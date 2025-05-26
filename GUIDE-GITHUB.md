# 📋 Guide Complet - Déploiement GitHub 

## 🔧 Prérequis

### 1. Installation de Git
**Télécharger Git depuis:** https://git-scm.com/download/win
- Choisir "64-bit Git for Windows Setup"
- Installation avec paramètres par défaut
- Redémarrer le terminal après installation

### 2. Compte GitHub
- Créer un compte sur https://github.com (gratuit)
- Vérifier votre email

## 🚀 Étapes de Déploiement

### Étape 1: Initialisation Git Local
```powershell
# Dans le dossier EmpreinteCarbone
git init
git branch -M main
```

### Étape 2: Configuration Git
```powershell
git config user.name "Votre Nom"
git config user.email "votre@email.com"
```

### Étape 3: Premier Commit
```powershell
git add .
git commit -m "feat: Calculateur d'empreinte carbone React complet

- Questionnaire adaptatif par secteur d'activité
- Calculs en temps réel avec facteurs ADEME français
- Dashboard interactif avec Chart.js
- Recommandations personnalisées avec ROI
- Design responsive Tailwind CSS
- Architecture React + TypeScript + Vite
- Documentation complète et guides de déploiement

Technologies: React 18, TypeScript, Vite, Tailwind CSS, Chart.js"
```

### Étape 4: Création Repository GitHub
1. Aller sur https://github.com
2. Cliquer sur "New repository" (bouton vert)
3. **Nom du repository:** `calculateur-empreinte-carbone`
4. **Description:** `Calculateur d'empreinte carbone corporate avec questionnaires adaptatifs`
5. **Public** ✅ (pour GitHub Pages gratuit)
6. **NE PAS** cocher "Add a README file" (on en a déjà un)
7. Cliquer "Create repository"

### Étape 5: Connexion avec GitHub
```powershell
# Remplacer USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/USERNAME/calculateur-empreinte-carbone.git
git push -u origin main
```

### Étape 6: Activation GitHub Pages (Optionnel)
1. Dans votre repository GitHub > Settings
2. Pages (dans le menu de gauche)
3. Source: "Deploy from a branch"
4. Branch: "main" / "(root)"
5. Save
6. **URL publique:** `https://USERNAME.github.io/calculateur-empreinte-carbone`

## 🎯 Résultat Final

### Repository GitHub créé avec:
- ✅ Code source complet React + TypeScript
- ✅ Documentation complète (3 guides)
- ✅ Scripts de packaging automatisés
- ✅ Configuration Vite + Tailwind CSS optimisée
- ✅ Tests et exemples inclus

### Options de démonstration:
1. **GitHub Pages** (gratuit): Site web public automatique
2. **Vercel/Netlify**: Déploiement en 2 minutes
3. **Local**: Clone + npm install + npm run dev

## 🔄 Commandes Git Utiles

### Mise à jour du code:
```powershell
git add .
git commit -m "Description des changements"
git push
```

### Récupération du code ailleurs:
```powershell
git clone https://github.com/USERNAME/calculateur-empreinte-carbone.git
cd calculateur-empreinte-carbone
npm install
npm run dev
```

### Synchronisation:
```powershell
git pull    # Récupérer les derniers changements
git status  # Voir l'état des fichiers
git log     # Historique des commits
```

## 🌐 URLs Importantes

- **Repository GitHub:** `https://github.com/USERNAME/calculateur-empreinte-carbone`
- **GitHub Pages:** `https://USERNAME.github.io/calculateur-empreinte-carbone`
- **Clone URL:** `https://github.com/USERNAME/calculateur-empreinte-carbone.git`

## 🎉 Avantages GitHub

1. **Sauvegarde cloud** automatique
2. **Historique complet** des modifications
3. **Collaboration** possible avec d'autres développeurs
4. **Issues et discussions** pour le feedback
5. **GitHub Pages** pour hébergement gratuit
6. **Actions CI/CD** pour déploiement automatique

---

**Votre calculateur d'empreinte carbone sera accessible publiquement et facilement partageable ! 🚀**
