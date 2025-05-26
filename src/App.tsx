import React, { useState } from 'react';
import { WelcomeScreen } from './components/Onboarding/WelcomeScreen';
import { DynamicForm } from './components/Forms/DynamicForm';
import { ResultsOverview } from './components/Dashboard/ResultsOverview';
import { useFormState } from './hooks/useFormState';
import { calculateEmissions } from './utils/calculations';

type AppState = 'welcome' | 'questionnaire' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const formState = useFormState();

  const handleGetStarted = () => {
    setAppState('questionnaire');
  };

  const handleFormComplete = () => {
    formState.completeForm();
    setAppState('results');
  };

  const handleStartOver = () => {
    formState.resetForm();
    setAppState('welcome');
  };

  const renderCurrentView = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
        
      case 'questionnaire':
        return (
          <DynamicForm
            formState={formState}
            onComplete={handleFormComplete}
            onBackToWelcome={() => setAppState('welcome')}
          />
        );
        
      case 'results':
        // Calculate results
        const company = formState.state.company as any;
        const emissions = formState.state.emissions as any;
        
        let results = null;
        if (company && emissions) {
          try {
            results = calculateEmissions(emissions, company);
          } catch (error) {
            console.error('Error calculating emissions:', error);
          }
        }
        
        return (
          <ResultsOverview
            company={company}
            emissions={emissions}
            results={results}
            onStartOver={handleStartOver}
          />
        );
        
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
}

export default App;
