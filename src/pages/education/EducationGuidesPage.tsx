import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function EducationGuidesPage() {
  return (
    <UnderConstructionPage
      featureName="Education Guides Library"
      expectedDate="Q2 2024"
      description="Comprehensive guides on financial planning, investment strategies, and wealth management topics."
      roadmapItems={[
        'Interactive financial planning guides',
        'Investment strategy walkthroughs',
        'Tax optimization tutorials',
        'Estate planning checklists',
        'Downloadable PDF resources'
      ]}
      showNotificationSignup={true}
    />
  );
}