import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { AdvisorOnboardingFlow } from '@/components/onboarding/AdvisorOnboardingFlow';

export default function AdvisorOnboardingPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Advisor Setup" 
        text="Complete your professional profile to start serving families with excellence and grow your practice."
      />
      
      <AdvisorOnboardingFlow />
    </div>
  );
}