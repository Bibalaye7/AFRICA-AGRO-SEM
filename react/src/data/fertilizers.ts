// Catalogue des engrais. Les doses sont indicatives (recommandations courantes au Sénégal, notamment ISRA) :
// elles varient selon le sol, la pluviométrie et l'itinéraire technique.
// Prix : laissez `price` à null pour afficher « Prix sur demande », ou indiquez un montant en FCFA par sac.

export type FertilizerCategory = 'fond' | 'couverture' | 'simple' | 'maraichage' | 'organique'

export type Fertilizer = {
  id: string
  name: string
  formula: string
  category: FertilizerCategory
  /** Teneurs N – P₂O₅ – K₂O en %, pour les barres de composition (null pour les engrais organiques) */
  npk: [number, number, number] | null
  extra?: string
  description: string
  crops: string[]
  dose: string
  timing: string
  packaging: string
  price: number | null
}

export const FERTILIZER_CATEGORIES: { id: FertilizerCategory; label: string; icon: string; image: string; text: string }[] = [
  { id: 'fond', label: 'Engrais de fond (NPK)', icon: 'fa-layer-group', image: '/images/engrais/npk-granules.jpg', text: 'Apportés au semis, ils nourrissent la culture dès le départ.' },
  { id: 'couverture', label: 'Engrais de couverture', icon: 'fa-cloud-rain', image: '/images/engrais/uree-perlee.jpg', text: 'Azote apporté pendant la croissance, en un ou plusieurs apports.' },
  { id: 'simple', label: 'Phosphore et potasse', icon: 'fa-flask', image: '/images/engrais/main-granules.jpg', text: 'Pour corriger un sol pauvre ou compléter une formule.' },
  { id: 'maraichage', label: 'Maraîchage et foliaires', icon: 'fa-carrot', image: '/images/engrais/tomates.jpg', text: 'Pour l’oignon, la tomate, la pomme de terre et les pépinières.' },
  { id: 'organique', label: 'Engrais organiques', icon: 'fa-leaf', image: '/images/engrais/organique.jpg', text: 'Ils améliorent durablement la structure et la vie du sol.' },
]

export const FERTILIZERS: Fertilizer[] = [
  {
    id: 'npk-6-20-10', name: 'NPK 6-20-10', formula: '6-20-10', category: 'fond', npk: [6, 20, 10],
    description: 'La formule de référence de l’arachide au Sénégal, riche en phosphore pour l’enracinement et la formation des gousses.',
    crops: ['Arachide', 'Niébé'], dose: '150 kg/ha', timing: 'Au semis, enfoui', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'npk-15-10-10', name: 'NPK 15-10-10', formula: '15-10-10', category: 'fond', npk: [15, 10, 10],
    description: 'Engrais de fond des céréales pluviales, à compléter par de l’urée en couverture.',
    crops: ['Mil', 'Sorgho', 'Maïs'], dose: '150 kg/ha', timing: 'Au semis ou au démariage', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'npk-15-15-15', name: 'NPK 15-15-15', formula: '15-15-15', category: 'fond', npk: [15, 15, 15],
    description: 'Formule équilibrée et polyvalente : azote, phosphore et potasse à parts égales.',
    crops: ['Maïs', 'Mil', 'Sorgho', 'Coton', 'Maraîchage'], dose: '150 à 200 kg/ha', timing: 'Au semis, enfoui', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'dap-18-46-0', name: 'DAP 18-46-0', formula: '18-46-0', category: 'fond', npk: [18, 46, 0],
    description: 'Phosphate diammonique très concentré en phosphore, pour un démarrage vigoureux.',
    crops: ['Riz irrigué', 'Maïs', 'Maraîchage'], dose: '100 kg/ha', timing: 'Au semis ou au repiquage', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'uree-46', name: 'Urée 46 %', formula: '46-0-0', category: 'couverture', npk: [46, 0, 0],
    description: 'L’engrais azoté le plus concentré, en perles. Il fait verdir la culture et augmente le rendement en grain.',
    crops: ['Mil', 'Sorgho', 'Maïs', 'Riz', 'Maraîchage'], dose: '100 kg/ha (céréales) · 250 à 350 kg/ha (riz irrigué)', timing: 'En 2 ou 3 apports, sur sol humide', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'sulfate-ammonium', name: 'Sulfate d’ammonium', formula: '21-0-0', category: 'couverture', npk: [21, 0, 0], extra: '+ 24 % soufre',
    description: 'Azote et soufre, apprécié de l’oignon et du chou, et adapté aux sols calcaires.',
    crops: ['Oignon', 'Chou', 'Riz', 'Maïs'], dose: '100 à 200 kg/ha', timing: 'En couverture, fractionné', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'tsp-0-46-0', name: 'Triple superphosphate (TSP)', formula: '0-46-0', category: 'simple', npk: [0, 46, 0],
    description: 'Phosphore pur et soluble, pour corriger les sols pauvres en phosphore.',
    crops: ['Arachide', 'Niébé', 'Maraîchage'], dose: '100 kg/ha', timing: 'En fond, avant le semis', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'phosphate-naturel', name: 'Phosphate naturel', formula: '≈ 30 % P₂O₅', category: 'simple', npk: [0, 30, 0],
    description: 'Phosphate naturel du Sénégal, à action lente : il remonte le niveau de phosphore du sol pour plusieurs campagnes.',
    crops: ['Toutes cultures', 'Sols acides et pauvres'], dose: '300 à 400 kg/ha', timing: 'Une fois tous les 3 à 4 ans, enfoui', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'kcl-0-0-60', name: 'Chlorure de potassium (KCl)', formula: '0-0-60', category: 'simple', npk: [0, 0, 60],
    description: 'Potasse concentrée pour la résistance à la sécheresse et la qualité des grains.',
    crops: ['Maïs', 'Sorgho', 'Riz', 'Banane'], dose: '50 à 100 kg/ha', timing: 'En fond', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'npk-10-10-20', name: 'NPK 10-10-20', formula: '10-10-20', category: 'maraichage', npk: [10, 10, 20],
    description: 'Riche en potasse, la formule du maraîchage : calibre, goût et conservation des légumes.',
    crops: ['Oignon', 'Tomate', 'Pomme de terre', 'Chou', 'Pastèque'], dose: '300 à 400 kg/ha', timing: 'En fond, puis 1 ou 2 apports', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'sulfate-potasse', name: 'Sulfate de potassium', formula: '0-0-50', category: 'maraichage', npk: [0, 0, 50], extra: '+ 18 % soufre',
    description: 'Potasse sans chlore pour les cultures sensibles : meilleure conservation de l’oignon et qualité des fruits.',
    crops: ['Oignon', 'Tomate', 'Pomme de terre', 'Piment'], dose: '50 à 150 kg/ha', timing: 'En fond ou au grossissement', packaging: 'Sac de 50 kg', price: null,
  },
  {
    id: 'foliaire-20-20-20', name: 'Engrais foliaire 20-20-20', formula: '20-20-20', category: 'maraichage', npk: [20, 20, 20], extra: '+ oligo-éléments',
    description: 'Engrais soluble pulvérisé sur les feuilles, pour relancer une culture stressée ou une pépinière.',
    crops: ['Pépinières', 'Tomate', 'Piment', 'Oignon'], dose: '2 à 3 kg/ha par passage', timing: 'Toutes les 2 à 3 semaines', packaging: 'Sachet de 1 kg · seau de 5 kg', price: null,
  },
  {
    id: 'compost', name: 'Compost organique', formula: 'Organique', category: 'organique', npk: null,
    description: 'Matière organique mûre qui retient l’eau, nourrit la vie du sol et rend les engrais minéraux plus efficaces.',
    crops: ['Maraîchage', 'Arboriculture', 'Toutes cultures'], dose: '5 à 10 t/ha', timing: 'Avant le semis ou la plantation', packaging: 'Sac de 50 kg · vrac', price: null,
  },
  {
    id: 'fiente-volaille', name: 'Fiente de volaille séchée', formula: 'Organique', category: 'organique', npk: null,
    description: 'Engrais organique riche en azote, issu de nos élevages de volailles : idéal en maraîchage.',
    crops: ['Oignon', 'Tomate', 'Chou', 'Maïs'], dose: '2 à 5 t/ha', timing: 'Bien enfouie, 2 à 3 semaines avant le semis', packaging: 'Sac de 50 kg', price: null,
  },
]

export const fertilizerName = (id: string) => FERTILIZERS.find((f) => f.id === id)?.name ?? id

export const BAG_KG = 50

// Programmes de fumure indicatifs par culture, pour 1 hectare.
export type FertilizerPlan = {
  id: string
  crop: string
  steps: { fertilizerId: string; kgPerHa: number; when: string }[]
  note?: string
}

export const FERTILIZER_PLANS: FertilizerPlan[] = [
  { id: 'arachide', crop: 'Arachide', steps: [{ fertilizerId: 'npk-6-20-10', kgPerHa: 150, when: 'Au semis, enfoui' }] },
  { id: 'niebe', crop: 'Niébé', steps: [{ fertilizerId: 'npk-6-20-10', kgPerHa: 150, when: 'Au semis, enfoui' }] },
  {
    id: 'mil-sorgho', crop: 'Mil ou sorgho',
    steps: [
      { fertilizerId: 'npk-15-10-10', kgPerHa: 150, when: 'Au semis ou au démariage' },
      { fertilizerId: 'uree-46', kgPerHa: 100, when: 'Moitié au démariage, moitié à la montaison' },
    ],
  },
  {
    id: 'mais', crop: 'Maïs',
    steps: [
      { fertilizerId: 'npk-15-15-15', kgPerHa: 150, when: 'Au semis, enfoui' },
      { fertilizerId: 'uree-46', kgPerHa: 150, when: 'À 6–8 feuilles, puis à la floraison' },
    ],
  },
  {
    id: 'riz', crop: 'Riz irrigué',
    steps: [
      { fertilizerId: 'dap-18-46-0', kgPerHa: 100, when: 'Au semis ou au repiquage' },
      { fertilizerId: 'uree-46', kgPerHa: 250, when: 'En 2 ou 3 apports : tallage, initiation paniculaire' },
    ],
  },
  {
    id: 'oignon', crop: 'Oignon',
    steps: [
      { fertilizerId: 'npk-10-10-20', kgPerHa: 300, when: 'En fond, à la plantation' },
      { fertilizerId: 'uree-46', kgPerHa: 100, when: 'En 2 apports, 3 et 6 semaines après repiquage' },
      { fertilizerId: 'sulfate-potasse', kgPerHa: 50, when: 'Au début du grossissement des bulbes' },
    ],
    note: 'Ajoutez 5 à 10 t/ha de compost ou de fumier bien décomposé avant la plantation.',
  },
  {
    id: 'tomate', crop: 'Tomate',
    steps: [
      { fertilizerId: 'npk-10-10-20', kgPerHa: 400, when: 'Moitié en fond, moitié à la floraison' },
      { fertilizerId: 'uree-46', kgPerHa: 100, when: 'En 2 apports après la reprise' },
    ],
    note: 'Ajoutez 5 à 10 t/ha de compost ou de fumier bien décomposé avant la plantation.',
  },
  {
    id: 'pomme-de-terre', crop: 'Pomme de terre',
    steps: [
      { fertilizerId: 'npk-10-10-20', kgPerHa: 400, when: 'En fond, à la plantation' },
      { fertilizerId: 'uree-46', kgPerHa: 100, when: 'Au buttage' },
    ],
    note: 'Ajoutez 10 t/ha de compost ou de fumier bien décomposé avant la plantation.',
  },
]

export const FERTILIZER_CUSTOMER_TYPES = [
  { id: 'producteur', label: 'Producteur individuel' },
  { id: 'groupement', label: 'GIE, coopérative, groupement' },
  { id: 'revendeur', label: 'Revendeur, boutique d’intrants' },
  { id: 'entreprise', label: 'Entreprise, projet, ONG' },
] as const
