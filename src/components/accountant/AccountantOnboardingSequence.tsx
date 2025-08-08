import React, { useState } from 'react';
import { AccountantPersonaLanding } from './AccountantPersonaLanding';
import { AccountantWelcomeStep } from './onboarding/AccountantWelcomeStep';
import { AccountantBasicToolsStep } from './onboarding/AccountantBasicToolsStep';
import { AccountantPremiumToolsStep } from './onboarding/AccountantPremiumToolsStep';
import { AccountantGetStartedStep } from './onboarding/AccountantGetStartedStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AccountantOnboardingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showLanding, setShowLanding] = useState(true);

  const steps = [
    { component: AccountantWelcomeStep, title: 'Welcome & Benefits' },
    { component: AccountantBasicToolsStep, title: 'Basic Tools (Free)' },
    { component: AccountantPremiumToolsStep, title: 'Premium Tools' },
    { component: AccountantGetStartedStep, title: 'Get Started' }
  ];

  const handleExploreFeatures = () => {
    setShowLanding(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowLanding(true);
    }
  };

  if (showLanding) {
    return <AccountantPersonaLanding onExploreFeatures={handleExploreFeatures} />;
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">CPA Practice Setup</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={index} className={`text-xs ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep === 0 ? 'Back to Overview' : 'Previous'}
        </Button>

        {currentStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            className="flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};