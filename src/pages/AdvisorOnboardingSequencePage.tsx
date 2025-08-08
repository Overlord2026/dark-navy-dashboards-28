import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvisorOnboardingSequence } from '@/components/advisor/onboarding/AdvisorOnboardingSequence';

export default function AdvisorOnboardingSequencePage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/advisor-dashboard');
  };

  return <AdvisorOnboardingSequence onComplete={handleComplete} />;
}