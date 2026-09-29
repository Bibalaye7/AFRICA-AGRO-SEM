// Mots de passe (scrypt) et sessions signées (HMAC-SHA256) dans un cookie HttpOnly.
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import type { IncomingMessage } from 'node:http'
import { getSessionSecret, one } from './db'

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>

export const SESSION_COOKIE = 'aas_session'
const SESSION_DAYS = 7

export type SessionUser = { id: string; email: string; full_name: string; role: 'agent' | 'admin' }

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scryptAsync(password, salt, 64)
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, salt, hash] = stored.split('$')
  if (algo !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'base64')
  const key = await scryptAsync(password, Buffer.from(salt, 'base64'), expected.length)
  return timingSafeEqual(key, expected)
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url')

export async function createSessionToken(userId: string): Promise<string> {
  const payload = b64url(JSON.stringify({ uid: userId, exp: Date.now() + SESSION_DAYS * 86400_000 }))
  const sig = createHmac('sha256', await getSessionSecret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

async function readSessionToken(token: string): Promise<string | null> {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = createHmac('sha256', await getSessionSecret()).update(payload).digest()
  const given = Buffer.from(sig, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { uid: string; exp: number }
    return exp > Date.now() ? uid : null
  } catch {
    return null
  }
}

export function parseCookies(req: IncomingMessage): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

export async function getSessionUser(req: IncomingMessage): Promise<SessionUser | null> {
  const token = parseCookies(req)[SESSION_COOKIE]
  if (!token) return null
  const uid = await readSessionToken(token)
  if (!uid) return null
  return one<SessionUser>('select id, email, full_name, role from users where id = ?', [uid])
}

const isHttps = (req: IncomingMessage) => req.headers['x-forwarded-proto'] === 'https'

export function sessionCookie(req: IncomingMessage, token: string) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${isHttps(req) ? '; Secure' : ''}`
}

export function clearSessionCookie(req: IncomingMessage) {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isHttps(req) ? '; Secure' : ''}`
}

/** Requête émise depuis l'ordinateur lui-même (pas depuis internet). */
export function isLocalRequest(req: IncomingMessage): boolean {
  if (process.env.VERCEL) return false
  const addr = req.socket?.remoteAddress ?? ''
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(addr)
}
