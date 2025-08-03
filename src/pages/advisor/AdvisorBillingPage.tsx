import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AdvisorBillingDashboard } from '@/components/advisor/billing/AdvisorBillingDashboard';

export default function AdvisorBillingPage() {
  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Advisor Billing">
      <AdvisorBillingDashboard />
    </ThreeColumnLayout>
  );
}