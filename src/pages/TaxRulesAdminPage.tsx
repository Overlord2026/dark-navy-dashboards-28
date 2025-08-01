import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { TaxRulesAdmin } from '@/components/admin/TaxRulesAdmin';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

export const TaxRulesAdminPage: React.FC = () => {
  return (
    <ThreeColumnLayout title="Tax Rules Administration">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Tax Rules & Configuration"
          text="Manage tax brackets, deductions, RMD ages, SECURE Act rules, and other tax regulations that power the calculators."
        />
        
        <TaxRulesAdmin />
      </div>
    </ThreeColumnLayout>
  );
};