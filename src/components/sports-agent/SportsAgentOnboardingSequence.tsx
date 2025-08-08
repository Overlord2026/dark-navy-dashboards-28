import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { SportsAgentBenefitsStep } from './onboarding/SportsAgentBenefitsStep';
import { SportsAgentProfileStep } from './onboarding/SportsAgentProfileStep';
import { SportsAgentAthleteSetupStep } from './onboarding/SportsAgentAthleteSetupStep';
import { SportsAgentUpgradeStep } from './onboarding/SportsAgentUpgradeStep';
import { SportsAgentConfirmationStep } from './onboarding/SportsAgentConfirmationStep';

export const SportsAgentOnboardingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    'Benefits Overview',
    'Create Account', 
    'Athlete Setup',
    'Choose Plan',
    'Confirmation'
  ];

  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <SportsAgentBenefitsStep onNext={handleNext} />;
      case 1:
        return <SportsAgentProfileStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 2:
        return <SportsAgentAthleteSetupStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <SportsAgentUpgradeStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <SportsAgentConfirmationStep onPrevious={handlePrevious} />;
      default:
        return <SportsAgentBenefitsStep onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Sports Agent Setup
            </h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{steps[currentStep]}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`text-xs text-center ${
                  index <= currentStep 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="hidden sm:block">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
};