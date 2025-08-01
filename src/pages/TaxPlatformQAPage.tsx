import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ComprehensiveTaxQARunner } from '@/components/qa/ComprehensiveTaxQARunner';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

export const TaxPlatformQAPage: React.FC = () => {
  return (
    <ThreeColumnLayout title="Tax Platform QA Suite">
      <div className="space-y-6">
        <DashboardHeader 
          heading="End-to-End QA Testing"
          text="Comprehensive testing suite for all tax calculators, workflows, premium gating, and educational features."
        />
        
        <ComprehensiveTaxQARunner />
      </div>
    </ThreeColumnLayout>
  );
};