import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const ref = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Configuration EmailJS
  // IMPORTANT: Vérifiez ces IDs dans votre dashboard EmailJS: https://dashboard.emailjs.com/admin
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_6c7w5uj'
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_28ecf18'
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ZuuXzMtP5NNOYwuMI'
  
  // Debug: Afficher les IDs utilisés (à retirer en production)
  useEffect(() => {
    console.log('EmailJS Config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? 'Configuré' : 'Manquant'
    })
  }, [])

  // Initialiser EmailJS au chargement
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Utiliser sendForm pour une meilleure compatibilité
      if (formRef.current) {
        const result = await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
          EMAILJS_PUBLIC_KEY
        )
        
        console.log('Email envoyé avec succès:', result)
        setSubmitStatus('success')
        setFormData({ nom: '', email: '', message: '' })
        
        // Réinitialiser le statut après 5 secondes
        setTimeout(() => {
          setSubmitStatus('idle')
        }, 5000)
      } else {
        throw new Error('Formulaire non trouvé')
      }
    } catch (error: any) {
      console.error('Erreur complète EmailJS:', error)
      console.error('Service ID:', EMAILJS_SERVICE_ID)
      console.error('Template ID:', EMAILJS_TEMPLATE_ID)
      
      // Afficher le message d'erreur détaillé
      let errorMsg = 'Erreur lors de l\'envoi. Veuillez réessayer.'
      
      if (error?.text) {
        errorMsg = error.text
      } else if (error?.message) {
        errorMsg = error.message
      } else if (error?.status) {
        errorMsg = `Erreur ${error.status}: ${error.text || 'Vérifiez votre configuration EmailJS'}`
      }
      
      // Message spécifique pour Template ID non trouvé
      if (errorMsg.includes('template') || errorMsg.includes('Template ID')) {
        errorMsg = 'Template ID introuvable. Vérifiez votre configuration dans le dashboard EmailJS: https://dashboard.emailjs.com/admin/templates'
      }
      
      setErrorMessage(errorMsg)
      setSubmitStatus('error')
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => {
        setSubmitStatus('idle')
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Contactez-nous</h2>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-agro-green mb-6">
              Envie de manger naturellement la nature ?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              NOUS CONTACTER<br />
              Contactez-nous pour réserver votre commande.<br />
              Appelez-nous ou commandez directement en ligne.<br />
              Nous avons hâte de vous accueillir !
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-agro-green rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">+221 785 14 10 57</p>
                  <p className="font-semibold text-gray-800">+221 773 396 178</p>
                  <p className="text-sm text-gray-600">Téléphone fixe: 338650405</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-agro-green rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-800">africaagrosem@gmail.com</p>
              </div>
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg space-y-6"
          >
            <div>
              <label htmlFor="from_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom Complet
              </label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Votre nom complet"
              />
            </div>
            <div>
              <label htmlFor="from_email" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                id="from_email"
                name="from_email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Votre Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Votre message..."
              />
            </div>

            {/* Messages de statut */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
              >
                ✓ Message envoyé avec succès ! Nous vous répondrons bientôt.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
              >
                ✗ {errorMessage || 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.'}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer Message'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact
