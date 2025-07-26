import React from 'react';
import { AdvisorInviteWorkflow } from '@/components/onboarding/AdvisorInviteWorkflow';

export default function AdvisorInvitePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AdvisorInviteWorkflow />
      </div>
    </div>
  );
}