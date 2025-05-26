# 🌱 Empreinte Carbone - Calculateur d'empreinte carbone d'entreprise

Une application React moderne pour calculer et analyser l'empreinte carbone des entreprises avec des questionnaires adaptatifs par secteur d'activité.

## ✨ Fonctionnalités

- **Questionnaire adaptatif** : Questions personnalisées selon le secteur d'activité
- **Calcul précis** : Méthodes de calcul basées sur les standards internationaux (GHG Protocol, ISO 14064)
- **Analyse comparative** : Comparaison avec les benchmarks sectoriels
- **Dashboard interactif** : Visualisations graphiques des résultats
- **Plan d'action personnalisé** : Recommandations pour réduire l'empreinte carbone
- **Interface moderne** : Design responsive avec Tailwind CSS

## 🏗️ Architecture technique

### Stack technologique
- **Framework** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : Tailwind CSS
- **Charts** : Chart.js + react-chartjs-2
- **Icons** : Lucide React
- **State Management** : React Hooks (useReducer)

### Structure du projet
```
src/
├── components/
│   ├── Dashboard/          # Composants de résultats et analyse
│   │   ├── ResultsOverview.tsx
│   │   ├── EmissionsChart.tsx
│   │   └── ActionPlan.tsx
│   ├── Forms/              # Composants de formulaires
│   │   ├── DynamicForm.tsx
│   │   ├── CompanyForm.tsx
│   │   └── EmissionForm.tsx
│   ├── Onboarding/         # Écran d'accueil
│   │   └── WelcomeScreen.tsx
│   └── Shared/             # Composants réutilisables
│       ├── LoadingSpinner.tsx
│       ├── ProgressBar.tsx
│       └── StepperNavigation.tsx
├── data/                   # Données statiques
│   ├── emissionFactors.ts  # Facteurs d'émission
│   └── questionnaire.ts    # Configuration du questionnaire
├── hooks/                  # Hooks personnalisés
│   └── useFormState.ts     # Gestion de l'état du formulaire
├── types/                  # Types TypeScript
│   └── index.ts
├── utils/                  # Utilitaires
│   └── calculations.ts     # Moteur de calcul des émissions
└── App.tsx                 # Composant racine
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd EmpreinteCarbone

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour la production
npm run build
```

## 📋 Méthodologie de calcul

### Catégories d'émissions
1. **Énergie** : Électricité, gaz, carburants
2. **Transport** : Déplacements professionnels, trajets domicile-travail, fret
3. **Déchets** : Production et traitement des déchets
4. **Achats** : Matières premières, équipements, services
5. **Informatique** : Serveurs, ordinateurs, cloud
6. **Immobilier** : Bureaux, entrepôts selon leur efficacité énergétique

### Standards de référence
- **GHG Protocol** : Classification Scope 1, 2, 3
- **ISO 14064** : Standards de quantification des émissions
- **Base Carbone ADEME** : Facteurs d'émission français

### Facteurs d'émission (exemples)
- Électricité France : 0.0571 kg CO₂e/kWh
- Gaz naturel : 0.227 kg CO₂e/kWh
- Transport voiture : 0.193 kg CO₂e/km
- Transport avion international : 0.195 kg CO₂e/km

## 🎯 Utilisation

### 1. Informations entreprise
- Nom de l'entreprise
- Secteur d'activité (11 secteurs disponibles)
- Taille de l'entreprise
- Localisation

### 2. Questionnaire adaptatif
Le questionnaire s'adapte automatiquement au secteur sélectionné :
- **Industrie** : Questions sur les processus industriels
- **Commerce** : Focus sur la réfrigération et les stocks
- **Transport** : Emphasis sur la flotte de véhicules
- **Services** : Questions adaptées aux activités tertiaires

### 3. Résultats et analyse
- **Empreinte totale** en tonnes CO₂ équivalent
- **Répartition par catégorie** et par scope GHG
- **Comparaison sectorielle** avec percentile de performance
- **Émissions par employé** vs benchmark industrie

### 4. Plan d'action
Recommandations personnalisées avec :
- Impact environnemental estimé
- Coût d'investissement
- Retour sur investissement
- Niveau de difficulté de mise en œuvre

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` :
```env
VITE_APP_TITLE=Empreinte Carbone
VITE_API_URL=https://api.example.com
```

### Personnalisation des facteurs d'émission
Les facteurs d'émission peuvent être ajustés dans `src/data/emissionFactors.ts` selon :
- La localisation géographique
- Les sources d'énergie locales
- Les réglementations spécifiques

## 📊 Benchmarks sectoriels

| Secteur | Émissions moyennes (t CO₂e/employé/an) |
|---------|------------------------------------------|
| Industrie manufacturière | 8.5 |
| Services | 3.2 |
| Commerce de détail | 4.1 |
| Construction | 6.8 |
| Technologies | 2.9 |
| Santé | 5.3 |
| Éducation | 2.1 |
| Finance | 3.5 |
| Agriculture | 12.3 |
| Transport | 15.7 |
| Énergie | 45.2 |

## 🛡️ Sécurité et confidentialité

- **RGPD compliant** : Aucune donnée personnelle stockée
- **Calculs locaux** : Tous les calculs sont effectués côté client
- **Pas de tracking** : Aucun suivi des utilisateurs
- **Open source** : Code source transparent et auditable

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 📧 Contact

Pour toute question ou suggestion :
- Email : contact@example.com
- Issues : [GitHub Issues](https://github.com/username/empreinte-carbone/issues)

## 🙏 Remerciements

- [ADEME](https://www.ademe.fr/) pour les facteurs d'émission
- [GHG Protocol](https://ghgprotocol.org/) pour la méthodologie
- Communauté React et open source

---

*Construit avec ❤️ pour un avenir plus durable*
