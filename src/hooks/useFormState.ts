import { useReducer } from 'react';
import { FormState, FormAction, EmissionData } from '../types';

const initialState: FormState = {
  currentStep: 0,
  company: {},
  emissions: {},
  isCompleted: false,
  errors: {},
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_COMPANY':
      return {
        ...state,
        company: { ...state.company, ...action.payload },
        errors: {},
      };

    case 'SET_EMISSION_DATA':
      return {
        ...state,
        emissions: {
          ...state.emissions,
          [action.payload.category]: {
            ...state.emissions[action.payload.category],
            ...action.payload.data,
          },
        },
        errors: {},
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 6), // 6 total steps (company + 5 emission categories)
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, 6)),
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };

    case 'COMPLETE_FORM':
      return {
        ...state,
        isCompleted: true,
      };

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
};

export const useFormState = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setCompany = (data: Partial<typeof state.company>) => {
    dispatch({ type: 'SET_COMPANY', payload: data });
  };

  const setEmissionData = (category: keyof EmissionData, data: any) => {
    dispatch({ type: 'SET_EMISSION_DATA', payload: { category, data } });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setError = (field: string, message: string) => {
    dispatch({ type: 'SET_ERROR', payload: { field, message } });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  const completeForm = () => {
    dispatch({ type: 'COMPLETE_FORM' });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const validateCurrentStep = (): boolean => {
    const { currentStep, company, emissions } = state;
    
    // Validate company information (step 0)
    if (currentStep === 0) {
      if (!company.name?.trim()) {
        setError('name', 'Le nom de l\'entreprise est requis');
        return false;
      }
      if (!company.sector) {
        setError('sector', 'Veuillez sélectionner un secteur d\'activité');
        return false;
      }
      if (!company.size) {
        setError('size', 'Veuillez sélectionner la taille de l\'entreprise');
        return false;
      }
      if (!company.location?.trim()) {
        setError('location', 'La localisation est requise');
        return false;
      }
    }

    // Validate emission data steps (1-6)
    const categories: (keyof EmissionData)[] = ['energy', 'transport', 'waste', 'purchases', 'it', 'realEstate'];
    const categoryIndex = currentStep - 1;
    
    if (categoryIndex >= 0 && categoryIndex < categories.length) {
      const category = categories[categoryIndex];
      const categoryData = emissions[category];
      
      // Basic validation - ensure required fields are filled
      if (!categoryData) {
        setError('category', 'Veuillez remplir au moins un champ');
        return false;
      }
      
      // Category-specific validation
      switch (category) {
        case 'energy':
          if (!categoryData.electricity && !categoryData.gas && !categoryData.fuel) {
            setError('energy', 'Veuillez renseigner au moins une consommation énergétique');
            return false;
          }
          break;
        case 'transport':
          if (!categoryData.commuting?.totalEmployees) {
            setError('totalEmployees', 'Le nombre d\'employés est requis');
            return false;
          }
          break;
        case 'realEstate':
          if (!categoryData.officeSpace && !categoryData.warehouseSpace) {
            setError('space', 'Veuillez renseigner au moins une surface');
            return false;
          }
          break;
      }
    }

    clearErrors();
    return true;
  };

  const getCompletionPercentage = (): number => {
    const totalSteps = 7; // Company + 6 emission categories
    return Math.round((state.currentStep / totalSteps) * 100);
  };

  const isStepCompleted = (step: number): boolean => {
    if (step === 0) {
      return !!(state.company.name && state.company.sector && state.company.size && state.company.location);
    }
    
    const categories: (keyof EmissionData)[] = ['energy', 'transport', 'waste', 'purchases', 'it', 'realEstate'];
    const categoryIndex = step - 1;
    
    if (categoryIndex >= 0 && categoryIndex < categories.length) {
      const category = categories[categoryIndex];
      return !!state.emissions[category];
    }
    
    return false;
  };

  return {
    state,
    setCompany,
    setEmissionData,
    nextStep,
    prevStep,
    setStep,
    setError,
    clearErrors,
    completeForm,
    resetForm,
    validateCurrentStep,
    getCompletionPercentage,
    isStepCompleted,
  };
};
