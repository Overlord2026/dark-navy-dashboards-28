import React, { useState } from 'react';
import { InsuranceWelcomeStep } from './onboarding/InsuranceWelcomeStep';
import { InsuranceProfileSetupStep } from './onboarding/InsuranceProfileSetupStep';
import { InsuranceComplianceStep } from './onboarding/InsuranceComplianceStep';
import { InsuranceClientToolsStep } from './onboarding/InsuranceClientToolsStep';
import { InsuranceMarketplaceStep } from './onboarding/InsuranceMarketplaceStep';
import { InsuranceDashboardTourStep } from './onboarding/InsuranceDashboardTourStep';

export const InsuranceOnboardingSequence = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <InsuranceWelcomeStep />;
      case 2:
        return <InsuranceProfileSetupStep />;
      case 3:
        return <InsuranceComplianceStep />;
      case 4:
        return <InsuranceClientToolsStep />;
      case 5:
        return <InsuranceMarketplaceStep />;
      case 6:
        return <InsuranceDashboardTourStep />;
      default:
        return <InsuranceWelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div 
                    className={`h-1 w-full mx-4 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="max-w-6xl mx-auto mt-8 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => window.location.href = '/insurance-dashboard'}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};