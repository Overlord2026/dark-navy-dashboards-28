import React from 'react';
import { AttorneyOnboardingSequence } from '@/components/attorney/AttorneyOnboardingSequence';
import { PageTransition } from '@/components/animations/PageTransition';

export default function AttorneyOnboardingSequencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <AttorneyOnboardingSequence />
        </PageTransition>
      </div>
    </div>
  );
}