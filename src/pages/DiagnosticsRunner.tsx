import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ComprehensiveDiagnosticRunner } from '@/components/diagnostics/ComprehensiveDiagnosticRunner';

const DiagnosticsRunner: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Application Diagnostics" 
        text="Comprehensive testing of all feature tabs, sub-tabs, and button functionality"
      />
      
      <ComprehensiveDiagnosticRunner />
    </div>
  );
};

export default DiagnosticsRunner;