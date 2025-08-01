import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AdvisorResourceCenter } from '@/components/advisor/AdvisorResourceCenter';

export default function AdvisorResourceCenterPage() {
  return (
    <ThreeColumnLayout 
      title="Resource Center" 
      activeMainItem="advisor"
      activeSecondaryItem="resources"
      secondaryMenuItems={[]}
    >
      <AdvisorResourceCenter />
    </ThreeColumnLayout>
  );
}