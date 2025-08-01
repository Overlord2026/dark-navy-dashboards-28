import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function CollaborationFamilyPage() {
  return (
    <UnderConstructionPage
      featureName="Family Collaboration Hub"
      expectedDate="Q1 2024"
      description="Secure family communication and collaboration platform for wealth management and estate planning."
      roadmapItems={[
        'Family member role management',
        'Secure document sharing',
        'Family meeting scheduler',
        'Legacy planning discussions',
        'Multi-generation access controls'
      ]}
      showNotificationSignup={true}
    />
  );
}