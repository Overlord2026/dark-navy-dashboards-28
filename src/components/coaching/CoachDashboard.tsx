import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { InteractiveProfessionalDemo } from '../professionals/InteractiveProfessionalDemo';
import { useAuth } from '@/context/AuthContext';

export function CoachDashboard() {
  const { userProfile } = useAuth();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Coach Dashboard"
        text={`Welcome ${userProfile?.firstName || userProfile?.first_name || 'Coach'}! Track your coaching progress and client success.`}
      />
      
      <InteractiveProfessionalDemo role="coach" />
    </div>
  );
}