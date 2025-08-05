import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { PersonaOnboardingQASuite } from '@/components/qa/PersonaOnboardingQASuite';

export default function PersonaOnboardingQAPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Persona Onboarding QA Suite" 
        text="Comprehensive end-to-end testing for all user personas through registration, Plaid linking, Stripe payments, feature gating, mobile UX, and accessibility validation."
      />
      
      <PersonaOnboardingQASuite />
    </div>
  );
}