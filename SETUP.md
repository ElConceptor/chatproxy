# Guide d'Installation - ChatProxy

## Prérequis

### 1. Installer Node.js

Si Node.js n'est pas installé sur votre système :

1. **Télécharger Node.js** :
   - Allez sur https://nodejs.org/
   - Téléchargez la version LTS (Long Term Support)
   - Installez-le en suivant les instructions

2. **Vérifier l'installation** :
   ```bash
   node --version
   npm --version
   ```

### 2. Installer les dépendances

Une fois Node.js installé, dans le dossier du projet :

```bash
npm install
```

### 3. Configurer les variables d'environnement

1. Copiez le fichier `env.example` vers `.env` :
   ```bash
   copy env.example .env
   ```

2. Éditez le fichier `.env` et ajoutez votre clé API OpenAI :
   ```
   OPENAI_API_KEY=sk-votre-cle-api-ici
   ```

### 4. Lancer le serveur

```bash
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### 5. Tester avec le front-end

1. Ouvrez le fichier `fronttest/index.html` dans votre navigateur
2. Ou utilisez un serveur local simple :
   ```bash
   # Avec Python
   cd fronttest
   python -m http.server 8080
   # Puis ouvrez http://localhost:8080
   ```

## 🐛 Dépannage

**Node.js non trouvé** :
- Vérifiez que Node.js est installé et dans votre PATH
- Redémarrez votre terminal après l'installation

**Erreur de port** :
- Changez le port dans le fichier `.env` (PORT=3001)
- Ou arrêtez le processus utilisant le port 3000

**Erreur CORS** :
- Vérifiez la configuration CORS dans `server.js`
- En développement, toutes les origines sont autorisées par défaut

