# ChatProxy - Proxy pour Qualtrics vers ChatGPT

Proxy serveur permettant à un formulaire Qualtrics de communiquer avec l'API ChatGPT en gérant les problèmes CORS.

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

3. Configurer votre clé API OpenAI dans le fichier `.env` :
```
OPENAI_API_KEY=sk-votre-cle-api-ici
```

## ⚙️ Configuration

Modifiez le fichier `.env` pour configurer :

- `PORT` : Port d'écoute du serveur (par défaut: 3000)
- `OPENAI_API_KEY` : Votre clé API OpenAI (obligatoire)
- `OPENAI_MODEL` : Modèle à utiliser (par défaut: gpt-3.5-turbo)
- `OPENAI_TEMPERATURE` : Température de génération (0.0-2.0)
- `OPENAI_MAX_TOKENS` : Nombre maximum de tokens
- `ALLOWED_ORIGIN` : Origine autorisée pour CORS (optionnel)

## 🏃 Démarrage

```bash
# Mode production
npm start

# Mode développement (avec rechargement automatique)
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## 📡 API Endpoints

### POST /api/chat

Endpoint principal pour envoyer un message à ChatGPT.

**Requête :**
```json
{
  "message": "Bonjour, comment allez-vous ?",
  "systemPrompt": "Vous êtes un assistant utile et professionnel.",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Message précédent"
    },
    {
      "role": "assistant",
      "content": "Réponse précédente"
    }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "response": "Je vais bien, merci ! Comment puis-je vous aider ?",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  },
  "model": "gpt-3.5-turbo"
}
```

### GET /api/chat

Vérifie la disponibilité du service.

### GET /health

Vérifie l'état du serveur.

## 🔧 Utilisation avec Qualtrics

Dans votre formulaire Qualtrics, utilisez JavaScript pour appeler l'API :

```javascript
Qualtrics.SurveyEngine.addOnload(function() {
    // Votre code ici
    
    // Exemple d'appel à l'API
    fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Votre message ici',
            systemPrompt: 'Vous êtes un assistant pour un formulaire Qualtrics'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Réponse:', data.response);
        // Traiter la réponse ici
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});
```

**Important :** En production, remplacez `http://localhost:3000` par l'URL de votre serveur proxy déployé.

## 🔒 Sécurité CORS

Le serveur est configuré pour gérer les requêtes CORS depuis Qualtrics. En développement, toutes les origines sont autorisées. En production, configurez `ALLOWED_ORIGIN` dans le fichier `.env` pour restreindre l'accès.

## 📝 Notes

- Assurez-vous que votre clé API OpenAI est valide et a des crédits disponibles
- Le timeout par défaut est de 30 secondes
- Les erreurs sont loggées dans la console du serveur

## 🐛 Dépannage

**Erreur CORS :**
- Vérifiez que l'origine de votre requête Qualtrics est autorisée
- En développement, toutes les origines sont autorisées par défaut

**Erreur API OpenAI :**
- Vérifiez que votre clé API est correcte dans `.env`
- Vérifiez que vous avez des crédits disponibles sur votre compte OpenAI

**Port déjà utilisé :**
- Changez le port dans le fichier `.env` ou arrêtez le processus utilisant le port 3000

