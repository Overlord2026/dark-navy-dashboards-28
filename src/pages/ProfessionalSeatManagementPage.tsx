import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ProfessionalSeatManagement } from '@/components/professionals/ProfessionalSeatManagement';

export default function ProfessionalSeatManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Seat Management" 
        text="Purchase and manage client seats for your professional practice. Link families to your services and track your client relationships."
      />
      
      <ProfessionalSeatManagement />
    </div>
  );
}