import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function WealthBusinessFilingsPage() {
  return (
    <UnderConstructionPage
      featureName="Business Filings Manager"
      expectedDate="Q2 2024"
      description="Comprehensive business filing management with automated reminders and compliance tracking."
      roadmapItems={[
        'Automated filing deadline tracking',
        'Document preparation assistance',
        'Compliance monitoring dashboard',
        'Multi-entity management',
        'Integration with tax professionals'
      ]}
      showNotificationSignup={true}
    />
  );
}