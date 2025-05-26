import React from 'react';
import { Target, TrendingDown, Clock, DollarSign, Zap, Lightbulb } from 'lucide-react';
import { Recommendation } from '../../types';

interface ActionPlanProps {
  emissionsByCategory: Record<string, number>;
  company: any;
  totalEmissions: number;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({
  emissionsByCategory,
  company,
  totalEmissions,
}) => {
  // Generate recommendations based on emissions data
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Energy recommendations
    if (emissionsByCategory.energy > totalEmissions * 0.2) {
      recommendations.push({
        id: 'led-lighting',
        category: 'energy',
        title: 'Passage à l\'éclairage LED',
        description: 'Remplacer tous les éclairages par des LED pour réduire la consommation électrique de 50-70%',
        impact: 'medium',
        difficulty: 'easy',
        potentialReduction: emissionsByCategory.energy * 0.15,
        estimatedCost: 5000,
        paybackPeriod: 18,
        priority: 4,
      });

      recommendations.push({
        id: 'renewable-energy',
        category: 'energy',
        title: 'Contrat d\'électricité verte',
        description: 'Souscrire à un contrat d\'électricité 100% renouvelable',
        impact: 'high',
        difficulty: 'easy',
        potentialReduction: emissionsByCategory.energy * 0.7,
        estimatedCost: 0,
        paybackPeriod: 0,
        priority: 5,
      });
    }

    // Transport recommendations
    if (emissionsByCategory.transport > totalEmissions * 0.25) {
      recommendations.push({
        id: 'remote-work',
        category: 'transport',
        title: 'Télétravail 2 jours par semaine',
        description: 'Mettre en place une politique de télétravail pour réduire les déplacements domicile-travail',
        impact: 'medium',
        difficulty: 'medium',
        potentialReduction: emissionsByCategory.transport * 0.4,
        estimatedCost: 2000,
        paybackPeriod: 6,
        priority: 4,
      });

      recommendations.push({
        id: 'electric-vehicles',
        category: 'transport',
        title: 'Véhicules électriques',
        description: 'Remplacer progressivement la flotte par des véhicules électriques',
        impact: 'high',
        difficulty: 'hard',
        potentialReduction: emissionsByCategory.transport * 0.6,
        estimatedCost: 25000,
        paybackPeriod: 48,
        priority: 3,
      });
    }

    // Waste recommendations
    if (emissionsByCategory.waste > totalEmissions * 0.1) {
      recommendations.push({
        id: 'waste-reduction',
        category: 'waste',
        title: 'Programme de réduction des déchets',
        description: 'Mettre en place un système de tri sélectif et réduire les déchets à la source',
        impact: 'medium',
        difficulty: 'medium',
        potentialReduction: emissionsByCategory.waste * 0.5,
        estimatedCost: 3000,
        paybackPeriod: 12,
        priority: 3,
      });
    }

    // IT recommendations
    if (emissionsByCategory.it > totalEmissions * 0.15) {
      recommendations.push({
        id: 'server-optimization',
        category: 'it',
        title: 'Optimisation des serveurs',
        description: 'Virtualiser les serveurs et optimiser leur utilisation',
        impact: 'medium',
        difficulty: 'medium',
        potentialReduction: emissionsByCategory.it * 0.3,
        estimatedCost: 8000,
        paybackPeriod: 24,
        priority: 3,
      });
    }

    // Purchases recommendations
    if (emissionsByCategory.purchases > totalEmissions * 0.3) {
      recommendations.push({
        id: 'local-suppliers',
        category: 'purchases',
        title: 'Fournisseurs locaux et éco-responsables',
        description: 'Privilégier les fournisseurs locaux et certifiés environnementalement',
        impact: 'high',
        difficulty: 'medium',
        potentialReduction: emissionsByCategory.purchases * 0.25,
        estimatedCost: 0,
        paybackPeriod: 0,
        priority: 4,
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  };

  const recommendations = generateRecommendations();
  const totalPotentialReduction = recommendations.reduce((sum, rec) => sum + rec.potentialReduction, 0);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingDown className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'low': return <Zap className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Plan d'action personnalisé
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Potentiel de réduction</div>
            <div className="text-xl font-bold text-green-600">
              -{(totalPotentialReduction).toFixed(1)} t CO₂e
            </div>
            <div className="text-sm text-gray-500">
              ({((totalPotentialReduction / totalEmissions) * 100).toFixed(1)}% de réduction)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-900">
              {recommendations.filter(r => r.difficulty === 'easy').length}
            </div>
            <div className="text-sm text-green-700">Actions faciles</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-yellow-900">
              {Math.round(recommendations.reduce((sum, r) => sum + r.paybackPeriod, 0) / recommendations.length)}
            </div>
            <div className="text-sm text-yellow-700">Mois de retour moyen</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-900">
              {(recommendations.reduce((sum, r) => sum + r.estimatedCost, 0) / 1000).toFixed(0)}k€
            </div>
            <div className="text-sm text-blue-700">Investissement total</div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={recommendation.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${getImpactColor(recommendation.impact)}`}>
                    {getImpactIcon(recommendation.impact)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {recommendation.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(recommendation.impact)}`}>
                        Impact {recommendation.impact === 'high' ? 'fort' : recommendation.impact === 'medium' ? 'moyen' : 'faible'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                        {recommendation.difficulty === 'easy' ? 'Facile' : recommendation.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {recommendation.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Réduction potentielle:</span>
                    <div className="text-green-600 font-bold">
                      -{recommendation.potentialReduction.toFixed(1)} t CO₂e
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Coût estimé:</span>
                    <div className="text-gray-900 font-bold">
                      {recommendation.estimatedCost === 0 ? 'Gratuit' : `${recommendation.estimatedCost.toLocaleString()}€`}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Retour sur investissement:</span>
                    <div className="text-gray-900 font-bold">
                      {recommendation.paybackPeriod === 0 ? 'Immédiat' : `${recommendation.paybackPeriod} mois`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className="text-2xl font-bold text-primary-600">
                  #{index + 1}
                </div>
                <div className="text-xs text-gray-500">
                  Priorité {recommendation.priority}/5
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">
          🚀 Prochaines étapes recommandées
        </h3>
        <div className="space-y-3 text-sm text-primary-800">
          <div className="flex items-start space-x-2">
            <span className="font-bold">1.</span>
            <span>Commencez par les actions gratuites ou à faible coût pour obtenir des résultats rapides</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-bold">2.</span>
            <span>Sensibilisez vos équipes aux enjeux environnementaux et impliquez-les dans la démarche</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-bold">3.</span>
            <span>Établissez un planning de mise en œuvre avec des objectifs mesurables</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-bold">4.</span>
            <span>Refaites un bilan dans 12 mois pour mesurer vos progrès</span>
          </div>
        </div>
      </div>
    </div>
  );
};
