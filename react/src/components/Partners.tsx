import { Link } from 'react-router-dom'

const partners = [
  {
    image: '/images/Partenaire 1.jpg',
    title: 'Coopératives locales',
    description: 'Production de semences sous contrat et distribution au plus près des producteurs.',
  },
  {
    image: '/images/partenaire de recherche.jpg',
    title: 'Instituts de recherche',
    description: 'Accès aux semences de prébase et aux variétés améliorées adaptées au climat sahélien.',
  },
  {
    image: '/images/Partenaire 3.jpg',
    title: 'ONG et associations',
    description: 'Programmes d’appui aux petits producteurs et aux femmes rurales.',
  },
]

const gallery = [
  { src: "/images/Rencontre avec le Ministre de l'Agriculture.jpg", alt: 'Rencontre avec le ministre de l’Agriculture' },
  { src: '/images/Signature officielle de la convention.jpg', alt: 'Signature de la convention avec le PRODAC' },
  { src: '/images/Équipe Africa Agro Sem et PRODAC.jpg', alt: 'Équipes Africa Agro Sem et PRODAC' },
]

const Partners = () => (
  <section id="partenaires" className="py-20 bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="section-title mb-3">Nos partenariats</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Des collaborations solides pour une agriculture durable.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {partners.map((partner) => (
          <article key={partner.title} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src={partner.image} alt={partner.title} className="w-full h-52 object-cover" loading="lazy" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-agro-green mb-2">{partner.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/images/Signature officielle de la convention.jpg"
          alt="Signature de la convention de partenariat entre le PRODAC et Africa Agro Sem"
          className="rounded-xl shadow-xl w-full"
          loading="lazy"
        />
        <div className="space-y-4 text-gray-700">
          <p className="text-sm font-semibold uppercase tracking-wide text-agro-green">Convention PRODAC</p>
          <h3 className="text-2xl font-bold text-gray-900">100 hectares pour produire des semences au sein d’un domaine agricole communautaire</h3>
          <p>
            Le Programme des domaines agricoles communautaires (PRODAC), représenté par son coordonnateur national
            <strong> Dr Cheikh Ahmadou Bamba Ngom</strong>, et Africa Agro Sem ont signé une convention de partenariat
            pour renforcer la <strong>souveraineté alimentaire</strong> et la <strong>création durable d’emplois</strong>.
          </p>
          <p>
            Le PRODAC a octroyé <strong>100 hectares</strong> à Africa Agro Sem, qui s’engage en retour à soutenir les
            infrastructures sociales des communautés locales.
          </p>
          <p className="text-sm text-gray-500">
            Nos remerciements au ministre de l’Agriculture, de la Souveraineté alimentaire et de l’Élevage,
            M. Mabouba Diagne, et au coordonnateur national du PRODAC.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 max-w-6xl mx-auto mt-8">
        {gallery.map((img) => (
          <img key={img.src} src={img.src} alt={img.alt} className="rounded-xl shadow w-full h-56 object-cover" loading="lazy" />
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-agro-green text-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Devenez partenaire</h3>
          <p className="text-white/85">
            État, collectivités, bailleurs, ONG, distributeurs ou investisseurs : nous sommes ouverts aux partenariats
            nationaux et internationaux. <span lang="en">International partners welcome.</span>
          </p>
        </div>
        <Link to="/partenariats" className="flex-shrink-0 px-6 py-3 rounded-lg bg-white text-agro-green font-semibold hover:bg-green-50">
          Proposer un partenariat
        </Link>
      </div>
    </div>
  </section>
)

export default Partners
