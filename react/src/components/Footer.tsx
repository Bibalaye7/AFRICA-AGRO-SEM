import { Link } from 'react-router-dom'
import { CONTACT, whatsappLink } from '../data/seeds'

const links = [
  { label: 'Accueil', to: '/' },
  { label: 'Nos activités', to: '/nos-activites' },
  { label: 'Élevage', to: '/elevage' },
  { label: 'Nos semences', to: '/semences' },
  { label: 'Réserver', to: '/#reservation' },
  { label: 'Vérifier un lot', to: '/verifier-lot' },
  { label: 'Partenariats', to: '/partenariats' },
  { label: 'À propos', to: '/a-propos' },
]

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-10 mb-8">
        <div className="text-center md:text-left">
          <img src="/les_logos/logo-blanc.jpg" alt="Africa Agro Sem" className="h-16 w-auto mb-4 mx-auto md:mx-0 rounded" />
          <p className="text-agro-light text-xl font-bold mb-2">AFRICA AGRO SEM</p>
          <p className="text-gray-400 text-sm">Semences certifiées pour l’agriculture sénégalaise et africaine.</p>
        </div>

        <nav className="text-center" aria-label="Liens du pied de page">
          <p className="text-agro-light text-lg font-bold mb-4">Navigation</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-gray-400 hover:text-agro-light transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-center md:text-right">
          <p className="text-agro-light text-lg font-bold mb-4">Contact</p>
          <div className="space-y-1 text-sm text-gray-400">
            {CONTACT.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block hover:text-white">{p}</a>
            ))}
            <p>Fixe : {CONTACT.landline}</p>
            <a href={`mailto:${CONTACT.email}`} className="block pt-2 hover:text-white">{CONTACT.email}</a>
          </div>
          <a
            href={whatsappLink('Bonjour Africa Agro Sem, ')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-semibold"
          >
            <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} AFRICA AGRO SEM – Tous droits réservés
      </div>
    </div>
  </footer>
)

export default Footer
