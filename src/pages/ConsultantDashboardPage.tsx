import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ConsultantDashboard } from '@/components/consultant/ConsultantDashboard';
import { PageTransition } from '@/components/animations/PageTransition';

export default function ConsultantDashboardPage() {
  return (
    <ThreeColumnLayout activeMainItem="consultant" title="Consultant Dashboard">
      <div className="w-full max-w-7xl mx-auto p-4">
        <PageTransition>
          <ConsultantDashboard />
        </PageTransition>
      </div>
    </ThreeColumnLayout>
  );
}