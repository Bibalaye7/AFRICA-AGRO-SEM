# Configuration EmailJS pour le formulaire de contact

## Étapes pour configurer EmailJS

### 1. Créer un compte EmailJS
1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (100 emails/mois gratuits)
3. Connectez-vous à votre compte

### 2. Créer un service email
1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte email
5. Notez le **Service ID** (ex: `service_xxxxx`)

### 3. Créer un template d'email
1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Configurez le template :

**Subject:**
```
Nouveau message depuis le site Africa Agro Sem
```

**Content (Option 1 - Template HTML stylé - RECOMMANDÉ):**
- Dans EmailJS, basculez en mode **HTML** (bouton en haut à droite de l'éditeur)
- **Option A** : Copiez-collez le contenu du fichier `EMAILJS_TEMPLATE_READY.html` (version optimisée, sans balises HTML complètes)
- **Option B** : Copiez-collez le contenu du fichier `EMAILJS_TEMPLATE.html` (version complète avec toutes les balises)
- Le template utilise les variables suivantes :
  - `{{from_name}}` - Nom de l'expéditeur
  - `{{from_email}}` - Email de l'expéditeur
  - `{{message}}` - Message du formulaire
- Le template inclut un design moderne avec :
  - En-tête vert avec gradient
  - Cartes d'information stylées
  - Bouton de réponse cliquable
  - Design responsive compatible avec tous les clients email

**Content (Option 2 - Template texte simple):**
Si vous préférez un template texte simple, utilisez :
```
Bonjour,

Vous avez reçu un nouveau message depuis le formulaire de contact du site Africa Agro Sem.

Nom: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Ce message a été envoyé depuis le site web.
```

4. Notez le **Template ID** (ex: `template_xxxxx`)

### 4. Obtenir votre clé publique
1. Allez dans **Account** > **General**
2. Copiez votre **Public Key** (ex: `xxxxxxxxxxxxx`)

### 5. Configurer dans le code
1. Ouvrez le fichier `react/src/components/Contact.tsx`
2. Remplacez les valeurs suivantes :
   - `YOUR_SERVICE_ID` par votre Service ID
   - `YOUR_TEMPLATE_ID` par votre Template ID
   - `YOUR_PUBLIC_KEY` par votre Public Key

Exemple :
```typescript
const EMAILJS_SERVICE_ID = 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'abcdefghijklmnop'
```

### 6. Tester le formulaire
1. Lancez l'application : `npm run dev`
2. Remplissez le formulaire de contact
3. Vérifiez que vous recevez bien l'email à `africaagrosem@gmail.com`

## Alternative : Utiliser des variables d'environnement (Recommandé)

Pour plus de sécurité, vous pouvez utiliser des variables d'environnement :

1. Créez un fichier `.env` à la racine du projet `react/` :
```
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

2. Modifiez `Contact.tsx` pour utiliser ces variables :
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
```

3. Ajoutez `.env` au `.gitignore` pour ne pas commiter vos clés

## Notes importantes
- Le plan gratuit d'EmailJS permet 200 emails/mois
- Les emails seront envoyés à l'adresse configurée dans votre service email
- Assurez-vous que votre service email est bien connecté et fonctionnel

