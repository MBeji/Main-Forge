import React from 'react';
import { Download, RotateCcw, Share2, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { EmissionsChart } from './EmissionsChart';
import { ActionPlan } from './ActionPlan';
import { formatEmissions, getEmissionTrend } from '../../utils/calculations';

interface ResultsOverviewProps {
  company: any;
  emissions: any;
  results: any;
  onStartOver: () => void;
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({
  company,
  emissions,
  results,
  onStartOver,
}) => {
  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur lors du calcul
          </h2>
          <p className="text-gray-600 mb-4">
            Une erreur s'est produite lors du calcul de votre empreinte carbone.
          </p>
          <button onClick={onStartOver} className="btn-primary">
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const { totalEmissions, emissionsByCategory, emissionsByScope, benchmarkComparison } = results;
  const trend = getEmissionTrend(totalEmissions, benchmarkComparison.industry * emissions.transport?.commuting?.totalEmployees || 1);

  const getTrendIcon = () => {
    switch (trend) {
      case 'low':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'high':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getTrendMessage = () => {
    switch (trend) {
      case 'low':
        return 'Votre empreinte carbone est inférieure à la moyenne de votre secteur. Félicitations !';
      case 'high':
        return 'Votre empreinte carbone est supérieure à la moyenne. Des améliorations sont possibles.';
      default:
        return 'Votre empreinte carbone est dans la moyenne de votre secteur.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Résultats de votre bilan carbone
              </h1>
              <p className="text-gray-600 mt-1">
                {company?.name} • {company?.sector}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="btn-secondary flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </button>
              <button className="btn-secondary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </button>
              <button onClick={onStartOver} className="btn-secondary flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nouveau calcul
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Emissions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Empreinte carbone totale
              </h3>
              {getTrendIcon()}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {formatEmissions(totalEmissions)}
            </div>
            <div className={`text-sm px-3 py-1 rounded-full inline-flex items-center ${getTrendColor()}`}>
              {getTrendMessage()}
            </div>
          </div>

          {/* Per Employee */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Par employé
            </h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatEmissions(totalEmissions / (emissions.transport?.commuting?.totalEmployees || 1))}
            </div>
            <div className="text-sm text-gray-600">
              Benchmark secteur : {formatEmissions(benchmarkComparison.industry)}
            </div>
          </div>

          {/* Percentile */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Position sectorielle
            </h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {benchmarkComparison.percentile}e percentile
            </div>
            <div className="text-sm text-gray-600">
              {benchmarkComparison.percentile <= 25 
                ? 'Excellent performance'
                : benchmarkComparison.percentile <= 50
                ? 'Bonne performance'
                : benchmarkComparison.percentile <= 75
                ? 'Performance moyenne'
                : 'Marge d\'amélioration'
              }
            </div>
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EmissionsChart
            emissionsByCategory={emissionsByCategory}
            emissionsByScope={emissionsByScope}
          />
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par scope
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Scope 1 - Émissions directes</div>
                  <div className="text-sm text-gray-600">Combustion sur site, véhicules de fonction</div>
                </div>
                <div className="font-bold text-red-600">
                  {formatEmissions(emissionsByScope.scope1)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Scope 2 - Électricité</div>
                  <div className="text-sm text-gray-600">Consommation d'électricité</div>
                </div>
                <div className="font-bold text-orange-600">
                  {formatEmissions(emissionsByScope.scope2)}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Scope 3 - Émissions indirectes</div>
                  <div className="text-sm text-gray-600">Achats, transports, déchets</div>
                </div>
                <div className="font-bold text-blue-600">
                  {formatEmissions(emissionsByScope.scope3)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Répartition détaillée par catégorie
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(emissionsByCategory).map(([category, value]) => {
              const percentage = ((value as number) / totalEmissions * 100).toFixed(1);
              const categoryLabels: Record<string, string> = {
                energy: 'Énergie',
                transport: 'Transport',
                waste: 'Déchets',
                purchases: 'Achats',
                it: 'Informatique',
                realEstate: 'Immobilier',
              };
              
              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{categoryLabels[category]}</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {formatEmissions(value as number)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Plan */}
        <ActionPlan
          emissionsByCategory={emissionsByCategory}
          company={company}
          totalEmissions={totalEmissions}
        />
      </div>
    </div>
  );
};
