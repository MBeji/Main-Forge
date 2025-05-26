export interface Company {
  id: string;
  name: string;
  sector: IndustrySector;
  size: CompanySize;
  location: string;
}

export type IndustrySector = 
  | 'manufacturing'
  | 'services'
  | 'retail'
  | 'construction'
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'finance'
  | 'agriculture'
  | 'transport'
  | 'energy'
  | 'other';

export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise';

export interface EmissionData {
  energy: EnergyData;
  transport: TransportData;
  waste: WasteData;
  purchases: PurchaseData;
  it: ITData;
  realEstate: RealEstateData;
}

export interface EnergyData {
  electricity: number; // kWh
  gas: number; // m³
  fuel: number; // L
  renewablePercentage: number; // %
}

export interface TransportData {
  businessTrips: {
    car: number; // km
    train: number; // km
    plane: number; // km
  };
  commuting: {
    totalEmployees: number;
    averageDistance: number; // km
    carPercentage: number; // %
    publicTransportPercentage: number; // %
  };
  freight: {
    road: number; // tonne.km
    rail: number; // tonne.km
    sea: number; // tonne.km
    air: number; // tonne.km
  };
}

export interface WasteData {
  totalWaste: number; // tonnes
  recyclingRate: number; // %
  organicWaste: number; // tonnes
  hazardousWaste: number; // tonnes
}

export interface PurchaseData {
  rawMaterials: number; // €
  equipment: number; // €
  services: number; // €
  digitalServices: number; // €
}

export interface ITData {
  servers: number;
  computers: number;
  mobileDevices: number;
  cloudServices: number; // €/month
  dataStorage: number; // TB
}

export interface RealEstateData {
  officeSpace: number; // m²
  warehouseSpace: number; // m²
  buildingAge: number; // years
  energyEfficiencyRating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}

export interface EmissionResults {
  totalEmissions: number; // tCO2e
  emissionsByCategory: {
    energy: number;
    transport: number;
    waste: number;
    purchases: number;
    it: number;
    realEstate: number;
  };
  emissionsByScope: {
    scope1: number; // Direct emissions
    scope2: number; // Indirect emissions from energy
    scope3: number; // Other indirect emissions
  };
  benchmarkComparison: {
    industry: number;
    size: number;
    percentile: number;
  };
}

export interface Recommendation {
  id: string;
  category: keyof EmissionData;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  potentialReduction: number; // tCO2e
  estimatedCost: number; // €
  paybackPeriod: number; // months
  priority: number; // 1-5
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  category: keyof EmissionData;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'number' | 'select' | 'multiselect' | 'range' | 'text';
  label: string;
  placeholder?: string;
  unit?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  dependsOn?: {
    questionId: string;
    value: any;
  };
}

export interface FormState {
  currentStep: number;
  company: Partial<Company>;
  emissions: Partial<EmissionData>;
  isCompleted: boolean;
  errors: Record<string, string>;
}

export type FormAction = 
  | { type: 'SET_COMPANY'; payload: Partial<Company> }
  | { type: 'SET_EMISSION_DATA'; payload: { category: keyof EmissionData; data: any } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'COMPLETE_FORM' }
  | { type: 'RESET_FORM' };
