import React from 'react';
import { UnderConstructionPage } from '@/components/ui/UnderConstructionPage';

export default function HealthOverviewPage() {
  return (
    <UnderConstructionPage
      featureName="Health Optimization Dashboard"
      expectedDate="Q1 2024"
      description="Comprehensive health management platform with HSA optimization, medical tracking, and wellness insights."
      roadmapItems={[
        'Health metrics dashboard',
        'HSA contribution optimizer',
        'Medical expense tracking',
        'Provider network integration',
        'Health goal tracking'
      ]}
      showNotificationSignup={true}
    />
  );
}