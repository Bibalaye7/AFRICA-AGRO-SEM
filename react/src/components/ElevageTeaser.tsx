import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LIVESTOCK_ACTIVITIES } from '../data/livestock'

// Aperçu de la partie élevage sur l'accueil.
const ElevageTeaser = () => (
  <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-green-50">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Élevage : lait frais, poulets et œufs</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Nos fermes produisent aussi du lait, des poulets de chair et des œufs, pour les familles et les professionnels.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {LIVESTOCK_ACTIVITIES.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={`/elevage#${a.id}`} className="group block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: a.position ?? '50% 50%' }}
                />
              </div>
              <p className="flex items-center gap-2 p-4 font-bold text-gray-900">
                <i className={`fa-solid ${a.icon} text-agro-green`} aria-hidden="true" />
                {a.title}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        <Link to="/elevage#commande" className="btn-primary">Commander du lait, des poulets ou des œufs</Link>
        <Link to="/elevage" className="py-3 px-6 rounded-lg font-semibold border-2 border-agro-green text-agro-green hover:bg-agro-green hover:text-white transition-colors">
          Découvrir l’élevage
        </Link>
      </div>
    </div>
  </section>
)

export default ElevageTeaser
