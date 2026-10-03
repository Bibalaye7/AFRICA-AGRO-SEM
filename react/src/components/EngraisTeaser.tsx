import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const highlights = ['NPK 6-20-10', 'NPK 15-15-15', 'Urée 46 %', 'DAP 18-46-0', 'NPK 10-10-20', 'Compost']

// Aperçu de la vente d'engrais sur l'accueil.
const EngraisTeaser = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-lime-50 to-amber-50"
      >
        <div className="relative min-h-[260px]">
          <img src="/images/engrais/main-granules.jpg" alt="Engrais en granulés dans la main" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="p-8 md:p-12">
          <p className="uppercase tracking-[0.2em] text-xs text-agro-green font-semibold mb-3">Nouveau</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Des engrais pour chaque culture</h2>
          <p className="text-gray-600 mb-6">
            Engrais de fond, urée, potasse, engrais de maraîchage et organiques, avec un calculateur de dose et la livraison dans les régions.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {highlights.map((h) => <span key={h} className="rounded-full bg-white border border-green-200 px-3 py-1 text-sm font-medium text-agro-green">{h}</span>)}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/engrais#calculateur" className="btn-primary">Calculer mes besoins</Link>
            <Link to="/engrais" className="py-3 px-6 rounded-lg font-semibold border-2 border-agro-green text-agro-green hover:bg-agro-green hover:text-white transition-colors">
              Voir les engrais
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

export default EngraisTeaser
