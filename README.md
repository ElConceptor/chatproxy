# ChatProxy - Proxy Qualtrics → ChatGPT

Proxy serverless simple pour connecter Qualtrics à l'API ChatGPT via Vercel.

## Structure

```
chatproxy/
├── api/
│   └── chat.js          # Fonction serverless qui capture les appels et les envoie à OpenAI
├── vercel.json          # Configuration Vercel (CORS)
└── package.json         # Configuration Node.js
```

## Déploiement sur Vercel

1. **Installer Vercel CLI** (optionnel) :
   ```bash
   npm install -g vercel
   ```

2. **Déployer** :
   ```bash
   vercel
   ```

   Ou via l'interface web : https://vercel.com

3. **Configurer les variables d'environnement** :
   - `OPENAI_API_KEY` : Votre clé API OpenAI (obligatoire)
   - `OPENAI_MODEL` : Modèle à utiliser (défaut: `gpt-3.5-turbo`)
   - `OPENAI_TEMPERATURE` : Température (défaut: `0.7`)
   - `OPENAI_MAX_TOKENS` : Max tokens (défaut: `500`)

## Utilisation

### Endpoint
```
POST https://votre-projet.vercel.app/api/chat
```

### Requête
```json
{
  "message": "Bonjour, comment allez-vous ?",
  "systemPrompt": "Vous êtes un assistant utile.",
  "conversationHistory": []
}
```

### Réponse
```json
{
  "success": true,
  "response": "Je vais bien, merci !",
  "usage": { ... },
  "model": "gpt-3.5-turbo"
}
```

## CORS

CORS est configuré dans `vercel.json` pour autoriser toutes les origines. Pour restreindre, modifiez la valeur dans `vercel.json`.
