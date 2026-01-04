# Guide de Configuration Git

## 📋 Installation de Git

Si Git n'est pas installé sur votre système Windows :

1. **Télécharger Git** :
   - Allez sur https://git-scm.com/download/win
   - Téléchargez et installez Git pour Windows
   - Redémarrez votre terminal après l'installation

2. **Vérifier l'installation** :
   ```bash
   git --version
   ```

## 🚀 Initialiser et Pousser vers GitHub

### Option 1 : Via GitHub Desktop (Recommandé pour débutants)

1. **Installer GitHub Desktop** :
   - Téléchargez depuis https://desktop.github.com/
   - Installez et connectez-vous avec votre compte GitHub

2. **Créer un nouveau repository** :
   - Cliquez sur "File" > "New Repository"
   - Nommez-le (ex: `chatproxy`)
   - Choisissez le dossier de votre projet
   - Cliquez sur "Create Repository"

3. **Pousser vers GitHub** :
   - Cliquez sur "Publish repository"
   - Cochez "Keep this code private" si vous voulez un repo privé
   - Cliquez sur "Publish repository"

### Option 2 : Via la ligne de commande

#### Étape 1 : Initialiser Git localement

```bash
# Initialiser le repository
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit: Proxy Qualtrics vers ChatGPT avec support Vercel"
```

#### Étape 2 : Créer un repository sur GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton "+" en haut à droite
3. Sélectionnez "New repository"
4. Nommez votre repository (ex: `chatproxy`)
5. **Ne cochez PAS** "Initialize with README" (vous avez déjà des fichiers)
6. Cliquez sur "Create repository"

#### Étape 3 : Connecter et pousser

GitHub vous donnera des instructions, mais voici les commandes :

```bash
# Ajouter le remote (remplacez USERNAME et REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Renommer la branche principale en main (si nécessaire)
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

#### Si vous avez déjà un repository existant

```bash
# Vérifier les remotes existants
git remote -v

# Si aucun remote, ajoutez-le
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Pousser
git push -u origin main
```

## 🔐 Authentification GitHub

Si vous utilisez HTTPS, GitHub peut demander une authentification :

### Option A : Personal Access Token (Recommandé)

1. Allez sur https://github.com/settings/tokens
2. Cliquez sur "Generate new token (classic)"
3. Donnez-lui un nom et sélectionnez les permissions `repo`
4. Copiez le token
5. Utilisez-le comme mot de passe lors du `git push`

### Option B : GitHub CLI

```bash
# Installer GitHub CLI
winget install GitHub.cli

# S'authentifier
gh auth login
```

## 📝 Commandes Git utiles

```bash
# Voir le statut
git status

# Ajouter des fichiers
git add .

# Créer un commit
git commit -m "Description des changements"

# Pousser vers GitHub
git push

# Voir l'historique
git log

# Créer une nouvelle branche
git checkout -b nom-de-la-branche
```

## 🎯 Fichiers à ne pas commiter

Le fichier `.gitignore` est déjà configuré pour exclure :
- `node_modules/`
- `.env` (contient vos clés API)
- Fichiers de logs
- Fichiers système

**Important** : Ne commitez JAMAIS votre fichier `.env` avec votre clé API OpenAI !

## ✅ Vérification

Après avoir poussé, vérifiez sur GitHub que tous les fichiers sont présents :
- ✅ `api/chat.js`
- ✅ `api/health.js`
- ✅ `vercel.json`
- ✅ `package.json`
- ✅ Tous les autres fichiers (sauf `.env`)

## 🔄 Mises à jour futures

Pour mettre à jour votre repository après des changements :

```bash
git add .
git commit -m "Description des changements"
git push
```

## 🐛 Dépannage

**Erreur "remote origin already exists"** :
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

**Erreur d'authentification** :
- Utilisez un Personal Access Token au lieu de votre mot de passe
- Ou configurez SSH : https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**Fichiers non suivis** :
```bash
git add .
git status  # Vérifier ce qui sera commité
```

