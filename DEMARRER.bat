@echo off
echo.
echo ========================================
echo  Calculateur d'Empreinte Carbone
echo  Demarrage automatique
echo ========================================
echo.

REM Verifier si Node.js est installe
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js non trouve!
    echo.
    echo 📥 Veuillez installer Node.js depuis:
    echo    https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detecte
echo.

REM Verifier si les dependances sont installees
if not exist "node_modules" (
    echo 📦 Installation des dependances...
    echo    Cela peut prendre 2-3 minutes...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation
        pause
        exit /b 1
    )
    echo ✅ Dependances installees
    echo.
)

echo 🚀 Demarrage du serveur de developpement...
echo.
echo    L'application s'ouvrira sur:
echo    http://localhost:3000
echo.
echo    Appuyez sur Ctrl+C pour arreter le serveur
echo.

REM Demarrer le serveur
npm run dev

pause
