import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'ACCUEIL', href: '/', isRoute: true },
    { label: 'PRODUITS', href: '#produits', isRoute: false },
    { label: 'À PROPOS', href: '/a-propos', isRoute: true },
    { label: 'PARTENAIRES', href: '#partenaires', isRoute: false },
  ]

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/${href}`
      return
    }
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
      }
    }, 100)
  }

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    if (item.isRoute) {
      if (item.href === '/' && location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      scrollToSection(item.href)
    }
  }

  const handleContactClick = () => {
    if (location.pathname !== '/') {
      window.location.href = '/#contact'
      return
    }
    scrollToSection('#contact')
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-6 lg:px-12 xl:px-16 py-4">
        <div className="flex items-center justify-between">
          {/* Logo à gauche */}
          <Link to="/" className="flex-shrink-0 ml-2 lg:ml-4">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/les_logos/logo-blanc.jpg"
                alt="Logo Africa Agro SEM"
                className="h-12 md:h-14 w-auto"
              />
            </motion.div>
          </Link>

          {/* Navigation au centre */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item, index) =>
              item.isRoute ? (
                <Link key={item.label} to={item.href}>
                  <motion.div
                    className="text-sm font-medium text-gray-600 hover:text-agro-green transition-colors relative group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-agro-green group-hover:w-full transition-all duration-300" />
                  </motion.div>
                </Link>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="text-sm font-medium text-gray-600 hover:text-agro-green transition-colors relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-agro-green group-hover:w-full transition-all duration-300" />
                </motion.a>
              )
            )}
          </div>

          {/* Bouton "Nous contacter" à droite */}
          <div className="hidden lg:flex items-center flex-shrink-0 mr-2 lg:mr-4">
            <motion.button
              onClick={handleContactClick}
              className="px-6 py-2.5 text-sm font-medium text-agro-green border-2 border-agro-green rounded-lg hover:bg-agro-green hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nous contacter
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5 transition-all" />
            <div className="w-6 h-0.5 bg-gray-800 transition-all" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 space-y-3"
          >
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-600 hover:text-agro-green py-2"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="block text-sm font-medium text-gray-600 hover:text-agro-green py-2"
                >
                  {item.label}
                </a>
              )
            )}
            <motion.button
              onClick={handleContactClick}
              className="w-full mt-4 px-6 py-2.5 text-sm font-medium text-agro-green border-2 border-agro-green rounded-lg hover:bg-agro-green hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Nous contacter
            </motion.button>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}

export default Header
