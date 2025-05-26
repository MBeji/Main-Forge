# Script de Packaging - Calculateur d'Empreinte Carbone
# Usage: .\package.ps1

Write-Host "🚀 Début du packaging de l'application..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trouvé. Veuillez installer Node.js depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Nettoyer les anciens builds
Write-Host "🧹 Nettoyage des anciens fichiers..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "EmpreinteCarbone-*.zip") { Remove-Item -Force "EmpreinteCarbone-*.zip" }

# Installer/Mettre à jour les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" install

# Construire l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" run build

# Vérifier si le build a réussi
if (Test-Path "dist") {
    Write-Host "✅ Build réussi!" -ForegroundColor Green
    
    # Créer l'archive du code source complet
    Write-Host "📁 Création de l'archive du code source..." -ForegroundColor Yellow
    $excludeFiles = @("node_modules", ".git", "*.zip", ".vscode/settings.json")
    $sourceFiles = Get-ChildItem -Path "." -Recurse | Where-Object { 
        $path = $_.FullName
        $exclude = $false
        foreach ($pattern in $excludeFiles) {
            if ($path -like "*$pattern*") { $exclude = $true; break }
        }
        -not $exclude
    }
    
    # Archive du code source (sans node_modules)
    $sourceArchive = "EmpreinteCarbone-Source-$(Get-Date -Format 'yyyy-MM-dd').zip"
    Compress-Archive -Path @(
        "src", "public", "index.html", "package.json", "package-lock.json",
        "vite.config.ts", "tsconfig.json", "tsconfig.node.json", 
        "tailwind.config.js", "postcss.config.js", "README.md", "DEPLOYMENT.md"
    ) -DestinationPath $sourceArchive -Force
    
    # Archive des fichiers de production
    $distArchive = "EmpreinteCarbone-Production-$(Get-Date -Format 'yyyy-MM-dd').zip"
    Compress-Archive -Path "dist\*" -DestinationPath $distArchive -Force
    
    # Statistiques
    $sourceSize = [math]::Round((Get-Item $sourceArchive).Length / 1MB, 2)
    $distSize = [math]::Round((Get-Item $distArchive).Length / 1MB, 2)
    
    Write-Host "`n🎉 Packaging terminé avec succès!" -ForegroundColor Green
    Write-Host "📦 Archives créées:" -ForegroundColor Cyan
    Write-Host "   - $sourceArchive ($sourceSize MB) - Code source complet" -ForegroundColor White
    Write-Host "   - $distArchive ($distSize MB) - Fichiers de production" -ForegroundColor White
    
    Write-Host "`n📋 Options de partage:" -ForegroundColor Cyan
    Write-Host "   1. Développeurs: Partagez $sourceArchive" -ForegroundColor White
    Write-Host "   2. Hébergement web: Utilisez le contenu de $distArchive" -ForegroundColor White
    Write-Host "   3. Démo rapide: Consultez DEPLOYMENT.md pour les options d'hébergement gratuit" -ForegroundColor White
    
} else {
    Write-Host "❌ Échec du build. Vérifiez les erreurs ci-dessus." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Script terminé!" -ForegroundColor Green
