import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AttorneyDashboard } from '@/components/attorney/AttorneyDashboard';
import { PageTransition } from '@/components/animations/PageTransition';

export default function EstateAttorneyDashboardPage() {
  return (
    <ThreeColumnLayout activeMainItem="attorney" title="Estate Attorney Hub">
      <div className="w-full max-w-7xl mx-auto p-4">
        <PageTransition>
          <AttorneyDashboard />
        </PageTransition>
      </div>
    </ThreeColumnLayout>
  );
}