const steps = [
  { period: 'Mars – mai', title: 'Réservations', text: 'Recensement des besoins des producteurs et coopératives.' },
  { period: 'Mai – juin', title: 'Mise en place', text: 'Acheminement des lots certifiés vers les magasins régionaux.' },
  { period: 'Juin – juillet', title: 'Distribution et semis', text: 'Retrait des semences et semis dès les premières pluies utiles.' },
  { period: 'Juillet – septembre', title: 'Suivi des cultures', text: 'Conseils techniques et visites de parcelles.' },
  { period: 'Octobre – décembre', title: 'Récolte et collecte', text: 'Collecte des semences pour la campagne suivante.' },
]

const CampaignCalendar = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Le calendrier de la campagne</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Les grandes étapes de l’hivernage, de la réservation à la récolte.</p>
      </div>
      <ol className="grid gap-4 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.title} className="relative bg-green-50 rounded-xl p-5">
            <span className="absolute -top-3 left-5 grid place-items-center w-7 h-7 rounded-full bg-agro-green text-white text-sm font-bold">
              {i + 1}
            </span>
            <p className="text-xs uppercase tracking-wide text-agro-green font-semibold mt-2">{s.period}</p>
            <h3 className="font-bold text-gray-900 mt-1 mb-2">{s.title}</h3>
            <p className="text-sm text-gray-600">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

export default CampaignCalendar
