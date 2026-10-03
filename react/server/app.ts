// API du site : un seul point d'entrée, utilisé par Vite en local (vite.config.ts)
// et par la fonction Vercel en ligne (api/handler.ts).
import type { IncomingMessage, ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'
import { ConfigError, all, getDb, one, run } from './db.js'
import {
  clearSessionCookie, createSessionToken, getSessionUser, hashPassword, isLocalRequest,
  sessionCookie, verifyPassword, type SessionUser,
} from './auth.js'

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

type Req = IncomingMessage & { body?: unknown }
type Ctx = { req: Req; res: ServerResponse; body: Record<string, unknown>; query: URLSearchParams; params: string[] }
type Handler = (ctx: Ctx) => Promise<unknown>

// ---------- Validation ----------

const SPECIES = ['arachide', 'mais', 'niebe', 'mil', 'sorgho']
// Identifiants du catalogue src/data/fertilizers.ts
const FERTILIZER_IDS = [
  'npk-6-20-10', 'npk-15-10-10', 'npk-15-15-15', 'dap-18-46-0', 'uree-46', 'sulfate-ammonium', 'tsp-0-46-0',
  'phosphate-naturel', 'kcl-0-0-60', 'npk-10-10-20', 'sulfate-potasse', 'foliaire-20-20-20', 'compost', 'fiente-volaille',
]

function str(body: Record<string, unknown>, key: string, opts: { required?: boolean; max?: number } = {}): string | null {
  const v = body[key]
  if (v == null || v === '') {
    if (opts.required) throw new HttpError(400, `Champ obligatoire manquant : ${key}`)
    return null
  }
  const s = String(v).trim()
  if (opts.required && !s) throw new HttpError(400, `Champ obligatoire manquant : ${key}`)
  if (s.length > (opts.max ?? 500)) throw new HttpError(400, `Champ trop long : ${key}`)
  return s || null
}

/** Champ texte obligatoire. */
const need = (body: Record<string, unknown>, key: string, max?: number) => str(body, key, { required: true, max })!

function num(body: Record<string, unknown>, key: string, opts: { required?: boolean; min?: number; max?: number } = {}): number | null {
  const v = body[key]
  if (v == null || v === '') {
    if (opts.required) throw new HttpError(400, `Champ obligatoire manquant : ${key}`)
    return null
  }
  const n = Number(v)
  if (!Number.isFinite(n)) throw new HttpError(400, `Nombre invalide : ${key}`)
  if (opts.min != null && n < opts.min) throw new HttpError(400, `Valeur trop petite : ${key}`)
  if (opts.max != null && n > opts.max) throw new HttpError(400, `Valeur trop grande : ${key}`)
  return n
}

function oneOf<T extends string>(value: string | null, allowed: readonly T[], key: string): T {
  if (!value || !allowed.includes(value as T)) throw new HttpError(400, `Valeur invalide : ${key}`)
  return value as T
}

const isDate = (s: string | null) => s == null || /^\d{4}-\d{2}-\d{2}$/.test(s)
function date(body: Record<string, unknown>, key: string, required = false) {
  const s = str(body, key, { required, max: 10 })
  if (!isDate(s)) throw new HttpError(400, `Date invalide : ${key}`)
  return s
}

// ---------- Accès ----------

async function requireStaff(ctx: Ctx): Promise<SessionUser> {
  const user = await getSessionUser(ctx.req)
  if (!user) throw new HttpError(401, 'Connexion requise.')
  return user
}

const failedLogins = new Map<string, { count: number; until: number }>()

// ---------- Routes ----------

const routes: [method: string, pattern: RegExp, handler: Handler][] = [
  ['GET', /^health$/, async () => {
    await getDb()
    return { ok: true }
  }],

  // --- Authentification ---
  ['GET', /^auth\/me$/, async ({ req }) => {
    const user = await getSessionUser(req)
    const count = (await one<{ n: number }>('select count(*) as n from users'))!.n
    return { user, needsSetup: count === 0, setupAllowed: count === 0 && isLocalRequest(req) }
  }],

  ['POST', /^auth\/setup$/, async ({ req, res, body }) => {
    if (!isLocalRequest(req)) throw new HttpError(403, 'Le premier compte administrateur se crée uniquement depuis l’ordinateur local.')
    const email = needEmail(body)
    const full_name = need(body, 'full_name', 120)
    const password = needPassword(body, 'password')
    const db = await getDb()
    const tx = await db.transaction('write')
    try {
      const n = (await tx.execute('select count(*) as n from users')).rows[0].n as number
      if (n > 0) throw new HttpError(409, 'Un compte administrateur existe déjà.')
      const id = randomUUID()
      await tx.execute({ sql: `insert into users (id, email, full_name, password_hash, role) values (?, ?, ?, ?, 'admin')`, args: [id, email, full_name, await hashPassword(password)] })
      await tx.commit()
      res.setHeader('Set-Cookie', sessionCookie(req, await createSessionToken(id)))
      return { user: { id, email, full_name, role: 'admin' } }
    } catch (err) {
      await tx.rollback()
      throw err
    }
  }],

  ['POST', /^auth\/login$/, async ({ req, res, body }) => {
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '')
    const lock = failedLogins.get(ip)
    if (lock && lock.until > Date.now()) throw new HttpError(429, 'Trop de tentatives. Réessayez dans quelques minutes.')
    const email = needEmail(body)
    const password = need(body, 'password', 200)
    const row = await one<SessionUser & { password_hash: string }>('select * from users where email = ?', [email])
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      const count = (lock?.count ?? 0) + 1
      failedLogins.set(ip, { count, until: count >= 5 ? Date.now() + 5 * 60_000 : 0 })
      throw new HttpError(401, 'E-mail ou mot de passe incorrect.')
    }
    failedLogins.delete(ip)
    res.setHeader('Set-Cookie', sessionCookie(req, await createSessionToken(row.id)))
    return { user: { id: row.id, email: row.email, full_name: row.full_name, role: row.role } }
  }],

  ['POST', /^auth\/logout$/, async ({ req, res }) => {
    res.setHeader('Set-Cookie', clearSessionCookie(req))
    return { ok: true }
  }],

  ['POST', /^auth\/password$/, async (ctx) => {
    const user = await requireStaff(ctx)
    const current = need(ctx.body, 'current', 200)
    const next = needPassword(ctx.body, 'next')
    const row = (await one<{ password_hash: string }>('select password_hash from users where id = ?', [user.id]))!
    if (!(await verifyPassword(current, row.password_hash))) throw new HttpError(400, 'Mot de passe actuel incorrect.')
    await run('update users set password_hash = ? where id = ?', [await hashPassword(next), user.id])
    return { ok: true }
  }],

  // --- Comptes de l'équipe (administrateur) ---
  ['GET', /^users$/, async (ctx) => {
    await requireAdmin(ctx)
    return all('select id, email, full_name, role, created_at from users order by created_at')
  }],

  ['POST', /^users$/, async (ctx) => {
    await requireAdmin(ctx)
    const email = needEmail(ctx.body)
    const full_name = need(ctx.body, 'full_name', 120)
    const role = oneOf(str(ctx.body, 'role'), ['agent', 'admin'] as const, 'role')
    const password = needPassword(ctx.body, 'password')
    if (await one('select id from users where email = ?', [email])) throw new HttpError(409, 'Un compte existe déjà avec cet e-mail.')
    await run('insert into users (id, email, full_name, password_hash, role) values (?, ?, ?, ?, ?)', [randomUUID(), email, full_name, await hashPassword(password), role])
    return { ok: true }
  }],

  ['DELETE', /^users\/([\w-]+)$/, async (ctx) => {
    const me = await requireAdmin(ctx)
    if (ctx.params[0] === me.id) throw new HttpError(400, 'Vous ne pouvez pas supprimer votre propre compte.')
    await run('update distributions set created_by = null where created_by = ?', [ctx.params[0]])
    await run('delete from users where id = ?', [ctx.params[0]])
    return { ok: true }
  }],

  // --- Formulaires publics ---
  ['POST', /^contact$/, async ({ body }) => {
    await run('insert into contact_messages (id, name, email, message) values (?, ?, ?, ?)', [randomUUID(), need(body, 'name', 120), needEmail(body), need(body, 'message', 5000)])
    return { ok: true }
  }],

  ['POST', /^reservations$/, async ({ body }) => {
    await run(
      `insert into seed_reservations (id, full_name, phone, region, commune, species, quantity_kg, area_ha, message)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), need(body, 'full_name', 150), need(body, 'phone', 30), need(body, 'region', 50), str(body, 'commune', { max: 100 }),
        oneOf(str(body, 'species'), SPECIES, 'species'), num(body, 'quantity_kg', { required: true, min: 1, max: 10_000_000 }),
        num(body, 'area_ha', { min: 0, max: 1_000_000 }), str(body, 'message', { max: 2000 })],
    )
    return { ok: true }
  }],

  ['POST', /^partnerships$/, async ({ body }) => {
    await run(
      `insert into partnership_requests (id, organization, contact_name, email, phone, country, partner_type, message)
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), need(body, 'organization', 150), need(body, 'contact_name', 120), needEmail(body), str(body, 'phone', { max: 30 }),
        need(body, 'country', 80), need(body, 'partner_type', 80), need(body, 'message', 5000)],
    )
    return { ok: true }
  }],

  ['POST', /^livestock-orders$/, async ({ body }) => {
    const date = str(body, 'wanted_date', { max: 10 })
    if (!isDate(date)) throw new HttpError(400, 'Date invalide : wanted_date')
    await run(
      `insert into livestock_orders (id, product, product_option, quantity, frequency, customer_type, full_name, phone, address, delivery, wanted_date, message)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), oneOf(str(body, 'product'), ['lait', 'poulet', 'oeufs'], 'product'), str(body, 'product_option', { max: 80 }),
        num(body, 'quantity', { required: true, min: 1, max: 100_000 }),
        oneOf(str(body, 'frequency'), ['unique', 'hebdomadaire', 'mensuelle'], 'frequency'),
        oneOf(str(body, 'customer_type'), ['particulier', 'restaurant', 'boutique', 'collectivite', 'evenement'], 'customer_type'),
        need(body, 'full_name', 150), need(body, 'phone', 30), need(body, 'address', 200),
        oneOf(str(body, 'delivery'), ['livraison', 'retrait'], 'delivery'), date, str(body, 'message', { max: 2000 })],
    )
    return { ok: true }
  }],

  ['POST', /^fertilizer-orders$/, async ({ body }) => {
    const raw = body.items
    if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) throw new HttpError(400, 'Valeur invalide : items')
    const items = raw.map((it) => {
      const item = (it ?? {}) as Record<string, unknown>
      return {
        product: oneOf(str(item, 'product'), FERTILIZER_IDS, 'items.product'),
        bags: Math.round(num(item, 'bags', { required: true, min: 1, max: 100_000 })!),
      }
    })
    await run(
      `insert into fertilizer_orders (id, items, total_bags, customer_type, region, full_name, phone, address, delivery, wanted_date, message)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), JSON.stringify(items), items.reduce((s, i) => s + i.bags, 0),
        oneOf(str(body, 'customer_type'), ['producteur', 'groupement', 'revendeur', 'entreprise'], 'customer_type'),
        need(body, 'region', 60), need(body, 'full_name', 150), need(body, 'phone', 30), need(body, 'address', 200),
        oneOf(str(body, 'delivery'), ['livraison', 'retrait'], 'delivery'), date(body, 'wanted_date'), str(body, 'message', { max: 2000 })],
    )
    return { ok: true }
  }],

  ['GET', /^lots\/verify$/, async ({ query }) => {
    const lot = (query.get('lot') ?? '').trim()
    if (!lot) throw new HttpError(400, 'Numéro de lot manquant.')
    return one(
      `select l.lot_number, l.species, l.variety, l.category, l.certification_date, l.germination_rate, l.status, c.name as campaign
       from seed_lots l join campaigns c on c.id = l.campaign_id where l.lot_number = ?`,
      [lot],
    )
  }],

  // --- Tableau de bord ---
  ['GET', /^campaigns$/, async (ctx) => {
    await requireStaff(ctx)
    const rows = await all<{ is_active: number }>('select * from campaigns order by start_date desc')
    return rows.map((c) => ({ ...c, is_active: Boolean(c.is_active) }))
  }],

  ['POST', /^campaigns$/, async (ctx) => {
    await requireStaff(ctx)
    const b = ctx.body
    const isActive = Boolean(b.is_active)
    const db = await getDb()
    const stmts = []
    if (isActive) stmts.push('update campaigns set is_active = 0')
    stmts.push({ sql: 'insert into campaigns (id, name, start_date, end_date, is_active) values (?, ?, ?, ?, ?)', args: [randomUUID(), need(b, 'name', 120), date(b, 'start_date', true), date(b, 'end_date', true), isActive ? 1 : 0] })
    await db.batch(stmts, 'write')
    return { ok: true }
  }],

  ['GET', /^campaigns\/([\w-]+)\/data$/, async (ctx) => {
    await requireStaff(ctx)
    const id = ctx.params[0]
    const [lots, distributions] = await Promise.all([
      all('select * from seed_lots where campaign_id = ? order by lot_number', [id]),
      all('select * from distributions where campaign_id = ? order by distributed_on desc, created_at desc', [id]),
    ])
    return { lots, distributions }
  }],

  ['POST', /^lots$/, async (ctx) => {
    await requireStaff(ctx)
    const b = ctx.body
    const lotNumber = need(b, 'lot_number', 60).toUpperCase()
    if (await one('select id from seed_lots where lot_number = ?', [lotNumber])) throw new HttpError(409, 'Ce numéro de lot existe déjà.')
    await run(
      `insert into seed_lots (id, campaign_id, lot_number, species, variety, category, quantity_kg, warehouse, region, certification_date, germination_rate, status)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), need(b, 'campaign_id', 60), lotNumber, oneOf(str(b, 'species'), SPECIES, 'species'), need(b, 'variety', 80),
        oneOf(str(b, 'category'), ['Prébase', 'Base', 'R1', 'R2'], 'category'), num(b, 'quantity_kg', { required: true, min: 0.01 }),
        need(b, 'warehouse', 120), need(b, 'region', 50), date(b, 'certification_date'), num(b, 'germination_rate', { min: 0, max: 100 }),
        oneOf(str(b, 'status'), ['certifie', 'en_attente', 'rejete'], 'status')],
    )
    return { ok: true }
  }],

  ['POST', /^distributions$/, async (ctx) => {
    const user = await requireStaff(ctx)
    const b = ctx.body
    const lotId = need(b, 'lot_id', 60)
    const qty = num(b, 'quantity_kg', { required: true, min: 0.01 })!
    const mode = oneOf(str(b, 'mode'), ['subvention', 'vente', 'don'], 'mode')
    const db = await getDb()
    // Transaction : le contrôle du stock et l'insertion ne peuvent pas être entrelacés avec une autre saisie.
    const tx = await db.transaction('write')
    try {
      const lot = (await tx.execute({ sql: 'select quantity_kg, status, campaign_id from seed_lots where id = ?', args: [lotId] })).rows[0]
      if (!lot) throw new HttpError(400, 'Lot introuvable.')
      if (lot.status !== 'certifie') throw new HttpError(400, 'Ce lot n’est pas certifié.')
      const used = Number((await tx.execute({ sql: 'select coalesce(sum(quantity_kg), 0) as used from distributions where lot_id = ?', args: [lotId] })).rows[0].used)
      const remaining = Number(lot.quantity_kg) - used
      if (qty > remaining + 1e-9) throw new HttpError(400, `Stock insuffisant : il reste ${Math.round(remaining)} kg sur ce lot.`)
      await tx.execute({
        sql: `insert into distributions (id, campaign_id, lot_id, distributed_on, beneficiary_name, beneficiary_type, phone, region, department, commune, quantity_kg, area_ha, mode, unit_price, created_by)
              values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [randomUUID(), lot.campaign_id, lotId, date(b, 'distributed_on', true), need(b, 'beneficiary_name', 150),
          oneOf(str(b, 'beneficiary_type'), ['agriculteur', 'cooperative', 'gie', 'autre'], 'beneficiary_type'),
          str(b, 'phone', { max: 30 }), need(b, 'region', 50), str(b, 'department', { max: 80 }), str(b, 'commune', { max: 100 }),
          qty, num(b, 'area_ha', { min: 0 }), mode, mode === 'vente' ? num(b, 'unit_price', { min: 0 }) : null, user.id],
      })
      await tx.commit()
      return { ok: true }
    } catch (err) {
      await tx.rollback()
      throw err
    }
  }],

  ['DELETE', /^distributions\/([\w-]+)$/, async (ctx) => {
    await requireStaff(ctx)
    await run('delete from distributions where id = ?', [ctx.params[0]])
    return { ok: true }
  }],

  ['GET', /^reservations$/, async (ctx) => {
    await requireStaff(ctx)
    return all('select * from seed_reservations order by created_at desc')
  }],

  ['PATCH', /^reservations\/([\w-]+)$/, async (ctx) => {
    await requireStaff(ctx)
    const status = oneOf(str(ctx.body, 'status'), ['nouvelle', 'confirmee', 'servie', 'annulee'], 'status')
    await run('update seed_reservations set status = ? where id = ?', [status, ctx.params[0]])
    return { ok: true }
  }],

  ['GET', /^partnerships$/, async (ctx) => {
    await requireStaff(ctx)
    return all('select * from partnership_requests order by created_at desc')
  }],

  ['PATCH', /^partnerships\/([\w-]+)$/, async (ctx) => {
    await requireStaff(ctx)
    const status = oneOf(str(ctx.body, 'status'), ['nouvelle', 'en_cours', 'conclue', 'refusee'], 'status')
    await run('update partnership_requests set status = ? where id = ?', [status, ctx.params[0]])
    return { ok: true }
  }],

  ['GET', /^livestock-orders$/, async (ctx) => {
    await requireStaff(ctx)
    return all('select * from livestock_orders order by created_at desc')
  }],

  ['PATCH', /^livestock-orders\/([\w-]+)$/, async (ctx) => {
    await requireStaff(ctx)
    const status = oneOf(str(ctx.body, 'status'), ['nouvelle', 'confirmee', 'livree', 'annulee'], 'status')
    await run('update livestock_orders set status = ? where id = ?', [status, ctx.params[0]])
    return { ok: true }
  }],

  ['GET', /^fertilizer-orders$/, async (ctx) => {
    await requireStaff(ctx)
    const rows = await all<Record<string, unknown> & { items: string }>('select * from fertilizer_orders order by created_at desc')
    return rows.map((r) => ({ ...r, items: JSON.parse(r.items) }))
  }],

  ['PATCH', /^fertilizer-orders\/([\w-]+)$/, async (ctx) => {
    await requireStaff(ctx)
    const status = oneOf(str(ctx.body, 'status'), ['nouvelle', 'confirmee', 'livree', 'annulee'], 'status')
    await run('update fertilizer_orders set status = ? where id = ?', [status, ctx.params[0]])
    return { ok: true }
  }],

  ['GET', /^messages$/, async (ctx) => {
    await requireStaff(ctx)
    return all('select * from contact_messages order by created_at desc')
  }],
]

async function requireAdmin(ctx: Ctx) {
  const user = await requireStaff(ctx)
  if (user.role !== 'admin') throw new HttpError(403, 'Réservé aux administrateurs.')
  return user
}

function needEmail(body: Record<string, unknown>) {
  const email = need(body, 'email', 200).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Adresse e-mail invalide.')
  return email
}

function needPassword(body: Record<string, unknown>, key: string) {
  const password = String(body[key] ?? '')
  if (password.length < 8) throw new HttpError(400, 'Le mot de passe doit contenir au moins 8 caractères.')
  if (password.length > 200) throw new HttpError(400, 'Mot de passe trop long.')
  return password
}

// ---------- Point d'entrée ----------

async function readBody(req: Req): Promise<Record<string, unknown>> {
  // Sur Vercel, le corps est déjà analysé ; en local, on lit le flux.
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body as Record<string, unknown>) ?? {}
  }
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > 100_000) throw new HttpError(413, 'Requête trop volumineuse.')
    chunks.push(chunk as Buffer)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    throw new HttpError(400, 'Corps de requête invalide.')
  }
}

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data ?? null))
}

/** `route` est le chemin après /api/, par ex. « campaigns/123/data ». */
export async function handleApi(req: Req, res: ServerResponse, route: string) {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = route.replace(/^\/+|\/+$/g, '')
  try {
    for (const [method, pattern, handler] of routes) {
      const m = path.match(pattern)
      if (!m || method !== req.method) continue
      // Protection CSRF simple : les écritures doivent être envoyées en JSON par le site.
      if (method !== 'GET' && !String(req.headers['content-type'] ?? '').includes('application/json')) {
        throw new HttpError(415, 'Format non accepté.')
      }
      const body = method === 'GET' || method === 'DELETE' ? {} : await readBody(req)
      const data = await handler({ req, res, body, query: url.searchParams, params: m.slice(1) })
      return send(res, 200, data)
    }
    send(res, 404, { error: 'Route inconnue.' })
  } catch (err) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.message })
    if (err instanceof ConfigError) return send(res, 503, { error: err.message })
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('SQLITE_CONSTRAINT')) return send(res, 400, { error: 'Données invalides ou déjà existantes.' })
    console.error('[api]', err)
    send(res, 500, { error: 'Erreur serveur.' })
  }
}
