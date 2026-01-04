# 🚀 Démarrage Rapide - Vercel

## Déploiement en 5 minutes

### 1. Préparer votre clé API OpenAI
- Obtenez votre clé sur https://platform.openai.com/api-keys

### 2. Déployer sur Vercel

**Option A : Via le site web (le plus simple)**
1. Allez sur https://vercel.com et connectez-vous
2. Cliquez sur "Add New Project"
3. Importez votre repository Git ou uploadez les fichiers
4. Configurez les variables d'environnement :
   - `OPENAI_API_KEY` = votre clé API
5. Cliquez sur "Deploy"

**Option B : Via la ligne de commande**
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter la clé API
vercel env add OPENAI_API_KEY

# Redéployer en production
vercel --prod
```

### 3. Tester votre API

Une fois déployé, vous obtiendrez une URL comme : `https://votre-projet.vercel.app`

Testez avec :
```bash
curl https://votre-projet.vercel.app/api/health
```

### 4. Utiliser dans Qualtrics

Dans votre formulaire Qualtrics, utilisez :
```javascript
fetch('https://votre-projet.vercel.app/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: 'Votre message ici'
    })
})
.then(response => response.json())
.then(data => {
    console.log(data.response);
});
```

## ✅ C'est tout !

Votre proxy est maintenant en ligne et prêt à être utilisé.

Pour plus de détails, consultez `VERCEL_DEPLOY.md`

