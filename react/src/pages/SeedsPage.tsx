import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { SPECIES } from '../data/seeds'

const SeedsPage = () => (
  <PublicLayout>
    <section className="pt-32 pb-12 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-agro-green mb-4">Fiches techniques des semences</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Choisissez la variété adaptée à votre zone et à la durée de votre hivernage. Les valeurs sont indicatives :
          nos techniciens vous conseillent selon votre sol et votre pluviométrie.
        </p>
        <nav className="flex flex-wrap justify-center gap-2 mt-8" aria-label="Espèces">
          {SPECIES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="px-4 py-2 rounded-full bg-white border border-green-200 text-sm font-medium text-agro-green hover:bg-agro-green hover:text-white">
              {s.name}
            </a>
          ))}
        </nav>
      </div>
    </section>

    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-12">
      {SPECIES.map((s) => (
        <article key={s.id} id={s.id} className="scroll-mt-24 bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-3">
          <img src={s.image} alt={s.name} className="w-full h-56 lg:h-full object-cover" loading="lazy" />
          <div className="lg:col-span-2 p-6 md:p-8">
            <h2 className="text-3xl font-bold text-agro-green mb-2">{s.name}</h2>
            <p className="text-gray-600 mb-6">{s.description}</p>
            <dl className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg bg-green-50 p-4">
                <dt className="text-xs uppercase tracking-wide text-gray-500">Dose de semis</dt>
                <dd className="font-bold text-gray-900">{s.seedRate} kg/ha</dd>
                <dd className="text-xs text-gray-500">{s.seedRateNote}</dd>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <dt className="text-xs uppercase tracking-wide text-gray-500">Période de semis</dt>
                <dd className="font-bold text-gray-900">{s.sowing}</dd>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <dt className="text-xs uppercase tracking-wide text-gray-500">Rendement potentiel</dt>
                <dd className="font-bold text-gray-900">{s.yieldPotential}</dd>
              </div>
            </dl>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Variétés de {s.name}</caption>
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4 font-medium">Variété</th>
                    <th className="py-2 pr-4 font-medium">Cycle</th>
                    <th className="py-2 pr-4 font-medium">Zone recommandée</th>
                    <th className="py-2 font-medium">Atout</th>
                  </tr>
                </thead>
                <tbody>
                  {s.varieties.map((v) => (
                    <tr key={v.name} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-semibold text-gray-900 whitespace-nowrap">{v.name}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{v.cycle}</td>
                      <td className="py-3 pr-4">{v.zone}</td>
                      <td className="py-3">{v.atout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/#reservation" className="btn-primary inline-block mt-6">Réserver des semences de {s.name.toLowerCase()}</Link>
          </div>
        </article>
      ))}
    </div>
  </PublicLayout>
)

export default SeedsPage
