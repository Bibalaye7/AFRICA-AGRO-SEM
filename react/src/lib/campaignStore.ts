// Accès aux données de la campagne agricole.
// Avec Supabase configuré, tout passe par la base (voir supabase/schema.sql).
// Sans Supabase, un mode démo stocke les données dans le navigateur (localStorage).
import { supabase } from './supabase'

export type Campaign = {
  id: string
  name: string
  start_date: string
  end_date: string
  is_active: boolean
}

export type SeedLot = {
  id: string
  campaign_id: string
  lot_number: string
  species: string
  variety: string
  category: string
  quantity_kg: number
  warehouse: string
  region: string
  certification_date: string | null
  germination_rate: number | null
  status: 'certifie' | 'en_attente' | 'rejete'
}

export type Distribution = {
  id: string
  campaign_id: string
  lot_id: string
  distributed_on: string
  beneficiary_name: string
  beneficiary_type: 'agriculteur' | 'cooperative' | 'gie' | 'autre'
  phone: string | null
  region: string
  department: string | null
  commune: string | null
  quantity_kg: number
  area_ha: number | null
  mode: 'subvention' | 'vente' | 'don'
  unit_price: number | null
}

export type Reservation = {
  id: string
  created_at: string
  full_name: string
  phone: string
  region: string
  commune: string | null
  species: string
  quantity_kg: number
  area_ha: number | null
  message: string | null
  status: 'nouvelle' | 'confirmee' | 'servie' | 'annulee'
}

export type PartnershipRequest = {
  id: string
  created_at: string
  organization: string
  contact_name: string
  email: string
  phone: string | null
  country: string
  partner_type: string
  message: string
  status: 'nouvelle' | 'en_cours' | 'conclue' | 'refusee'
}

export type LotVerification = {
  lot_number: string
  species: string
  variety: string
  category: string
  certification_date: string | null
  germination_rate: number | null
  status: SeedLot['status']
  campaign: string
}

export type NewLot = Omit<SeedLot, 'id'>
export type NewDistribution = Omit<Distribution, 'id'>
export type NewReservation = Omit<Reservation, 'id' | 'created_at' | 'status'>
export type NewPartnership = Omit<PartnershipRequest, 'id' | 'created_at' | 'status'>

export const isDemoMode = !supabase

// ---------- Mode démo (localStorage) ----------

type DemoDb = {
  campaigns: Campaign[]
  lots: SeedLot[]
  distributions: Distribution[]
  reservations: Reservation[]
  partnerships: PartnershipRequest[]
}

const DEMO_KEY = 'aas-demo-db-v1'

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

function seedDemoDb(): DemoDb {
  const campaign: Campaign = { id: 'c-2026', name: 'Campagne 2026-2027', start_date: '2026-05-01', end_date: '2027-01-31', is_active: true }
  const lot = (lot_number: string, species: string, variety: string, category: string, quantity_kg: number, warehouse: string, region: string, germination_rate: number): SeedLot => ({
    id: lot_number, campaign_id: campaign.id, lot_number, species, variety, category, quantity_kg, warehouse, region,
    certification_date: '2026-04-15', germination_rate, status: 'certifie',
  })
  const lots = [
    lot('AAS-26-ARA-001', 'arachide', '55-437', 'R1', 40000, 'Magasin Diourbel', 'Diourbel', 88),
    lot('AAS-26-ARA-002', 'arachide', '73-33', 'R2', 30000, 'Magasin Kaolack', 'Kaolack', 85),
    lot('AAS-26-MAI-001', 'mais', 'Early Thai', 'R1', 8000, 'Magasin Kolda', 'Kolda', 92),
    lot('AAS-26-NIE-001', 'niebe', 'Mélakh', 'R1', 6000, 'Magasin Louga', 'Louga', 90),
    lot('AAS-26-MIL-001', 'mil', 'Souna 3', 'R1', 3000, 'Magasin Kaffrine', 'Kaffrine', 87),
    lot('AAS-26-SOR-001', 'sorgho', 'CE 145-66', 'R2', 2500, 'Magasin Tambacounda', 'Tambacounda', 86),
  ]
  const names = ['GIE Ndiambour', 'Coopérative And Liggey', 'Moussa Diop', 'Awa Ndiaye', 'Coopérative Kaffrine Nord', 'Ibrahima Sarr', 'GIE Takku Liggey', 'Fatou Sow', 'Mamadou Ba', 'Union des producteurs de Nioro']
  const regionsByLot: Record<string, string[]> = {
    'AAS-26-ARA-001': ['Diourbel', 'Louga', 'Thiès'],
    'AAS-26-ARA-002': ['Kaolack', 'Kaffrine', 'Fatick'],
    'AAS-26-MAI-001': ['Kolda', 'Sédhiou'],
    'AAS-26-NIE-001': ['Louga', 'Thiès'],
    'AAS-26-MIL-001': ['Kaffrine', 'Kaolack'],
    'AAS-26-SOR-001': ['Tambacounda', 'Kédougou'],
  }
  const distributions: Distribution[] = []
  let day = 0
  lots.forEach((l, li) => {
    const count = 6 + li
    for (let i = 0; i < count; i++) {
      const isCoop = i % 3 === 0
      const kg = Math.round((l.quantity_kg * (isCoop ? 0.09 : 0.04)) / 50) * 50
      const date = new Date(Date.UTC(2026, 5, 2 + ((day++ * 3) % 70)))
      const region = regionsByLot[l.lot_number][i % regionsByLot[l.lot_number].length]
      const species = lots.find((x) => x.id === l.id)!.species
      const rate = { arachide: 120, mais: 25, niebe: 25, mil: 5, sorgho: 10 }[species] ?? 20
      distributions.push({
        id: uid(), campaign_id: campaign.id, lot_id: l.id,
        distributed_on: date.toISOString().slice(0, 10),
        beneficiary_name: names[(li + i) % names.length],
        beneficiary_type: isCoop ? 'cooperative' : 'agriculteur',
        phone: null, region, department: null, commune: null,
        quantity_kg: kg, area_ha: Math.round((kg / rate) * 10) / 10,
        mode: i % 4 === 0 ? 'vente' : 'subvention', unit_price: null,
      })
    }
  })
  return { campaigns: [campaign], lots, distributions, reservations: [], partnerships: [] }
}

function readDemo(): DemoDb {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) return JSON.parse(raw) as DemoDb
  } catch {
    /* stockage indisponible : on repart des données d'exemple */
  }
  const db = seedDemoDb()
  writeDemo(db)
  return db
}

function writeDemo(db: DemoDb) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(db))
  } catch {
    /* stockage indisponible : les modifications restent en mémoire */
  }
}

export function resetDemoData() {
  writeDemo(seedDemoDb())
}

// ---------- API commune ----------

const MISSING_TABLES_HINT = 'Les tables de la campagne sont introuvables. Exécutez le script supabase/schema.sql dans l’éditeur SQL de Supabase.'

function fail(error: { message: string; code?: string } | null): never {
  if (error?.code === '42P01' || error?.code === 'PGRST205' || error?.message?.includes('does not exist')) {
    throw new Error(MISSING_TABLES_HINT)
  }
  throw new Error(error?.message ?? 'Erreur inconnue')
}

export async function listCampaigns(): Promise<Campaign[]> {
  if (!supabase) return readDemo().campaigns
  const { data, error } = await supabase.from('campaigns').select('*').order('start_date', { ascending: false })
  if (error) fail(error)
  return data as Campaign[]
}

export async function createCampaign(input: Omit<Campaign, 'id'>): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    if (input.is_active) db.campaigns.forEach((c) => (c.is_active = false))
    db.campaigns.unshift({ ...input, id: uid() })
    return writeDemo(db)
  }
  if (input.is_active) await supabase.from('campaigns').update({ is_active: false }).eq('is_active', true)
  const { error } = await supabase.from('campaigns').insert(input)
  if (error) fail(error)
}

export async function loadCampaignData(campaignId: string): Promise<{ lots: SeedLot[]; distributions: Distribution[] }> {
  if (!supabase) {
    const db = readDemo()
    return {
      lots: db.lots.filter((l) => l.campaign_id === campaignId),
      distributions: db.distributions.filter((d) => d.campaign_id === campaignId),
    }
  }
  const [lots, distributions] = await Promise.all([
    supabase.from('seed_lots').select('*').eq('campaign_id', campaignId).order('lot_number'),
    supabase.from('distributions').select('*').eq('campaign_id', campaignId).order('distributed_on', { ascending: false }),
  ])
  if (lots.error) fail(lots.error)
  if (distributions.error) fail(distributions.error)
  return { lots: lots.data as SeedLot[], distributions: distributions.data as Distribution[] }
}

export async function createLot(input: NewLot): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    if (db.lots.some((l) => l.lot_number === input.lot_number)) throw new Error('Ce numéro de lot existe déjà.')
    db.lots.push({ ...input, id: uid() })
    return writeDemo(db)
  }
  const { error } = await supabase.from('seed_lots').insert(input)
  if (error) fail(error.code === '23505' ? { message: 'Ce numéro de lot existe déjà.' } : error)
}

export async function createDistribution(input: NewDistribution): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    db.distributions.push({ ...input, id: uid() })
    return writeDemo(db)
  }
  const { error } = await supabase.from('distributions').insert(input)
  if (error) fail(error)
}

export async function deleteDistribution(id: string): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    db.distributions = db.distributions.filter((d) => d.id !== id)
    return writeDemo(db)
  }
  const { error } = await supabase.from('distributions').delete().eq('id', id)
  if (error) fail(error)
}

export async function listReservations(): Promise<Reservation[]> {
  if (!supabase) return [...readDemo().reservations].reverse()
  const { data, error } = await supabase.from('seed_reservations').select('*').order('created_at', { ascending: false })
  if (error) fail(error)
  return data as Reservation[]
}

export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    db.reservations = db.reservations.map((r) => (r.id === id ? { ...r, status } : r))
    return writeDemo(db)
  }
  const { error } = await supabase.from('seed_reservations').update({ status }).eq('id', id)
  if (error) fail(error)
}

export async function listPartnerships(): Promise<PartnershipRequest[]> {
  if (!supabase) return [...readDemo().partnerships].reverse()
  const { data, error } = await supabase.from('partnership_requests').select('*').order('created_at', { ascending: false })
  if (error) fail(error)
  return data as PartnershipRequest[]
}

export async function updatePartnershipStatus(id: string, status: PartnershipRequest['status']): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    db.partnerships = db.partnerships.map((p) => (p.id === id ? { ...p, status } : p))
    return writeDemo(db)
  }
  const { error } = await supabase.from('partnership_requests').update({ status }).eq('id', id)
  if (error) fail(error)
}

// ---------- Formulaires publics ----------

export async function submitReservation(input: NewReservation): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    db.reservations.push({ ...input, id: uid(), created_at: new Date().toISOString(), status: 'nouvelle' })
    return writeDemo(db)
  }
  const { error } = await supabase.from('seed_reservations').insert(input)
  if (error) fail(error)
}

export async function submitPartnership(input: NewPartnership): Promise<void> {
  if (!supabase) {
    const db = readDemo()
    db.partnerships.push({ ...input, id: uid(), created_at: new Date().toISOString(), status: 'nouvelle' })
    return writeDemo(db)
  }
  const { error } = await supabase.from('partnership_requests').insert(input)
  if (error) fail(error)
}

export async function verifyLot(lotNumber: string): Promise<LotVerification | null> {
  const wanted = lotNumber.trim().toUpperCase()
  if (!supabase) {
    const db = readDemo()
    const lot = db.lots.find((l) => l.lot_number.toUpperCase() === wanted)
    if (!lot) return null
    const campaign = db.campaigns.find((c) => c.id === lot.campaign_id)
    return { ...lot, campaign: campaign?.name ?? '' }
  }
  const { data, error } = await supabase.rpc('verify_lot', { p_lot_number: wanted })
  if (error) fail(error)
  const rows = data as LotVerification[] | null
  return rows && rows.length > 0 ? rows[0] : null
}
