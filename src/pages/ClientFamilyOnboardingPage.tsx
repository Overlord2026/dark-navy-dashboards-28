import React from 'react';
import { ClientFamilyOnboardingSequence } from '@/components/client/ClientFamilyOnboardingSequence';
import { PageTransition } from '@/components/animations/PageTransition';

export default function ClientFamilyOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <ClientFamilyOnboardingSequence />
        </PageTransition>
      </div>
    </div>
  );
}