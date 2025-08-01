import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { CalculatorValidationSuite } from '@/components/qa/CalculatorValidationSuite';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, FileUp, Shield, AlertTriangle } from 'lucide-react';

export const SystemValidationPage: React.FC = () => {
  return (
    <ThreeColumnLayout title="System Validation Suite">
      <div className="space-y-6">
        <DashboardHeader 
          heading="System Validation & Testing"
          text="Comprehensive validation of calculator tools, file uploads, and role-based access controls across all user personas."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-sm">Calculator Tools</div>
              <div className="text-xs text-muted-foreground">Roth, Tax, Portfolio analysis</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <FileUp className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-sm">File Uploads</div>
              <div className="text-xs text-muted-foreground">Documents, contracts, statements</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Shield className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium text-sm">Role Access</div>
              <div className="text-xs text-muted-foreground">Permission validation</div>
            </div>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This validation suite tests all critical functionality across different user personas including:
            calculator accessibility, file upload permissions, input validation, error handling, and role-based access controls.
            Run tests to identify any issues with tools or permissions.
          </AlertDescription>
        </Alert>
        
        <CalculatorValidationSuite />
      </div>
    </ThreeColumnLayout>
  );
};