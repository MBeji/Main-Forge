import React from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { StepperNavigation } from '../Shared/StepperNavigation';
import { ProgressBar } from '../Shared/ProgressBar';
import { CompanyForm } from './CompanyForm';
import { EmissionForm } from './EmissionForm';
import { getSectorSpecificQuestions } from '../../data/questionnaire';
import { EmissionData, IndustrySector } from '../../types';

interface DynamicFormProps {
  formState: any;
  onComplete: () => void;
  onBackToWelcome: () => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  formState,
  onComplete,
  onBackToWelcome,
}) => {
  const { state, nextStep, prevStep, setStep, validateCurrentStep } = formState;
  const { currentStep, company } = state;

  // Get sector-specific questionnaire steps
  const questionnaireSteps = company.sector 
    ? getSectorSpecificQuestions(company.sector as IndustrySector)
    : getSectorSpecificQuestions('other');

  // Create navigation steps
  const navigationSteps = [
    { id: 'company', title: 'Entreprise', description: 'Informations générales' },
    ...questionnaireSteps.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description,
    })),
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === navigationSteps.length - 1) {
        onComplete();
      } else {
        nextStep();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      prevStep();
    } else {
      onBackToWelcome();
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setStep(stepIndex);
  };

  const getCompletedSteps = () => {
    return navigationSteps.map((_, index) => formState.isStepCompleted(index));
  };

  const renderCurrentStep = () => {
    if (currentStep === 0) {
      return <CompanyForm formState={formState} />;
    }

    const stepIndex = currentStep - 1;
    if (stepIndex >= 0 && stepIndex < questionnaireSteps.length) {
      const step = questionnaireSteps[stepIndex];
      return (
        <EmissionForm
          step={step}
          formState={formState}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToWelcome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="text-sm">Accueil</span>
            </button>
            
            <div className="text-sm text-gray-500">
              Étape {currentStep + 1} sur {navigationSteps.length}
            </div>
          </div>
          
          <ProgressBar
            progress={formState.getCompletionPercentage()}
            className="mb-6"
          />
          
          <StepperNavigation
            steps={navigationSteps}
            currentStep={currentStep}
            completedSteps={getCompletedSteps()}
            onStepClick={handleStepClick}
            className="mb-6"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          {/* Step Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {navigationSteps[currentStep]?.title}
            </h1>
            <p className="text-gray-600">
              {navigationSteps[currentStep]?.description}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Error Display */}
          {Object.keys(state.errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Veuillez corriger les erreurs suivantes :
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(state.errors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePrev}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 0 ? 'Accueil' : 'Précédent'}
            </button>

            <button
              onClick={handleNext}
              className="btn-primary flex items-center"
            >
              {currentStep === navigationSteps.length - 1 ? 'Terminer' : 'Suivant'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
