import React from 'react';
import { PersonaLendingFlow } from '@/components/lending/PersonaLendingFlow';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function LendingPersonaPage() {
  return (
    <div className="container mx-auto p-6">
      <PersonaLendingFlow />
    </div>
  );
}