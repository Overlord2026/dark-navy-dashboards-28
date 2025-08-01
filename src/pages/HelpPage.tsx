import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function HelpPage() {
  return (
    <UnderConstructionPage
      featureName="Help & Support Center"
      expectedDate="Q2 2024"
      description="A comprehensive help center with tutorials, FAQs, and live support options."
      roadmapItems={[
        'Video tutorials and walkthroughs',
        'Searchable FAQ database',
        'Live chat support integration',
        'User manual and documentation',
        'Contact forms and ticket system'
      ]}
      showNotificationSignup={true}
    />
  );
}