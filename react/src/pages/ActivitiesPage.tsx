import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, animate, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'
import { ACTIVITIES, type Activity } from '../data/activities'

const crops = ['Arachide', 'Maïs', 'Niébé', 'Mil', 'Sorgho', 'Oignon', 'Pomme de terre', 'Poivron', 'Tomate']

const audiences = [
  { icon: 'fa-person-digging', title: 'Agriculteurs', text: 'Des semences certifiées, disponibles à temps et près de chez vous.' },
  { icon: 'fa-people-roof', title: 'Coopératives et GIE', text: 'Commandes groupées, accompagnement technique et suivi des distributions.' },
  { icon: 'fa-landmark', title: 'État et programmes', text: 'Mise en place et distribution de semences avec un suivi par bénéficiaire.' },
  { icon: 'fa-earth-africa', title: 'Partenaires internationaux', text: 'Bailleurs, ONG et investisseurs : des projets concrets et mesurables.' },
]

// ---------- Compteur animé ----------

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref} className="tabular-nums">{value}{suffix}</span>
}

// ---------- Titre qui apparaît mot par mot ----------

function WordReveal({ text, className }: { text: string; className?: string }) {
  return (
    <h1 className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

// ---------- Une étape de la chaîne ----------

function Step({ activity, index }: { activity: Activity; index: number }) {
  const reversed = index % 2 === 1
  return (
    <motion.article
      id={activity.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="relative grid md:grid-cols-2 gap-8 md:gap-14 items-center scroll-mt-28"
    >
      {/* Pastille numérotée sur la ligne de progression */}
      <motion.span
        variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="hidden md:grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 place-items-center rounded-full bg-agro-green text-white text-lg font-bold ring-8 ring-white shadow-lg"
      >
        {index + 1}
      </motion.span>

      <motion.div
        variants={{ hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 1rem)' }, visible: { opacity: 1, clipPath: 'inset(0 0 0% 0 round 1rem)' } }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${reversed ? 'md:order-2 md:pl-10' : 'md:pr-10'}`}
      >
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl"
          style={{ objectPosition: activity.position ?? '50% 50%' }}
        />
      </motion.div>
      <span className="md:hidden absolute -top-4 -left-1 z-10 grid w-11 h-11 place-items-center rounded-full bg-agro-green text-white font-bold ring-4 ring-white">
        {index + 1}
      </span>

      <motion.div
        variants={{ hidden: { opacity: 0, x: reversed ? -40 : 40 }, visible: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className={reversed ? 'md:order-1 md:pr-10 md:text-right' : 'md:pl-10'}
      >
        <span className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-agro-green mb-2 ${reversed ? 'md:flex-row-reverse' : ''}`}>
          <i className={`fa-solid ${activity.icon}`} aria-hidden="true" />
          Étape {index + 1}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{activity.title}</h3>
        <p className="text-gray-600 leading-relaxed mb-4">{activity.text}</p>
        <ul className={`space-y-2 ${reversed ? 'md:ml-auto' : ''}`}>
          {activity.points.map((p, i) => (
            <motion.li
              key={p}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className={`flex items-center gap-2 text-gray-800 ${reversed ? 'md:flex-row-reverse' : ''}`}
            >
              <i className="fa-solid fa-circle-check text-agro-green" aria-hidden="true" />
              {p}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.article>
  )
}

// ---------- Page ----------

const ActivitiesPage = () => {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImageY = useTransform(heroProgress, [0, 1], ['0%', '25%'])
  const heroTextOpacity = useTransform(heroProgress, [0, 0.7], [1, 0])

  const chainRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: chainProgress } = useScroll({ target: chainRef, offset: ['start 60%', 'end 60%'] })
  const lineScale = useSpring(chainProgress, { stiffness: 120, damping: 30 })

  return (
    // Respecte le réglage « réduire les animations » du téléphone ou de l'ordinateur
    <MotionConfig reducedMotion="user">
      <PublicLayout>
        {/* ---- Héros ---- */}
        <section ref={heroRef} className="relative h-[92vh] min-h-[560px] overflow-hidden bg-green-950 text-white">
          <motion.img
            src="/images/PHOTO-2025-02-06-09-46-33.jpg"
            alt=""
            style={{ y: heroImageY }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 via-green-950/55 to-green-950/90" />

          <motion.div style={{ opacity: heroTextOpacity }} className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex flex-col justify-center pt-20">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-[0.2em] text-sm text-green-200 font-semibold mb-5"
            >
              Nos activités
            </motion.p>
            <WordReveal text="De la graine au champ, nous semons l’avenir de l’agriculture sénégalaise" className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] max-w-5xl mb-6" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-lg md:text-xl text-white/85 max-w-2xl mb-10"
            >
              Africa Agro Sem produit, certifie, stocke et distribue des semences de qualité aux agriculteurs du Sénégal
              pendant la campagne agricole, et les accompagne jusqu’à la récolte.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="flex flex-wrap gap-3">
              <a href="#chaine" className="btn-primary">Découvrir nos 6 activités</a>
              <Link to="/#reservation" className="py-3 px-6 rounded-lg font-semibold border-2 border-white/80 hover:bg-white hover:text-agro-green transition-colors">
                Réserver des semences
              </Link>
            </motion.div>
          </motion.div>

          <motion.a
            href="#chiffres"
            aria-label="Faire défiler vers la suite"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80"
          >
            <i className="fa-solid fa-chevron-down text-2xl" aria-hidden="true" />
          </motion.a>
        </section>

        {/* ---- Chiffres ---- */}
        <section id="chiffres" className="bg-agro-green text-white">
          <div className="container mx-auto px-4 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 6, suffix: '', label: 'activités, de la graine au champ' },
              { value: 5, suffix: '', label: 'espèces de semences certifiées' },
              { value: 100, suffix: ' ha', label: 'de production au sein du PRODAC' },
              { value: 14, suffix: '', label: 'régions du Sénégal couvertes par la réservation en ligne' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-bold"><Counter to={s.value} suffix={s.suffix} /></p>
                <p className="text-sm md:text-base text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Aperçu des activités ---- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title mb-3">
              Ce que nous faisons
            </motion.h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Une chaîne complète, maîtrisée de bout en bout, pour que chaque producteur sème une semence de qualité.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ACTIVITIES.map((a, i) => (
                <motion.a
                  key={a.id}
                  href={`#${a.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group block rounded-2xl border border-green-100 bg-green-50/50 p-6 hover:bg-agro-green hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-between mb-4">
                    <span className="grid w-12 h-12 place-items-center rounded-xl bg-white text-agro-green shadow-sm">
                      <i className={`fa-solid ${a.icon} text-xl`} aria-hidden="true" />
                    </span>
                    <span className="text-3xl font-bold text-green-200 group-hover:text-white/40">0{i + 1}</span>
                  </span>
                  <h3 className="font-bold text-lg mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/85">{a.short}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ---- La chaîne, étape par étape ---- */}
        <section id="chaine" className="py-20 bg-gradient-to-b from-green-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-3">De la graine au champ</h2>
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-16">Faites défiler pour suivre le parcours d’une semence Africa Agro Sem.</p>

            <div ref={chainRef} className="relative space-y-20 md:space-y-28">
              {/* Ligne qui se remplit au fil du défilement */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-green-100" aria-hidden="true">
                <motion.div style={{ scaleY: lineScale }} className="origin-top h-full w-full rounded-full bg-agro-green" />
              </div>
              {ACTIVITIES.map((a, i) => <Step key={a.id} activity={a} index={i} />)}
            </div>
          </div>
        </section>

        {/* ---- Nos cultures (bandeau défilant) ---- */}
        <section className="py-10 bg-agro-green text-white overflow-hidden" aria-label="Nos cultures">
          <div className="marquee flex w-max gap-10 text-2xl md:text-3xl font-bold whitespace-nowrap">
            {[...crops, ...crops].map((c, i) => (
              <span key={i} className="flex items-center gap-10" aria-hidden={i >= crops.length}>
                {c}
                <i className="fa-solid fa-seedling text-green-300 text-xl" aria-hidden="true" />
              </span>
            ))}
          </div>
        </section>

        {/* ---- Pour qui ---- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-12">Pour qui travaillons-nous ?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {audiences.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                  className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm text-center"
                >
                  <span className="inline-grid w-16 h-16 place-items-center rounded-full bg-agro-green/10 text-agro-green mb-4">
                    <i className={`fa-solid ${a.icon} text-2xl`} aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Appel à l'action ---- */}
        <section className="relative py-20 overflow-hidden text-white">
          <div className="absolute inset-0 cta-gradient" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative container mx-auto px-4 text-center max-w-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Préparons ensemble la prochaine campagne</h2>
            <p className="text-lg text-white/85 mb-8">Producteur, coopérative, institution ou partenaire international : parlons de vos besoins en semences.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/#reservation" className="px-6 py-3 rounded-lg bg-white text-agro-green font-semibold hover:bg-green-50">Réserver des semences</Link>
              <Link to="/partenariats" className="px-6 py-3 rounded-lg border-2 border-white font-semibold hover:bg-white/10">Devenir partenaire</Link>
            </div>
          </motion.div>
        </section>
      </PublicLayout>
    </MotionConfig>
  )
}

export default ActivitiesPage
