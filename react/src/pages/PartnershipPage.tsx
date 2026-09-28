import { useState, type FormEvent } from 'react'
import PublicLayout from '../components/PublicLayout'
import { submitPartnership } from '../lib/campaignStore'
import { CONTACT } from '../data/seeds'

type Lang = 'fr' | 'en'

const content = {
  fr: {
    eyebrow: 'Partenariats nationaux et internationaux',
    title: 'Construisons ensemble la souveraineté semencière',
    intro: 'Africa Agro Sem s’associe aux institutions publiques, bailleurs, ONG, coopératives, distributeurs et investisseurs pour rendre des semences certifiées accessibles à chaque producteur.',
    offersTitle: 'Ce que nous proposons',
    offers: [
      { icon: 'fa-tractor', title: 'Production sous contrat', text: 'Multiplication de semences certifiées sur nos parcelles et avec des coopératives encadrées.' },
      { icon: 'fa-truck', title: 'Distribution de programmes', text: 'Mise en place et distribution de semences pour les programmes publics, subventionnés ou humanitaires, avec suivi par bénéficiaire.' },
      { icon: 'fa-chart-line', title: 'Rapports et traçabilité', text: 'Tableau de bord des quantités distribuées par région, espèce et bénéficiaire, partagé avec nos partenaires.' },
      { icon: 'fa-globe', title: 'Export et sous-région', text: 'Approvisionnement de partenaires en Afrique de l’Ouest et commercialisation de produits agricoles.' },
      { icon: 'fa-flask', title: 'Recherche et innovation', text: 'Tests variétaux, parcelles de démonstration et diffusion de variétés améliorées.' },
      { icon: 'fa-sack-dollar', title: 'Investissement', text: 'Extension des surfaces, stockage, chambres froides et unités de conditionnement.' },
    ],
    formTitle: 'Proposer un partenariat',
    fields: { organization: 'Organisation', contact: 'Nom du contact', email: 'E-mail', phone: 'Téléphone', country: 'Pays', type: 'Type de partenaire', message: 'Votre projet de partenariat' },
    choose: 'Choisir…',
    types: ['Institution publique', 'Collectivité territoriale', 'Bailleur / coopération internationale', 'ONG / association', 'Coopérative / organisation paysanne', 'Distributeur / revendeur', 'Investisseur', 'Institut de recherche', 'Autre'],
    submit: 'Envoyer la proposition',
    sending: 'Envoi…',
    success: 'Merci ! Votre proposition a bien été reçue. Notre équipe vous répond sous peu.',
    error: 'Envoi impossible. Écrivez-nous directement à',
  },
  en: {
    eyebrow: 'National and international partnerships',
    title: 'Let’s build seed sovereignty together',
    intro: 'Africa Agro Sem partners with public institutions, donors, NGOs, cooperatives, distributors and investors to make certified seed available to every farmer in Senegal and West Africa.',
    offersTitle: 'What we offer',
    offers: [
      { icon: 'fa-tractor', title: 'Contract seed production', text: 'Multiplication of certified seed on our land and with supervised cooperatives.' },
      { icon: 'fa-truck', title: 'Programme distribution', text: 'Delivery of seed for public, subsidised or humanitarian programmes, tracked per beneficiary.' },
      { icon: 'fa-chart-line', title: 'Reporting and traceability', text: 'A shared dashboard of quantities distributed by region, crop and beneficiary.' },
      { icon: 'fa-globe', title: 'Export and sub-region', text: 'Supply to partners across West Africa and trade in agricultural produce.' },
      { icon: 'fa-flask', title: 'Research and innovation', text: 'Variety trials, demonstration plots and dissemination of improved varieties.' },
      { icon: 'fa-sack-dollar', title: 'Investment', text: 'Expanding acreage, storage, cold rooms and seed-processing units.' },
    ],
    formTitle: 'Propose a partnership',
    fields: { organization: 'Organisation', contact: 'Contact name', email: 'Email', phone: 'Phone', country: 'Country', type: 'Partner type', message: 'Your partnership proposal' },
    choose: 'Select…',
    types: ['Public institution', 'Local authority', 'Donor / international cooperation', 'NGO / association', 'Cooperative / farmer organisation', 'Distributor / reseller', 'Investor', 'Research institute', 'Other'],
    submit: 'Send proposal',
    sending: 'Sending…',
    success: 'Thank you! We have received your proposal and will get back to you shortly.',
    error: 'Sending failed. Please email us at',
  },
}

const emptyForm = { organization: '', contact_name: '', email: '', phone: '', country: 'Sénégal', partner_type: '', message: '' }

const PartnershipPage = () => {
  const [lang, setLang] = useState<Lang>('fr')
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const t = content[lang]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitPartnership({ ...form, phone: form.phone || null })
      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  const field = (key: keyof typeof emptyForm, label: string, props: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={`p-${key}`} className="form-label">{label}</label>
      <input id={`p-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="form-input" {...props} />
    </div>
  )

  return (
    <PublicLayout>
      <div lang={lang}>
        <section className="relative pt-32 pb-16 text-white overflow-hidden">
          <img src="/images/partenaire-serré-la-main.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 to-green-900/60" />
          <div className="relative container mx-auto px-4 lg:px-8">
            <div className="flex justify-end mb-6">
              <div className="inline-flex rounded-full bg-white/15 p-1" role="group" aria-label="Langue / Language">
                {(['fr', 'en'] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-4 py-1 rounded-full text-sm font-semibold ${lang === l ? 'bg-white text-agro-green' : 'text-white'}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <p className="uppercase tracking-[0.18em] text-sm text-green-200 font-semibold mb-3">{t.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold max-w-3xl mb-4">{t.title}</h1>
            <p className="text-lg text-white/90 max-w-2xl">{t.intro}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title">{t.offersTitle}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.offers.map((o) => (
                <div key={o.title} className="rounded-xl border border-green-100 p-6 bg-green-50/40">
                  <i className={`fa-solid ${o.icon} text-2xl text-agro-green mb-3`} aria-hidden="true" />
                  <h3 className="font-bold text-lg mb-2">{o.title}</h3>
                  <p className="text-sm text-gray-600">{o.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="section-title">{t.formTitle}</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 grid sm:grid-cols-2 gap-4">
              {field('organization', `${t.fields.organization} *`, { required: true })}
              {field('contact_name', `${t.fields.contact} *`, { required: true })}
              {field('email', `${t.fields.email} *`, { required: true, type: 'email' })}
              {field('phone', t.fields.phone, { type: 'tel' })}
              {field('country', `${t.fields.country} *`, { required: true })}
              <div>
                <label htmlFor="p-type" className="form-label">{t.fields.type} *</label>
                <select id="p-type" required value={form.partner_type} onChange={(e) => setForm({ ...form, partner_type: e.target.value })} className="form-input">
                  <option value="">{t.choose}</option>
                  {t.types.map((ty) => <option key={ty}>{ty}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="p-message" className="form-label">{t.fields.message} *</label>
                <textarea id="p-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="form-input resize-none" />
              </div>
              {status === 'success' && <p className="sm:col-span-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm" role="status">{t.success}</p>}
              {status === 'error' && (
                <p className="sm:col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
                  {t.error} <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </p>
              )}
              <button type="submit" disabled={status === 'sending'} className="btn-primary sm:col-span-2 disabled:opacity-50">
                {status === 'sending' ? t.sending : t.submit}
              </button>
            </form>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

export default PartnershipPage
