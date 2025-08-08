import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { RealtorBenefitsStep } from './onboarding/RealtorBenefitsStep';
import { RealtorProfileStep } from './onboarding/RealtorProfileStep';
import { RealtorPricingStep } from './onboarding/RealtorPricingStep';
import { RealtorPropertySetupStep } from './onboarding/RealtorPropertySetupStep';
import { RealtorConfirmationStep } from './onboarding/RealtorConfirmationStep';

export const RealtorOnboardingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome & Overview',
      component: RealtorBenefitsStep
    },
    {
      title: 'Basic Profile Setup',
      component: RealtorProfileStep
    },
    {
      title: 'Choose Subscription Tier',
      component: RealtorPricingStep
    },
    {
      title: 'Upload Property List',
      component: RealtorPropertySetupStep
    },
    {
      title: 'Connect Payment & Confirm',
      component: RealtorConfirmationStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">R</span>
              </div>
              <span className="text-xl font-semibold">Realtor Setup</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-8">
        <CurrentStepComponent onNext={handleNext} />
      </main>
    </div>
  );
};