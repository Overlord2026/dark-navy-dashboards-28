import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function EstatePlanningPage() {
  return (
    <UnderConstructionPage
      featureName="Estate Planning Suite"
      expectedDate="Q2 2024"
      description="Comprehensive estate planning tools including will creation, trust management, and legacy planning."
      roadmapItems={[
        'Interactive will builder',
        'Trust structure optimizer',
        'Tax minimization strategies',
        'Digital vault for documents',
        'Legacy planning calculator'
      ]}
      showNotificationSignup={true}
    />
  );
}