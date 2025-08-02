import React from 'react';
import { ClientOnboardingFlow } from '@/components/onboarding/ClientOnboardingFlow';

export default function ClientOnboardingPage() {
  const handleOnboardingComplete = (state: any) => {
    console.log('Onboarding completed:', state);
  };

  return (
    <ClientOnboardingFlow 
      onComplete={handleOnboardingComplete}
      brandSettings={{
        companyName: 'MyBFOCFO',
        primaryColor: '#FFD700'
      }}
    />
  );
}