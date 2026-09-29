import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { REGIONS, SEED_CATEGORIES, SPECIES, speciesName } from '../../data/seeds'
import type { Distribution, NewDistribution, NewLot, SeedLot } from '../../lib/campaignStore'
import { formatTonnes } from './charts'

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900" aria-label="Fermer">
            <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

type SubmitFn<T> = (value: T) => Promise<void>

function useSubmit<T>(onSubmit: SubmitFn<T>) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const run = async (value: T) => {
    setBusy(true)
    setError('')
    try {
      await onSubmit(value)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible.')
    } finally {
      setBusy(false)
    }
  }
  return { busy, error, run }
}

const FormFooter = ({ busy, error, label }: { busy: boolean; error: string; label: string }) => (
  <div className="sm:col-span-2 space-y-3">
    {error && <p className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">{error}</p>}
    <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-agro-green text-white font-semibold hover:bg-[#2d6336] disabled:opacity-50">
      {busy ? 'Enregistrement…' : label}
    </button>
  </div>
)

// ---------- Nouvelle campagne ----------

export function CampaignForm({ onSubmit }: { onSubmit: SubmitFn<{ name: string; start_date: string; end_date: string; is_active: boolean }> }) {
  const year = new Date().getFullYear()
  const [form, setForm] = useState({ name: `Campagne ${year}-${year + 1}`, start_date: `${year}-05-01`, end_date: `${year + 1}-01-31`, is_active: true })
  const { busy, error, run } = useSubmit(onSubmit)
  return (
    <form onSubmit={(e) => { e.preventDefault(); run(form) }} className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor="c-name">Nom</label>
        <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="c-start">Début</label>
        <input id="c-start" type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="c-end">Fin</label>
        <input id="c-end" type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="form-input" />
      </div>
      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-agro-green" />
        Campagne en cours
      </label>
      <FormFooter busy={busy} error={error} label="Créer la campagne" />
    </form>
  )
}

// ---------- Nouveau lot ----------

export function LotForm({ campaignId, onSubmit }: { campaignId: string; onSubmit: SubmitFn<NewLot> }) {
  const [form, setForm] = useState({
    lot_number: '', species: 'arachide', variety: SPECIES[0].varieties[0].name, category: 'R1',
    quantity_kg: '', warehouse: '', region: '', certification_date: '', germination_rate: '', status: 'certifie' as SeedLot['status'],
  })
  const { busy, error, run } = useSubmit(onSubmit)
  const varieties = SPECIES.find((s) => s.id === form.species)?.varieties ?? []

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    run({
      campaign_id: campaignId,
      lot_number: form.lot_number.trim().toUpperCase(),
      species: form.species,
      variety: form.variety.trim(),
      category: form.category,
      quantity_kg: Number(form.quantity_kg),
      warehouse: form.warehouse.trim(),
      region: form.region,
      certification_date: form.certification_date || null,
      germination_rate: form.germination_rate ? Number(form.germination_rate) : null,
      status: form.status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="form-label" htmlFor="l-num">Numéro de lot *</label>
        <input id="l-num" required placeholder="AAS-26-ARA-003" value={form.lot_number} onChange={(e) => setForm({ ...form, lot_number: e.target.value })} className="form-input uppercase" />
      </div>
      <div>
        <label className="form-label" htmlFor="l-status">Statut</label>
        <select id="l-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SeedLot['status'] })} className="form-input">
          <option value="certifie">Certifié</option>
          <option value="en_attente">Certification en cours</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="l-species">Espèce *</label>
        <select
          id="l-species"
          value={form.species}
          onChange={(e) => setForm({ ...form, species: e.target.value, variety: SPECIES.find((s) => s.id === e.target.value)?.varieties[0]?.name ?? '' })}
          className="form-input"
        >
          {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="l-variety">Variété *</label>
        <input id="l-variety" required list="l-varieties" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} className="form-input" />
        <datalist id="l-varieties">{varieties.map((v) => <option key={v.name} value={v.name} />)}</datalist>
      </div>
      <div>
        <label className="form-label" htmlFor="l-cat">Catégorie *</label>
        <select id="l-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input">
          {SEED_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="l-qty">Quantité (kg) *</label>
        <input id="l-qty" required type="number" min={1} step="any" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="l-wh">Magasin *</label>
        <input id="l-wh" required placeholder="Magasin Kaolack" value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="l-region">Région du magasin *</label>
        <select id="l-region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="form-input">
          <option value="">Choisir…</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="l-date">Date de certification</label>
        <input id="l-date" type="date" value={form.certification_date} onChange={(e) => setForm({ ...form, certification_date: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="l-germ">Taux de germination (%)</label>
        <input id="l-germ" type="number" min={0} max={100} step="any" value={form.germination_rate} onChange={(e) => setForm({ ...form, germination_rate: e.target.value })} className="form-input" />
      </div>
      <FormFooter busy={busy} error={error} label="Enregistrer le lot" />
    </form>
  )
}

// ---------- Nouvelle distribution ----------

export function DistributionForm({
  campaignId, lots, distributions, onSubmit,
}: { campaignId: string; lots: SeedLot[]; distributions: Distribution[]; onSubmit: SubmitFn<NewDistribution> }) {
  const available = lots.filter((l) => l.status === 'certifie')
  const [form, setForm] = useState({
    lot_id: available[0]?.id ?? '', distributed_on: new Date().toISOString().slice(0, 10),
    beneficiary_name: '', beneficiary_type: 'agriculteur' as Distribution['beneficiary_type'], phone: '',
    region: '', department: '', commune: '', quantity_kg: '', area_ha: '', mode: 'subvention' as Distribution['mode'], unit_price: '',
  })
  const { busy, error, run } = useSubmit(onSubmit)
  const [localError, setLocalError] = useState('')

  const lot = lots.find((l) => l.id === form.lot_id)
  const used = distributions.filter((d) => d.lot_id === form.lot_id).reduce((s, d) => s + d.quantity_kg, 0)
  const remaining = lot ? lot.quantity_kg - used : 0
  const rate = SPECIES.find((s) => s.id === lot?.species)?.seedRate

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const qty = Number(form.quantity_kg)
    if (!lot) return setLocalError('Choisissez un lot.')
    if (qty > remaining) return setLocalError(`Stock insuffisant : il reste ${formatTonnes(remaining)} sur ce lot.`)
    setLocalError('')
    run({
      campaign_id: campaignId,
      lot_id: lot.id,
      distributed_on: form.distributed_on,
      beneficiary_name: form.beneficiary_name.trim(),
      beneficiary_type: form.beneficiary_type,
      phone: form.phone.trim() || null,
      region: form.region,
      department: form.department.trim() || null,
      commune: form.commune.trim() || null,
      quantity_kg: qty,
      area_ha: form.area_ha ? Number(form.area_ha) : rate ? Math.round((qty / rate) * 100) / 100 : null,
      mode: form.mode,
      unit_price: form.mode === 'vente' && form.unit_price ? Number(form.unit_price) : null,
    })
  }

  if (available.length === 0) {
    return <p className="text-gray-600">Aucun lot certifié dans cette campagne. Ajoutez d’abord un lot dans l’onglet « Stocks et lots ».</p>
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor="d-lot">Lot *</label>
        <select id="d-lot" value={form.lot_id} onChange={(e) => setForm({ ...form, lot_id: e.target.value })} className="form-input">
          {available.map((l) => (
            <option key={l.id} value={l.id}>{l.lot_number} – {speciesName(l.species)}, variété {l.variety} ({l.warehouse})</option>
          ))}
        </select>
        {lot && <p className="text-xs text-gray-500 mt-1">Stock restant : <strong>{formatTonnes(remaining)}</strong></p>}
      </div>
      <div>
        <label className="form-label" htmlFor="d-name">Bénéficiaire *</label>
        <input id="d-name" required value={form.beneficiary_name} onChange={(e) => setForm({ ...form, beneficiary_name: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="d-type">Type *</label>
        <select id="d-type" value={form.beneficiary_type} onChange={(e) => setForm({ ...form, beneficiary_type: e.target.value as Distribution['beneficiary_type'] })} className="form-input">
          <option value="agriculteur">Agriculteur</option>
          <option value="cooperative">Coopérative</option>
          <option value="gie">GIE</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="d-phone">Téléphone</label>
        <input id="d-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="d-date">Date *</label>
        <input id="d-date" type="date" required value={form.distributed_on} onChange={(e) => setForm({ ...form, distributed_on: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="d-region">Région *</label>
        <select id="d-region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="form-input">
          <option value="">Choisir…</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label" htmlFor="d-dept">Département</label>
        <input id="d-dept" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="form-input" />
      </div>
      <div className="sm:col-span-2">
        <label className="form-label" htmlFor="d-commune">Commune / village</label>
        <input id="d-commune" value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="d-qty">Quantité (kg) *</label>
        <input id="d-qty" required type="number" min={1} step="any" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="d-area">Superficie (ha)</label>
        <input
          id="d-area"
          type="number"
          min={0}
          step="any"
          placeholder={rate && form.quantity_kg ? `≈ ${(Number(form.quantity_kg) / rate).toFixed(1)} (calculée)` : ''}
          value={form.area_ha}
          onChange={(e) => setForm({ ...form, area_ha: e.target.value })}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label" htmlFor="d-mode">Mode *</label>
        <select id="d-mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as Distribution['mode'] })} className="form-input">
          <option value="subvention">Subventionné (État)</option>
          <option value="vente">Vente</option>
          <option value="don">Don / programme</option>
        </select>
      </div>
      {form.mode === 'vente' && (
        <div>
          <label className="form-label" htmlFor="d-price">Prix unitaire (FCFA/kg)</label>
          <input id="d-price" type="number" min={0} step="any" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} className="form-input" />
        </div>
      )}
      <FormFooter busy={busy} error={localError || error} label="Enregistrer la distribution" />
    </form>
  )
}
