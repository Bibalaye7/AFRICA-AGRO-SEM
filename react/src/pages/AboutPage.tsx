import { motion } from 'framer-motion'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const AboutPage = () => {

  const [campagneData, setCampagneData] = useState([
    { etape: 'Préparation', semis: 0, recolte: 0 },
    { etape: 'Semis', semis: 0, recolte: 0 },
    { etape: 'Irrigation', semis: 0, recolte: 0 },
    { etape: 'Fertilisation', semis: 0, recolte: 0 },
    { etape: 'Récolte', semis: 0, recolte: 0 },
  ])

  const [formData, setFormData] = useState({
    etape: '',
    tonnesSemis: '',
    tonnesRecolte: '',
  })

  const [showAdminForm, setShowAdminForm] = useState(false)

  const handleCampagneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const index = campagneData.findIndex((c) => c.etape === formData.etape)
    if (index !== -1) {
      const newData = [...campagneData]
      newData[index] = {
        ...newData[index],
        semis: parseFloat(formData.tonnesSemis) || 0,
        recolte: parseFloat(formData.tonnesRecolte) || 0,
      }
      setCampagneData(newData)
      setFormData({ etape: '', tonnesSemis: '', tonnesRecolte: '' })
    }
  }

  const sections = [
    {
      title: 'Notre Histoire',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>AFRICA AGRO SEM</strong> est née de la volonté de transformer le potentiel agricole 
            africain en opportunités économiques durables. Fondée au sénégal, l'entreprise a débuté avec 
            des activités agricoles locales, alliant tradition et modernités. Au fil des années, elle 
            s'est diversifée pour englober l'agrobusiness, la logistique, l'immobilier et le e-commerce, 
            devenant un acteur incontournable dans le développement socio-économique du continent.
          </p>
          <motion.img
            src="/images/PHOTO-2025-02-06-09-46-33.jpg"
            alt="Champs agricoles au Sénégal"
            className="w-full rounded-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </>
      ),
    },
    {
      title: 'Nos Valeurs Fondamentales',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            Nous croyons en une croissance responsable et inclusive. <strong>Durabilité</strong> (préservation 
            des écosystèmes), <strong>innovation</strong> (intégration de technologies agricoles et digitales), 
            <strong>transparence</strong> (traçabilité des produits) et <strong>engagement communautaire</strong> 
            (création d'emplois locaux) guident chacune de nos actions. Chaque décision est prise avec le souci 
            de respecter la terre, les hommes et les générations futures.
          </p>
          <motion.img
            src="/images/PHOTO-2025-01-22-21-46-46 (3).jpg"
            alt="Équipe agricole en action"
            className="w-full rounded-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </>
      ),
    },
    {
      title: 'Nos Engagements Clés',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            <em>AFRICA AGRO SEM</em> s'engage à :<br />
            <strong>Protéger l'environnement</strong> via des pratiques agricoles écoresponsables et une 
            logistique optimisée.<br />
            <strong>Soutenir l'économie locale</strong> en valorisant les produits sénégalais à l'international 
            et en collaborant avec les petits producteurs.<br />
            <strong>Promouvoir la qualité</strong> à travers des normes sanitaires strictes et des services 
            fiables (transport, stockage, transformation).
          </p>
          <motion.img
            src="/images/PHOTO-2025-01-17-20-24-03.jpg"
            alt="Pratiques agricoles durables"
            className="w-full rounded-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </>
      ),
    },
    {
      title: 'Notre Vision Stratégique',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            Notre ambition est de devenir un <strong>leader panafricain de l'agro-industrie</strong>, en 
            connectant les marchés locaux aux dynamiques globales. Nous aspirons à une agriculture africaine 
            résiliente, créatrice d'emplois durables et garante de la souveraineté alimentaire, tout en 
            développant des synergies avec des secteurs complémentaires (immobilier, service, e-commerce).
          </p>
          <motion.img
            src="/les_logos/logo-blanc.jpg"
            alt="Carte de l'Afrique avec des icônes agricoles"
            className="w-full max-w-md mx-auto rounded-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </>
      ),
    },
    {
      title: 'Domaines d\'Expertise Phares',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-6">
            De la <strong>production agricole</strong> (céréales, élevage, aviculture) à la 
            <strong>commercialisation internationale</strong>, en passant par la <strong>logistique</strong> 
            (transport multimodal) et l'<strong>innovation digitale</strong> (plateformes e-commerce), 
            AFRICA AGRO SEM maîtrise toute la chaîne de valeur. Nous intervenons également dans 
            <strong>l'installation des chambres froides</strong> et les <strong>services aux entreprises</strong>, 
            offrant des solutions intégrées.
          </p>
          <motion.img
            src="/images/camion-produits-agricoles.webp"
            alt="Chaîne logistique agricole"
            className="w-full rounded-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </>
      ),
    },
    {
      title: 'Message à Nos Clients et Partenaires',
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-6 text-lg italic">
            "Chez AFRICA AGRO SEM, nous cultivons bien plus que des produits : nous cultivons la confiance. 
            Que vous soyez un client, un fournisseur ou un investisseur, rejoignez-nous pour bâtir un avenir 
            où prospérité rime avec responsabilité. Ensemble, récoltons le potentiel de l'Afrique."
          </p>
          <motion.img
            src="/images/partenaire-serré-la-main.webp"
            alt="Poignée de main partenariale"
            className="w-full rounded-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-green-50 to-white py-20"
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-agro-green mb-4">
              À Propos de Nous
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre histoire, nos valeurs et notre engagement pour une agriculture durable
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-20"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-agro-green mb-6 text-center">
                  {section.title}
                </h2>
                <div className="max-w-4xl mx-auto">{section.content}</div>
              </div>
            </motion.section>
          ))}

          {/* Section Nouveaux Partenaires */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mb-20 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-agro-green mb-8 text-center">
              Nos Nouveaux Partenaires
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <motion.img
                src="/images/Signature officielle de la convention.jpg"
                alt="Signature partenariat PRODAC et Africa Agro Sem"
                className="rounded-xl shadow-xl w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <div className="space-y-4 text-gray-700">
                <p>
                  Considérant la volonté des nouvelles autorités de promouvoir l'esprit d'ouverture et de 
                  favoriser l'intégration effective du secteur privé au sein des domaines agricoles 
                  communautaires (DAC), en vue de contribuer significativement à la réalisation des objectifs 
                  stratégiques du PRODAC, notamment la <strong>création durable d'emplois</strong> et le 
                  <strong>renforcement de la souveraineté alimentaire</strong>, le PRODAC, représenté par son 
                  Coordonnateur National <strong>Dr Cheikh Ahmadou Bamba Ngom</strong> d'une part, et 
                  <strong>Africa Agro Sem</strong>, représenté par son Directeur Général d'autre part, ont 
                  signé une convention de partenariat.
                </p>
                <p>
                  Avec la volonté commune de collaborer pour soutenir les communautés locales, le PRODAC a 
                  octroyé <strong>100 Hectares à Africa Agro Sem</strong>. Cette dernière mettra à contribution 
                  sa politique de responsabilité sociale pour appuyer activement les initiatives communautaires 
                  visant à <strong>améliorer les infrastructures sociales</strong>.
                </p>
                <p className="font-bold text-agro-green text-lg">
                  Nos sincères remerciements au Ministre de l'Agriculture, de la Souveraineté Alimentaire et 
                  de l'Élevage, <strong>Mabouba Diagne</strong>, au Coordonnateur National du PRODAC 
                  <strong>Dr Cheikh A. Bamba Ngom</strong>, ainsi qu'à la délégation de Africa Agro Sem.
                  <br />🤝🙏🤝❤ #SONKOmoyDIOMAYE
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
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                />
              ))}
            </div>
          </motion.section>

          {/* Section Gestion de la Campagne Agricole */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mb-20 bg-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-agro-green">
                Gestion de la Campagne Agricole
              </h2>
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="btn-primary text-sm"
              >
                {showAdminForm ? 'Masquer' : 'Administration'}
              </button>
            </div>

            {showAdminForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-green-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-agro-green mb-4">
                  Ajouter / Mettre à jour les tonnes de semis et récoltes
                </h3>
                <form onSubmit={handleCampagneSubmit} className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Étape</label>
                    <select
                      value={formData.etape}
                      onChange={(e) => setFormData({ ...formData, etape: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green"
                    >
                      <option value="">Sélectionner l'étape</option>
                      <option value="Préparation">Préparation des sols</option>
                      <option value="Semis">Semis</option>
                      <option value="Irrigation">Irrigation</option>
                      <option value="Fertilisation">Fertilisation</option>
                      <option value="Récolte">Récolte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tonnes de semis
                    </label>
                    <input
                      type="number"
                      value={formData.tonnesSemis}
                      onChange={(e) =>
                        setFormData({ ...formData, tonnesSemis: e.target.value })
                      }
                      placeholder="Tonnes allouées par l'État"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tonnes récoltées
                    </label>
                    <input
                      type="number"
                      value={formData.tonnesRecolte}
                      onChange={(e) =>
                        setFormData({ ...formData, tonnesRecolte: e.target.value })
                      }
                      placeholder="Tonnes obtenues après campagne"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green"
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="btn-primary w-full">
                      Enregistrer
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Tableau récapitulatif */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-agro-green text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Étape</th>
                    <th className="px-6 py-4 text-center font-semibold">Tonnes de semis</th>
                    <th className="px-6 py-4 text-center font-semibold">Tonnes récoltées</th>
                  </tr>
                </thead>
                <tbody>
                  {campagneData.map((item, index) => (
                    <tr
                      key={item.etape}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{item.etape}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{item.semis}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{item.recolte}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage

