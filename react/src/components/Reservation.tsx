import { useState, type FormEvent } from 'react'
import { REGIONS, SPECIES, whatsappLink, type SpeciesId } from '../data/seeds'
import { submitReservation } from '../lib/campaignStore'

const formatKg = (kg: number) => (kg >= 1000 ? `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} t` : `${Math.round(kg)} kg`)

const emptyForm = { full_name: '', phone: '', region: '', commune: '', message: '' }

const Reservation = () => {
  const [species, setSpecies] = useState<SpeciesId>('arachide')
  const [area, setArea] = useState('1')
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const selected = SPECIES.find((s) => s.id === species)!
  const areaHa = Math.max(0, parseFloat(area.replace(',', '.')) || 0)
  const neededKg = areaHa * selected.seedRate

  const whatsappText =
    `Bonjour Africa Agro Sem, je souhaite réserver ${formatKg(neededKg)} de semences de ${selected.name} ` +
    `pour ${areaHa} ha${form.region ? ` (région de ${form.region})` : ''}.${form.full_name ? ` Nom : ${form.full_name}.` : ''}`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (neededKg <= 0) {
      setError('Indiquez une superficie supérieure à zéro.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setError('')
    try {
      await submitReservation({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        region: form.region,
        commune: form.commune.trim() || null,
        species,
        quantity_kg: Math.round(neededKg),
        area_ha: areaHa,
        message: form.message.trim() || null,
      })
      setStatus('success')
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible.')
      setStatus('error')
    }
  }

  return (
    <section id="reservation" className="py-20 bg-gradient-to-b from-green-50 to-white scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Réservez vos semences</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculez votre besoin, puis envoyez votre réservation. Un conseiller vous rappelle pour confirmer le point de retrait.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 bg-agro-green text-white rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-5">
              <i className="fa-solid fa-calculator mr-2" aria-hidden="true" />
              Calculateur de besoin
            </h3>
            <label className="block text-sm mb-1" htmlFor="calc-species">Culture</label>
            <select id="calc-species" value={species} onChange={(e) => setSpecies(e.target.value as SpeciesId)} className="form-input text-gray-900 mb-4">
              {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <label className="block text-sm mb-1" htmlFor="calc-area">Superficie à semer (ha)</label>
            <input id="calc-area" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} className="form-input text-gray-900 mb-6" />
            <div className="bg-white/10 rounded-xl p-5">
              <p className="text-sm text-white/80">Quantité recommandée</p>
              <p className="text-4xl font-bold my-1">{formatKg(neededKg)}</p>
              <p className="text-xs text-white/75">
                Base : {selected.seedRate} kg/ha ({selected.seedRateNote}). Valeur indicative, à ajuster avec nos techniciens selon votre sol.
              </p>
            </div>
            <a
              href={whatsappLink(whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white text-agro-green font-semibold hover:bg-green-50"
            >
              <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true" />
              Réserver par WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 md:p-8 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="res-name">Nom complet ou nom de la coopérative *</label>
              <input id="res-name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label" htmlFor="res-phone">Téléphone *</label>
              <input id="res-phone" required type="tel" placeholder="77 000 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label" htmlFor="res-region">Région *</label>
              <select id="res-region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="form-input">
                <option value="">Choisir…</option>
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="res-commune">Commune / village</label>
              <input id="res-commune" value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} className="form-input" />
            </div>
            <div className="sm:col-span-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-gray-700">
              Réservation : <strong>{formatKg(neededKg)}</strong> de <strong>{selected.name}</strong> pour <strong>{areaHa} ha</strong>
              <span className="text-gray-500"> (modifiable dans le calculateur)</span>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="res-message">Précisions (variété souhaitée, date de retrait…)</label>
              <textarea id="res-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="form-input resize-none" />
            </div>

            {status === 'success' && (
              <p className="sm:col-span-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm" role="status">
                Réservation enregistrée. Nous vous appelons pour confirmer la quantité et le point de retrait.
              </p>
            )}
            {status === 'error' && (
              <p className="sm:col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
                {error} Vous pouvez aussi réserver par WhatsApp.
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary sm:col-span-2 disabled:opacity-50">
              {status === 'sending' ? 'Envoi…' : 'Envoyer ma réservation'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Reservation
