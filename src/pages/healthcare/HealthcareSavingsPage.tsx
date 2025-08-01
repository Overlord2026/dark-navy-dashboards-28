import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function HealthcareSavingsPage() {
  return (
    <UnderConstructionPage
      featureName="Healthcare Savings Optimizer"
      expectedDate="Q2 2024"
      description="Advanced healthcare savings tools including HSA optimization, FSA planning, and healthcare cost analysis."
      roadmapItems={[
        'HSA contribution optimization calculator',
        'FSA planning and expense tracking',
        'Healthcare cost comparison tools',
        'Insurance plan analyzer',
        'Tax savings projections'
      ]}
      showNotificationSignup={true}
    />
  );
}