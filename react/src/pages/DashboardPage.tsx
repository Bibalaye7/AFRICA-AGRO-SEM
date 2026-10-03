import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { REGIONS, SPECIES, speciesName } from '../data/seeds'
import {
  createCampaign, createDistribution, createLot, deleteDistribution, listCampaigns, listPartnerships,
  listReservations, loadCampaignData, updatePartnershipStatus, updateReservationStatus,
  listLivestockOrders, updateLivestockOrderStatus, type LivestockOrder,
  listFertilizerOrders, updateFertilizerOrderStatus, type FertilizerOrder,
  type Campaign, type Distribution, type PartnershipRequest, type Reservation, type SeedLot,
} from '../lib/campaignStore'
import { CumulativeChart, HorizontalBars, ProgressBars, formatTonnes } from '../components/dashboard/charts'
import { CampaignForm, DistributionForm, LotForm, Modal } from '../components/dashboard/forms'
import { FertilizerOrdersPanel, LivestockOrdersPanel, MessagesPanel, PasswordForm, TeamPanel } from '../components/dashboard/panels'

type Tab = 'overview' | 'distributions' | 'lots' | 'reservations' | 'fertilizer' | 'livestock' | 'partnerships' | 'messages' | 'team'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Vue d’ensemble', icon: 'fa-chart-pie' },
  { id: 'distributions', label: 'Distributions', icon: 'fa-truck-ramp-box' },
  { id: 'lots', label: 'Stocks et lots', icon: 'fa-warehouse' },
  { id: 'reservations', label: 'Réservations', icon: 'fa-calendar-check' },
  { id: 'fertilizer', label: 'Commandes engrais', icon: 'fa-flask' },
  { id: 'livestock', label: 'Commandes élevage', icon: 'fa-cow' },
  { id: 'partnerships', label: 'Partenariats', icon: 'fa-handshake' },
  { id: 'messages', label: 'Messages', icon: 'fa-envelope' },
  { id: 'team', label: 'Équipe', icon: 'fa-users' },
]

const beneficiaryLabels: Record<Distribution['beneficiary_type'], string> = {
  agriculteur: 'Agriculteur', cooperative: 'Coopérative', gie: 'GIE', autre: 'Autre',
}
const modeLabels: Record<Distribution['mode'], string> = { subvention: 'Subventionné', vente: 'Vente', don: 'Don' }
const lotStatusLabels: Record<SeedLot['status'], string> = { certifie: 'Certifié', en_attente: 'En cours', rejete: 'Rejeté' }
const reservationStatusLabels: Record<Reservation['status'], string> = { nouvelle: 'Nouvelle', confirmee: 'Confirmée', servie: 'Servie', annulee: 'Annulée' }
const partnershipStatusLabels: Record<PartnershipRequest['status'], string> = { nouvelle: 'Nouvelle', en_cours: 'En discussion', conclue: 'Conclue', refusee: 'Refusée' }

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const fmtNumber = (n: number, digits = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: digits })

function downloadCsv(filename: string, rows: (string | number | null)[][]) {
  const csv = rows
    .map((r) => r.map((c) => {
      const v = c == null ? '' : String(c)
      return /[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
    }).join(';'))
    .join('\n')
  // BOM pour qu'Excel lise correctement les accents
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignId, setCampaignId] = useState('')
  const [lots, setLots] = useState<SeedLot[]>([])
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [partnerships, setPartnerships] = useState<PartnershipRequest[]>([])
  const [livestockOrders, setLivestockOrders] = useState<LivestockOrder[]>([])
  const [fertilizerOrders, setFertilizerOrders] = useState<FertilizerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<'campaign' | 'lot' | 'distribution' | 'password' | null>(null)
  const [notice, setNotice] = useState('')
  const [filters, setFilters] = useState({ search: '', region: '', species: '' })

  const loadAll = useCallback(async (preferredCampaign?: string) => {
    setLoading(true)
    setError('')
    try {
      const [cs, rs, ps, lo, fo] = await Promise.all([listCampaigns(), listReservations(), listPartnerships(), listLivestockOrders(), listFertilizerOrders()])
      setLivestockOrders(lo)
      setFertilizerOrders(fo)
      setCampaigns(cs)
      setReservations(rs)
      setPartnerships(ps)
      const current = cs.find((c) => c.id === preferredCampaign) ?? cs.find((c) => c.is_active) ?? cs[0]
      setCampaignId(current?.id ?? '')
      if (current) {
        const data = await loadCampaignData(current.id)
        setLots(data.lots)
        setDistributions(data.distributions)
      } else {
        setLots([])
        setDistributions([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chargement impossible.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Les demandes arrivent du site public à tout moment : on recharge la liste à l'ouverture de son onglet.
  useEffect(() => {
    if (tab === 'reservations') listReservations().then(setReservations, (err) => setError(err.message))
    if (tab === 'partnerships') listPartnerships().then(setPartnerships, (err) => setError(err.message))
    if (tab === 'fertilizer') listFertilizerOrders().then(setFertilizerOrders, (err) => setError(err.message))
    if (tab === 'livestock') listLivestockOrders().then(setLivestockOrders, (err) => setError(err.message))
  }, [tab])

  const campaign = campaigns.find((c) => c.id === campaignId)
  const lotById = useMemo(() => new Map(lots.map((l) => [l.id, l])), [lots])

  // ---------- Indicateurs ----------
  const stats = useMemo(() => {
    const certifiedLots = lots.filter((l) => l.status === 'certifie')
    const stockKg = certifiedLots.reduce((s, l) => s + l.quantity_kg, 0)
    const distributedKg = distributions.reduce((s, d) => s + d.quantity_kg, 0)
    const areaHa = distributions.reduce((s, d) => s + (d.area_ha ?? 0), 0)
    const beneficiaries = new Set(distributions.map((d) => `${d.beneficiary_name.trim().toLowerCase()}|${d.phone ?? ''}`)).size
    const coops = distributions.filter((d) => d.beneficiary_type !== 'agriculteur').length

    const bySpecies = SPECIES.map((s) => {
      const lotIds = new Set(certifiedLots.filter((l) => l.species === s.id).map((l) => l.id))
      return {
        label: s.name,
        total: certifiedLots.filter((l) => l.species === s.id).reduce((acc, l) => acc + l.quantity_kg, 0),
        value: distributions.filter((d) => lotIds.has(d.lot_id)).reduce((acc, d) => acc + d.quantity_kg, 0),
      }
    }).filter((r) => r.total > 0)

    const regionMap = new Map<string, { kg: number; count: number }>()
    distributions.forEach((d) => {
      const r = regionMap.get(d.region) ?? { kg: 0, count: 0 }
      regionMap.set(d.region, { kg: r.kg + d.quantity_kg, count: r.count + 1 })
    })
    const byRegion = [...regionMap.entries()]
      .map(([label, r]) => ({ label, value: r.kg, detail: `${r.count} distribution${r.count > 1 ? 's' : ''}` }))
      .sort((a, b) => b.value - a.value)

    const byDay = new Map<string, number>()
    distributions.forEach((d) => byDay.set(d.distributed_on, (byDay.get(d.distributed_on) ?? 0) + d.quantity_kg))
    let cumul = 0
    const cumulative = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, kg]) => ({ date, value: (cumul += kg) }))

    const byMode = (['subvention', 'vente', 'don'] as const).map((m) => ({
      mode: m,
      kg: distributions.filter((d) => d.mode === m).reduce((s, d) => s + d.quantity_kg, 0),
    }))

    return { stockKg, distributedKg, remainingKg: stockKg - distributedKg, areaHa, beneficiaries, coops, bySpecies, byRegion, cumulative, byMode }
  }, [lots, distributions])

  const filteredDistributions = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return distributions.filter((d) => {
      const lot = lotById.get(d.lot_id)
      if (filters.region && d.region !== filters.region) return false
      if (filters.species && lot?.species !== filters.species) return false
      if (q && ![d.beneficiary_name, d.commune, d.phone, lot?.lot_number].some((v) => v?.toLowerCase().includes(q))) return false
      return true
    })
  }, [distributions, filters, lotById])

  const newReservations = reservations.filter((r) => r.status === 'nouvelle').length
  const newPartnerships = partnerships.filter((p) => p.status === 'nouvelle').length

  // ---------- Actions ----------
  const afterSave = async () => {
    setModal(null)
    await loadAll(campaignId)
  }

  const handleDelete = async (d: Distribution) => {
    if (!window.confirm(`Supprimer la distribution de ${formatTonnes(d.quantity_kg)} à ${d.beneficiary_name} ?`)) return
    try {
      await deleteDistribution(d.id)
      await loadAll(campaignId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible.')
    }
  }

  const exportDistributions = () => {
    downloadCsv(`distributions-${campaign?.name ?? 'campagne'}.csv`, [
      ['Date', 'Lot', 'Espèce', 'Variété', 'Bénéficiaire', 'Type', 'Téléphone', 'Région', 'Département', 'Commune', 'Quantité (kg)', 'Superficie (ha)', 'Mode', 'Prix (FCFA/kg)'],
      ...filteredDistributions.map((d) => {
        const lot = lotById.get(d.lot_id)
        return [d.distributed_on, lot?.lot_number ?? '', speciesName(lot?.species ?? ''), lot?.variety ?? '', d.beneficiary_name, beneficiaryLabels[d.beneficiary_type], d.phone, d.region, d.department, d.commune, d.quantity_kg, d.area_ha, modeLabels[d.mode], d.unit_price]
      }),
    ])
  }

  const exportLots = () => {
    downloadCsv(`stocks-${campaign?.name ?? 'campagne'}.csv`, [
      ['Lot', 'Espèce', 'Variété', 'Catégorie', 'Magasin', 'Région', 'Stock initial (kg)', 'Distribué (kg)', 'Restant (kg)', 'Germination (%)', 'Statut'],
      ...lots.map((l) => {
        const used = distributions.filter((d) => d.lot_id === l.id).reduce((s, d) => s + d.quantity_kg, 0)
        return [l.lot_number, speciesName(l.species), l.variety, l.category, l.warehouse, l.region, l.quantity_kg, used, l.quantity_kg - used, l.germination_rate, lotStatusLabels[l.status]]
      }),
    ])
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><img src="/les_logos/logo-blanc.jpg" alt="Africa Agro Sem" className="h-10 w-auto" /></Link>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Tableau de bord</h1>
              <p className="text-xs text-gray-500">Semences distribuées durant la campagne</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="campaign" className="sr-only">Campagne</label>
            <select
              id="campaign"
              value={campaignId}
              onChange={(e) => loadAll(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
            >
              {campaigns.length === 0 && <option value="">Aucune campagne</option>}
              {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active ? ' (en cours)' : ''}</option>)}
            </select>
            <button onClick={() => setModal('campaign')} className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
              <i className="fa-solid fa-plus mr-1" aria-hidden="true" /> Campagne
            </button>
            <Link to="/" className="px-3 py-2 text-sm text-gray-600 hover:text-agro-green">Voir le site</Link>
            {user && (
              <button onClick={() => setModal('password')} className="px-3 py-2 text-sm text-gray-600 hover:text-agro-green" title={user.email}>
                <i className="fa-solid fa-user mr-1.5" aria-hidden="true" />{user.full_name}
              </button>
            )}
            <button onClick={handleSignOut} className="px-3 py-2 text-sm text-gray-600 hover:text-agro-green">Déconnexion</button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto" aria-label="Sections du tableau de bord">
          {tabs.filter((t) => t.id !== 'team' || user?.role === 'admin').map((t) => {
            const badge =
              t.id === 'reservations' ? newReservations
              : t.id === 'partnerships' ? newPartnerships
              : t.id === 'fertilizer' ? fertilizerOrders.filter((o) => o.status === 'nouvelle').length
              : t.id === 'livestock' ? livestockOrders.filter((o) => o.status === 'nouvelle').length
              : 0
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 ${tab === t.id ? 'border-agro-green text-agro-green' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                <i className={`fa-solid ${t.icon} mr-2`} aria-hidden="true" />
                {t.label}
                {badge > 0 && <span className="ml-2 rounded-full bg-agro-green text-white text-xs px-2 py-0.5">{badge}</span>}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {notice && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">{notice}</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}

        {loading ? (
          <p className="text-center text-gray-500 py-20">Chargement…</p>
        ) : !['overview', 'distributions', 'lots'].includes(tab) ? null : !campaign ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-600 mb-4">Aucune campagne n’a encore été créée.</p>
            <button onClick={() => setModal('campaign')} className="btn-primary">Créer la première campagne</button>
          </div>
        ) : (
          <>
            {tab === 'overview' && (
              <>
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Indicateurs clés">
                  <StatTile label="Semences distribuées" value={formatTonnes(stats.distributedKg)} hint={`${stats.stockKg > 0 ? Math.round((stats.distributedKg / stats.stockKg) * 100) : 0} % du stock certifié`} />
                  <StatTile label="Stock restant" value={formatTonnes(stats.remainingKg)} hint={`sur ${formatTonnes(stats.stockKg)} certifiés`} />
                  <StatTile label="Bénéficiaires" value={fmtNumber(stats.beneficiaries)} hint={`dont ${stats.coops} distributions à des groupements`} />
                  <StatTile label="Superficie couverte" value={`${fmtNumber(stats.areaHa)} ha`} hint="estimée selon la dose de semis" />
                </section>

                <section className="grid lg:grid-cols-2 gap-6">
                  <Card title="Distribué par rapport au stock, par espèce">
                    <ProgressBars rows={stats.bySpecies} emptyText="Aucun lot certifié." />
                  </Card>
                  <Card title="Quantités distribuées par région">
                    <HorizontalBars rows={stats.byRegion} emptyText="Aucune distribution enregistrée." />
                  </Card>
                </section>

                <section className="grid lg:grid-cols-3 gap-6">
                  <Card title="Distribution cumulée depuis le début de la campagne" className="lg:col-span-2">
                    <CumulativeChart points={stats.cumulative} />
                  </Card>
                  <Card title="Répartition par mode">
                    <table className="w-full text-sm">
                      <tbody>
                        {stats.byMode.map((m) => (
                          <tr key={m.mode} className="border-b last:border-0">
                            <td className="py-3 text-gray-700">{modeLabels[m.mode]}</td>
                            <td className="py-3 text-right tabular-nums font-semibold">{formatTonnes(m.kg)}</td>
                            <td className="py-3 text-right tabular-nums text-gray-500 w-14">
                              {stats.distributedKg > 0 ? Math.round((m.kg / stats.distributedKg) * 100) : 0} %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-6 flex flex-col gap-2">
                      <button onClick={() => setModal('distribution')} className="w-full py-2.5 rounded-lg bg-agro-green text-white font-semibold text-sm">
                        <i className="fa-solid fa-plus mr-2" aria-hidden="true" />Nouvelle distribution
                      </button>
                      <button onClick={exportDistributions} className="w-full py-2.5 rounded-lg border border-gray-300 text-sm">
                        <i className="fa-solid fa-file-csv mr-2" aria-hidden="true" />Exporter le rapport (CSV)
                      </button>
                    </div>
                  </Card>
                </section>
              </>
            )}

            {tab === 'distributions' && (
              <Card
                title={`Distributions (${filteredDistributions.length})`}
                actions={
                  <>
                    <button onClick={exportDistributions} className="px-3 py-2 rounded-lg border border-gray-300 text-sm"><i className="fa-solid fa-file-csv mr-1.5" aria-hidden="true" />Exporter</button>
                    <button onClick={() => setModal('distribution')} className="px-3 py-2 rounded-lg bg-agro-green text-white text-sm font-semibold"><i className="fa-solid fa-plus mr-1.5" aria-hidden="true" />Ajouter</button>
                  </>
                }
              >
                <div className="flex flex-wrap gap-3 mb-4">
                  <input
                    aria-label="Rechercher"
                    placeholder="Rechercher un bénéficiaire, une commune, un lot…"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="form-input flex-1 min-w-[220px]"
                  />
                  <select aria-label="Filtrer par région" value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} className="form-input w-auto">
                    <option value="">Toutes les régions</option>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <select aria-label="Filtrer par espèce" value={filters.species} onChange={(e) => setFilters({ ...filters, species: e.target.value })} className="form-input w-auto">
                    <option value="">Toutes les espèces</option>
                    {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-3 font-medium">Date</th>
                        <th className="py-2 pr-3 font-medium">Bénéficiaire</th>
                        <th className="py-2 pr-3 font-medium">Localité</th>
                        <th className="py-2 pr-3 font-medium">Semence</th>
                        <th className="py-2 pr-3 font-medium text-right">Quantité</th>
                        <th className="py-2 pr-3 font-medium text-right">Superficie</th>
                        <th className="py-2 pr-3 font-medium">Mode</th>
                        <th className="py-2"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistributions.map((d) => {
                        const lot = lotById.get(d.lot_id)
                        return (
                          <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-2.5 pr-3 whitespace-nowrap tabular-nums">{fmtDate(d.distributed_on)}</td>
                            <td className="py-2.5 pr-3">
                              <span className="font-medium text-gray-900">{d.beneficiary_name}</span>
                              <span className="block text-xs text-gray-500">{beneficiaryLabels[d.beneficiary_type]}{d.phone ? ` · ${d.phone}` : ''}</span>
                            </td>
                            <td className="py-2.5 pr-3">{d.region}{d.commune ? <span className="block text-xs text-gray-500">{d.commune}</span> : null}</td>
                            <td className="py-2.5 pr-3">
                              {speciesName(lot?.species ?? '')} · Variété {lot?.variety}
                              <span className="block text-xs text-gray-500">{lot?.lot_number}</span>
                            </td>
                            <td className="py-2.5 pr-3 text-right tabular-nums font-semibold whitespace-nowrap">{formatTonnes(d.quantity_kg)}</td>
                            <td className="py-2.5 pr-3 text-right tabular-nums whitespace-nowrap">{d.area_ha != null ? `${fmtNumber(d.area_ha, 1)} ha` : '—'}</td>
                            <td className="py-2.5 pr-3">{modeLabels[d.mode]}</td>
                            <td className="py-2.5 text-right">
                              <button onClick={() => handleDelete(d)} className="p-2 text-gray-400 hover:text-red-600" aria-label={`Supprimer la distribution de ${d.beneficiary_name}`}>
                                <i className="fa-solid fa-trash-can" aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filteredDistributions.length === 0 && <p className="text-center text-gray-500 py-8">Aucune distribution ne correspond à ces filtres.</p>}
                </div>
              </Card>
            )}

            {tab === 'lots' && (
              <Card
                title={`Stocks et lots (${lots.length})`}
                actions={
                  <>
                    <button onClick={exportLots} className="px-3 py-2 rounded-lg border border-gray-300 text-sm"><i className="fa-solid fa-file-csv mr-1.5" aria-hidden="true" />Exporter</button>
                    <button onClick={() => setModal('lot')} className="px-3 py-2 rounded-lg bg-agro-green text-white text-sm font-semibold"><i className="fa-solid fa-plus mr-1.5" aria-hidden="true" />Nouveau lot</button>
                  </>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-3 font-medium">Lot</th>
                        <th className="py-2 pr-3 font-medium">Semence</th>
                        <th className="py-2 pr-3 font-medium">Magasin</th>
                        <th className="py-2 pr-3 font-medium text-right">Stock initial</th>
                        <th className="py-2 pr-3 font-medium text-right">Restant</th>
                        <th className="py-2 pr-3 font-medium min-w-[140px]">Distribué</th>
                        <th className="py-2 font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lots.map((l) => {
                        const used = distributions.filter((d) => d.lot_id === l.id).reduce((s, d) => s + d.quantity_kg, 0)
                        const pct = Math.min(100, (used / l.quantity_kg) * 100)
                        const low = l.status === 'certifie' && l.quantity_kg - used < l.quantity_kg * 0.1
                        return (
                          <tr key={l.id} className="border-b last:border-0">
                            <td className="py-2.5 pr-3 font-medium text-gray-900 whitespace-nowrap">{l.lot_number}</td>
                            <td className="py-2.5 pr-3">
                              {speciesName(l.species)} · Variété {l.variety}
                              <span className="block text-xs text-gray-500">Cat. {l.category}{l.germination_rate != null ? ` · germ. ${l.germination_rate} %` : ''}</span>
                            </td>
                            <td className="py-2.5 pr-3">{l.warehouse}<span className="block text-xs text-gray-500">{l.region}</span></td>
                            <td className="py-2.5 pr-3 text-right tabular-nums">{formatTonnes(l.quantity_kg)}</td>
                            <td className="py-2.5 pr-3 text-right tabular-nums font-semibold whitespace-nowrap">
                              {formatTonnes(l.quantity_kg - used)}
                              {low && <span className="block text-xs font-medium text-amber-700"><i className="fa-solid fa-triangle-exclamation mr-1" aria-hidden="true" />Stock bas</span>}
                            </td>
                            <td className="py-2.5 pr-3">
                              <div className="h-2 rounded-full bg-[#e6eee7] overflow-hidden"><div className="h-full rounded-full bg-agro-green" style={{ width: `${pct}%` }} /></div>
                              <span className="text-xs text-gray-500 tabular-nums">{Math.round(pct)} %</span>
                            </td>
                            <td className="py-2.5"><StatusPill status={l.status} label={lotStatusLabels[l.status]} /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {lots.length === 0 && <p className="text-center text-gray-500 py-8">Aucun lot enregistré pour cette campagne.</p>}
                </div>
              </Card>
            )}
          </>
        )}

        {!loading && tab === 'reservations' && (
          <Card title={`Réservations reçues depuis le site (${reservations.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-3 font-medium">Reçue le</th>
                    <th className="py-2 pr-3 font-medium">Demandeur</th>
                    <th className="py-2 pr-3 font-medium">Localité</th>
                    <th className="py-2 pr-3 font-medium">Demande</th>
                    <th className="py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 align-top">
                      <td className="py-2.5 pr-3 whitespace-nowrap tabular-nums">{fmtDate(r.created_at)}</td>
                      <td className="py-2.5 pr-3">
                        <span className="font-medium text-gray-900">{r.full_name}</span>
                        <a href={`tel:${r.phone}`} className="block text-xs text-agro-green">{r.phone}</a>
                      </td>
                      <td className="py-2.5 pr-3">{r.region}{r.commune ? <span className="block text-xs text-gray-500">{r.commune}</span> : null}</td>
                      <td className="py-2.5 pr-3">
                        <strong>{formatTonnes(r.quantity_kg)}</strong> de {speciesName(r.species)}{r.area_ha ? ` (${r.area_ha} ha)` : ''}
                        {r.message && <span className="block text-xs text-gray-500 max-w-xs">{r.message}</span>}
                      </td>
                      <td className="py-2.5">
                        <select
                          aria-label={`Statut de la réservation de ${r.full_name}`}
                          value={r.status}
                          onChange={async (e) => {
                            const status = e.target.value as Reservation['status']
                            try {
                              await updateReservationStatus(r.id, status)
                              setReservations((prev) => prev.map((x) => (x.id === r.id ? { ...x, status } : x)))
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Mise à jour impossible.')
                            }
                          }}
                          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm bg-white"
                        >
                          {Object.entries(reservationStatusLabels).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reservations.length === 0 && <p className="text-center text-gray-500 py-8">Aucune réservation pour le moment. Elles arrivent ici depuis le formulaire « Réservez vos semences » du site.</p>}
            </div>
          </Card>
        )}

        {!loading && tab === 'fertilizer' && (
          <FertilizerOrdersPanel
            orders={fertilizerOrders}
            onStatus={async (id, status) => {
              try {
                await updateFertilizerOrderStatus(id, status)
                setFertilizerOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Mise à jour impossible.')
              }
            }}
          />
        )}
        {!loading && tab === 'livestock' && (
          <LivestockOrdersPanel
            orders={livestockOrders}
            onStatus={async (id, status) => {
              try {
                await updateLivestockOrderStatus(id, status)
                setLivestockOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Mise à jour impossible.')
              }
            }}
          />
        )}
        {!loading && tab === 'messages' && <MessagesPanel />}
        {!loading && tab === 'team' && user?.role === 'admin' && <TeamPanel currentUser={user} />}

        {!loading && tab === 'partnerships' && (
          <Card title={`Demandes de partenariat (${partnerships.length})`}>
            <ul className="divide-y">
              {partnerships.map((p) => (
                <li key={p.id} className="py-4 flex flex-col md:flex-row md:items-start gap-3 justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{p.organization} <span className="font-normal text-gray-500">· {p.partner_type} · {p.country}</span></p>
                    <p className="text-sm text-gray-600">
                      {p.contact_name} · <a href={`mailto:${p.email}`} className="text-agro-green">{p.email}</a>{p.phone ? ` · ${p.phone}` : ''} · {fmtDate(p.created_at)}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{p.message}</p>
                  </div>
                  <select
                    aria-label={`Statut de la demande de ${p.organization}`}
                    value={p.status}
                    onChange={async (e) => {
                      const status = e.target.value as PartnershipRequest['status']
                      try {
                        await updatePartnershipStatus(p.id, status)
                        setPartnerships((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)))
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Mise à jour impossible.')
                      }
                    }}
                    className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm bg-white self-start"
                  >
                    {Object.entries(partnershipStatusLabels).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                  </select>
                </li>
              ))}
            </ul>
            {partnerships.length === 0 && <p className="text-center text-gray-500 py-8">Aucune demande pour le moment. Elles arrivent ici depuis la page « Partenariats ».</p>}
          </Card>
        )}
      </main>

      {modal === 'password' && (
        <Modal title="Changer mon mot de passe" onClose={() => setModal(null)}>
          <PasswordForm onDone={() => { setModal(null); setNotice('Mot de passe modifié.') }} />
        </Modal>
      )}
      {modal === 'campaign' && (
        <Modal title="Nouvelle campagne" onClose={() => setModal(null)}>
          <CampaignForm onSubmit={async (c) => { await createCampaign(c); await afterSave() }} />
        </Modal>
      )}
      {modal === 'lot' && campaign && (
        <Modal title="Nouveau lot de semences" onClose={() => setModal(null)}>
          <LotForm campaignId={campaign.id} onSubmit={async (l) => { await createLot(l); await afterSave() }} />
        </Modal>
      )}
      {modal === 'distribution' && campaign && (
        <Modal title="Nouvelle distribution" onClose={() => setModal(null)}>
          <DistributionForm campaignId={campaign.id} lots={lots} distributions={distributions} onSubmit={async (d) => { await createDistribution(d); await afterSave() }} />
        </Modal>
      )}
    </div>
  )
}

function Card({ title, actions, className = '', children }: { title: string; actions?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  )
}

function StatTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 my-1">{value}</p>
      <p className="text-xs text-gray-500">{hint}</p>
    </div>
  )
}

function StatusPill({ status, label }: { status: SeedLot['status']; label: string }) {
  const styles = {
    certifie: { cls: 'bg-green-50 text-green-800', icon: 'fa-circle-check' },
    en_attente: { cls: 'bg-amber-50 text-amber-800', icon: 'fa-hourglass-half' },
    rejete: { cls: 'bg-red-50 text-red-800', icon: 'fa-circle-xmark' },
  }[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.cls}`}>
      <i className={`fa-solid ${styles.icon}`} aria-hidden="true" />{label}
    </span>
  )
}

export default DashboardPage
