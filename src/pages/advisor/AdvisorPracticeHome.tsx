import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AdvisorPracticeDashboard } from '@/components/advisor/practice/AdvisorPracticeDashboard';

export default function AdvisorPracticeHome() {
  return (
    <ThreeColumnLayout 
      title="Practice Management" 
      activeMainItem="advisor"
      activeSecondaryItem="practice"
      secondaryMenuItems={[]}
    >
      <AdvisorPracticeDashboard />
    </ThreeColumnLayout>
  );
}