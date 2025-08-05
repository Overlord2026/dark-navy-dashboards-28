import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { PersonaDashboardQASuite } from '@/components/qa/PersonaDashboardQASuite';

export default function PersonaDashboardQAPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Persona Dashboard QA Testing" 
        text="Comprehensive validation of all persona dashboards for navigation, responsiveness, accessibility, branding, and user experience compliance."
      />
      
      <PersonaDashboardQASuite />
    </div>
  );
}