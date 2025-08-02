import React from 'react';
import { ClientOnboardingFlow } from '@/components/onboarding/ClientOnboardingFlow';

export default function ClientOnboardingPage() {
  const handleOnboardingComplete = (state: any) => {
    console.log('Onboarding completed:', state);
  };

  // Example configurations for different use cases
  const whiteLabelConfig = {
    companyName: 'MyBFOCFO',
    primaryColor: '#FFD700',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    welcomeMessage: 'Welcome to your personalized family office experience.',
    pricingTier: 'enterprise' as const,
    features: {
      aiAssistant: true,
      documentOcr: true,
      digitalSignature: true,
      apiIntegrations: true,
      customBranding: true,
      multiCustodian: true,
    }
  };

  const referralInfo = {
    type: 'advisor' as const,
    referrerName: 'John Smith',
    referrerFirm: 'Smith Wealth Advisors',
    referrerEmail: 'john@smithwealth.com',
  };

  return (
    <ClientOnboardingFlow 
      onComplete={handleOnboardingComplete}
      whiteLabelConfig={whiteLabelConfig}
      referralInfo={referralInfo}
    />
  );
}