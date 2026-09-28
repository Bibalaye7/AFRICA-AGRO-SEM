// Catalogue des semences certifiées. Les valeurs techniques (cycle, dose, rendement)
// sont indicatives : elles varient selon la zone, la pluviométrie et l'itinéraire technique.

export type SpeciesId = 'arachide' | 'mais' | 'niebe' | 'mil' | 'sorgho'

export type Variety = {
  name: string
  cycle: string
  zone: string
  atout: string
}

export type Species = {
  id: SpeciesId
  name: string
  image: string
  /** Dose de semis indicative en kg/ha, utilisée par le calculateur */
  seedRate: number
  seedRateNote: string
  sowing: string
  yieldPotential: string
  description: string
  varieties: Variety[]
}

export const SPECIES: Species[] = [
  {
    id: 'arachide',
    name: 'Arachide',
    image: '/images/peanut-1029804_1280.jpg',
    seedRate: 120,
    seedRateNote: 'graines décortiquées',
    sowing: 'Dès les premières pluies utiles (juin – juillet)',
    yieldPotential: '1,5 à 3 t/ha',
    description: "Culture phare du bassin arachidier. Nos semences sont triées, traitées et testées en germination avant chaque campagne.",
    varieties: [
      { name: '55-437', cycle: '90 jours', zone: 'Nord et centre-nord (Louga, Diourbel)', atout: 'Précoce, tolère les fins de saison sèches' },
      { name: '73-33', cycle: '110 jours', zone: 'Sud du bassin (Kaolack, Kaffrine)', atout: 'Bon rendement en gousses' },
      { name: 'Fleur 11', cycle: '90 jours', zone: 'Centre (Thiès, Fatick)', atout: 'Graines homogènes, bonne teneur en huile' },
    ],
  },
  {
    id: 'mais',
    name: 'Maïs',
    image: '/images/corn-1726017_1280.jpg',
    seedRate: 25,
    seedRateNote: 'semis en poquets',
    sowing: 'Juin – juillet, sols riches ou irrigués',
    yieldPotential: '3 à 6 t/ha',
    description: 'Variétés adaptées au sud et à l’est du pays, pour la consommation et l’alimentation animale.',
    varieties: [
      { name: 'Early Thai', cycle: '80 – 85 jours', zone: 'Centre et sud', atout: 'Très précoce, sécurise la récolte' },
      { name: 'Obatanpa', cycle: '105 jours', zone: 'Sud (Kolda, Sédhiou, Tambacounda)', atout: 'Riche en protéines' },
    ],
  },
  {
    id: 'niebe',
    name: 'Niébé',
    image: '/images/PHOTO-2025-01-22-21-46-46 (5).jpg',
    seedRate: 25,
    seedRateNote: 'culture pure',
    sowing: 'Juillet – août',
    yieldPotential: '1 à 2 t/ha',
    description: 'Légumineuse clé de la sécurité alimentaire, qui enrichit le sol en azote pour la culture suivante.',
    varieties: [
      { name: 'Mélakh', cycle: '60 jours', zone: 'Nord et centre', atout: 'Très précoce, tolère la sécheresse' },
      { name: 'Yacine', cycle: '70 jours', zone: 'Centre et centre-sud', atout: 'Grosses graines, bonne valeur marchande' },
    ],
  },
  {
    id: 'mil',
    name: 'Mil',
    image: '/images/PHOTO-2025-01-22-21-46-46 (8).jpg',
    seedRate: 5,
    seedRateNote: 'semis en poquets',
    sowing: 'Premières pluies (juin – juillet)',
    yieldPotential: '1 à 2,5 t/ha',
    description: 'Céréale de base résistante à la sécheresse, adaptée aux sols sableux.',
    varieties: [
      { name: 'Souna 3', cycle: '85 – 90 jours', zone: 'Tout le bassin arachidier', atout: 'Rustique et productive' },
      { name: 'Thialack 2', cycle: '95 jours', zone: 'Centre et sud', atout: 'Épis longs, bon grain' },
    ],
  },
  {
    id: 'sorgho',
    name: 'Sorgho',
    image: '/images/sorghum-275257_1280.jpg',
    seedRate: 10,
    seedRateNote: 'semis en lignes',
    sowing: 'Juin – juillet',
    yieldPotential: '1,5 à 3 t/ha',
    description: 'Céréale robuste pour les zones à pluviométrie irrégulière et les sols lourds.',
    varieties: [
      { name: 'CE 145-66', cycle: '100 jours', zone: 'Centre et sud', atout: 'Grain blanc apprécié en cuisine' },
      { name: 'CE 180-33', cycle: '90 jours', zone: 'Centre-nord', atout: 'Précoce, bonne tenue à la verse' },
    ],
  },
]

export const speciesName = (id: string) => SPECIES.find((s) => s.id === id)?.name ?? id

export const REGIONS = [
  'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda',
  'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor',
]

export const SEED_CATEGORIES = ['Prébase', 'Base', 'R1', 'R2'] as const

export const CONTACT = {
  phones: ['+221 78 514 10 57', '+221 77 339 61 78'],
  landline: '+221 33 865 04 05',
  email: 'africaagrosem@gmail.com',
  whatsapp: '221785141057',
}

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
