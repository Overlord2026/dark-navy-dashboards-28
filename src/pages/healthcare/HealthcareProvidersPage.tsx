import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export function HealthcareProvidersPage() {
  return (
    <UnderConstructionPage
      featureName="Healthcare Provider Network"
      expectedDate="Q2 2024"
      description="Find and manage healthcare providers, schedule appointments, and track medical history."
      roadmapItems={[
        'Provider search and comparison',
        'Appointment scheduling integration',
        'Medical history tracking',
        'Insurance coverage verification',
        'Provider rating and reviews'
      ]}
      showNotificationSignup={true}
    />
  );
}