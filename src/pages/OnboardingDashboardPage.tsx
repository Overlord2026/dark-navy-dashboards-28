import React from 'react';
import { OnboardingDashboard } from '@/components/onboarding/OnboardingDashboard';

export default function OnboardingDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <OnboardingDashboard />
      </div>
    </div>
  );
}