import React from 'react';
import { SpendingAnalysis } from '@/components/budget/SpendingAnalysis';
import PersonaOnboarding from "@/components/pros/PersonaOnboarding";

export default function SpendingReportsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <PersonaOnboarding />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Spending Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive spending analysis and category breakdown
          </p>
        </div>
      </div>

      <SpendingAnalysis />
    </div>
  );
}