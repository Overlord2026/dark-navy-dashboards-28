import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function LendingPage() {
  return (
    <UnderConstructionPage
      featureName="Lending & Credit Solutions"
      expectedDate="Q2 2024"
      description="Comprehensive lending platform with mortgage, personal loans, and credit optimization tools."
      roadmapItems={[
        'Mortgage rate comparison engine',
        'Personal loan marketplace',
        'Credit score optimization tools',
        'Pre-qualification system',
        'Lending partner network'
      ]}
      showNotificationSignup={true}
    />
  );
}