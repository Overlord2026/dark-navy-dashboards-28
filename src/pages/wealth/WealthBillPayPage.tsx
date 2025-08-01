import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function WealthBillPayPage() {
  return (
    <UnderConstructionPage
      featureName="Automated Bill Pay Center"
      expectedDate="Q2 2024"
      description="Intelligent bill management with automated payments, expense categorization, and cash flow optimization."
      roadmapItems={[
        'Automated bill payment scheduling',
        'Expense categorization and tracking',
        'Cash flow optimization alerts',
        'Vendor management system',
        'Tax document organization'
      ]}
      showNotificationSignup={true}
    />
  );
}