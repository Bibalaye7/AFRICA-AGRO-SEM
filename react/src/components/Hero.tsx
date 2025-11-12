import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    image: '/images/PHOTO-2025-02-06-09-46-34.jpg',
    title: 'Notre engagement qualité',
    subtitle: 'Des pratiques agricoles responsables et durables',
  },
  {
    image: '/images/randy-fath-5aJVJvJ9rG8-unsplash.jpg',
    title: 'Récoltes abondantes',
    subtitle: 'Une production locale et saisonnière',
  },
  {
    image: '/images/PHOTO-2025-02-06-09-48-16.jpg',
    title: 'Transformation locale',
    subtitle: 'Valorisation des produits sur place',
  },
  {
    image: '/images/PHOTO-2025-01-17-20-24-03 (3).jpg',
    title: 'Une équipe passionnée',
    subtitle: 'Professionnels de l\'agroalimentaire',
  },
  {
    image: '/images/sharon-pittaway-KUZnfk-2DSQ-unsplash.jpg',
    title: 'Livraison garantie',
    subtitle: 'Circuit court et fraîcheur préservée',
  },
  {
    image: '/images/PHOTO-2025-01-17-20-26-28 (3).jpg',
    title: 'Innovation technologique',
    subtitle: 'Agriculture de précision et monitoring',
  },
  {
    image: '/images/PHOTO-2025-01-17-20-26-28.jpg',
    title: 'Partenariats durables',
    subtitle: 'Collaboration avec les producteurs locaux',
  },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section id="home" className="relative h-screen mt-16 overflow-hidden">
      <AnimatePresence mode="wait" custom={currentSlide}>
        <motion.div
          key={currentSlide}
          custom={currentSlide}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          {/* Overlay sombre pour assombrir l'image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12 xl:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-white ml-4 md:ml-8 lg:ml-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
                {slides[currentSlide].subtitle}
              </p>
              <motion.a
                href="#produits"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#produits')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-primary inline-block mt-6 mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Découvrir nos produits
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero

