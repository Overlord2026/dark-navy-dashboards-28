import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function HealthcareMedicationsPage() {
  return (
    <UnderConstructionPage
      featureName="Medication Management"
      expectedDate="Q2 2024"
      description="Track medications, manage prescriptions, and optimize pharmaceutical costs."
      roadmapItems={[
        'Medication tracking and reminders',
        'Prescription cost comparison',
        'Drug interaction checker',
        'Pharmacy network integration',
        'Medication history and reports'
      ]}
      showNotificationSignup={true}
    />
  );
}