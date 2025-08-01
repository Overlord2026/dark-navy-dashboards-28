import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function WealthCashTransfersPage() {
  return (
    <UnderConstructionPage
      featureName="Cash Transfer Hub"
      expectedDate="Q2 2024"
      description="Streamlined cash transfers between accounts, automated scheduling, and transfer optimization."
      roadmapItems={[
        'Bank account linking and verification',
        'Automated recurring transfers',
        'Transfer cost optimization',
        'Multi-currency support',
        'Transfer history and reporting'
      ]}
      showNotificationSignup={true}
    />
  );
}