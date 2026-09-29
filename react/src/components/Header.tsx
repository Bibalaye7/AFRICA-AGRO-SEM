import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Nos activités', to: '/nos-activites' },
  { label: 'Élevage', to: '/elevage' },
  { label: 'Nos semences', to: '/semences' },
  { label: 'Traçabilité', to: '/verifier-lot' },
  { label: 'Partenariats', to: '/partenariats' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Contact', to: '/#contact' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isStaff, signOut } = useAuth()
  const canSeeDashboard = isStaff

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname, location.hash])

  // Un clic sur une ancre déjà active ne change pas l'URL : on force le défilement.
  const handleHashClick = (to: string) => {
    const [path, hash] = to.split('#')
    if (hash && location.pathname === (path || '/') && location.hash === `#${hash}`) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors hover:text-agro-green ${
      isActive ? 'text-agro-green' : 'text-gray-600'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8 py-3" aria-label="Navigation principale">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0" aria-label="Africa Agro Sem – accueil">
            <img src="/les_logos/logo-blanc.jpg" alt="Africa Agro Sem" className="h-12 md:h-14 w-auto" />
          </Link>

          <div className="hidden xl:flex items-center gap-7 flex-1 justify-center">
            {navItems.map((item) =>
              item.to.includes('#') ? (
                <Link key={item.label} to={item.to} onClick={() => handleHashClick(item.to)} className={linkClass({ isActive: false })}>
                  {item.label}
                </Link>
              ) : (
                <NavLink key={item.label} to={item.to} end className={linkClass}>
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            {canSeeDashboard && (
              <Link to="/tableau-de-bord" className="text-sm font-medium text-gray-600 hover:text-agro-green">
                <i className="fa-solid fa-chart-column mr-1.5" aria-hidden="true" />
                Tableau de bord
              </Link>
            )}
            {user ? (
              <button onClick={handleSignOut} className="text-sm font-medium text-gray-600 hover:text-agro-green">
                Déconnexion
              </button>
            ) : (
              (
                <Link to="/auth" className="text-sm font-medium text-gray-600 hover:text-agro-green">
                  Espace pro
                </Link>
              )
            )}
            <Link
              to="/#reservation"
              onClick={() => handleHashClick('/#reservation')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-agro-green rounded-lg hover:bg-agro-light transition-colors"
            >
              Réserver mes semences
            </Link>
          </div>

          <button
            className="xl:hidden p-2 text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`} aria-hidden="true" />
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end
                    onClick={() => handleHashClick(item.to)}
                    className={({ isActive }) =>
                      `py-3 border-b border-gray-100 text-base font-medium ${isActive && !item.to.includes('#') ? 'text-agro-green' : 'text-gray-700'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                {canSeeDashboard && (
                  <Link to="/tableau-de-bord" className="py-3 border-b border-gray-100 text-base font-medium text-gray-700">
                    Tableau de bord
                  </Link>
                )}
                {user ? (
                  <button onClick={handleSignOut} className="py-3 text-left text-base font-medium text-gray-700">
                    Déconnexion
                  </button>
                ) : (
                  (
                    <Link to="/auth" className="py-3 text-base font-medium text-gray-700">
                      Espace pro
                    </Link>
                  )
                )}
                <Link
                  to="/#reservation"
                  onClick={() => handleHashClick('/#reservation')}
                  className="mt-3 text-center px-5 py-3 font-semibold text-white bg-agro-green rounded-lg"
                >
                  Réserver mes semences
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header
