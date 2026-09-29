import { useRef, useState, type FormEvent } from 'react'
import { saveContactMessage } from '../lib/campaignStore'
import { sendFormEmail } from '../lib/email'
import { CONTACT, whatsappLink } from '../data/seeds'

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')

    // Le message est enregistré en base (si disponible) ET envoyé par e-mail :
    // il suffit qu'un des deux canaux fonctionne pour qu'il ne soit pas perdu.
    const saveToDb = saveContactMessage({ name: formData.nom, email: formData.email, message: formData.message })
      .then(() => true, () => false)
    const sendEmail = sendFormEmail(formRef.current).then(() => true, () => false)

    const [saved, sent] = await Promise.all([saveToDb, sendEmail])
    if (saved || sent) {
      setStatus('success')
      setFormData({ nom: '', email: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Contactez-nous</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Une question sur une variété, une commande groupée ou un partenariat ? Écrivez-nous.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-agro-green mb-6">Nos coordonnées</h3>
            <ul className="space-y-5 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="w-10 h-10 flex-shrink-0 bg-agro-green rounded-full grid place-items-center text-white"><i className="fa-solid fa-phone" aria-hidden="true" /></span>
                <div>
                  {CONTACT.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block font-semibold hover:text-agro-green">{p}</a>
                  ))}
                  <a href={`tel:${CONTACT.landline.replace(/\s/g, '')}`} className="block text-sm text-gray-600">Fixe : {CONTACT.landline}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-10 h-10 flex-shrink-0 bg-agro-green rounded-full grid place-items-center text-white"><i className="fa-solid fa-envelope" aria-hidden="true" /></span>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-agro-green break-all">{CONTACT.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-10 h-10 flex-shrink-0 bg-[#25D366] rounded-full grid place-items-center text-white"><i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" /></span>
                <a href={whatsappLink('Bonjour Africa Agro Sem, ')} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-agro-green">
                  Écrire sur WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-5">
            <div>
              <label htmlFor="from_name" className="form-label">Nom complet</label>
              <input type="text" id="from_name" name="from_name" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required disabled={status === 'sending'} className="form-input" placeholder="Votre nom complet" />
            </div>
            <div>
              <label htmlFor="from_email" className="form-label">Adresse e-mail</label>
              <input type="email" id="from_email" name="from_email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={status === 'sending'} className="form-input" placeholder="votre@email.com" />
            </div>
            <div>
              <label htmlFor="message" className="form-label">Votre message</label>
              <textarea id="message" name="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} disabled={status === 'sending'} className="form-input resize-none" placeholder="Votre message…" />
            </div>

            {status === 'success' && (
              <p className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm" role="status">
                Message envoyé. Nous vous répondrons rapidement.
              </p>
            )}
            {status === 'error' && (
              <p className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" role="alert">
                L’envoi a échoué. Réessayez ou contactez-nous par téléphone ou WhatsApp.
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
