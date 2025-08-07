import React, { useState, useEffect } from 'react';
import { PersonaOnboardingFlow } from '@/components/onboarding/PersonaOnboardingFlow';
import { InviteFlowModal } from '@/components/viral/InviteFlowModal';
import { PersonaDashboardTabs } from '@/components/dashboard/PersonaDashboardTabs';
import { useUser } from '@/context/UserContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { PersonaType } from '@/types/personas';

interface PersonaDashboardLayoutProps {
  children?: React.ReactNode;
}

export const PersonaDashboardLayout: React.FC<PersonaDashboardLayoutProps> = ({ children }) => {
  const { userProfile } = useUser();
  const role = userProfile?.role || 'client';
  const tier = userProfile?.client_tier || 'basic';
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    const onboardingKey = `onboarding-completed-${role}-${tier}`;
    const hasCompleted = localStorage.getItem(onboardingKey);
    
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
  }, [role, tier]);

  return (
    <MainLayout>
      <PersonaDashboardTabs className="container mx-auto" />
      
      {/* Custom Content */}
      {children}

      {/* Onboarding Flow */}
      {showOnboarding && (
        <PersonaOnboardingFlow 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)} 
        />
      )}

      {/* Invite Flow Modal */}
      <InviteFlowModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        persona={role as PersonaType}
      />
    </MainLayout>
  );
};

export default PersonaDashboardLayout;