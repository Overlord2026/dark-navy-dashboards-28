import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { AttorneyQARunner } from '@/components/qa/AttorneyQARunner';

export const AttorneyQAPage: React.FC = () => {
  return (
    <ThreeColumnLayout title="Attorney Platform QA Suite">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Attorney Platform Comprehensive QA"
          text="End-to-end testing for attorney onboarding, client collaboration, legal resources, education library, and platform automations."
        />
        
        <AttorneyQARunner />
      </div>
    </ThreeColumnLayout>
  );
};