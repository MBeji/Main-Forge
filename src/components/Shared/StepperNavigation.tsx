import React from 'react';
import { Check } from 'lucide-react';

interface StepperNavigationProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  currentStep: number;
  completedSteps: boolean[];
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex items-center">
              <button
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${currentStep === index
                    ? 'bg-primary-600 text-white'
                    : completedSteps[index]
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                  ${onStepClick ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                `}
                aria-label={`Étape ${index + 1}: ${step.title}`}
              >
                {completedSteps[index] ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              
              {/* Step Label */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
                <div className={`
                  text-xs font-medium whitespace-nowrap
                  ${currentStep === index
                    ? 'text-primary-600'
                    : completedSteps[index]
                    ? 'text-green-600'
                    : 'text-gray-500'
                  }
                `}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-400 mt-1 max-w-20">
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2">
                <div
                  className={`h-full transition-colors duration-200 ${
                    completedSteps[index] || currentStep > index
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
