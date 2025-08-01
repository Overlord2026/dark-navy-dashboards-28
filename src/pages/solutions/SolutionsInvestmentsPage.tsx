import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function SolutionsInvestmentsPage() {
  return (
    <UnderConstructionPage
      featureName="Investment Solutions Center"
      expectedDate="Q1 2024"
      description="Advanced investment solutions with portfolio optimization and risk management tools."
      roadmapItems={[
        'Portfolio optimization engine',
        'Risk assessment tools',
        'Investment product marketplace',
        'Performance analytics dashboard',
        'Automated rebalancing'
      ]}
      showNotificationSignup={true}
    />
  );
}