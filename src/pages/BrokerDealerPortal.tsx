import React from 'react';
import { BrokerDealerDashboard } from '@/components/enterprise/BrokerDealerDashboard';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';

export default function BrokerDealerPortal() {
  return (
    <ThreeColumnLayout title="Broker-Dealer Portal" activeMainItem="broker-dealer">
      <BrokerDealerDashboard />
    </ThreeColumnLayout>
  );
}