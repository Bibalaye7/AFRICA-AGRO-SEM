import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'
import {
  BAG_KG, FERTILIZERS, FERTILIZER_CATEGORIES, FERTILIZER_CUSTOMER_TYPES, FERTILIZER_PLANS,
  fertilizerName, type Fertilizer, type FertilizerCategory,
} from '../data/fertilizers'
import { REGIONS, whatsappLink } from '../data/seeds'
import { submitFertilizerOrder, type NewFertilizerOrder } from '../lib/campaignStore'

const practices = [
  { icon: 'fa-vial', title: 'Connaître son sol', text: 'Un sol sableux, acide ou épuisé n’a pas les mêmes besoins : parlez-nous de votre parcelle avant de choisir la formule.' },
  { icon: 'fa-arrow-down-short-wide', title: 'Enfouir l’engrais de fond', text: 'Apportez le NPK au semis et recouvrez-le de terre : il reste à portée des racines et ne se perd pas.' },
  { icon: 'fa-cloud-rain', title: 'Fractionner l’urée', text: 'Apportez l’azote en 2 ou 3 fois, sur sol humide après une pluie, jamais avant une grosse averse.' },
  { icon: 'fa-recycle', title: 'Associer organique et minéral', text: 'Le compost ou le fumier rendent les engrais minéraux plus efficaces et améliorent le sol durablement.' },
  { icon: 'fa-warehouse', title: 'Bien stocker', text: 'Gardez les sacs fermés, au sec, à l’abri du soleil, loin des enfants et des aliments. Portez des gants.' },
]

const faq = [
  { q: 'Comment passer commande ?', a: 'Ajoutez les engrais à votre commande depuis le catalogue ou le calculateur, puis remplissez le formulaire. Vous pouvez aussi commander directement par WhatsApp. Nous vous rappelons pour confirmer le prix, la date et le paiement.' },
  { q: 'Comment savoir quel engrais choisir ?', a: 'Utilisez le calculateur : choisissez votre culture et votre surface, il vous propose les engrais, les quantités et le moment d’apport. Nos conseillers vous aident gratuitement à l’adapter à votre sol.' },
  { q: 'Livrez-vous dans les régions ?', a: 'Oui, selon les quantités et votre localité. Vous pouvez aussi retirer votre commande dans notre magasin. Indiquez votre région et votre village ou quartier dans le formulaire.' },
  { q: 'Faites-vous des prix pour les commandes groupées ?', a: 'Oui : GIE, coopératives, revendeurs et projets peuvent demander un devis pour des volumes importants. Choisissez votre type de structure dans le formulaire.' },
  { q: 'Proposez-vous les engrais subventionnés ?', a: 'Les engrais subventionnés sont mis en place chaque campagne par l’État, avec des prix et des circuits fixés par les autorités. Contactez-nous pour savoir ce que nous pouvons proposer cette campagne.' },
  { q: 'Comment reconnaître un engrais de qualité ?', a: 'Un sac scellé, une étiquette lisible avec la formule (par exemple NPK 15-15-15), le poids et le fabricant, et des granulés secs et réguliers. Méfiez-vous des sacs ouverts ou reconditionnés.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

const nutrientColors = ['bg-agro-green', 'bg-amber-500', 'bg-rose-500']
const nutrientLabels = ['N', 'P₂O₅', 'K₂O']

function Composition({ npk }: { npk: Fertilizer['npk'] }) {
  if (!npk) {
    return (
      <p className="flex items-center gap-2 text-sm text-agro-green font-medium">
        <i className="fa-solid fa-seedling" aria-hidden="true" /> Matière organique naturelle
      </p>
    )
  }
  return (
    <dl className="space-y-1.5">
      {npk.map((v, i) => (
        <div key={nutrientLabels[i]} className="flex items-center gap-2 text-xs">
          <dt className="w-10 text-gray-500">{nutrientLabels[i]}</dt>
          <dd className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.span
              className={`block h-full rounded-full ${nutrientColors[i]}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, (v / 60) * 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          </dd>
          <dd className="w-9 text-right font-semibold tabular-nums text-gray-800">{v} %</dd>
        </div>
      ))}
    </dl>
  )
}

const emptyForm = {
  customer_type: 'producteur',
  region: '',
  address: '',
  delivery: 'livraison' as NewFertilizerOrder['delivery'],
  wanted_date: '',
  full_name: '',
  phone: '',
  message: '',
}

const bagsLabel = (n: number) => `${n} sac${n > 1 ? 's' : ''}`
// « 3 sacs de NPK 15-15-15 », mais « 3 sacs d’Urée 46 % »
const bagsOf = (n: number, id: string) => { const name = fertilizerName(id); return `${bagsLabel(n)} ${/^[AEIOUYÉÈ]/i.test(name) ? 'd’' : 'de '}${name}` }

const EngraisPage = () => {
  const [category, setCategory] = useState<'tous' | FertilizerCategory>('tous')
  // Commande en cours : identifiant de l'engrais → nombre de sacs (texte saisi)
  const [cart, setCart] = useState<Record<string, string>>({})
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [planId, setPlanId] = useState(FERTILIZER_PLANS[0].id)
  const [area, setArea] = useState('1')
  const [formVisible, setFormVisible] = useState(false)
  const [added, setAdded] = useState('')

  useEffect(() => {
    const el = document.getElementById('commande')
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const shown = FERTILIZERS.filter((f) => category === 'tous' || f.category === category)

  const items = Object.entries(cart)
    .map(([product, bags]) => ({ product, bags: Math.max(0, Math.floor(Number(bags) || 0)) }))
    .filter((i) => i.bags > 0)
  const totalBags = items.reduce((s, i) => s + i.bags, 0)
  const summary = items.map((i) => bagsOf(i.bags, i.product)).join(', ')

  const addToCart = (id: string, bags = 1) => {
    setCart((prev) => ({ ...prev, [id]: String((Math.floor(Number(prev[id]) || 0)) + bags) }))
    setStatus('idle')
    setAdded(id)
    window.setTimeout(() => setAdded((a) => (a === id ? '' : a)), 1500)
  }
  const removeFromCart = (id: string) => setCart(({ [id]: _removed, ...rest }) => rest)

  // ---- Calculateur ----
  const plan = FERTILIZER_PLANS.find((p) => p.id === planId)!
  const ha = Math.max(0, Number(area.replace(',', '.')) || 0)
  const planRows = plan.steps.map((s) => {
    const kg = s.kgPerHa * ha
    return { ...s, kg, bags: Math.ceil(kg / BAG_KG) }
  })
  const addPlan = () => {
    setCart((prev) => {
      const next = { ...prev }
      for (const r of planRows) if (r.bags > 0) next[r.fertilizerId] = String((Math.floor(Number(next[r.fertilizerId]) || 0)) + r.bags)
      return next
    })
    setStatus('idle')
    document.getElementById('commande')?.scrollIntoView({ behavior: 'smooth' })
  }

  const customerLabel = FERTILIZER_CUSTOMER_TYPES.find((c) => c.id === form.customer_type)!.label
  const whatsappText =
    `Bonjour Africa Agro Sem, je souhaite commander des engrais : ${summary || '(à préciser)'}.` +
    (form.region ? ` Région : ${form.region}${form.address ? `, ${form.address}` : ''}.` : '') +
    (form.full_name ? ` Nom : ${form.full_name}.` : '')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setStatus('sending')
    const input: NewFertilizerOrder = {
      items,
      customer_type: form.customer_type,
      region: form.region,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      delivery: form.delivery,
      wanted_date: form.wanted_date || null,
      message: form.message.trim() || null,
    }
    const mail = [
      'Nouvelle commande d’engrais depuis le site :',
      ...items.map((i) => `- ${bagsOf(i.bags, i.product)}`),
      `Total : ${bagsLabel(totalBags)} (${(totalBags * BAG_KG).toLocaleString('fr-FR')} kg)`,
      `Client : ${input.full_name} (${customerLabel})`,
      `Téléphone : ${input.phone}`,
      `${input.delivery === 'livraison' ? 'Livraison' : 'Retrait au magasin'} : ${input.region}, ${input.address}`,
      input.wanted_date ? `Date souhaitée : ${input.wanted_date}` : '',
      input.message ? `Précisions : ${input.message}` : '',
    ].filter(Boolean).join('\n')
    try {
      await submitFertilizerOrder(input, mail)
      setStatus('success')
      setCart({})
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <PublicLayout>
        {/* ---- Héros ---- */}
        <section className="pt-28 pb-16 bg-gradient-to-br from-lime-50 via-white to-amber-50 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="uppercase tracking-[0.2em] text-sm text-agro-green font-semibold mb-4">
                Vente d’engrais
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5"
              >
                Le bon engrais, <span className="text-agro-green">à la bonne dose</span>, au bon moment
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-lg text-gray-600 mb-8 max-w-xl">
                NPK, urée, DAP, potasse, engrais de maraîchage et organiques : nous vendons les engrais utilisés au Sénégal,
                avec un conseil de dosage gratuit pour chaque culture et la livraison dans les régions.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-3">
                <a href="#calculateur" className="btn-primary">Calculer mes besoins</a>
                <a href="#catalogue" className="py-3 px-6 rounded-lg font-semibold border-2 border-agro-green text-agro-green hover:bg-agro-green hover:text-white transition-colors">
                  Voir les engrais
                </a>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { src: '/images/engrais/agriculteur.jpg', alt: 'Agriculteur dans un champ bien nourri', cls: 'row-span-2 h-full min-h-[320px]', pos: '35% 50%' },
                { src: '/images/engrais/npk-granules.jpg', alt: 'Granulés d’engrais NPK', cls: 'h-44 md:h-52', pos: '50% 50%' },
                { src: '/images/engrais/sacs.jpg', alt: 'Sacs d’engrais empilés', cls: 'h-44 md:h-52', pos: '50% 50%' },
              ].map((img, i) => (
                <motion.img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full object-cover rounded-2xl shadow-xl ${img.cls}`}
                  style={{ objectPosition: img.pos }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---- Bandeau de confiance ---- */}
        <section className="bg-agro-green text-white">
          <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-box', text: 'Sacs de 50 kg scellés et étiquetés' },
              { icon: 'fa-calculator', text: 'Conseil de dosage gratuit' },
              { icon: 'fa-people-group', text: 'Commandes groupées GIE et coopératives' },
              { icon: 'fa-truck', text: 'Livraison dans les régions' },
            ].map((b) => (
              <p key={b.text} className="flex items-center gap-3 text-sm md:text-base">
                <i className={`fa-solid ${b.icon} text-2xl text-green-200`} aria-hidden="true" />
                {b.text}
              </p>
            ))}
          </div>
        </section>

        {/* ---- Catalogue ---- */}
        <section id="catalogue" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-3">Nos engrais</h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Les formules utilisées au Sénégal, avec leur composition, les cultures conseillées et la dose indicative.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filtrer par type d’engrais">
              {[{ id: 'tous' as const, label: 'Tous', icon: 'fa-border-all' }, ...FERTILIZER_CATEGORIES].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${category === c.id ? 'bg-agro-green text-white border-agro-green' : 'border-gray-300 text-gray-700 hover:border-agro-green'}`}
                >
                  <i className={`fa-solid ${c.icon} mr-2`} aria-hidden="true" />
                  {c.label}
                </button>
              ))}
            </div>

            {category !== 'tous' && (() => {
              const c = FERTILIZER_CATEGORIES.find((x) => x.id === category)!
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8 rounded-2xl overflow-hidden h-40 md:h-48">
                  <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/10" />
                  <div className="relative h-full flex flex-col justify-center px-6 md:px-10 text-white max-w-xl">
                    <p className="text-2xl md:text-3xl font-bold mb-1">{c.label}</p>
                    <p className="text-white/85">{c.text}</p>
                  </div>
                </motion.div>
              )
            })()}

            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {shown.map((f) => (
                  <motion.article
                    key={f.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{f.name}</h3>
                        <p className="text-sm text-gray-500">{FERTILIZER_CATEGORIES.find((c) => c.id === f.category)!.label}</p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-green-50 px-2.5 py-1 text-sm font-bold text-agro-green tabular-nums">{f.formula}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{f.description}</p>
                    <div className="mb-4">
                      <Composition npk={f.npk} />
                      {f.extra && <p className="mt-1.5 text-xs font-medium text-gray-600">{f.extra}</p>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {f.crops.map((c) => <span key={c} className="rounded-full bg-amber-50 text-amber-800 text-xs px-2.5 py-1">{c}</span>)}
                    </div>
                    <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm mb-5">
                      <dt className="text-gray-500"><i className="fa-solid fa-scale-balanced w-4" aria-hidden="true" /> Dose</dt><dd className="text-gray-900">{f.dose}</dd>
                      <dt className="text-gray-500"><i className="fa-regular fa-clock w-4" aria-hidden="true" /> Quand</dt><dd className="text-gray-900">{f.timing}</dd>
                      <dt className="text-gray-500"><i className="fa-solid fa-box w-4" aria-hidden="true" /> Format</dt><dd className="text-gray-900">{f.packaging}</dd>
                    </dl>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <p className="font-semibold text-agro-green">
                        {f.price ? `${f.price.toLocaleString('fr-FR')} FCFA / sac` : 'Prix sur demande'}
                      </p>
                      <button
                        onClick={() => addToCart(f.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${added === f.id ? 'bg-green-100 text-agro-green' : 'bg-agro-green text-white hover:bg-agro-light'}`}
                      >
                        {added === f.id ? <><i className="fa-solid fa-check mr-1.5" aria-hidden="true" />Ajouté</> : <><i className="fa-solid fa-plus mr-1.5" aria-hidden="true" />Commander</>}
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
            <p className="text-center text-sm text-gray-500 mt-8">
              Doses indicatives, d’après les recommandations courantes au Sénégal (ISRA). Elles varient selon le sol et la pluviométrie : demandez conseil.
            </p>
          </div>
        </section>

        {/* ---- Calculateur ---- */}
        <section id="calculateur" className="py-20 bg-gradient-to-b from-green-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <h2 className="section-title mb-3">Calculez vos besoins en engrais</h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">Choisissez votre culture et votre surface : vous obtenez les engrais, les quantités et le nombre de sacs.</p>

            <motion.div {...fadeUp} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="calc-crop" className="form-label">Culture</label>
                  <select id="calc-crop" value={planId} onChange={(e) => setPlanId(e.target.value)} className="form-input">
                    {FERTILIZER_PLANS.map((p) => <option key={p.id} value={p.id}>{p.crop}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="calc-area" className="form-label">Surface (hectares)</label>
                  <input id="calc-area" type="number" min={0} step={0.25} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} className="form-input" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-3 font-medium">Engrais</th>
                      <th className="py-2 pr-3 font-medium">Dose / ha</th>
                      <th className="py-2 pr-3 font-medium">Total</th>
                      <th className="py-2 pr-3 font-medium">Sacs de 50 kg</th>
                      <th className="py-2 font-medium">Quand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planRows.map((r) => (
                      <tr key={r.fertilizerId} className="border-b last:border-0 align-top">
                        <td className="py-3 pr-3 font-semibold text-gray-900">{fertilizerName(r.fertilizerId)}</td>
                        <td className="py-3 pr-3 tabular-nums">{r.kgPerHa} kg</td>
                        <td className="py-3 pr-3 tabular-nums">{r.kg.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg</td>
                        <td className="py-3 pr-3 tabular-nums font-bold text-agro-green">{r.bags}</td>
                        <td className="py-3 text-gray-600">{r.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {plan.note && (
                <p className="mt-4 text-sm text-gray-700 rounded-lg bg-amber-50 px-4 py-3">
                  <i className="fa-solid fa-leaf text-amber-600 mr-2" aria-hidden="true" />{plan.note}
                </p>
              )}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-gray-700">
                  Total : <strong className="text-agro-green">{bagsLabel(planRows.reduce((s, r) => s + r.bags, 0))}</strong> pour {ha.toLocaleString('fr-FR')} ha de {plan.crop.toLowerCase()}
                </p>
                <button onClick={addPlan} disabled={ha <= 0} className="btn-primary disabled:opacity-50">
                  <i className="fa-solid fa-cart-plus mr-2" aria-hidden="true" />Ajouter à ma commande
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---- Pack semences + engrais ---- */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeUp} className="grid md:grid-cols-[1.2fr,1fr] rounded-3xl overflow-hidden bg-gray-900 text-white">
              <div className="p-8 md:p-12">
                <p className="uppercase tracking-[0.2em] text-xs text-green-300 font-semibold mb-3">Pack campagne</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Semences certifiées + engrais adaptés</h2>
                <p className="text-white/80 mb-6">
                  Une bonne semence donne tout son potentiel avec la bonne fumure. Réservez vos semences Variété Sunugal et vos engrais en même temps :
                  un seul interlocuteur, une seule livraison pour la campagne.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/#reservation" className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-green-50">Réserver mes semences</Link>
                  <Link to="/semences" className="px-6 py-3 rounded-lg border border-white/30 font-semibold hover:bg-white/10">Voir les semences</Link>
                </div>
              </div>
              <img src="/images/engrais/riziere.jpg" alt="Apport sur une rizière" loading="lazy" className="w-full h-64 md:h-full object-cover" />
            </motion.div>
          </div>
        </section>

        {/* ---- Approvisionnement et partenaires ---- */}
        <section className="py-20 bg-gradient-to-b from-white to-green-50">
          <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
            <div className="grid grid-cols-2 gap-4">
              <motion.img
                {...fadeUp}
                src="/images/engrais/equipe-entrepot.jpg"
                alt="Un responsable d’Africa Agro Sem dans un entrepôt d’engrais"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-xl"
              />
              <motion.img
                {...fadeUp}
                transition={{ delay: 0.15 }}
                src="/images/engrais/equipe-partenaire.jpg"
                alt="Africa Agro Sem avec un partenaire, sac d’engrais en main"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-xl mt-10"
                style={{ objectPosition: '50% 30%' }}
              />
            </div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Un approvisionnement sérieux, avec nos partenaires</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous travaillons directement avec des fabricants et des fournisseurs partenaires, au Sénégal et à l’international.
                Nos équipes se rendent sur les sites de production et de stockage pour contrôler les produits avant leur arrivée.
              </p>
              <ul className="space-y-2 text-gray-800 mb-6">
                {['Formule conforme à l’étiquette', 'Sacs neufs, scellés et pesés', 'Stocks constitués avant les premières pluies'].map((t) => (
                  <li key={t} className="flex gap-2"><i className="fa-solid fa-circle-check text-agro-green mt-1" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <Link to="/partenariats" className="btn-primary inline-block">Devenir partenaire</Link>
            </motion.div>
          </div>
        </section>

        {/* ---- Bonnes pratiques ---- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-3">Bien utiliser ses engrais</h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">Cinq gestes simples pour que chaque sac rapporte plus.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {practices.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-gray-100 p-5 shadow-sm"
                >
                  <span className="inline-grid w-12 h-12 place-items-center rounded-full bg-agro-green text-white mb-3">
                    <i className={`fa-solid ${p.icon}`} aria-hidden="true" />
                  </span>
                  <h3 className="font-bold mb-1.5">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Professionnels ---- */}
        <section id="professionnels" className="py-20 bg-gray-900 text-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pour les volumes importants</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { type: 'groupement', icon: 'fa-people-group', title: 'GIE et coopératives', text: 'Commandes groupées pour vos membres, livraison au village et conseil de fumure.' },
                { type: 'revendeur', icon: 'fa-shop', title: 'Revendeurs', text: 'Approvisionnement régulier de votre boutique d’intrants, en sacs de 50 kg.' },
                { type: 'entreprise', icon: 'fa-briefcase', title: 'Projets, ONG, entreprises', text: 'Devis, facture et livraison planifiée pour vos programmes agricoles.' },
              ].map((p, i) => (
                <motion.div key={p.type} {...fadeUp} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-white/5 border border-white/10 p-7 flex flex-col">
                  <i className={`fa-solid ${p.icon} text-3xl text-green-300 mb-4`} aria-hidden="true" />
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-white/80 mb-6">{p.text}</p>
                  <a href="#commande" onClick={() => setForm((f) => ({ ...f, customer_type: p.type }))} className="mt-auto inline-block text-center px-5 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-green-50">
                    Demander un devis
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Commande ---- */}
        <section id="commande" className="py-20 bg-gradient-to-b from-green-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="section-title mb-3">Commander des engrais</h2>
            <p className="text-center text-lg text-gray-600 mb-10">Nous vous rappelons pour confirmer le prix, la date et le paiement.</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 grid sm:grid-cols-2 gap-4">
              <fieldset className="sm:col-span-2">
                <legend className="form-label">Engrais commandés *</legend>
                {items.length === 0 && Object.keys(cart).length === 0 && (
                  <p className="text-sm text-gray-500 mb-3">Ajoutez des engrais depuis le catalogue ou le calculateur, ou choisissez-les ici.</p>
                )}
                <ul className="space-y-2 mb-3">
                  {Object.entries(cart).map(([id, bags]) => (
                    <li key={id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                      <span className="flex-1 font-medium text-gray-900">{fertilizerName(id)}</span>
                      <label className="sr-only" htmlFor={`bags-${id}`}>Nombre de sacs de {fertilizerName(id)}</label>
                      <input
                        id={`bags-${id}`}
                        type="number"
                        min={1}
                        required
                        value={bags}
                        onChange={(e) => setCart((prev) => ({ ...prev, [id]: e.target.value }))}
                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-right tabular-nums"
                      />
                      <span className="text-sm text-gray-500 w-10">sacs</span>
                      <button type="button" onClick={() => removeFromCart(id)} aria-label={`Retirer ${fertilizerName(id)}`} className="text-gray-400 hover:text-red-600 p-1">
                        <i className="fa-solid fa-trash-can" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
                <select
                  aria-label="Ajouter un engrais"
                  value=""
                  onChange={(e) => e.target.value && addToCart(e.target.value)}
                  className="form-input"
                >
                  <option value="">+ Ajouter un engrais…</option>
                  {FERTILIZER_CATEGORIES.map((c) => (
                    <optgroup key={c.id} label={c.label}>
                      {FERTILIZERS.filter((f) => f.category === c.id).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </fieldset>
              <div>
                <label htmlFor="f-type" className="form-label">Vous êtes *</label>
                <select id="f-type" value={form.customer_type} onChange={(e) => setForm({ ...form, customer_type: e.target.value })} className="form-input">
                  {FERTILIZER_CUSTOMER_TYPES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="f-region" className="form-label">Région *</label>
                <select id="f-region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="form-input">
                  <option value="">Choisir…</option>
                  {REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <fieldset>
                <legend className="form-label">Réception *</legend>
                <div className="flex gap-4 pt-2">
                  {[['livraison', 'Livraison'], ['retrait', 'Retrait au magasin']].map(([v, l]) => (
                    <label key={v} className="flex items-center gap-2 text-gray-700">
                      <input type="radio" name="delivery" value={v} checked={form.delivery === v} onChange={() => setForm({ ...form, delivery: v as NewFertilizerOrder['delivery'] })} className="accent-agro-green" />
                      {l}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="f-date" className="form-label">Date souhaitée</label>
                <input id="f-date" type="date" value={form.wanted_date} onChange={(e) => setForm({ ...form, wanted_date: e.target.value })} className="form-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="f-address" className="form-label">{form.delivery === 'livraison' ? 'Lieu de livraison (commune, village ou quartier) *' : 'Commune, village ou quartier *'}</label>
                <input id="f-address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="form-input" />
              </div>
              <div>
                <label htmlFor="f-name" className="form-label">Nom ou structure *</label>
                <input id="f-name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="form-input" />
              </div>
              <div>
                <label htmlFor="f-phone" className="form-label">Téléphone *</label>
                <input id="f-phone" type="tel" required placeholder="77 000 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="f-msg" className="form-label">Précisions (cultures, surface, type de sol…)</label>
                <textarea id="f-msg" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="form-input resize-none" />
              </div>

              <p className="sm:col-span-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-gray-700">
                <i className="fa-solid fa-basket-shopping text-agro-green mr-2" aria-hidden="true" />
                {items.length > 0
                  ? <>Votre commande : <strong>{summary}</strong> – soit {bagsLabel(totalBags)}, {(totalBags * BAG_KG).toLocaleString('fr-FR')} kg</>
                  : 'Votre commande est vide : ajoutez au moins un engrais.'}
              </p>
              {status === 'success' && (
                <p className="sm:col-span-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm" role="status">
                  Commande envoyée ! Nous vous appelons rapidement pour la confirmer.
                </p>
              )}
              {status === 'error' && (
                <p className="sm:col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
                  L’envoi a échoué. Commandez directement par WhatsApp avec le bouton ci-dessous.
                </p>
              )}
              <button type="submit" disabled={status === 'sending' || items.length === 0} className="btn-primary disabled:opacity-50">
                {status === 'sending' ? 'Envoi…' : 'Envoyer la commande'}
              </button>
              <a
                href={whatsappLink(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white font-semibold py-3 px-6 hover:brightness-95"
              >
                <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true" /> Commander par WhatsApp
              </a>
            </form>
          </div>
        </section>

        {/* ---- Questions fréquentes ---- */}
        <section className="py-20 bg-gradient-to-b from-white to-green-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="section-title mb-10">Questions fréquentes</h2>
            <div className="space-y-3">
              {faq.map((f) => (
                <details key={f.q} className="group rounded-xl bg-white border border-gray-100 shadow-sm p-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-gray-900 list-none">
                    {f.q}
                    <i className="fa-solid fa-chevron-down text-agro-green transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Barre « Ma commande » ---- */}
        <AnimatePresence>
          {totalBags > 0 && !formVisible && (
            <motion.a
              href="#commande"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-5 left-4 right-24 sm:right-auto z-40 flex items-center gap-3 rounded-full bg-gray-900 text-white pl-4 pr-5 py-3 shadow-xl"
            >
              <span className="grid w-8 h-8 place-items-center rounded-full bg-agro-green text-sm font-bold tabular-nums">{items.length}</span>
              <span className="text-sm">
                Ma commande · <strong>{bagsLabel(totalBags)}</strong>
              </span>
              <i className="fa-solid fa-arrow-right ml-auto sm:ml-2" aria-hidden="true" />
            </motion.a>
          )}
        </AnimatePresence>
      </PublicLayout>
    </MotionConfig>
  )
}

export default EngraisPage
