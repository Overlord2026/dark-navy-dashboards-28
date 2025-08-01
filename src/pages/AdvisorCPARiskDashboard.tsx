import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ClientRiskDashboard } from '@/components/advisor/ClientRiskDashboard';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

export const AdvisorCPARiskDashboard: React.FC = () => {
  return (
    <ThreeColumnLayout title="Client Risk Management">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Client Risk & Opportunity Dashboard"
          text="Monitor client tax risks, opportunities, and compliance alerts. Launch targeted workflows to maximize client value and minimize tax liability."
        />
        
        <ClientRiskDashboard />
      </div>
    </ThreeColumnLayout>
  );
};