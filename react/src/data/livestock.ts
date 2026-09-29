// Partie « Élevage » : activités et produits proposés à la commande.
// Prix : laissez `price` à null pour afficher « Prix sur demande », ou indiquez un montant en FCFA.

export type LivestockActivity = {
  id: string
  icon: string
  title: string
  text: string
  points: string[]
  image: string
  position?: string
}

export const LIVESTOCK_ACTIVITIES: LivestockActivity[] = [
  {
    id: 'vaches-laitieres',
    icon: 'fa-cow',
    title: 'Vaches laitières',
    text: 'Un troupeau de vaches laitières suivi au quotidien : alimentation, abreuvement, soins et suivi vétérinaire pour un lait de qualité toute l’année.',
    points: ['Races laitières sélectionnées', 'Suivi vétérinaire et vaccinations', 'Alimentation équilibrée'],
    image: '/images/WhatsApp Image 2025-09-01 à 14.45.31_5be7e275.jpg',
    position: '50% 35%',
  },
  {
    id: 'lait',
    icon: 'fa-bottle-droplet',
    title: 'Production et vente de lait',
    text: 'Traite, refroidissement et conditionnement du lait frais, vendu aux particuliers comme aux boutiques, restaurants et hôtels.',
    points: ['Traite dans le respect de l’hygiène', 'Lait refroidi et conservé au frais', 'Vente au détail et en gros'],
    image: '/images/elevage/lait-bouteilles.jpg',
  },
  {
    id: 'poulets-de-chair',
    icon: 'fa-drumstick-bite',
    title: 'Poulets de chair',
    text: 'Des poulets élevés en bâtiment, de l’arrivée des poussins jusqu’à la vente, disponibles vivants ou prêts à cuire.',
    points: ['Bandes suivies du premier jour à la vente', 'Poulets vivants ou prêts à cuire', 'Commandes pour vos événements'],
    image: '/images/elevage/poussins.jpg',
  },
  {
    id: 'pondeuses',
    icon: 'fa-egg',
    title: 'Poules pondeuses',
    text: 'Un élevage de poules pondeuses pour des œufs frais, ramassés chaque jour et vendus en plateaux de 30.',
    points: ['Œufs ramassés chaque jour', 'Plateaux de 30 œufs', 'Livraison régulière possible'],
    image: '/images/elevage/pondeuses.jpg',
  },
]

export type LivestockProduct = {
  id: 'lait' | 'poulet' | 'oeufs'
  name: string
  unit: string
  unitPlural: string
  options: string[]
  image: string
  price: number | null
}

export const LIVESTOCK_PRODUCTS: LivestockProduct[] = [
  { id: 'lait', name: 'Lait frais de vache', unit: 'litre', unitPlural: 'litres', options: ['Au litre', 'Bidon de 5 litres', 'En gros (20 litres et plus)'], image: '/images/elevage/lait-verre.jpg', price: null },
  { id: 'poulet', name: 'Poulet de chair', unit: 'poulet', unitPlural: 'poulets', options: ['Vivant', 'Prêt à cuire'], image: '/images/elevage/poulets-de-chair.jpg', price: null },
  { id: 'oeufs', name: 'Œufs frais', unit: 'plateau de 30', unitPlural: 'plateaux de 30', options: ['Plateau de 30 œufs'], image: '/images/elevage/plateau-oeufs.jpg', price: null },
]

export const productName = (id: string) => LIVESTOCK_PRODUCTS.find((p) => p.id === id)?.name ?? id

export const CUSTOMER_TYPES = [
  { id: 'particulier', label: 'Particulier / famille' },
  { id: 'restaurant', label: 'Restaurant, hôtel, traiteur' },
  { id: 'boutique', label: 'Boutique, supérette' },
  { id: 'collectivite', label: 'Cantine, école, entreprise' },
  { id: 'evenement', label: 'Événement (mariage, baptême, fête)' },
] as const

export const FREQUENCIES = [
  { id: 'unique', label: 'Une seule fois' },
  { id: 'hebdomadaire', label: 'Chaque semaine (abonnement)' },
  { id: 'mensuelle', label: 'Chaque mois (abonnement)' },
] as const
