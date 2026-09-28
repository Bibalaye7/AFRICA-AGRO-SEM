import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    image: '/images/PHOTO-2025-02-06-09-46-34.jpg',
    title: 'Des semences certifiées pour chaque campagne',
    subtitle: 'Arachide, maïs, niébé, mil et sorgho : des variétés adaptées à chaque zone du Sénégal.',
  },
  {
    image: '/images/PHOTO-2025-01-17-20-24-03 (3).jpg',
    title: 'Produites sur nos terres, contrôlées lot par lot',
    subtitle: 'Chaque lot porte un numéro que vous pouvez vérifier en ligne avant de semer.',
  },
  {
    image: '/images/PHOTO-2025-01-17-20-26-28 (3).jpg',
    title: 'Disponibles à temps, près de chez vous',
    subtitle: 'Réservez avant les premières pluies et récupérez vos semences dans nos points de distribution.',
  },
  {
    image: '/images/PHOTO-2025-01-17-20-26-28.jpg',
    title: 'Ouverts aux partenariats',
    subtitle: 'État, coopératives, ONG, bailleurs et investisseurs, au Sénégal comme à l’international.',
  },
]

const highlights = [
  { icon: 'fa-seedling', value: '5', label: 'espèces de semences certifiées' },
  { icon: 'fa-map-location-dot', value: '100 ha', label: 'octroyés par le PRODAC' },
  { icon: 'fa-qrcode', value: 'Lot par lot', label: 'traçabilité vérifiable en ligne' },
  { icon: 'fa-brands fa-whatsapp', value: 'En ligne', label: 'réservation par formulaire ou WhatsApp' },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [currentSlide])

  const goTo = (index: number) => setCurrentSlide((index + slides.length) % slides.length)
  const slide = slides[currentSlide]

  return (
    <section id="home" className="relative pt-[72px] md:pt-20">
      <div className="relative h-[78vh] min-h-[520px] overflow-hidden bg-gray-900">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.image}
            src={slide.image}
            alt=""
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
                className="max-w-2xl text-white"
              >
                <p className="uppercase tracking-[0.18em] text-xs md:text-sm text-green-200 font-semibold mb-4">
                  Campagne agricole 2026-2027
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8">{slide.subtitle}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-wrap gap-3">
              <Link to="/#reservation" className="btn-primary">
                Réserver mes semences
              </Link>
              <Link
                to="/verifier-lot"
                className="py-3 px-6 rounded-lg font-semibold text-white border-2 border-white/80 hover:bg-white hover:text-agro-green transition-colors"
              >
                Vérifier un lot
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={() => goTo(currentSlide - 1)}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm"
          aria-label="Diapositive précédente"
        >
          <i className="fa-solid fa-chevron-left w-6" aria-hidden="true" />
        </button>
        <button
          onClick={() => goTo(currentSlide + 1)}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm"
          aria-label="Diapositive suivante"
        >
          <i className="fa-solid fa-chevron-right w-6" aria-hidden="true" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75 w-3'}`}
              aria-label={`Aller à la diapositive ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      </div>

      <div className="bg-agro-green text-white">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 py-6">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-3">
              <i className={`${h.icon.startsWith('fa-brands') ? h.icon : `fa-solid ${h.icon}`} text-2xl text-green-200`} aria-hidden="true" />
              <div>
                <p className="text-lg md:text-xl font-bold leading-tight">{h.value}</p>
                <p className="text-xs md:text-sm text-white/80">{h.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
