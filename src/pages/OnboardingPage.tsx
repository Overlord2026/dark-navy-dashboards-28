import React from 'react';
import { ClientOnboardingFlow } from '@/components/onboarding/ClientOnboardingFlow';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export const OnboardingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const handleComplete = (state: any) => {
    console.log('Onboarding completed:', state);
    // Navigate to appropriate dashboard after completion
    window.location.href = '/client-dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientOnboardingFlow
        onComplete={handleComplete}
        tenantId={user?.user_metadata?.tenant_id}
      />
    </div>
  );
};

export default OnboardingPage;