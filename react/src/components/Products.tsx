import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SPECIES } from '../data/seeds'

const maraichage = [
  { name: 'Oignon', image: '/images/onions-5187022_1280.jpg' },
  { name: 'Pomme de terre', image: '/images/PHOTO-2025-02-06-09-58-30 (7).jpg' },
  { name: 'Tomate', image: '/images/tomatoes-4434850_1280.jpg' },
  { name: 'Poivron', image: '/images/bell-peppers-499068_1280.jpg' },
]

const Products = () => (
  <section id="produits" className="py-20 bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Nos semences certifiées</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Des variétés sélectionnées pour chaque zone agroécologique, avec cycle, dose de semis et rendement indiqués.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {SPECIES.map((s, index) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="card-product flex flex-col"
          >
            <div className="relative h-40 overflow-hidden">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <h3 className="absolute bottom-3 left-4 text-white font-bold text-xl">{s.name}</h3>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-3">
                Variétés : <span className="font-semibold text-gray-800">{s.varieties.map((v) => v.name).join(', ')}</span>
              </p>
              <dl className="text-sm space-y-1 mb-4">
                <div className="flex justify-between gap-2"><dt className="text-gray-500">Dose</dt><dd className="font-medium">{s.seedRate} kg/ha</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-gray-500">Rendement</dt><dd className="font-medium">{s.yieldPotential}</dd></div>
              </dl>
              <Link to={`/semences#${s.id}`} className="mt-auto text-sm font-semibold text-agro-green hover:underline">
                Fiche technique →
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-agro-green mb-2 text-center">Production maraîchère</h3>
        <p className="text-center text-gray-600 mb-8">Nous produisons aussi des légumes pour les marchés locaux et l’export.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {maraichage.map((p) => (
            <div key={p.name} className="relative h-36 rounded-xl overflow-hidden shadow">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-3 text-white font-semibold">{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default Products
