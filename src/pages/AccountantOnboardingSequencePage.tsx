import React from 'react';
import { AccountantOnboardingSequence } from '@/components/accountant/AccountantOnboardingSequence';
import { PageTransition } from '@/components/animations/PageTransition';

export default function AccountantOnboardingSequencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <AccountantOnboardingSequence />
        </PageTransition>
      </div>
    </div>
  );
}