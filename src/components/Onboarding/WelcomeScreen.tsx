import React from 'react';
import { Building2, Leaf, TrendingUp, Target } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Questionnaire adaptatif',
      description: 'Questions personnalisées selon votre secteur d\'activité',
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Calcul précis',
      description: 'Méthodes de calcul basées sur les standards internationaux',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Analyse comparative',
      description: 'Comparez vos résultats aux benchmarks de votre secteur',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Plan d\'action',
      description: 'Recommandations personnalisées pour réduire vos émissions',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Leaf className="w-10 h-10 text-primary-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calculateur d'Empreinte Carbone
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mesurez, analysez et réduisez l'empreinte carbone de votre entreprise 
            avec notre outil complet et adapté à votre secteur d'activité.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Commencer l'évaluation
            </button>
            
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">⏱️</span>
              <span>15-20 minutes</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Process Overview */}
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comment ça fonctionne ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Questionnaire</h3>
              <p className="text-sm text-gray-600">
                Répondez aux questions sur vos consommations énergétiques, 
                transports, déchets et achats
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Calcul</h3>
              <p className="text-sm text-gray-600">
                Notre algorithme calcule automatiquement vos émissions 
                selon les facteurs d'émission officiels
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Recommandations</h3>
              <p className="text-sm text-gray-600">
                Recevez un plan d'action personnalisé pour réduire 
                votre impact environnemental
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Méthodologie conforme aux standards
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400">
            <span className="px-3 py-1 bg-gray-100 rounded-full">GHG Protocol</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">ISO 14064</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">ADEME</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">RGPD Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
