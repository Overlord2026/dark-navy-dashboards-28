import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { InteractiveProfessionalDemo } from './InteractiveProfessionalDemo';
import { useAuth } from '@/context/AuthContext';

export function IMOFMODashboard() {
  const { userProfile } = useAuth();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="IMO/FMO Executive Dashboard"
        text={`Welcome ${userProfile?.firstName || userProfile?.first_name || 'Executive'}! Manage your organization and track performance.`}
      />
      
      <InteractiveProfessionalDemo role="imo_executive" />
    </div>
  );
}