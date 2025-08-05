import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { StripeSubscriptionManualTester } from '@/components/qa/StripeSubscriptionManualTester';

export default function StripeSubscriptionTestPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Stripe Subscription Manual Testing" 
        text="Comprehensive manual testing suite for subscription upgrade, downgrade, and payment flows using Stripe test cards and real user interactions."
      />
      
      <StripeSubscriptionManualTester />
    </div>
  );
}