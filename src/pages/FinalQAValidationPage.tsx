import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ComprehensivePersonaQARunner } from '@/components/qa/ComprehensivePersonaQARunner';

export default function FinalQAValidationPage() {
  return (
    <ThreeColumnLayout title="Final QA Validation">
      <div className="space-y-6">
        <DashboardHeader 
          heading="🚀 Final Pre-API Go-Live QA Testing"
          text="Comprehensive validation of all personas across navigation, onboarding, dashboard, workflows, and integrations with mock/demo data."
        />
        
        <ComprehensivePersonaQARunner />
      </div>
    </ThreeColumnLayout>
  );
}