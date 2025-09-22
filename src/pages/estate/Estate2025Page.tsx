import React from 'react';
import { Estate2025Dashboard } from '@/components/estate/Estate2025Dashboard';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

export default function Estate2025Page() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <DashboardHeader 
        heading="2025 Estate Tax Planning" 
        text="Updated estate tax rules, sunset provision analysis, and advanced planning strategies for 2025."
      />
      
      <Estate2025Dashboard />
    </div>
  );
}