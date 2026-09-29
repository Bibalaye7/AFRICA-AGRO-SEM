// Les activités d'Africa Agro Sem, dans l'ordre de la chaîne « de la graine au champ ».
// `position` cadre la photo sur son sujet (visage, mains…) quand elle est rognée.

export type Activity = {
  id: string
  icon: string
  title: string
  short: string
  text: string
  points: string[]
  image: string
  position?: string
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'production',
    icon: 'fa-seedling',
    title: 'Production de semences',
    short: 'Multiplication de semences sur nos parcelles',
    text: 'Nous multiplions des semences de variétés améliorées sur nos propres parcelles, dont 100 hectares au sein d’un domaine agricole communautaire du PRODAC, et avec des producteurs encadrés.',
    points: ['Semences de prébase issues de la recherche', 'Parcelles suivies de la levée à la récolte', 'Arachide, maïs, niébé, mil, sorgho'],
    image: '/images/PHOTO-2025-02-06-09-48-16.jpg',
    position: '50% 12%',
  },
  {
    id: 'certification',
    icon: 'fa-certificate',
    title: 'Contrôle et certification',
    short: 'Pureté et germination vérifiées lot par lot',
    text: 'Chaque récolte est triée, contrôlée puis certifiée avant d’être proposée aux producteurs. Chaque lot reçoit un numéro qui permet d’en vérifier l’origine.',
    points: ['Tests de pureté et de germination', 'Catégories Prébase, Base, R1, R2', 'Numéro de lot traçable'],
    image: '/images/PHOTO-2025-02-06-09-46-34.jpg',
    position: '50% 45%',
  },
  {
    id: 'stockage',
    icon: 'fa-warehouse',
    title: 'Conditionnement et stockage',
    short: 'Semences préservées jusqu’au semis',
    text: 'Les semences sont conditionnées et stockées dans de bonnes conditions pour préserver leur pouvoir germinatif jusqu’à la campagne.',
    points: ['Sacs étiquetés par lot', 'Magasins régionaux', 'Chambres froides pour les produits frais'],
    image: '/images/PHOTO-2025-01-17-20-26-28.jpg',
  },
  {
    id: 'distribution',
    icon: 'fa-truck',
    title: 'Distribution pendant la campagne',
    short: 'Des semences disponibles à temps, près des champs',
    text: 'Avant les premières pluies, nous acheminons les semences vers les points de retrait et les distribuons aux agriculteurs et coopératives, en suivant chaque sac distribué.',
    points: ['Réservation en ligne ou par WhatsApp', 'Programmes publics et subventionnés', 'Suivi des quantités par région et par bénéficiaire'],
    image: '/images/camion-produits-agricoles.webp',
  },
  {
    id: 'accompagnement',
    icon: 'fa-people-group',
    title: 'Accompagnement des producteurs',
    short: 'Conseils techniques pour de meilleurs rendements',
    text: 'Nous accompagnons les producteurs, les GIE et les coopératives : choix de la variété, dose de semis, itinéraire technique et suivi des parcelles.',
    points: ['Fiches techniques par variété', 'Formation des groupements', 'Création d’emplois locaux, notamment pour les femmes'],
    image: '/images/PHOTO-2025-01-22-21-46-46 (3).jpg',
    position: '50% 60%',
  },
  {
    id: 'maraichage',
    icon: 'fa-basket-shopping',
    title: 'Maraîchage et commercialisation',
    short: 'Oignon, pomme de terre, poivron, tomate…',
    text: 'Nous produisons aussi des cultures maraîchères pour les marchés locaux et l’export, et valorisons les produits agricoles sénégalais auprès de nos partenaires.',
    points: ['Oignon, pomme de terre, poivron, tomate', 'Marchés locaux et sous-région', 'Logistique et chaîne du froid'],
    image: '/images/PHOTO-2025-02-06-09-58-30.jpg',
    position: '50% 30%',
  },
]
