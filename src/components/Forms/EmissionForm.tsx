import React from 'react';
import { QuestionnaireStep } from '../../types';
import { HelpCircle } from 'lucide-react';

interface EmissionFormProps {
  step: QuestionnaireStep;
  formState: any;
}

export const EmissionForm: React.FC<EmissionFormProps> = ({ step, formState }) => {
  const { state, setEmissionData } = formState;
  const { emissions, errors } = state;
  
  const categoryData = emissions[step.category] || {};

  const handleChange = (questionId: string, value: any) => {
    // Handle nested object paths like "businessTrips.car"
    const keys = questionId.split('.');
    let updatedData = { ...categoryData };
    
    if (keys.length === 1) {
      updatedData[keys[0]] = value;
    } else {
      // Handle nested objects
      if (!updatedData[keys[0]]) {
        updatedData[keys[0]] = {};
      }
      updatedData[keys[0]][keys[1]] = value;
    }
    
    setEmissionData(step.category, updatedData);
  };

  const getValue = (questionId: string) => {
    const keys = questionId.split('.');
    if (keys.length === 1) {
      return categoryData[keys[0]] || '';
    } else {
      return categoryData[keys[0]]?.[keys[1]] || '';
    }
  };

  const renderQuestion = (question: any) => {
    const value = getValue(question.id);
    const hasError = errors[question.id];

    switch (question.type) {
      case 'number':
        return (
          <div key={question.id} className="space-y-2">
            <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                id={question.id}
                type="number"
                value={value}
                onChange={(e) => handleChange(question.id, parseFloat(e.target.value) || 0)}
                placeholder={question.placeholder}
                min={question.min}
                max={question.max}
                step={question.step}
                className={`input-field ${question.unit ? 'pr-16' : ''} ${hasError ? 'border-red-300 focus:ring-red-500' : ''}`}
              />
              {question.unit && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">{question.unit}</span>
                </div>
              )}
            </div>
            {question.helpText && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{question.helpText}</span>
              </div>
            )}
            {hasError && (
              <p className="text-sm text-red-600">{hasError}</p>
            )}
          </div>
        );

      case 'range':
        return (
          <div key={question.id} className="space-y-2">
            <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              <input
                id={question.id}
                type="range"
                value={value}
                onChange={(e) => handleChange(question.id, parseInt(e.target.value))}
                min={question.min}
                max={question.max}
                step={question.step}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{question.min}{question.unit}</span>
                <span className="font-medium text-primary-600">{value}{question.unit}</span>
                <span>{question.max}{question.unit}</span>
              </div>
            </div>
            {question.helpText && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{question.helpText}</span>
              </div>
            )}
            {hasError && (
              <p className="text-sm text-red-600">{hasError}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="space-y-2">
            <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={question.id}
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className={`input-field ${hasError ? 'border-red-300 focus:ring-red-500' : ''}`}
            >
              <option value="">Sélectionnez une option</option>
              {question.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {question.helpText && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{question.helpText}</span>
              </div>
            )}
            {hasError && (
              <p className="text-sm text-red-600">{hasError}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={question.id} className="space-y-2">
            <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={question.id}
              type="text"
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className={`input-field ${hasError ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {question.helpText && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{question.helpText}</span>
              </div>
            )}
            {hasError && (
              <p className="text-sm text-red-600">{hasError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {step.questions.map(renderQuestion)}
      
      {/* Category-specific tips */}
      <div className="bg-gray-50 rounded-lg p-4 mt-8">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          💡 Conseils pour cette section
        </h3>
        <div className="text-sm text-gray-600">
          {step.category === 'energy' && (
            <ul className="space-y-1">
              <li>• Consultez vos factures des 12 derniers mois pour plus de précision</li>
              <li>• N'oubliez pas d'inclure tous les sites de votre entreprise</li>
              <li>• Les énergies renouvelables réduisent significativement votre empreinte</li>
            </ul>
          )}
          {step.category === 'transport' && (
            <ul className="space-y-1">
              <li>• Incluez tous les déplacements professionnels (missions, formations, etc.)</li>
              <li>• Pensez aux trajets domicile-travail de vos employés</li>
              <li>• Le transport de marchandises peut représenter une part importante</li>
            </ul>
          )}
          {step.category === 'waste' && (
            <ul className="space-y-1">
              <li>• Comptabilisez tous types de déchets (papier, électronique, organique)</li>
              <li>• Un bon tri et recyclage réduisent considérablement les émissions</li>
              <li>• Contactez votre prestataire de collecte pour les données précises</li>
            </ul>
          )}
          {step.category === 'purchases' && (
            <ul className="space-y-1">
              <li>• Incluez tous vos achats : équipements, fournitures, services</li>
              <li>• Les achats représentent souvent la plus grande part des émissions</li>
              <li>• Privilégiez les fournisseurs locaux et éco-responsables</li>
            </ul>
          )}
          {step.category === 'it' && (
            <ul className="space-y-1">
              <li>• N'oubliez pas les équipements en fin de vie cette année</li>
              <li>• Les services cloud ont un impact variable selon le fournisseur</li>
              <li>• L'optimisation de l'usage réduit la consommation énergétique</li>
            </ul>
          )}
          {step.category === 'realEstate' && (
            <ul className="space-y-1">
              <li>• Incluez tous vos locaux : bureaux, entrepôts, ateliers</li>
              <li>• La classe énergétique influence fortement les émissions</li>
              <li>• Les travaux de rénovation peuvent réduire l'impact de 30 à 50%</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
