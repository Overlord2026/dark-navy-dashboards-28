import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ConsultantOnboardingFlow } from '@/components/onboarding/ConsultantOnboardingFlow';
import { PageTransition } from '@/components/animations/PageTransition';

export default function ConsultantOnboardingPage() {
  return (
    <ThreeColumnLayout activeMainItem="consultant" title="Consultant Onboarding">
      <div className="w-full max-w-6xl mx-auto p-4">
        <PageTransition>
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Consultant & Coach Setup
            </h1>
            <p className="text-muted-foreground mt-2">
              Become an impact multiplier in the BFO ecosystem with your expertise and programs
            </p>
          </div>
          <ConsultantOnboardingFlow />
        </PageTransition>
      </div>
    </ThreeColumnLayout>
  );
}