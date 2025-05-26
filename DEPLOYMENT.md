# Guide de Déploiement - Calculateur d'Empreinte Carbone

## 📦 Options de Partage

### Option 1: Partage du Code Source Complet
Pour développeurs qui veulent modifier ou étendre l'application.

**Fichiers à partager:**
- Archive ZIP complète du projet (EmpreinteCarbone-Package.zip)

**Instructions pour l'autre personne:**
1. Installer Node.js (version 18+) depuis https://nodejs.org/
2. Extraire l'archive ZIP
3. Ouvrir un terminal dans le dossier extrait
4. Exécuter `npm install` pour installer les dépendances
5. Exécuter `npm run dev` pour démarrer le serveur de développement
6. Ouvrir http://localhost:3000 dans le navigateur

### Option 2: Déploiement Web Statique
Pour un partage simple via hébergement web.

**Étapes:**
1. Construire l'application: `npm run build`
2. Déployer le contenu du dossier `dist/` sur un serveur web
3. Partager l'URL publique

### Option 3: Hébergement Gratuit (Recommandé)

#### Vercel (Le plus simple)
1. Créer un compte sur https://vercel.com
2. Connecter votre projet GitHub/GitLab
3. Déploiement automatique à chaque commit
4. URL publique gratuite fournie

#### Netlify
1. Créer un compte sur https://netlify.com
2. Glisser-déposer le dossier `dist/` ou connecter Git
3. URL publique gratuite fournie

#### GitHub Pages
1. Pousser le code sur GitHub
2. Activer GitHub Pages dans les paramètres du repository
3. Configuration automatique avec GitHub Actions

## 🚀 Commandes Utiles

### Développement
```bash
npm install          # Installer les dépendances
npm run dev         # Serveur de développement
npm run build       # Construire pour la production
npm run preview     # Prévisualiser la version de production
```

### Production
```bash
npm run build       # Crée le dossier dist/
```

## 📁 Structure des Fichiers de Production

Après `npm run build`, le dossier `dist/` contient:
- `index.html` - Page principale
- `assets/` - Fichiers CSS, JS et images optimisés
- Tous les fichiers nécessaires pour l'hébergement

## 🔧 Configuration Requise

### Minimum:
- Node.js 18+
- npm 8+
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

### Recommandé:
- Node.js 20+
- npm 10+
- VS Code avec extensions TypeScript et Tailwind CSS

## 📝 Notes Importantes

1. **Données**: L'application fonctionne entièrement côté client (pas de base de données)
2. **Sécurité**: Aucune donnée sensible n'est transmise ou stockée
3. **Performance**: Application optimisée avec Vite et Tailwind CSS
4. **Compatibilité**: Fonctionne sur desktop et mobile
5. **Hors ligne**: Pas de fonctionnalité hors ligne (nécessite internet pour les bibliothèques CDN)

## 🛠️ Résolution de Problèmes

### Erreur "npm not found"
- Installer Node.js depuis le site officiel
- Redémarrer le terminal après installation

### Erreur de compilation
- Vérifier la version de Node.js: `node --version`
- Supprimer `node_modules/` et `package-lock.json`
- Réinstaller: `npm install`

### Port 3000 déjà utilisé
- Changer le port: `npm run dev -- --port 3001`
- Ou tuer le processus qui utilise le port 3000

## 📧 Support

Pour toute question ou problème:
1. Vérifier la documentation dans README.md
2. Consulter les logs d'erreur dans la console du navigateur
3. Vérifier que toutes les dépendances sont installées
