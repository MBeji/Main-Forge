import { QuestionnaireStep, IndustrySector } from '../types';

export const QUESTIONNAIRE_STEPS: QuestionnaireStep[] = [
  {
    id: 'energy',
    title: 'Consommation énergétique',
    description: 'Renseignez vos consommations d\'énergie annuelles',
    category: 'energy',
    questions: [
      {
        id: 'electricity',
        type: 'number',
        label: 'Consommation d\'électricité annuelle',
        unit: 'kWh',
        required: true,
        helpText: 'Consultez vos factures d\'électricité des 12 derniers mois',
        min: 0,
      },
      {
        id: 'gas',
        type: 'number',
        label: 'Consommation de gaz naturel annuelle',
        unit: 'm³',
        required: true,
        helpText: 'Gaz utilisé pour le chauffage, la production d\'eau chaude, etc.',
        min: 0,
      },
      {
        id: 'fuel',
        type: 'number',
        label: 'Consommation de carburant (fioul, essence, diesel)',
        unit: 'L',
        required: false,
        helpText: 'Carburants utilisés pour les équipements sur site',
        min: 0,
      },
      {
        id: 'renewablePercentage',
        type: 'range',
        label: 'Pourcentage d\'énergie renouvelable',
        unit: '%',
        required: true,
        min: 0,
        max: 100,
        step: 5,
        helpText: 'Part d\'énergie verte dans votre mix énergétique',
      },
    ],
  },
  {
    id: 'transport',
    title: 'Transport et mobilité',
    description: 'Évaluez les émissions liées aux déplacements',
    category: 'transport',
    questions: [
      {
        id: 'businessTrips.car',
        type: 'number',
        label: 'Déplacements professionnels en voiture',
        unit: 'km/an',
        required: true,
        helpText: 'Distance totale parcourue par tous les employés',
        min: 0,
      },
      {
        id: 'businessTrips.train',
        type: 'number',
        label: 'Déplacements professionnels en train',
        unit: 'km/an',
        required: true,
        min: 0,
      },
      {
        id: 'businessTrips.plane',
        type: 'number',
        label: 'Déplacements professionnels en avion',
        unit: 'km/an',
        required: true,
        min: 0,
      },
      {
        id: 'commuting.totalEmployees',
        type: 'number',
        label: 'Nombre total d\'employés',
        required: true,
        min: 1,
      },
      {
        id: 'commuting.averageDistance',
        type: 'number',
        label: 'Distance moyenne domicile-travail',
        unit: 'km (aller simple)',
        required: true,
        min: 0,
      },
      {
        id: 'commuting.carPercentage',
        type: 'range',
        label: 'Pourcentage d\'employés utilisant la voiture',
        unit: '%',
        required: true,
        min: 0,
        max: 100,
        step: 5,
      },
      {
        id: 'commuting.publicTransportPercentage',
        type: 'range',
        label: 'Pourcentage d\'employés utilisant les transports en commun',
        unit: '%',
        required: true,
        min: 0,
        max: 100,
        step: 5,
      },
    ],
  },
  {
    id: 'waste',
    title: 'Gestion des déchets',
    description: 'Quantifiez vos déchets et leur traitement',
    category: 'waste',
    questions: [
      {
        id: 'totalWaste',
        type: 'number',
        label: 'Quantité totale de déchets produits',
        unit: 'tonnes/an',
        required: true,
        helpText: 'Tous types de déchets confondus',
        min: 0,
      },
      {
        id: 'recyclingRate',
        type: 'range',
        label: 'Taux de recyclage',
        unit: '%',
        required: true,
        min: 0,
        max: 100,
        step: 5,
        helpText: 'Pourcentage de déchets recyclés ou valorisés',
      },
      {
        id: 'organicWaste',
        type: 'number',
        label: 'Déchets organiques',
        unit: 'tonnes/an',
        required: false,
        min: 0,
      },
      {
        id: 'hazardousWaste',
        type: 'number',
        label: 'Déchets dangereux',
        unit: 'tonnes/an',
        required: false,
        helpText: 'Produits chimiques, batteries, équipements électroniques',
        min: 0,
      },
    ],
  },
  {
    id: 'purchases',
    title: 'Achats et approvisionnements',
    description: 'Évaluez l\'impact de vos achats',
    category: 'purchases',
    questions: [
      {
        id: 'rawMaterials',
        type: 'number',
        label: 'Achats de matières premières',
        unit: '€/an',
        required: true,
        min: 0,
      },
      {
        id: 'equipment',
        type: 'number',
        label: 'Achats d\'équipements et machines',
        unit: '€/an',
        required: true,
        min: 0,
      },
      {
        id: 'services',
        type: 'number',
        label: 'Achats de services',
        unit: '€/an',
        required: true,
        helpText: 'Services de maintenance, conseil, sous-traitance',
        min: 0,
      },
      {
        id: 'digitalServices',
        type: 'number',
        label: 'Services numériques',
        unit: '€/an',
        required: false,
        helpText: 'Logiciels, licences, services cloud',
        min: 0,
      },
    ],
  },
  {
    id: 'it',
    title: 'Systèmes informatiques',
    description: 'Inventaire de votre parc informatique',
    category: 'it',
    questions: [
      {
        id: 'servers',
        type: 'number',
        label: 'Nombre de serveurs',
        required: true,
        min: 0,
      },
      {
        id: 'computers',
        type: 'number',
        label: 'Nombre d\'ordinateurs',
        required: true,
        min: 0,
      },
      {
        id: 'mobileDevices',
        type: 'number',
        label: 'Nombre d\'appareils mobiles',
        required: true,
        helpText: 'Smartphones, tablettes fournis par l\'entreprise',
        min: 0,
      },
      {
        id: 'cloudServices',
        type: 'number',
        label: 'Coût mensuel des services cloud',
        unit: '€/mois',
        required: false,
        min: 0,
      },
      {
        id: 'dataStorage',
        type: 'number',
        label: 'Stockage de données',
        unit: 'TB',
        required: false,
        min: 0,
      },
    ],
  },
  {
    id: 'realEstate',
    title: 'Immobilier et espaces',
    description: 'Caractéristiques de vos locaux',
    category: 'realEstate',
    questions: [
      {
        id: 'officeSpace',
        type: 'number',
        label: 'Surface de bureaux',
        unit: 'm²',
        required: true,
        min: 0,
      },
      {
        id: 'warehouseSpace',
        type: 'number',
        label: 'Surface d\'entrepôts/ateliers',
        unit: 'm²',
        required: false,
        min: 0,
      },
      {
        id: 'buildingAge',
        type: 'number',
        label: 'Âge moyen des bâtiments',
        unit: 'années',
        required: true,
        min: 0,
        max: 150,
      },
      {
        id: 'energyEfficiencyRating',
        type: 'select',
        label: 'Classe énergétique des bâtiments',
        required: true,
        options: [
          { value: 'A', label: 'A (Très performant)' },
          { value: 'B', label: 'B (Performant)' },
          { value: 'C', label: 'C (Assez performant)' },
          { value: 'D', label: 'D (Peu performant)' },
          { value: 'E', label: 'E (Peu performant)' },
          { value: 'F', label: 'F (Passoire énergétique)' },
          { value: 'G', label: 'G (Passoire énergétique)' },
        ],
      },
    ],
  },
];

// Sector-specific question adaptations
export const getSectorSpecificQuestions = (sector: IndustrySector): QuestionnaireStep[] => {
  const baseSteps = [...QUESTIONNAIRE_STEPS];
  
  switch (sector) {
    case 'manufacturing':
      // Add manufacturing-specific questions
      baseSteps[0].questions.push({
        id: 'industrialProcesses',
        type: 'number',
        label: 'Consommation énergétique des processus industriels',
        unit: 'kWh/an',
        required: true,
        min: 0,
      });
      break;
      
    case 'retail':
      // Add retail-specific questions
      baseSteps[0].questions.push({
        id: 'refrigeration',
        type: 'number',
        label: 'Consommation des systèmes de réfrigération',
        unit: 'kWh/an',
        required: false,
        min: 0,
      });
      break;
      
    case 'transport':
      // Emphasize transport questions
      baseSteps[1].questions.unshift({
        id: 'fleetSize',
        type: 'number',
        label: 'Taille de la flotte de véhicules',
        required: true,
        min: 0,
      });
      break;
      
    default:
      break;
  }
  
  return baseSteps;
};
