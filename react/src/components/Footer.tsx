import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const location = useLocation()
  
  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/${href}`
      return
    }
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Colonne 1 - Informations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <img
              src="/les_logos/logo-blanc.jpg"
              alt="Logo"
              className="h-16 w-auto mb-4 mx-auto md:mx-0"
            />
            <h5 className="text-agro-light text-xl font-bold mb-3">AFRICA AGRO SEM</h5>
            <p className="text-gray-400 text-sm">L'excellence agricole africaine</p>
          </motion.div>

          {/* Colonne 2 - Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h5 className="text-agro-light text-lg font-bold mb-4">Navigation</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-agro-light transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <a
                  href="#produits"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#produits')
                  }}
                  className="text-gray-400 hover:text-agro-light transition-colors"
                >
                  Produits
                </a>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-400 hover:text-agro-light transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#contact')
                  }}
                  className="text-gray-400 hover:text-agro-light transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Colonne 3 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center md:text-right"
          >
            <h5 className="text-agro-light text-lg font-bold mb-4">Contact</h5>
            <div className="space-y-2 text-sm text-gray-400">
              <p>+221 785 14 10 57</p>
              <p>+221 773 396 178</p>
              <p>Téléphone fixe: 338650405</p>
              <p className="mt-4">africaagrosem@gmail.com</p>
            </div>
            <div className="flex justify-center md:justify-end space-x-4 mt-6">
              {['facebook', 'instagram', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-agro-green transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={`fab fa-${social} text-white`} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            &copy; 2025 AFRICA AGRO SEM - Tous droits réservés
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
