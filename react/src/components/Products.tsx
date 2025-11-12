import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Products = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const legumes = [
    {
      name: 'TOMATE',
      image: '/images/tomatoes-4434850_1280.jpg',
      description: 'La tomate, riche en lycopène, vitamines C et K, et antioxydants, renforce le système immunitaire, favorise la santé cardiaque, protège la peau et soutient une digestion saine grâce à ses fibres.',
    },
    {
      name: "L'OIGNON",
      image: '/images/onions-5187022_1280.jpg',
      description: "Riche en antioxydants et en vitamine C, renforce le système immunitaire, protège la santé cardiovasculaire et possède des propriétés anti-inflammatoires et antibactériennes naturelles.",
    },
    {
      name: 'POIVRON',
      image: '/images/bell-peppers-499068_1280.jpg',
      description: 'Gorgé de vitamines A et C, stimule l\'immunité, protège la vue grâce à ses antioxydants, et favorise une digestion saine grâce à ses fibres, tout en étant faible en calories.',
    },
    {
      name: 'POMME DE TERRE',
      image: '/images/PHOTO-2025-02-06-09-58-30 (7).jpg',
      description: 'La pomme de terre, source de glucides complexes, vitamines C, B6, potassium et fibres, fournit une énergie durable, soutient le système immunitaire, la fonction musculaire, la digestion et réduit le stress oxydatif grâce à ses antioxydants lorsqu\'elle est préparée sainement.',
    },
  ]

  const cereales = [
    {
      name: 'NIEBE',
      image: '/images/PHOTO-2025-01-22-21-46-46 (5).jpg',
      description: 'Le niébé, riche en protéines végétales, fibres, vitamines B, fer, magnésium et potassium, améliore la digestion, renforce l\'énergie, soutient la santé cardiovasculaire, prévient l\'anémie, réduit l\'inflammation et favorise la santé musculaire et nerveuse, tout en étant une option nutritive et rassasiante.',
    },
    {
      name: 'MIL',
      image: '/images/PHOTO-2025-01-22-21-46-46 (8).jpg',
      description: 'Le mil, riche en fibres, magnésium, phosphore, vitamines B et antioxydants, soutient la digestion, régule la glycémie, renforce la santé cardiaque, osseuse et musculaire, favorise un métabolisme énergétique optimal, réduit le stress oxydatif, et constitue une céréale sans gluten, nutritive et durable, adaptée aux régimes variés et respectueuse de l\'environnement.',
    },
    {
      name: 'ARACHIDE',
      image: '/images/peanut-1029804_1280.jpg',
      description: 'L\'arachide, riche en protéines végétales, acides gras monoinsaturés et polyinsaturés, fibres, vitamines E et B, magnésium et phosphore, soutient la santé cardiaque, renforce l\'énergie, favorise la digestion, protège la peau, améliore la fonction musculaire et nerveuse, et constitue une source rassasiante et durable, idéale en version grillée ou non salée pour une alimentation équilibrée.',
    },
    {
      name: 'MAÏS',
      image: '/images/corn-1726017_1280.jpg',
      description: 'Le maïs, riche en fibres, vitamines B, magnésium, phosphore et antioxydants comme la lutéine, favorise la digestion, soutient l\'énergie métabolique, renforce la santé oculaire et cardiovasculaire, protège contre le stress oxydatif, et constitue une source nutritive de glucides complexes pour une alimentation équilibrée.',
    },
  ]

  const ProductCard = ({ product, index }: { product: typeof legumes[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-product"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg">
          {product.name}
        </h3>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
          {product.description}
        </p>
      </div>
    </motion.div>
  )

  return (
    <section id="produits" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Nos Produits</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Visitez notre site dès aujourd'hui et laissez-vous séduire par la richesse de nos produits !
          </motion.p>
        </motion.div>

        {/* Légumes */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl font-bold text-agro-green mb-8 text-center"
          >
            Légumes
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legumes.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </div>

        {/* Céréales */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-2xl font-bold text-agro-green mb-8 text-center"
          >
            Céréales
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cereales.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index + 4} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products

