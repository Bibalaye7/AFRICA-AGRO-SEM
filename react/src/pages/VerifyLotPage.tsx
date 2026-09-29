import { useState, type FormEvent } from 'react'
import PublicLayout from '../components/PublicLayout'
import { speciesName, CONTACT } from '../data/seeds'
import { verifyLot, type LotVerification } from '../lib/campaignStore'
import { ApiError } from '../lib/api'

const statusInfo: Record<LotVerification['status'], { label: string; icon: string; className: string }> = {
  certifie: { label: 'Lot certifié', icon: 'fa-circle-check', className: 'bg-green-50 border-green-200 text-green-800' },
  en_attente: { label: 'Certification en cours', icon: 'fa-hourglass-half', className: 'bg-amber-50 border-amber-200 text-amber-800' },
  rejete: { label: 'Lot non conforme : ne pas semer', icon: 'fa-triangle-exclamation', className: 'bg-red-50 border-red-200 text-red-800' },
}

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—')

const VerifyLotPage = () => {
  const [lotNumber, setLotNumber] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>('idle')
  const [result, setResult] = useState<LotVerification | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!lotNumber.trim()) return
    setState('loading')
    try {
      const lot = await verifyLot(lotNumber)
      setResult(lot)
      setState(lot ? 'found' : 'not_found')
    } catch (err) {
      // 503 : base de données pas encore disponible en ligne — message pour le visiteur, pas pour l'administrateur.
      setError(
        err instanceof ApiError && err.status === 503
          ? `La vérification en ligne sera bientôt disponible. En attendant, appelez-nous au ${CONTACT.phones[0]} avec votre numéro de lot.`
          : err instanceof Error ? err.message : 'Vérification impossible.',
      )
      setState('error')
    }
  }

  return (
    <PublicLayout>
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 to-white min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <span className="inline-grid place-items-center w-16 h-16 rounded-full bg-agro-green text-white mb-4">
              <i className="fa-solid fa-shield-halved text-2xl" aria-hidden="true" />
            </span>
            <h1 className="text-4xl font-bold text-agro-green mb-3">Vérifier un lot de semences</h1>
            <p className="text-gray-600">
              Saisissez le numéro de lot imprimé sur l’étiquette de votre sac pour vérifier qu’il s’agit bien d’une
              semence certifiée Africa Agro Sem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-lg">
            <label htmlFor="lot" className="sr-only">Numéro de lot</label>
            <input
              id="lot"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              placeholder="Ex. AAS-26-ARA-001"
              className="form-input flex-1 uppercase"
              autoComplete="off"
              required
            />
            <button type="submit" disabled={state === 'loading'} className="btn-primary disabled:opacity-50">
              {state === 'loading' ? 'Vérification…' : 'Vérifier'}
            </button>
          </form>

          {state === 'found' && result && (
            <div className={`mt-8 rounded-2xl border p-6 ${statusInfo[result.status].className}`} role="status">
              <p className="text-xl font-bold flex items-center gap-2 mb-4">
                <i className={`fa-solid ${statusInfo[result.status].icon}`} aria-hidden="true" />
                {statusInfo[result.status].label}
              </p>
              <dl className="grid grid-cols-2 gap-4 text-gray-800">
                <div><dt className="text-xs uppercase text-gray-500">Numéro de lot</dt><dd className="font-semibold">{result.lot_number}</dd></div>
                <div><dt className="text-xs uppercase text-gray-500">Campagne</dt><dd className="font-semibold">{result.campaign}</dd></div>
                <div><dt className="text-xs uppercase text-gray-500">Espèce / variété</dt><dd className="font-semibold">{speciesName(result.species)} – Variété {result.variety}</dd></div>
                <div><dt className="text-xs uppercase text-gray-500">Catégorie</dt><dd className="font-semibold">{result.category}</dd></div>
                <div><dt className="text-xs uppercase text-gray-500">Date de certification</dt><dd className="font-semibold">{formatDate(result.certification_date)}</dd></div>
                <div><dt className="text-xs uppercase text-gray-500">Taux de germination</dt><dd className="font-semibold">{result.germination_rate != null ? `${result.germination_rate} %` : '—'}</dd></div>
              </dl>
            </div>
          )}

          {state === 'not_found' && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800" role="alert">
              <p className="font-bold mb-2"><i className="fa-solid fa-circle-xmark mr-2" aria-hidden="true" />Aucun lot trouvé pour ce numéro.</p>
              <p className="text-sm">
                Vérifiez l’orthographe. Si le numéro est correct, la semence ne provient peut-être pas de chez nous :
                appelez-nous au <a className="underline font-semibold" href={`tel:${CONTACT.phones[0].replace(/\s/g, '')}`}>{CONTACT.phones[0]}</a> avant de semer.
              </p>
            </div>
          )}

          {state === 'error' && (
            <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800" role="alert">{error}</p>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}

export default VerifyLotPage
