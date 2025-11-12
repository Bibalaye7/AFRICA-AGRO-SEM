import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="apropos" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Bienvenue chez AFRICA AGRO SEM</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-agro-green mb-3">Présentation</h3>
            <p className="text-gray-700 leading-relaxed">
              Votre partenaire de confiance pour des produits agricoles, naturels et de haute qualité ! 
              Spécialisée dans la production des semences certifiés (Arachides, Maîs, nièbés(haricots), 
              mils, Sorghos,) et la production de Pomme de terre, de l'oignon et d'autres produits 
              agricoles issus des terres fertiles du sénégal, notre entreprise s'engage à vous offrir 
              le meilleur de l'agriculture africaine et dans le monde.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-agro-green mb-3">Gamme</h3>
            <p className="text-gray-700 leading-relaxed">
              Nous proposons une gamme variée de produits, allant des céréales et légumineuses. 
              Chaque récolte est soigneusement sélectionnée pour garantir fraîcheur, saveur et respect 
              de l'environnement.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-agro-green mb-3">Cible</h3>
            <p className="text-gray-700 leading-relaxed">
              Que vous soyez un particulier, un partenaire ou un revendeur, AFRICA AGRO SEM est votre 
              source fiable pour des produits sains et durables. Découvrez notre catalogue en ligne, 
              passez vos commandes facilement et laissez-nous vous livrer l'excellence de la terre 
              directement chez vous.
            </p>
          </motion.div>
        </motion.div>

        {/* Histoire Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-agro-green mb-4">Notre Histoire</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>AFRICA AGRO SEM</strong> est née de la volonté de transformer le potentiel 
                agricole africain en opportunités économiques durables. Fondée au sénégal, l'entreprise 
                a débuté avec des activités agricoles locales, alliant tradition et modernités.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Au fil des années, elle s'est diversifée pour englober l'agrobusiness, la logistique, 
                l'immobilier et le e-commerce, devenant un acteur incontournable dans le développement 
                socio-économique du continent.
              </p>
            </div>
            <motion.img
              src="/images/PHOTO-2025-02-06-09-46-33.jpg"
              alt="Champs agricoles au Sénégal"
              className="rounded-xl shadow-xl w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Valeurs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-agro-green mb-6 text-center">Nos Valeurs Fondamentales</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Durabilité', desc: 'Préservation des écosystèmes' },
              { title: 'Innovation', desc: 'Technologies agricoles et digitales' },
              { title: 'Transparence', desc: 'Traçabilité des produits' },
              { title: 'Engagement', desc: 'Création d\'emplois locaux' },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow"
              >
                <h4 className="font-bold text-agro-green mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About

