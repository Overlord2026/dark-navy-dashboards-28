import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { QAPlaybook } from '@/components/qa/QAPlaybook';

export const QAPlaybookPage: React.FC = () => {
  return (
    <ThreeColumnLayout title="QA Playbook">
      <div className="space-y-6">
        <DashboardHeader 
          heading="QA Playbook"
          text="Comprehensive testing suite for routing, receipts, compliance, exports, and performance validation after each batch."
        />
        
        <QAPlaybook />
      </div>
    </ThreeColumnLayout>
  );
};