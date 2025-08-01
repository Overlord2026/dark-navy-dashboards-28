import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function SolutionsPage() {
  return (
    <UnderConstructionPage
      featureName="Financial Solutions Hub"
      expectedDate="Q2 2024"
      description="Comprehensive financial solutions including investments, insurance, lending, and tax planning."
      roadmapItems={[
        'Investment solution finder',
        'Insurance needs calculator',
        'Lending product comparison',
        'Tax strategy optimizer',
        'Integrated solution recommendations'
      ]}
      showNotificationSignup={true}
    />
  );
}