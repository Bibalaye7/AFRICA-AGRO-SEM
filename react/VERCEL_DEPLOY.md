# Guide de Déploiement sur Vercel

## Étapes pour déployer le site sur Vercel

### Option 1 : Déploiement via l'interface Vercel (Recommandé)

1. **Créer un compte Vercel**
   - Allez sur https://vercel.com
   - Créez un compte ou connectez-vous avec GitHub/GitLab/Bitbucket

2. **Importer le projet**
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub (ou créez-en un nouveau)
   - Sélectionnez le dossier `react` comme racine du projet

3. **Configuration automatique**
   - Vercel détectera automatiquement Vite
   - Les paramètres suivants seront configurés automatiquement :
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Base de données (obligatoire pour le tableau de bord en ligne)**
    - Créez une base gratuite sur https://turso.tech (commande `turso db create africa-agro-sem`),
      puis récupérez son URL (`libsql://…`) et un jeton (`turso db tokens create africa-agro-sem`).
    - Dans **Settings → Environment Variables**, ajoutez pour **Production** et **Preview** :
       - `DATABASE_URL` : l'URL `libsql://…` de la base Turso
       - `DATABASE_AUTH_TOKEN` : le jeton Turso
       - `SESSION_SECRET` (conseillé) : une longue chaîne aléatoire
    - Sans ces variables, le site public fonctionne et les formulaires arrivent par e-mail (EmailJS),
      mais le tableau de bord et la vérification de lot restent indisponibles en ligne.
    - Pour créer le premier administrateur de la base en ligne : sur votre PC, lancez le site avec
      les mêmes `DATABASE_URL` / `DATABASE_AUTH_TOKEN` dans `.env.local`, puis ouvrez
      http://localhost:5173/auth.
    - Variables EmailJS (optionnel) : `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build
   - Votre site sera accessible via une URL Vercel (ex: `votre-projet.vercel.app`)

### Option 2 : Déploiement via CLI Vercel

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer depuis le dossier react**
   ```bash
   cd react
   vercel
   ```

4. **Suivre les instructions**
   - Répondez aux questions (pressez Entrée pour les valeurs par défaut)
   - Le déploiement commencera automatiquement

### Configuration du fichier vercel.json

Le fichier `vercel.json` est déjà configuré avec :
- Support du routing React (SPA)
- Configuration pour Vite
- Redirections pour toutes les routes vers `index.html`

### Vérifications après déploiement

1. ✅ Vérifiez que toutes les images s'affichent correctement
2. ✅ Testez le formulaire de contact
3. ✅ Vérifiez la navigation entre les pages
4. ✅ Testez sur mobile et tablette
5. ✅ Vérifiez que la section "Nos Partenariats" s'affiche bien sur mobile

### Mises à jour futures

Pour mettre à jour le site après des modifications :
- Si vous utilisez GitHub : Push vos changements, Vercel déploiera automatiquement
- Si vous utilisez la CLI : Exécutez `vercel --prod` depuis le dossier `react`

### Support

En cas de problème :
- Consultez les logs de build sur Vercel Dashboard
- Vérifiez que toutes les dépendances sont dans `package.json`
- Assurez-vous que le build local fonctionne : `npm run build`

