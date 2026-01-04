# Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer le proxy ChatProxy sur Vercel.

## 📋 Prérequis

1. Un compte Vercel (gratuit) : https://vercel.com
2. Une clé API OpenAI
3. Git installé (optionnel, mais recommandé)

## 🚀 Déploiement

### Option 1 : Déploiement via l'interface Vercel (Recommandé)

1. **Préparer votre projet** :
   - Assurez-vous que tous les fichiers sont commités dans Git
   - Ou préparez un dossier ZIP avec tous les fichiers

2. **Aller sur Vercel** :
   - Connectez-vous sur https://vercel.com
   - Cliquez sur "Add New Project"

3. **Importer le projet** :
   - Si vous utilisez Git : connectez votre repository
   - Sinon : déployez depuis un dossier local

4. **Configurer le projet** :
   - Framework Preset : **Other** (ou laissez Vercel détecter automatiquement)
   - Root Directory : `.` (racine du projet)
   - Build Command : (laissez vide, pas de build nécessaire)
   - Output Directory : (laissez vide)

5. **Configurer les variables d'environnement** :
   Cliquez sur "Environment Variables" et ajoutez :
   ```
   OPENAI_API_KEY = votre-cle-api-openai
   OPENAI_MODEL = gpt-3.5-turbo (optionnel)
   OPENAI_TEMPERATURE = 0.7 (optionnel)
   OPENAI_MAX_TOKENS = 500 (optionnel)
   ALLOWED_ORIGIN = https://votre-domaine.qualtrics.com (optionnel)
   ```

6. **Déployer** :
   - Cliquez sur "Deploy"
   - Attendez la fin du déploiement (quelques minutes)

7. **Récupérer l'URL** :
   - Une fois déployé, Vercel vous donnera une URL comme : `https://votre-projet.vercel.app`
   - Votre API sera disponible sur : `https://votre-projet.vercel.app/api/chat`

### Option 2 : Déploiement via CLI Vercel

1. **Installer Vercel CLI** :
   ```bash
   npm install -g vercel
   ```

2. **Se connecter** :
   ```bash
   vercel login
   ```

3. **Déployer** :
   ```bash
   vercel
   ```

4. **Configurer les variables d'environnement** :
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add OPENAI_MODEL
   vercel env add OPENAI_TEMPERATURE
   vercel env add OPENAI_MAX_TOKENS
   vercel env add ALLOWED_ORIGIN
   ```

5. **Redéployer avec les variables** :
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

### Variables d'environnement disponibles

| Variable | Description | Obligatoire | Défaut |
|----------|-------------|-------------|--------|
| `OPENAI_API_KEY` | Clé API OpenAI | ✅ Oui | - |
| `OPENAI_MODEL` | Modèle à utiliser | ❌ Non | `gpt-3.5-turbo` |
| `OPENAI_TEMPERATURE` | Température (0.0-2.0) | ❌ Non | `0.7` |
| `OPENAI_MAX_TOKENS` | Nombre max de tokens | ❌ Non | `500` |
| `ALLOWED_ORIGIN` | Origine CORS autorisée | ❌ Non | `*` (toutes) |

### Configuration CORS

Par défaut, toutes les origines sont autorisées. Pour restreindre :

1. Allez dans les paramètres du projet sur Vercel
2. Ajoutez la variable `ALLOWED_ORIGIN` avec votre domaine Qualtrics
3. Exemple : `ALLOWED_ORIGIN=https://votre-domaine.qualtrics.com`

## 📡 Endpoints disponibles

Une fois déployé, vous aurez accès à :

- **POST** `https://votre-projet.vercel.app/api/chat` - Envoyer un message
- **GET** `https://votre-projet.vercel.app/api/chat` - Vérifier le service
- **GET** `https://votre-projet.vercel.app/api/health` - Health check

## 🧪 Tester le déploiement

1. **Test de santé** :
   ```bash
   curl https://votre-projet.vercel.app/api/health
   ```

2. **Test de l'API** :
   ```bash
   curl -X POST https://votre-projet.vercel.app/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Bonjour, comment allez-vous ?"}'
   ```

3. **Utiliser le front-end de test** :
   - Ouvrez `fronttest/index.html`
   - Modifiez l'URL dans l'interface pour utiliser votre URL Vercel
   - Testez l'envoi de messages

## 🔄 Mises à jour

Pour mettre à jour votre déploiement :

1. **Via Git** : Push vos changements, Vercel redéploiera automatiquement
2. **Via CLI** : `vercel --prod`
3. **Via l'interface** : Re-déployez depuis le dashboard

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `ALLOWED_ORIGIN` est correctement configuré
- Vérifiez les headers dans `vercel.json`

### Erreur 500 - API Key manquante
- Vérifiez que `OPENAI_API_KEY` est bien configurée dans les variables d'environnement
- Redéployez après avoir ajouté la variable

### Timeout
- Les fonctions serverless Vercel ont un timeout de 10s (gratuit) ou 60s (pro)
- Si vous avez besoin de plus de temps, considérez un plan payant

### Logs
- Consultez les logs dans le dashboard Vercel
- Ou utilisez : `vercel logs`

## 📝 Notes importantes

- **Gratuit** : Vercel offre un plan gratuit généreux pour commencer
- **HTTPS** : Toutes les URLs Vercel sont en HTTPS par défaut
- **Auto-scaling** : Vercel gère automatiquement la montée en charge
- **Domaines personnalisés** : Vous pouvez ajouter votre propre domaine dans les paramètres

## 🔗 Liens utiles

- Documentation Vercel : https://vercel.com/docs
- Dashboard Vercel : https://vercel.com/dashboard
- Support Vercel : https://vercel.com/support

