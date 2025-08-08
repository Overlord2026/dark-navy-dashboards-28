import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { EliteBenefitsStep } from './onboarding/EliteBenefitsStep';
import { EliteToolsStep } from './onboarding/EliteToolsStep';
import { ElitePricingStep } from './onboarding/ElitePricingStep';
import { EliteAccountSetupStep } from './onboarding/EliteAccountSetupStep';
import { EliteConfirmationStep } from './onboarding/EliteConfirmationStep';

export const EliteFamilyOfficeOnboardingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Benefits Overview',
      component: EliteBenefitsStep
    },
    {
      title: 'Tool Categories',
      component: EliteToolsStep
    },
    {
      title: 'Pricing Tier Overview',
      component: ElitePricingStep
    },
    {
      title: 'Account Setup',
      component: EliteAccountSetupStep
    },
    {
      title: 'Confirmation & Tour',
      component: EliteConfirmationStep
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
                <span className="text-sm font-bold text-primary-foreground">BFO</span>
              </div>
              <span className="text-xl font-semibold">Elite Family Office Setup</span>
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