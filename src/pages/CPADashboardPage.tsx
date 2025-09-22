import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { CPADashboard } from '@/components/accountant/CPADashboard';
import { PageTransition } from '@/components/animations/PageTransition';

export default function CPADashboardPage() {
  return (
    <ThreeColumnLayout activeMainItem="cpa" title="CPA Practice Hub">
      <div className="w-full max-w-7xl mx-auto p-4">
        <PageTransition>
          <CPADashboard />
        </PageTransition>
      </div>
    </ThreeColumnLayout>
  );
}