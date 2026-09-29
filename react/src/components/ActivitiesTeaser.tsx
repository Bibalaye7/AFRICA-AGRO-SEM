import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ACTIVITIES } from '../data/activities'

// Aperçu des activités sur l'accueil ; chaque carte mène à son étape sur la page « Nos activités ».
const ActivitiesTeaser = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Nos activités, de la graine au champ</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Six métiers complémentaires pour que chaque producteur sème une semence de qualité.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {ACTIVITIES.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/nos-activites#${a.id}`}
              className="group h-full flex flex-col items-center text-center rounded-2xl border border-green-100 p-5 hover:bg-agro-green hover:text-white hover:-translate-y-1 transition-all"
            >
              <span className="grid w-14 h-14 place-items-center rounded-full bg-agro-green/10 text-agro-green group-hover:bg-white mb-3">
                <i className={`fa-solid ${a.icon} text-xl`} aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold text-agro-green group-hover:text-white/80">Étape {i + 1}</span>
              <span className="font-bold leading-snug">{a.title}</span>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/nos-activites" className="btn-primary inline-block">Découvrir nos activités en détail</Link>
      </div>
    </div>
  </section>
)

export default ActivitiesTeaser
