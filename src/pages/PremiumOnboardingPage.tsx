import React from 'react';
import { PremiumOnboardingFlow } from '@/components/onboarding/PremiumOnboardingFlow';
import { useNavigate } from 'react-router-dom';

export const PremiumOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Navigate to client dashboard after onboarding completion
    navigate('/client-dashboard');
  };

  return <PremiumOnboardingFlow onComplete={handleComplete} />;
};

export default PremiumOnboardingPage;