import React from 'react';
import { NILOnboardingWizard } from '@/components/nil/onboarding/NILOnboardingWizard';
import { useNavigate } from 'react-router-dom';

export default function NILOnboardingPage() {
  const navigate = useNavigate();

  const handleComplete = (flow: any) => {
    // Route to appropriate dashboard based on flow completion
    navigate('/nil/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <NILOnboardingWizard personaType="athlete" onComplete={handleComplete} />
    </div>
  );
}