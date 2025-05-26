# Script PowerShell pour déploiement GitHub
# Usage: .\deploy-github.ps1

Write-Host "🚀 Déploiement GitHub - Calculateur d'Empreinte Carbone" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Vérifier si Git est installé
try {
    git --version | Out-Null
    Write-Host "✅ Git détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé." -ForegroundColor Red
    Write-Host "Installez Git depuis: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Configuration Git
Write-Host "🔧 Configuration Git..." -ForegroundColor Yellow
$gitName = Read-Host "Nom utilisateur Git (ou Entrée pour 'Développeur EmpreinteCarbone')"
if ([string]::IsNullOrEmpty($gitName)) { $gitName = "Développeur EmpreinteCarbone" }

$gitEmail = Read-Host "Email Git (ou Entrée pour 'dev@empreintecarbone.local')"
if ([string]::IsNullOrEmpty($gitEmail)) { $gitEmail = "dev@empreintecarbone.local" }

git config user.name "$gitName"
git config user.email "$gitEmail"

# Initialiser le repository si nécessaire
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Nettoyer les fichiers temporaires avant commit
Write-Host "🧹 Nettoyage des fichiers temporaires..." -ForegroundColor Yellow
if (Test-Path "*.zip") { Remove-Item "*.zip" -Force }
if (Test-Path "node_modules") { 
    Write-Host "⚠️ node_modules détecté (sera ignoré par .gitignore)" -ForegroundColor Yellow
}

# Ajouter les fichiers
Write-Host "📦 Ajout des fichiers au repository..." -ForegroundColor Yellow
git add .

# Vérifier ce qui sera commité
Write-Host "📋 Fichiers qui seront commités:" -ForegroundColor Cyan
git status --short

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = @"
feat: Calculateur d'empreinte carbone React complet

- Questionnaire adaptatif par secteur d'activité
- Calculs en temps réel avec facteurs ADEME français  
- Dashboard interactif avec Chart.js
- Recommandations personnalisées avec ROI
- Design responsive Tailwind CSS
- Architecture React + TypeScript + Vite
- Documentation complète et guides de déploiement
- Scripts de packaging et déploiement automatisés

Technologies: React 18, TypeScript, Vite, Tailwind CSS, Chart.js
Taille: Application légère (~70KB packagée)
"@

git commit -m "$commitMessage"

Write-Host ""
Write-Host "✅ Repository local créé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Étapes suivantes pour GitHub:" -ForegroundColor Cyan
Write-Host "1. Aller sur https://github.com" -ForegroundColor White
Write-Host "2. Créer un nouveau repository public 'calculateur-empreinte-carbone'" -ForegroundColor White
Write-Host "3. Copier l'URL du repository" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "URL du repository GitHub (ex: https://github.com/username/calculateur-empreinte-carbone.git)"

if (-not [string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "🔗 Ajout du remote GitHub..." -ForegroundColor Yellow
    git remote add origin "$repoUrl"
    
    Write-Host "⬆️ Push vers GitHub..." -ForegroundColor Yellow
    try {
        git push -u origin main
        Write-Host ""
        Write-Host "🎉 Déploiement GitHub réussi!" -ForegroundColor Green
        Write-Host "Repository disponible sur: $repoUrl" -ForegroundColor Cyan
        
        # Suggestions pour GitHub Pages
        Write-Host ""
        Write-Host "🌐 Pour activer GitHub Pages:" -ForegroundColor Cyan
        Write-Host "1. Aller dans Settings > Pages sur GitHub" -ForegroundColor White
        Write-Host "2. Source: Deploy from a branch" -ForegroundColor White
        Write-Host "3. Branch: main / (root)" -ForegroundColor White
        
        $username = ($repoUrl -split '/')[3]
        $repoName = ($repoUrl -split '/')[-1] -replace '\.git$'
        Write-Host "4. Site web sera sur: https://$username.github.io/$repoName" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Erreur lors du push. Vérifiez l'URL et vos permissions." -ForegroundColor Red
    }
} else {
    Write-Host "⏸️ Repository local prêt. Ajoutez le remote GitHub manuellement:" -ForegroundColor Yellow
    Write-Host "git remote add origin <URL_REPOSITORY>" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Commandes Git utiles:" -ForegroundColor Cyan
Write-Host "git status              # Voir les changements" -ForegroundColor White
Write-Host "git add .               # Ajouter tous les fichiers" -ForegroundColor White
Write-Host "git commit -m 'message' # Créer un commit" -ForegroundColor White
Write-Host "git push                # Envoyer vers GitHub" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Votre calculateur d'empreinte carbone est maintenant sur GitHub!" -ForegroundColor Green
