import { EmissionData, EmissionResults, Company } from '../types';
import { EMISSION_FACTORS, INDUSTRY_BENCHMARKS, SIZE_BENCHMARKS } from '../data/emissionFactors';

export const calculateEmissions = (
  data: EmissionData,
  company: Company
): EmissionResults => {
  const emissionsByCategory = {
    energy: calculateEnergyEmissions(data.energy),
    transport: calculateTransportEmissions(data.transport),
    waste: calculateWasteEmissions(data.waste),
    purchases: calculatePurchaseEmissions(data.purchases),
    it: calculateITEmissions(data.it),
    realEstate: calculateRealEstateEmissions(data.realEstate),
  };

  const totalEmissions = Object.values(emissionsByCategory).reduce(
    (sum, emissions) => sum + emissions,
    0
  );

  const emissionsByScope = calculateEmissionsByScope(emissionsByCategory, data);

  const benchmarkComparison = calculateBenchmarkComparison(
    totalEmissions,
    company,
    data.transport.commuting.totalEmployees
  );

  return {
    totalEmissions,
    emissionsByCategory,
    emissionsByScope,
    benchmarkComparison,
  };
};

const calculateEnergyEmissions = (energy: any): number => {
  if (!energy) return 0;
  
  const electricityEmissions = (energy.electricity || 0) * EMISSION_FACTORS.energy.electricity;
  const gasEmissions = (energy.gas || 0) * EMISSION_FACTORS.energy.gas;
  const fuelEmissions = (energy.fuel || 0) * EMISSION_FACTORS.energy.fuel;
  
  const totalBeforeRenewable = electricityEmissions + gasEmissions + fuelEmissions;
  const renewableReduction = (energy.renewablePercentage || 0) / 100;
  
  // Apply renewable reduction only to electricity
  const adjustedElectricityEmissions = electricityEmissions * (1 - renewableReduction);
  
  return (adjustedElectricityEmissions + gasEmissions + fuelEmissions) / 1000; // Convert to tonnes
};

const calculateTransportEmissions = (transport: any): number => {
  if (!transport) return 0;
  
  const businessTripsEmissions = 
    (transport.businessTrips?.car || 0) * EMISSION_FACTORS.transport.car +
    (transport.businessTrips?.train || 0) * EMISSION_FACTORS.transport.train +
    (transport.businessTrips?.plane || 0) * EMISSION_FACTORS.transport.plane.international;
  
  const commutingEmissions = calculateCommutingEmissions(transport.commuting);
  
  const freightEmissions = 
    (transport.freight?.road || 0) * EMISSION_FACTORS.transport.freight.road +
    (transport.freight?.rail || 0) * EMISSION_FACTORS.transport.freight.rail +
    (transport.freight?.sea || 0) * EMISSION_FACTORS.transport.freight.sea +
    (transport.freight?.air || 0) * EMISSION_FACTORS.transport.freight.air;
  
  return (businessTripsEmissions + commutingEmissions + freightEmissions) / 1000;
};

const calculateCommutingEmissions = (commuting: any): number => {
  if (!commuting) return 0;
  
  const totalEmployees = commuting.totalEmployees || 0;
  const averageDistance = commuting.averageDistance || 0;
  const carPercentage = (commuting.carPercentage || 0) / 100;
  const publicTransportPercentage = (commuting.publicTransportPercentage || 0) / 100;
  
  // Assume 220 working days per year, round trip
  const annualDistance = averageDistance * 2 * 220;
  
  const carEmissions = totalEmployees * carPercentage * annualDistance * EMISSION_FACTORS.transport.car;
  const publicTransportEmissions = totalEmployees * publicTransportPercentage * annualDistance * EMISSION_FACTORS.transport.publicTransport;
  
  return carEmissions + publicTransportEmissions;
};

const calculateWasteEmissions = (waste: any): number => {
  if (!waste) return 0;
  
  const totalWaste = waste.totalWaste || 0;
  const recyclingRate = (waste.recyclingRate || 0) / 100;
  
  const recycledWaste = totalWaste * recyclingRate;
  const landfillWaste = totalWaste * (1 - recyclingRate);
  
  const recyclingEmissions = recycledWaste * EMISSION_FACTORS.waste.recycling * 1000; // Convert tonnes to kg
  const landfillEmissions = landfillWaste * EMISSION_FACTORS.waste.landfill * 1000;
  const organicEmissions = (waste.organicWaste || 0) * EMISSION_FACTORS.waste.organic * 1000;
  const hazardousEmissions = (waste.hazardousWaste || 0) * EMISSION_FACTORS.waste.hazardous * 1000;
  
  return (recyclingEmissions + landfillEmissions + organicEmissions + hazardousEmissions) / 1000;
};

const calculatePurchaseEmissions = (purchases: any): number => {
  if (!purchases) return 0;
  
  const rawMaterialsEmissions = (purchases.rawMaterials || 0) * EMISSION_FACTORS.purchases.rawMaterials;
  const equipmentEmissions = (purchases.equipment || 0) * EMISSION_FACTORS.purchases.equipment;
  const servicesEmissions = (purchases.services || 0) * EMISSION_FACTORS.purchases.services;
  const digitalServicesEmissions = (purchases.digitalServices || 0) * EMISSION_FACTORS.purchases.digitalServices;
  
  return (rawMaterialsEmissions + equipmentEmissions + servicesEmissions + digitalServicesEmissions) / 1000;
};

const calculateITEmissions = (it: any): number => {
  if (!it) return 0;
  
  const serverEmissions = (it.servers || 0) * EMISSION_FACTORS.it.server;
  const computerEmissions = (it.computers || 0) * EMISSION_FACTORS.it.computer;
  const mobileDeviceEmissions = (it.mobileDevices || 0) * EMISSION_FACTORS.it.mobileDevice;
  const cloudServicesEmissions = (it.cloudServices || 0) * 12 * EMISSION_FACTORS.it.cloudServices;
  const dataStorageEmissions = (it.dataStorage || 0) * EMISSION_FACTORS.it.dataStorage;
  
  return (serverEmissions + computerEmissions + mobileDeviceEmissions + cloudServicesEmissions + dataStorageEmissions) / 1000;
};

const calculateRealEstateEmissions = (realEstate: any): number => {
  if (!realEstate) return 0;
  
  const officeEmissions = (realEstate.officeSpace || 0) * EMISSION_FACTORS.realEstate.office;
  const warehouseEmissions = (realEstate.warehouseSpace || 0) * EMISSION_FACTORS.realEstate.warehouse;
  
  const energyRating = realEstate.energyEfficiencyRating || 'D';
  const multiplier = EMISSION_FACTORS.realEstate.energyRatingMultiplier[energyRating as keyof typeof EMISSION_FACTORS.realEstate.energyRatingMultiplier];
  
  return ((officeEmissions + warehouseEmissions) * multiplier) / 1000;
};

const calculateEmissionsByScope = (emissionsByCategory: any, data: EmissionData) => {
  // Scope 1: Direct emissions (gas, fuel, company vehicles)
  const scope1 = emissionsByCategory.energy * 0.3 + // Rough estimate for gas/fuel portion
    emissionsByCategory.transport * 0.2; // Company vehicles portion
  
  // Scope 2: Indirect emissions from purchased energy
  const scope2 = emissionsByCategory.energy * 0.7; // Electricity portion
  
  // Scope 3: All other indirect emissions
  const scope3 = emissionsByCategory.transport * 0.8 + // Most transport emissions
    emissionsByCategory.waste +
    emissionsByCategory.purchases +
    emissionsByCategory.it +
    emissionsByCategory.realEstate;
  
  return { scope1, scope2, scope3 };
};

const calculateBenchmarkComparison = (
  totalEmissions: number,
  company: Company,
  totalEmployees: number
) => {
  const emissionsPerEmployee = totalEmployees > 0 ? totalEmissions / totalEmployees : 0;
  
  const industryBenchmark = INDUSTRY_BENCHMARKS[company.sector] || INDUSTRY_BENCHMARKS.other;
  const sizeBenchmark = SIZE_BENCHMARKS[company.size] || SIZE_BENCHMARKS.medium;
  
  const adjustedBenchmark = industryBenchmark * sizeBenchmark;
  
  // Calculate percentile (simplified)
  const ratio = emissionsPerEmployee / adjustedBenchmark;
  let percentile = 50;
  
  if (ratio < 0.5) percentile = 10;
  else if (ratio < 0.75) percentile = 25;
  else if (ratio < 1.0) percentile = 40;
  else if (ratio < 1.25) percentile = 60;
  else if (ratio < 1.5) percentile = 75;
  else percentile = 90;
  
  return {
    industry: adjustedBenchmark,
    size: sizeBenchmark,
    percentile,
  };
};

export const formatEmissions = (emissions: number): string => {
  if (emissions < 1) {
    return `${Math.round(emissions * 1000)} kg CO₂e`;
  }
  return `${Math.round(emissions * 10) / 10} t CO₂e`;
};

export const getEmissionTrend = (current: number, benchmark: number): 'low' | 'medium' | 'high' => {
  const ratio = current / benchmark;
  if (ratio < 0.75) return 'low';
  if (ratio < 1.25) return 'medium';
  return 'high';
};
