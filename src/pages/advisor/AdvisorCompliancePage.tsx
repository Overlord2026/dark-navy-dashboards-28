import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ComplianceTracker } from '@/components/advisor/compliance/ComplianceTracker';

export default function AdvisorCompliancePage() {
  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Advisor Compliance">
      <ComplianceTracker />
    </ThreeColumnLayout>
  );
}