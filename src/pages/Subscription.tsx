
import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';

export default function Subscription() {
  return (
    <ThreeColumnLayout activeMainItem="subscription" title="Subscription">
      <div className="max-w-6xl mx-auto p-4">
        <SubscriptionPlans />
      </div>
    </ThreeColumnLayout>
  );
}
