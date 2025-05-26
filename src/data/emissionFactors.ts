// Emission factors in kgCO2e per unit
export const EMISSION_FACTORS = {
  energy: {
    electricity: 0.0571, // kgCO2e/kWh (France 2023)
    gas: 0.227, // kgCO2e/kWh
    fuel: 2.31, // kgCO2e/L
  },
  transport: {
    car: 0.193, // kgCO2e/km
    train: 0.037, // kgCO2e/km
    plane: {
      domestic: 0.230, // kgCO2e/km
      international: 0.195, // kgCO2e/km
    },
    publicTransport: 0.103, // kgCO2e/km
    freight: {
      road: 0.106, // kgCO2e/tonne.km
      rail: 0.028, // kgCO2e/tonne.km
      sea: 0.015, // kgCO2e/tonne.km
      air: 1.540, // kgCO2e/tonne.km
    },
  },
  waste: {
    landfill: 0.7, // kgCO2e/kg
    recycling: 0.1, // kgCO2e/kg
    organic: 0.2, // kgCO2e/kg
    hazardous: 1.5, // kgCO2e/kg
  },
  purchases: {
    rawMaterials: 0.5, // kgCO2e/€
    equipment: 0.3, // kgCO2e/€
    services: 0.15, // kgCO2e/€
    digitalServices: 0.1, // kgCO2e/€
  },
  it: {
    server: 300, // kgCO2e/unit/year
    computer: 80, // kgCO2e/unit/year
    mobileDevice: 25, // kgCO2e/unit/year
    cloudServices: 0.5, // kgCO2e/€/month
    dataStorage: 50, // kgCO2e/TB/year
  },
  realEstate: {
    office: 25, // kgCO2e/m²/year
    warehouse: 15, // kgCO2e/m²/year
    energyRatingMultiplier: {
      A: 0.5,
      B: 0.7,
      C: 0.9,
      D: 1.0,
      E: 1.2,
      F: 1.5,
      G: 2.0,
    },
  },
};

// Industry benchmarks in tCO2e per employee per year
export const INDUSTRY_BENCHMARKS = {
  manufacturing: 8.5,
  services: 3.2,
  retail: 4.1,
  construction: 6.8,
  technology: 2.9,
  healthcare: 5.3,
  education: 2.1,
  finance: 3.5,
  agriculture: 12.3,
  transport: 15.7,
  energy: 45.2,
  other: 4.0,
};

// Company size benchmarks (adjustment factors)
export const SIZE_BENCHMARKS = {
  small: 1.2, // Small companies often have higher per-employee emissions
  medium: 1.0,
  large: 0.8,
  enterprise: 0.7, // Larger companies often have better efficiency
};
