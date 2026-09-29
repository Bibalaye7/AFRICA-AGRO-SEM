// Accès aux données de la campagne agricole, via l'API du site (server/app.ts).
// Les formulaires publics sont aussi notifiés par e-mail : si la base est momentanément
// indisponible, la demande parvient quand même à l'entreprise.
import { api } from './api'
import { sendEmail } from './email'
import { speciesName } from '../data/seeds'

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

// ---------- Tableau de bord ----------

export const listCampaigns = () => api<Campaign[]>('campaigns')

export const createCampaign = (input: Omit<Campaign, 'id'>) => api('campaigns', { method: 'POST', body: input }).then(() => undefined)

export const loadCampaignData = (campaignId: string) =>
  api<{ lots: SeedLot[]; distributions: Distribution[] }>(`campaigns/${encodeURIComponent(campaignId)}/data`)

export const createLot = (input: NewLot) => api('lots', { method: 'POST', body: input }).then(() => undefined)

export const createDistribution = (input: NewDistribution) => api('distributions', { method: 'POST', body: input }).then(() => undefined)

export const deleteDistribution = (id: string) => api(`distributions/${encodeURIComponent(id)}`, { method: 'DELETE' }).then(() => undefined)

export const listReservations = () => api<Reservation[]>('reservations')

export const updateReservationStatus = (id: string, status: Reservation['status']) =>
  api(`reservations/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } }).then(() => undefined)

export const listPartnerships = () => api<PartnershipRequest[]>('partnerships')

export const updatePartnershipStatus = (id: string, status: PartnershipRequest['status']) =>
  api(`partnerships/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } }).then(() => undefined)

// ---------- Formulaires publics ----------

/** Enregistre en base et notifie par e-mail ; échoue seulement si les deux échouent. */
async function saveAndNotify(save: Promise<unknown>, notify: Promise<unknown>) {
  const [saved, notified] = await Promise.allSettled([save, notify])
  if (saved.status === 'rejected' && notified.status === 'rejected') {
    throw new Error('Envoi impossible pour le moment.')
  }
}

export function submitReservation(input: NewReservation): Promise<void> {
  return saveAndNotify(
    api('reservations', { method: 'POST', body: input }),
    sendEmail({
      from_name: `Réservation – ${input.full_name}`,
      from_email: 'non renseigné (contact par téléphone)',
      message: [
        'Nouvelle réservation de semences depuis le site :',
        `Nom / coopérative : ${input.full_name}`,
        `Téléphone : ${input.phone}`,
        `Région : ${input.region}${input.commune ? ` – ${input.commune}` : ''}`,
        `Semence : ${speciesName(input.species)}`,
        `Quantité : ${input.quantity_kg} kg${input.area_ha ? ` pour ${input.area_ha} ha` : ''}`,
        input.message ? `Précisions : ${input.message}` : '',
      ].filter(Boolean).join('\n'),
    }),
  )
}

export function submitPartnership(input: NewPartnership): Promise<void> {
  return saveAndNotify(
    api('partnerships', { method: 'POST', body: input }),
    sendEmail({
      from_name: `Partenariat – ${input.organization}`,
      from_email: input.email,
      message: [
        'Nouvelle demande de partenariat depuis le site :',
        `Organisation : ${input.organization} (${input.partner_type}, ${input.country})`,
        `Contact : ${input.contact_name} – ${input.email}${input.phone ? ` – ${input.phone}` : ''}`,
        '',
        input.message,
      ].join('\n'),
    }),
  )
}

export const saveContactMessage = (input: { name: string; email: string; message: string }) =>
  api('contact', { method: 'POST', body: input }).then(() => undefined)

export const verifyLot = (lotNumber: string) =>
  api<LotVerification | null>(`lots/verify?lot=${encodeURIComponent(lotNumber.trim())}`)
