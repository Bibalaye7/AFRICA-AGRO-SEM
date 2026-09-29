import { useState, type FormEvent } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'
import { CUSTOMER_TYPES, FREQUENCIES, LIVESTOCK_ACTIVITIES, LIVESTOCK_PRODUCTS, type LivestockProduct } from '../data/livestock'
import { whatsappLink } from '../data/seeds'
import { submitLivestockOrder, type NewLivestockOrder } from '../lib/campaignStore'

const commitments = [
  { icon: 'fa-user-doctor', title: 'Suivi vétérinaire', text: 'Vaccinations et soins suivis pour chaque troupeau et chaque bande.' },
  { icon: 'fa-hand-sparkles', title: 'Hygiène', text: 'Traite, ramassage des œufs et abattage réalisés dans le respect de l’hygiène.' },
  { icon: 'fa-snowflake', title: 'Fraîcheur', text: 'Lait refroidi, œufs ramassés chaque jour, poulets préparés à la commande.' },
  { icon: 'fa-list-check', title: 'Traçabilité', text: 'Chaque bande de poulets et chaque lot de production est suivi.' },
]

const faq = [
  { q: 'Comment passer commande ?', a: 'Remplissez le formulaire ci-dessous ou écrivez-nous sur WhatsApp. Nous vous rappelons pour confirmer la quantité, le prix, la date et le mode de paiement.' },
  { q: 'Livrez-vous ?', a: 'Oui, selon votre zone. Vous pouvez aussi choisir de récupérer votre commande à la ferme. Indiquez votre adresse ou votre quartier dans le formulaire.' },
  { q: 'Puis-je recevoir du lait ou des œufs chaque semaine ?', a: 'Oui : choisissez « Chaque semaine » ou « Chaque mois » dans le formulaire. Nous convenons ensemble du jour de livraison, puis nous vous livrons régulièrement.' },
  { q: 'Vendez-vous aux restaurants et aux boutiques ?', a: 'Oui. Nous proposons des livraisons régulières et des volumes adaptés aux restaurants, hôtels, traiteurs, boutiques et cantines.' },
  { q: 'Comment réserver des poulets pour un événement ?', a: 'Commandez le plus tôt possible (idéalement plusieurs semaines avant) en choisissant « Événement » : nous prévoyons la bande de poulets correspondant à votre date.' },
]

const emptyOrder = {
  product: 'lait' as LivestockProduct['id'],
  product_option: LIVESTOCK_PRODUCTS[0].options[0],
  quantity: '1',
  frequency: 'unique' as NewLivestockOrder['frequency'],
  customer_type: 'particulier',
  delivery: 'livraison' as NewLivestockOrder['delivery'],
  wanted_date: '',
  full_name: '',
  phone: '',
  address: '',
  message: '',
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
}

const ElevagePage = () => {
  const [order, setOrder] = useState(emptyOrder)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const product = LIVESTOCK_PRODUCTS.find((p) => p.id === order.product)!
  const qty = Math.max(0, Math.floor(Number(order.quantity) || 0))
  const frequencyLabel = FREQUENCIES.find((f) => f.id === order.frequency)!.label.toLowerCase()
  const customerLabel = CUSTOMER_TYPES.find((c) => c.id === order.customer_type)!.label
  const summary = `${qty} ${qty > 1 ? product.unitPlural : product.unit} – ${product.name} (${order.product_option}), ${frequencyLabel}, ${order.delivery === 'livraison' ? 'en livraison' : 'retrait à la ferme'}`

  const choose = (id: LivestockProduct['id']) => {
    const p = LIVESTOCK_PRODUCTS.find((x) => x.id === id)!
    setOrder({ ...order, product: id, product_option: p.options[0] })
    setStatus('idle')
    document.getElementById('commande')?.scrollIntoView({ behavior: 'smooth' })
  }

  const whatsappText =
    `Bonjour Africa Agro Sem, je souhaite commander : ${summary}.` +
    (order.full_name ? ` Nom : ${order.full_name}.` : '') +
    (order.address ? ` Adresse : ${order.address}.` : '')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (qty < 1) return
    setStatus('sending')
    const input: NewLivestockOrder = {
      product: order.product,
      product_option: order.product_option,
      quantity: qty,
      frequency: order.frequency,
      customer_type: order.customer_type,
      full_name: order.full_name.trim(),
      phone: order.phone.trim(),
      address: order.address.trim(),
      delivery: order.delivery,
      wanted_date: order.wanted_date || null,
      message: order.message.trim() || null,
    }
    const mail = [
      'Nouvelle commande élevage depuis le site :',
      `Commande : ${summary}`,
      `Client : ${input.full_name} (${customerLabel})`,
      `Téléphone : ${input.phone}`,
      `Adresse : ${input.address}`,
      input.wanted_date ? `Date souhaitée : ${input.wanted_date}` : '',
      input.message ? `Précisions : ${input.message}` : '',
    ].filter(Boolean).join('\n')
    try {
      await submitLivestockOrder(input, mail)
      setStatus('success')
      setOrder(emptyOrder)
    } catch {
      setStatus('error')
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <PublicLayout>
        {/* ---- Héros ---- */}
        <section className="pt-28 pb-16 bg-gradient-to-br from-amber-50 via-white to-green-50 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="uppercase tracking-[0.2em] text-sm text-agro-green font-semibold mb-4">
                Élevage
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5"
              >
                Lait frais, poulets et œufs de <span className="text-agro-green">nos fermes</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-lg text-gray-600 mb-8 max-w-xl">
                Vaches laitières, poulets de chair et poules pondeuses : nous produisons et vendons des produits frais, pour les familles
                comme pour les professionnels, avec livraison ou retrait à la ferme.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-3">
                <a href="#commande" className="btn-primary">Commander</a>
                <a href="#professionnels" className="py-3 px-6 rounded-lg font-semibold border-2 border-agro-green text-agro-green hover:bg-agro-green hover:text-white transition-colors">
                  Offre professionnels
                </a>
              </motion.div>
            </div>

            {/* Mosaïque animée */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: '/images/elevage/lait-bouteilles.jpg', alt: 'Bouteilles de lait frais', cls: 'row-span-2 h-full min-h-[320px]' },
                { src: '/images/elevage/pondeuses.jpg', alt: 'Poules pondeuses', cls: 'h-44 md:h-52' },
                { src: '/images/elevage/poulets-de-chair.jpg', alt: 'Poulets de chair en bâtiment', cls: 'h-44 md:h-52' },
              ].map((img, i) => (
                <motion.img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full object-cover rounded-2xl shadow-xl ${img.cls}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---- Bandeau de confiance ---- */}
        <section className="bg-agro-green text-white">
          <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-bottle-droplet', text: 'Lait frais au litre ou en gros' },
              { icon: 'fa-drumstick-bite', text: 'Poulets vivants ou prêts à cuire' },
              { icon: 'fa-egg', text: 'Œufs frais en plateaux de 30' },
              { icon: 'fa-rotate', text: 'Abonnement hebdomadaire ou mensuel' },
            ].map((b) => (
              <p key={b.text} className="flex items-center gap-3 text-sm md:text-base">
                <i className={`fa-solid ${b.icon} text-2xl text-green-200`} aria-hidden="true" />
                {b.text}
              </p>
            ))}
          </div>
        </section>

        {/* ---- Activités ---- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-3">Nos activités d’élevage</h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">Quatre activités complémentaires, suivies au quotidien par notre équipe.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {LIVESTOCK_ACTIVITIES.map((a, i) => (
                <motion.article key={a.id} id={a.id} {...fadeUp} transition={{ delay: (i % 2) * 0.12 }} className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm scroll-mt-24">
                  <div className="overflow-hidden">
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: a.position ?? '50% 50%' }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
                      <span className="grid w-10 h-10 place-items-center rounded-full bg-agro-green/10 text-agro-green text-lg">
                        <i className={`fa-solid ${a.icon}`} aria-hidden="true" />
                      </span>
                      {a.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{a.text}</p>
                    <ul className="space-y-1.5">
                      {a.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-gray-800 text-sm">
                          <i className="fa-solid fa-circle-check text-agro-green" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Produits ---- */}
        <section className="py-20 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-3">Nos produits</h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">Choisissez un produit : le formulaire de commande se remplit automatiquement.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {LIVESTOCK_PRODUCTS.map((p, i) => (
                <motion.div key={p.id} {...fadeUp} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="rounded-2xl overflow-hidden bg-white shadow-md flex flex-col">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{p.options.join(' · ')}</p>
                    <p className="text-lg font-semibold text-agro-green mb-4">
                      {p.price ? `${p.price.toLocaleString('fr-FR')} FCFA / ${p.unit}` : 'Prix sur demande'}
                    </p>
                    <button onClick={() => choose(p.id)} className="mt-auto btn-primary">Commander</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Engagements ---- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-12">Nos engagements qualité</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {commitments.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                  className="text-center rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <span className="inline-grid w-14 h-14 place-items-center rounded-full bg-agro-green text-white mb-4">
                    <i className={`fa-solid ${c.icon} text-xl`} aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Professionnels et événements ---- */}
        <section id="professionnels" className="py-20 bg-gray-900 text-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-8">
            <motion.div {...fadeUp} className="rounded-2xl bg-white/5 border border-white/10 p-8">
              <i className="fa-solid fa-store text-3xl text-green-300 mb-4" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Restaurants, hôtels, boutiques, cantines</h2>
              <p className="text-white/80 mb-5">Un fournisseur local fiable pour vos besoins en lait, poulets et œufs.</p>
              <ul className="space-y-2 text-white/90 mb-6">
                {['Livraisons régulières selon votre planning', 'Volumes adaptés à votre activité', 'Un interlocuteur dédié et une facture'].map((t) => (
                  <li key={t} className="flex gap-2"><i className="fa-solid fa-check text-green-300 mt-1" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <a href="#commande" onClick={() => setOrder({ ...order, customer_type: 'restaurant', frequency: 'hebdomadaire' })} className="inline-block px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-green-50">
                Demander une offre professionnelle
              </a>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="rounded-2xl bg-white/5 border border-white/10 p-8">
              <i className="fa-solid fa-champagne-glasses text-3xl text-amber-300 mb-4" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Mariages, baptêmes, fêtes</h2>
              <p className="text-white/80 mb-5">Réservez vos poulets à l’avance : nous prévoyons une bande pour votre date.</p>
              <ul className="space-y-2 text-white/90 mb-6">
                {['Réservation plusieurs semaines à l’avance', 'Poulets vivants ou prêts à cuire', 'Livraison le jour convenu'].map((t) => (
                  <li key={t} className="flex gap-2"><i className="fa-solid fa-check text-amber-300 mt-1" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <a href="#commande" onClick={() => setOrder({ ...order, product: 'poulet', product_option: 'Prêt à cuire', customer_type: 'evenement', frequency: 'unique' })} className="inline-block px-6 py-3 rounded-lg bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300">
                Réserver pour un événement
              </a>
            </motion.div>
          </div>
        </section>

        {/* ---- Commande ---- */}
        <section id="commande" className="py-20 bg-gradient-to-b from-green-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="section-title mb-3">Passer une commande</h2>
            <p className="text-center text-lg text-gray-600 mb-10">Nous vous rappelons pour confirmer le prix, la date et le paiement.</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 grid sm:grid-cols-2 gap-4">
              <fieldset className="sm:col-span-2">
                <legend className="form-label">Produit *</legend>
                <div className="grid grid-cols-3 gap-3">
                  {LIVESTOCK_PRODUCTS.map((p) => (
                    <label key={p.id} className={`cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-semibold transition-colors ${order.product === p.id ? 'border-agro-green bg-green-50 text-agro-green' : 'border-gray-200 text-gray-700 hover:border-green-300'}`}>
                      <input type="radio" name="product" value={p.id} checked={order.product === p.id} onChange={() => setOrder({ ...order, product: p.id, product_option: p.options[0] })} className="sr-only" />
                      <i className={`fa-solid ${p.id === 'lait' ? 'fa-bottle-droplet' : p.id === 'poulet' ? 'fa-drumstick-bite' : 'fa-egg'} block text-xl mb-1`} aria-hidden="true" />
                      {p.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="o-option" className="form-label">Format *</label>
                <select id="o-option" value={order.product_option} onChange={(e) => setOrder({ ...order, product_option: e.target.value })} className="form-input">
                  {product.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="o-qty" className="form-label">Quantité ({product.unitPlural}) *</label>
                <input id="o-qty" type="number" min={1} required value={order.quantity} onChange={(e) => setOrder({ ...order, quantity: e.target.value })} className="form-input" />
              </div>
              <div>
                <label htmlFor="o-freq" className="form-label">Fréquence *</label>
                <select id="o-freq" value={order.frequency} onChange={(e) => setOrder({ ...order, frequency: e.target.value as NewLivestockOrder['frequency'] })} className="form-input">
                  {FREQUENCIES.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="o-type" className="form-label">Vous êtes *</label>
                <select id="o-type" value={order.customer_type} onChange={(e) => setOrder({ ...order, customer_type: e.target.value })} className="form-input">
                  {CUSTOMER_TYPES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <fieldset>
                <legend className="form-label">Réception *</legend>
                <div className="flex gap-4 pt-2">
                  {[['livraison', 'Livraison'], ['retrait', 'Retrait à la ferme']].map(([v, l]) => (
                    <label key={v} className="flex items-center gap-2 text-gray-700">
                      <input type="radio" name="delivery" value={v} checked={order.delivery === v} onChange={() => setOrder({ ...order, delivery: v as NewLivestockOrder['delivery'] })} className="accent-agro-green" />
                      {l}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="o-date" className="form-label">Date souhaitée</label>
                <input id="o-date" type="date" value={order.wanted_date} onChange={(e) => setOrder({ ...order, wanted_date: e.target.value })} className="form-input" />
              </div>
              <div>
                <label htmlFor="o-name" className="form-label">Nom ou établissement *</label>
                <input id="o-name" required value={order.full_name} onChange={(e) => setOrder({ ...order, full_name: e.target.value })} className="form-input" />
              </div>
              <div>
                <label htmlFor="o-phone" className="form-label">Téléphone *</label>
                <input id="o-phone" type="tel" required placeholder="77 000 00 00" value={order.phone} onChange={(e) => setOrder({ ...order, phone: e.target.value })} className="form-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="o-address" className="form-label">{order.delivery === 'livraison' ? 'Adresse de livraison (quartier, ville) *' : 'Ville ou quartier *'}</label>
                <input id="o-address" required value={order.address} onChange={(e) => setOrder({ ...order, address: e.target.value })} className="form-input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="o-msg" className="form-label">Précisions</label>
                <textarea id="o-msg" rows={3} value={order.message} onChange={(e) => setOrder({ ...order, message: e.target.value })} className="form-input resize-none" />
              </div>

              <p className="sm:col-span-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-gray-700">
                <i className="fa-solid fa-basket-shopping text-agro-green mr-2" aria-hidden="true" />
                Votre commande : <strong>{summary}</strong>
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
              <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">
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

        {/* ---- Équipe ---- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
            <motion.img
              {...fadeUp}
              src="/images/WhatsApp Image 2025-09-01 à 14.45.31_68ee04e9.jpg"
              alt="L’équipe Africa Agro Sem auprès des vaches laitières"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl"
              style={{ objectPosition: '50% 35%' }}
            />
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Une équipe présente au quotidien</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nos équipes suivent chaque jour les animaux : alimentation, soins, propreté des bâtiments et qualité des produits.
                L’élevage complète nos activités agricoles et semencières, pour une agriculture plus complète et plus durable.
              </p>
              <a href="#commande" className="btn-primary inline-block">Commander nos produits</a>
            </motion.div>
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
      </PublicLayout>
    </MotionConfig>
  )
}

export default ElevagePage
