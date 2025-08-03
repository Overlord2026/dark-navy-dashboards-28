import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AdvisorDashboard } from '@/components/advisor/AdvisorDashboard';

export default function AdvisorMainDashboard() {
  return (
    <ThreeColumnLayout 
      title="Advisor Dashboard" 
      activeMainItem="advisor"
      activeSecondaryItem="dashboard"
      secondaryMenuItems={[]}
    >
      <AdvisorDashboard />
    </ThreeColumnLayout>
  );
}