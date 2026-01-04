# Front-end de Test - ChatProxy

Interface de test pour le proxy Qualtrics → ChatGPT.

## 🚀 Utilisation

### Option 1: Ouvrir directement dans le navigateur

1. Assurez-vous que le serveur proxy est lancé (voir le README principal)
2. Ouvrez `index.html` dans votre navigateur
3. L'interface se connectera automatiquement au serveur sur `http://localhost:3000`

### Option 2: Utiliser un serveur local simple

Si vous avez Python installé :
```bash
# Python 3
python -m http.server 8080

# Puis ouvrez http://localhost:8080 dans votre navigateur
```

## 📋 Fonctionnalités

- ✅ Test de connexion au serveur proxy
- 💬 Interface de chat interactive
- 📊 Affichage des informations de réponse (tokens, modèle)
- 🔄 Gestion de l'historique de conversation
- ⚙️ Configuration du prompt système
- 🎨 Interface moderne et responsive

## 🔧 Configuration

Vous pouvez modifier l'URL du proxy directement dans l'interface ou dans le fichier `app.js` :

```javascript
const API_URL = 'http://localhost:3000/api/chat';
```

## 📝 Notes

- Le front-end nécessite que le serveur proxy soit en cours d'exécution
- Assurez-vous que CORS est correctement configuré sur le serveur
- En cas d'erreur CORS, vérifiez que le serveur autorise les requêtes depuis votre origine

