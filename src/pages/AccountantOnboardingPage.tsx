import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AccountantOnboardingFlow } from '@/components/onboarding/AccountantOnboardingFlow';
import { PageTransition } from '@/components/animations/PageTransition';

export default function AccountantOnboardingPage() {
  return (
    <ThreeColumnLayout activeMainItem="accountant" title="Accountant Onboarding">
      <div className="w-full max-w-6xl mx-auto p-4">
        <PageTransition>
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              CPA Firm Setup
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your clients' tax lives with next-generation tools and secure workflows
            </p>
          </div>
          <AccountantOnboardingFlow />
        </PageTransition>
      </div>
    </ThreeColumnLayout>
  );
}