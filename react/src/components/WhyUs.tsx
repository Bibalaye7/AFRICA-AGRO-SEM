const reasons = [
  {
    icon: 'fa-certificate',
    title: 'Semences certifiées et testées',
    text: 'Chaque lot est contrôlé (pureté, taux de germination) avant d’être mis à disposition des producteurs.',
  },
  {
    icon: 'fa-magnifying-glass',
    title: 'Traçabilité lot par lot',
    text: 'Saisissez le numéro inscrit sur votre sac pour vérifier la variété, la catégorie et la date de certification.',
  },
  {
    icon: 'fa-calendar-check',
    title: 'Réservation avant les pluies',
    text: 'Réservez en ligne ou par WhatsApp : nous planifions les quantités par région pour éviter les ruptures.',
  },
  {
    icon: 'fa-book-open',
    title: 'Fiches techniques claires',
    text: 'Cycle, zone recommandée, dose de semis et rendement pour choisir la bonne variété.',
  },
  {
    icon: 'fa-people-group',
    title: 'Au service des coopératives',
    text: 'Accompagnement des GIE et coopératives, du besoin en semences jusqu’au suivi de la distribution.',
  },
  {
    icon: 'fa-handshake',
    title: 'Partenaire fiable',
    text: 'Données de distribution suivies en temps réel et rapports partagés avec nos partenaires publics et privés.',
  },
]

const WhyUs = () => (
  <section className="py-20 bg-gradient-to-b from-green-50 to-white">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Pourquoi choisir Africa Agro Sem ?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Une bonne récolte commence par une bonne semence, disponible au bon moment.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.title} className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <span className="inline-grid place-items-center w-12 h-12 rounded-full bg-agro-green/10 text-agro-green mb-4">
              <i className={`fa-solid ${r.icon} text-xl`} aria-hidden="true" />
            </span>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{r.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyUs
