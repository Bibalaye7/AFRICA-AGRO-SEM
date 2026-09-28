import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'

const sections = [
  {
    title: 'Notre histoire',
    image: '/images/PHOTO-2025-02-06-09-46-33.jpg',
    alt: 'Champs agricoles au Sénégal',
    body: (
      <p>
        <strong>AFRICA AGRO SEM</strong> est née de la volonté de transformer le potentiel agricole africain en
        opportunités économiques durables. Fondée au Sénégal, l’entreprise a débuté par des activités agricoles
        locales, alliant tradition et modernité. Elle s’est spécialisée dans la production et la distribution de
        semences certifiées d’arachide, de maïs, de niébé, de mil et de sorgho, ainsi que dans la production de pomme
        de terre, d’oignon et d’autres cultures maraîchères.
      </p>
    ),
  },
  {
    title: 'Nos valeurs fondamentales',
    image: '/images/PHOTO-2025-01-22-21-46-46 (3).jpg',
    alt: 'Équipe agricole en action',
    body: (
      <ul className="space-y-2">
        <li><strong>Durabilité</strong> : préserver les sols et les écosystèmes.</li>
        <li><strong>Innovation</strong> : intégrer les technologies agricoles et numériques.</li>
        <li><strong>Transparence</strong> : assurer la traçabilité de chaque lot de semences.</li>
        <li><strong>Engagement communautaire</strong> : créer des emplois locaux et soutenir les producteurs.</li>
      </ul>
    ),
  },
  {
    title: 'Nos engagements clés',
    image: '/images/PHOTO-2025-01-17-20-24-03.jpg',
    alt: 'Pratiques agricoles durables',
    body: (
      <ul className="space-y-2">
        <li><strong>Protéger l’environnement</strong> par des pratiques agricoles écoresponsables et une logistique optimisée.</li>
        <li><strong>Soutenir l’économie locale</strong> en travaillant avec les petits producteurs et en valorisant les produits sénégalais à l’international.</li>
        <li><strong>Garantir la qualité</strong> grâce à des contrôles stricts et des services fiables de transport, stockage et conditionnement.</li>
      </ul>
    ),
  },
  {
    title: 'Notre vision stratégique',
    image: '/images/PHOTO-2025-01-17-20-26-28 (2).jpg',
    alt: 'Parcelle de production de semences',
    body: (
      <p>
        Devenir un <strong>acteur de référence de la semence certifiée en Afrique de l’Ouest</strong>, en connectant
        les producteurs locaux aux marchés régionaux et internationaux, pour une agriculture résiliente, créatrice
        d’emplois et garante de la souveraineté alimentaire.
      </p>
    ),
  },
  {
    title: 'Nos domaines d’expertise',
    image: '/images/camion-produits-agricoles.webp',
    alt: 'Chaîne logistique agricole',
    body: (
      <p>
        De la <strong>production de semences</strong> et de cultures vivrières à la <strong>commercialisation</strong>,
        en passant par la <strong>logistique</strong>, le <strong>stockage</strong> (chambres froides) et
        l’<strong>innovation numérique</strong>, AFRICA AGRO SEM maîtrise toute la chaîne de valeur.
      </p>
    ),
  },
]

const AboutPage = () => (
  <PublicLayout>
    <section className="pt-32 pb-16 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-agro-green mb-4">À propos de nous</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Notre histoire, nos valeurs et notre engagement pour une agriculture durable.
        </p>
      </div>
    </section>

    <div className="container mx-auto px-4 lg:px-8 py-16 space-y-16">
      {sections.map((section, index) => (
        <motion.section
          key={section.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 ? 'md:[&>img]:order-last' : ''}`}
        >
          <img src={section.image} alt={section.alt} className="w-full h-72 object-cover rounded-2xl shadow-xl" loading="lazy" />
          <div className="text-gray-700 leading-relaxed">
            <h2 className="text-3xl font-bold text-agro-green mb-4">{section.title}</h2>
            {section.body}
          </div>
        </motion.section>
      ))}

      <section className="rounded-2xl bg-agro-green text-white p-8 md:p-12 text-center">
        <p className="text-lg md:text-xl italic max-w-3xl mx-auto mb-6">
          « Chez AFRICA AGRO SEM, nous cultivons bien plus que des produits : nous cultivons la confiance. Que vous
          soyez producteur, fournisseur ou investisseur, rejoignez-nous pour bâtir un avenir où prospérité rime avec
          responsabilité. Ensemble, récoltons le potentiel de l’Afrique. »
        </p>
        <Link to="/partenariats" className="inline-block px-6 py-3 rounded-lg bg-white text-agro-green font-semibold hover:bg-green-50">
          Devenir partenaire
        </Link>
      </section>
    </div>
  </PublicLayout>
)

export default AboutPage
