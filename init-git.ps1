# Script PowerShell pour initialiser Git et préparer le push
# Exécutez ce script après avoir installé Git

Write-Host "🚀 Initialisation du repository Git..." -ForegroundColor Green

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git trouvé: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "📥 Téléchargez Git depuis: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Vérifier si déjà un repository Git
if (Test-Path .git) {
    Write-Host "⚠️  Un repository Git existe déjà" -ForegroundColor Yellow
    $continue = Read-Host "Voulez-vous continuer quand même? (o/n)"
    if ($continue -ne "o") {
        exit 0
    }
} else {
    # Initialiser Git
    Write-Host "📦 Initialisation du repository..." -ForegroundColor Cyan
    git init
}

# Ajouter tous les fichiers
Write-Host "📝 Ajout des fichiers..." -ForegroundColor Cyan
git add .

# Afficher le statut
Write-Host "`n📊 Statut actuel:" -ForegroundColor Cyan
git status

# Demander le message de commit
Write-Host "`n💬 Message de commit (laissez vide pour le message par défaut):" -ForegroundColor Yellow
$commitMessage = Read-Host
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit: Proxy Qualtrics vers ChatGPT avec support Vercel"
}

# Créer le commit
Write-Host "`n💾 Création du commit..." -ForegroundColor Cyan
git commit -m $commitMessage

Write-Host "`n✅ Repository Git initialisé avec succès!" -ForegroundColor Green
Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Créez un repository sur GitHub (https://github.com/new)" -ForegroundColor White
Write-Host "2. Exécutez les commandes suivantes:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host "`n📖 Consultez GIT_SETUP.md pour plus de détails" -ForegroundColor Yellow

