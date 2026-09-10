# Africa Agro Sem - Site Web React

Refonte moderne du site web d'Africa Agro Sem avec React, TypeScript, Tailwind CSS et Framer Motion.

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
- **Supabase** - Authentification visiteurs et base de données

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

## 🔐 Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécutez le fichier `supabase/schema.sql`.
3. Copiez `.env.example` vers `.env.local`.
4. Dans **Project Settings > API**, copiez l'URL du projet dans `VITE_SUPABASE_URL` et la clé publique `anon` dans `VITE_SUPABASE_ANON_KEY`.
5. Dans **Authentication > Providers > Email**, activez l'authentification e-mail. Vous pouvez désactiver la confirmation e-mail pendant vos tests.
6. Redémarrez `npm run dev` après toute modification du fichier `.env.local`.

La route `/auth` permet l'inscription et la connexion. Les comptes sont stockés dans Supabase Auth, leurs profils dans `profiles`, et les demandes du formulaire dans `contact_messages`.

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

