import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AttorneyOnboardingFlow } from '@/components/onboarding/AttorneyOnboardingFlow';
import { PageTransition } from '@/components/animations/PageTransition';

export default function AttorneyOnboardingPage() {
  return (
    <ThreeColumnLayout activeMainItem="attorney" title="Attorney Onboarding">
      <div className="w-full max-w-6xl mx-auto p-4">
        <PageTransition>
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Attorney Practice Setup
            </h1>
            <p className="text-muted-foreground mt-2">
              Personalize your dashboard with best-in-class legal tools for modern families
            </p>
          </div>
          <AttorneyOnboardingFlow />
        </PageTransition>
      </div>
    </ThreeColumnLayout>
  );
}