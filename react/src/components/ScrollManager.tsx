import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Remonte en haut à chaque changement de page et fait défiler vers l'ancre (#contact, #reservation…).
const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    // Laisse le temps à la page cible de s'afficher avant de chercher l'ancre.
    const timer = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}

export default ScrollManager
