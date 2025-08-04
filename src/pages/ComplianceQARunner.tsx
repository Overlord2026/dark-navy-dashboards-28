import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ComplianceQATestRunner } from '@/components/qa/ComplianceQATestRunner';

const ComplianceQARunner: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Compliance Management QA Testing" 
        text="Comprehensive validation of agent onboarding, CE uploads, reminders, and admin workflows"
      />
      
      <ComplianceQATestRunner />
    </div>
  );
};

export default ComplianceQARunner;