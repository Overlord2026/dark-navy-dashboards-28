import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { GoNoGoQAReport } from '@/components/qa/GoNoGoQAReport';

export default function GoNoGoQAPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Go/No-Go QA Summary Report" 
        text="Executive summary of all QA testing results with clear launch recommendation based on API integrations, onboarding flows, payments, UI/UX, and accessibility compliance."
      />
      
      <GoNoGoQAReport />
    </div>
  );
}