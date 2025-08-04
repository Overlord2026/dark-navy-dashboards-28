import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WelcomeBanner } from '@/components/onboarding/mass/WelcomeBanner';
import { QuickStartSelection } from '@/components/onboarding/mass/QuickStartSelection';
import { BookMigrationWizard } from '@/components/onboarding/mass/BookMigrationWizard';
import { OnboardingProgressDashboard } from '@/components/onboarding/mass/OnboardingProgressDashboard';
import { TrainingResourceCenter } from '@/components/onboarding/mass/TrainingResourceCenter';
import { CommunicationCenter } from '@/components/onboarding/mass/CommunicationCenter';
import { ComplianceIntegration } from '@/components/onboarding/mass/ComplianceIntegration';

export default function MassOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingType, setOnboardingType] = useState<'solo' | 'firm' | null>(null);
  const [selectedCustodian, setSelectedCustodian] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <WelcomeBanner currentStep={currentStep} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <QuickStartSelection 
                onboardingType={onboardingType}
                setOnboardingType={setOnboardingType}
                selectedCustodian={selectedCustodian}
                setSelectedCustodian={setSelectedCustodian}
              />
              
              <BookMigrationWizard 
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onboardingType={onboardingType}
              />
              
              <OnboardingProgressDashboard currentStep={currentStep} />
            </div>
            
            <div className="space-y-8">
              <ComplianceIntegration />
              <TrainingResourceCenter />
              <CommunicationCenter />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}