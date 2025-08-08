import React, { useState } from 'react';
import { ClientFamilyWelcomeStep } from './onboarding/ClientFamilyWelcomeStep';
import { ClientFamilyBasicFeaturesStep } from './onboarding/ClientFamilyBasicFeaturesStep';
import { ClientFamilyPremiumFeaturesStep } from './onboarding/ClientFamilyPremiumFeaturesStep';
import { ClientFamilyWireframeStep } from './onboarding/ClientFamilyWireframeStep';
import { ClientFamilyCTAStep } from './onboarding/ClientFamilyCTAStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ClientFamilyOnboardingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { component: ClientFamilyWelcomeStep, title: 'Welcome' },
    { component: ClientFamilyBasicFeaturesStep, title: 'Basic Features' },
    { component: ClientFamilyPremiumFeaturesStep, title: 'Premium Features' },
    { component: ClientFamilyWireframeStep, title: 'Dashboard Preview' },
    { component: ClientFamilyCTAStep, title: 'Get Started' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Family Office Setup</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
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
          disabled={currentStep === 0}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};