import React from 'react';
import { NILOnboardingWizard } from '@/components/nil/onboarding/NILOnboardingWizard';
import { useNavigate } from 'react-router-dom';

export default function NILOnboardingPage() {
  const navigate = useNavigate();

  const handleComplete = (persona: string) => {
    // Route to appropriate dashboard based on persona
    switch (persona) {
      case 'athlete':
        navigate('/nil/dashboard');
        break;
      case 'family':
        navigate('/nil/family-dashboard');
        break;
      case 'advisor':
        navigate('/nil/advisor-dashboard');
        break;
      case 'admin':
        navigate('/nil/admin');
        break;
      default:
        navigate('/nil/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NILOnboardingWizard onComplete={handleComplete} />
    </div>
  );
}