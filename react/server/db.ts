// Base de données du site (SQLite via libSQL).
// - En local : un simple fichier, react/data/africa-agro-sem.db (créé automatiquement).
// - En ligne (Vercel) : une base Turso, via DATABASE_URL et DATABASE_AUTH_TOKEN.
import { createClient, type Client, type InArgs } from '@libsql/client'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'

export class ConfigError extends Error {}

const SCHEMA = [
  `create table if not exists users (
    id text primary key,
    email text not null unique collate nocase,
    full_name text not null,
    password_hash text not null,
    role text not null default 'agent' check (role in ('agent', 'admin')),
    created_at text not null default (datetime('now'))
  )`,
  `create table if not exists settings (
    key text primary key,
    value text not null
  )`,
  `create table if not exists campaigns (
    id text primary key,
    name text not null,
    start_date text not null,
    end_date text not null,
    is_active integer not null default 0,
    created_at text not null default (datetime('now'))
  )`,
  `create table if not exists seed_lots (
    id text primary key,
    campaign_id text not null references campaigns(id) on delete cascade,
    lot_number text not null unique collate nocase,
    species text not null check (species in ('arachide', 'mais', 'niebe', 'mil', 'sorgho')),
    variety text not null,
    category text not null check (category in ('Prébase', 'Base', 'R1', 'R2')),
    quantity_kg real not null check (quantity_kg > 0),
    warehouse text not null,
    region text not null,
    certification_date text,
    germination_rate real check (germination_rate between 0 and 100),
    status text not null default 'en_attente' check (status in ('certifie', 'en_attente', 'rejete')),
    created_at text not null default (datetime('now'))
  )`,
  `create table if not exists distributions (
    id text primary key,
    campaign_id text not null references campaigns(id) on delete cascade,
    lot_id text not null references seed_lots(id) on delete restrict,
    distributed_on text not null,
    beneficiary_name text not null,
    beneficiary_type text not null check (beneficiary_type in ('agriculteur', 'cooperative', 'gie', 'autre')),
    phone text,
    region text not null,
    department text,
    commune text,
    quantity_kg real not null check (quantity_kg > 0),
    area_ha real,
    mode text not null default 'subvention' check (mode in ('subvention', 'vente', 'don')),
    unit_price real,
    created_by text references users(id),
    created_at text not null default (datetime('now'))
  )`,
  `create index if not exists distributions_campaign_idx on distributions(campaign_id)`,
  `create index if not exists distributions_lot_idx on distributions(lot_id)`,
  `create table if not exists seed_reservations (
    id text primary key,
    full_name text not null,
    phone text not null,
    region text not null,
    commune text,
    species text not null,
    quantity_kg real not null check (quantity_kg > 0),
    area_ha real,
    message text,
    status text not null default 'nouvelle' check (status in ('nouvelle', 'confirmee', 'servie', 'annulee')),
    created_at text not null default (datetime('now'))
  )`,
  `create table if not exists partnership_requests (
    id text primary key,
    organization text not null,
    contact_name text not null,
    email text not null,
    phone text,
    country text not null,
    partner_type text not null,
    message text not null,
    status text not null default 'nouvelle' check (status in ('nouvelle', 'en_cours', 'conclue', 'refusee')),
    created_at text not null default (datetime('now'))
  )`,
  `create table if not exists contact_messages (
    id text primary key,
    name text not null,
    email text not null,
    message text not null,
    created_at text not null default (datetime('now'))
  )`,
]

let clientPromise: Promise<Client> | null = null

function createDbClient(): Client {
  const url = process.env.DATABASE_URL
  if (url) return createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN })
  if (process.env.VERCEL) {
    throw new ConfigError('Base de données non configurée : ajoutez DATABASE_URL et DATABASE_AUTH_TOKEN dans Vercel.')
  }
  const dir = join(process.cwd(), 'data')
  mkdirSync(dir, { recursive: true })
  return createClient({ url: `file:${join(dir, 'africa-agro-sem.db').replace(/\\/g, '/')}` })
}

/** Client unique, avec le schéma créé au premier appel. */
export function getDb(): Promise<Client> {
  clientPromise ??= (async () => {
    const client = createDbClient()
    await client.execute('pragma foreign_keys = on')
    await client.batch(SCHEMA, 'write')
    return client
  })().catch((err) => {
    clientPromise = null
    throw err
  })
  return clientPromise
}

export async function all<T>(sql: string, args: InArgs = []): Promise<T[]> {
  const db = await getDb()
  const res = await db.execute({ sql, args })
  return res.rows.map((r) => ({ ...r }) as T)
}

export async function one<T>(sql: string, args: InArgs = []): Promise<T | null> {
  return (await all<T>(sql, args))[0] ?? null
}

export async function run(sql: string, args: InArgs = []) {
  const db = await getDb()
  return db.execute({ sql, args })
}

/** Secret de signature des sessions : SESSION_SECRET, sinon généré une fois et gardé en base. */
export async function getSessionSecret(): Promise<string> {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET
  const existing = await one<{ value: string }>(`select value from settings where key = 'session_secret'`)
  if (existing) return existing.value
  const secret = randomBytes(32).toString('hex')
  await run(`insert or ignore into settings (key, value) values ('session_secret', ?)`, [secret])
  return (await one<{ value: string }>(`select value from settings where key = 'session_secret'`))!.value
}
