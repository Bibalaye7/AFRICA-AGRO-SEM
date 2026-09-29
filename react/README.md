# Africa Agro Sem - Site Web React

Refonte moderne du site web d'Africa Agro Sem avec React, TypeScript, Tailwind CSS et Framer Motion.

## 🌱 Fonctionnalités

- **Site public ouvert** : plus besoin de se connecter pour le visiter
- **Fiches techniques** des semences (`/semences`) : variétés, cycle, zone, dose, rendement
- **Calculateur de besoin + réservation** en ligne ou par WhatsApp (`/#reservation`)
- **Traçabilité** : vérification d'un numéro de lot (`/verifier-lot`)
- **Partenariats** nationaux et internationaux, page bilingue FR/EN (`/partenariats`)
- **Tableau de bord** de la campagne (`/tableau-de-bord`) : lots et stocks, distributions,
  indicateurs, graphiques, réservations, demandes de partenariat, export CSV

## 🗄️ Base de données

Le site a sa propre base de données **SQLite** (bibliothèque libSQL) et sa propre API (`server/`, `api/`).

- **En local** : rien à configurer. La base est le fichier `data/africa-agro-sem.db`, créé
  automatiquement au premier lancement (`npm run dev`). **Sauvegardez ce fichier** : il contient
  toutes les données (copiez-le simplement ailleurs, site arrêté).
- **Premier accès** : ouvrez http://localhost:5173/auth et créez le compte administrateur.
  Cette création n'est possible que depuis l'ordinateur local, et une seule fois.
- **Équipe** : l'administrateur ajoute les agents depuis l'onglet « Équipe » du tableau de bord.
- **En ligne (Vercel)** : créez une base gratuite sur [Turso](https://turso.tech) et ajoutez
  `DATABASE_URL` et `DATABASE_AUTH_TOKEN` dans les variables d'environnement Vercel
  (voir `VERCEL_DEPLOY.md`).

## 🚀 Installation

```bash
cd react
npm install
```

## 📦 Technologies utilisées

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **Vite** - Build tool rapide
- **SQLite / libSQL** - Base de données (fichier local, ou Turso en ligne)

## 🎨 Caractéristiques

- ✅ Design moderne et professionnel reflétant l'agriculture
- ✅ Animations fluides avec Framer Motion
- ✅ Responsive design (mobile, tablette, desktop)
- ✅ Navigation smooth scroll
- ✅ Header fixe avec effet au scroll
- ✅ Carousel automatique dans la section Hero
- ✅ Composants compacts et modulaires
- ✅ CTA (Call To Action) optimisés
- ✅ Formulaire de contact fonctionnel

## 🏃 Développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## 🏗️ Build pour production

```bash
npm run build
```

## 👀 Preview de la production

```bash
npm run preview
```

## 📁 Structure du projet

```
react/
├── public/
│   ├── images/          # Toutes les images du site
│   └── les_logos/       # Logos de l'entreprise
├── src/
│   ├── components/
│   │   ├── Header.tsx   # Navigation principale
│   │   ├── Hero.tsx     # Section hero avec carousel
│   │   ├── About.tsx    # Section à propos
│   │   ├── Products.tsx # Section produits
│   │   ├── Partners.tsx # Section partenaires
│   │   ├── Contact.tsx  # Section contact
│   │   └── Footer.tsx   # Pied de page
│   ├── App.tsx          # Composant principal
│   ├── main.tsx         # Point d'entrée
│   └── style.css        # Styles Tailwind
└── package.json
```

## 🎯 Sections du site

1. **Header** - Navigation fixe avec menu responsive
2. **Hero** - Carousel d'images avec animations
3. **About** - Présentation de l'entreprise et valeurs
4. **Products** - Catalogue de légumes et céréales
5. **Partners** - Partenariats et collaborations
6. **Contact** - Formulaire de contact et informations
7. **Footer** - Liens et informations de contact

## 🌟 Animations

- Animations au scroll avec Framer Motion
- Transitions fluides entre les sections
- Effets hover sur les cartes produits
- Carousel automatique dans le Hero
- Menu mobile animé

## 📱 Responsive

Le site est entièrement responsive et optimisé pour :
- Mobile (< 768px)
- Tablette (768px - 1024px)
- Desktop (> 1024px)

