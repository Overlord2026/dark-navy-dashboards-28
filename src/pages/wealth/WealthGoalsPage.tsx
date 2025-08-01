import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function WealthGoalsPage() {
  return (
    <UnderConstructionPage
      featureName="Advanced Wealth Goals"
      expectedDate="Q2 2024"
      description="Comprehensive goal planning with AI-powered recommendations and progress tracking."
      roadmapItems={[
        'AI-powered goal recommendations',
        'Advanced progress analytics',
        'Goal dependency mapping',
        'Risk-adjusted projections',
        'Milestone celebrations and rewards'
      ]}
      showNotificationSignup={true}
    />
  );
}