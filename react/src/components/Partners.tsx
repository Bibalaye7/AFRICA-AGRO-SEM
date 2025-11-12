import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Partners = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const partners = [
    {
      image: '/images/Partenaire 1.jpg',
      title: 'Coopératives Locales',
      description: 'Collaboration directe avec les producteurs locaux pour valoriser les filières agricoles sénégalaises.',
    },
    {
      image: '/images/partenaire de recherche.jpg',
      title: 'Instituts de Recherche',
      description: 'Partenariat avec des centres scientifiques pour innover dans la semence et l\'agriculture de précision.',
    },
    {
      image: '/images/Partenaire 3.jpg',
      title: 'ONG & Associations',
      description: 'Engagement auprès des ONG et associations pour promouvoir une agriculture durable et responsable.',
    },
  ]

  return (
    <section id="partenaires" className="py-20 bg-gradient-to-b from-green-50 to-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Nos Partenariats</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des collaborations solides pour une agriculture durable
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="relative h-auto overflow-hidden">
                <motion.img
                  src={partner.image}
                  alt={partner.title}
                  className="w-full h-auto object-contain"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-agro-green mb-3">{partner.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Nouveaux Partenaires */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-agro-green mb-8 text-center">
            Nos Nouveaux Partenaires
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <motion.img
              src="/images/Signature officielle de la convention.jpg"
              alt="Signature partenariat PRODAC et Africa Agro Sem"
              className="rounded-xl shadow-xl w-full h-auto object-contain"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <div className="space-y-4 text-gray-700">
              <p>
                Considérant la volonté des nouvelles autorités de promouvoir l'esprit d'ouverture et 
                de favoriser l'intégration effective du secteur privé au sein des domaines agricoles 
                communautaires (DAC), en vue de contribuer significativement à la réalisation des 
                objectifs stratégiques du PRODAC, notamment la <strong>création durable d'emplois</strong> et 
                le <strong>renforcement de la souveraineté alimentaire</strong>, le PRODAC, représenté par 
                son Coordonnateur National <strong>Dr Cheikh Ahmadou Bamba Ngom</strong> d'une part, et 
                <strong>Africa Agro Sem</strong>, représenté par son Directeur Général d'autre part, ont 
                signé une convention de partenariat.
              </p>
              <p>
                Avec la volonté commune de collaborer pour soutenir les communautés locales, le PRODAC 
                a octroyé <strong>100 Hectares à Africa Agro Sem</strong>. Cette dernière mettra à 
                contribution sa politique de responsabilité sociale pour appuyer activement les initiatives 
                communautaires visant à <strong>améliorer les infrastructures sociales</strong>.
              </p>
              <p className="font-bold text-agro-green">
                Nos sincères remerciements au Ministre de l'Agriculture, de la Souveraineté Alimentaire 
                et de l'Élevage, <strong>Mabouba Diagne</strong>, au Coordonnateur National du PRODAC 
                <strong>Dr Cheikh A. Bamba Ngom</strong>, ainsi qu'à la délégation de Africa Agro Sem.
              </p>
            </div>
          </div>

          {/* Galerie */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              '/images/Rencontre avec le Ministre de l\'Agriculture.jpg',
              '/images/Signature officielle de la convention.jpg',
              '/images/Équipe Africa Agro Sem et PRODAC.jpg',
            ].map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`Partenaire ${index + 1}`}
                className="rounded-xl shadow-lg w-full h-auto object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Partners

