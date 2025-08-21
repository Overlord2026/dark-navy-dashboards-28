import React from 'react';
import { DashboardOrchestrator } from '@/components/dashboard/DashboardOrchestrator';
import { NudgePanel } from '@/components/NudgePanel';
import { ReceiptsQuickView } from '@/components/ui/receipts-quick-view';
import { PersonaSwitcher } from '@/features/personalization/components/PersonaSwitcher';
import { usePersonalizationStore } from '@/features/personalization/store';

export default function DashboardPage() {
  const { persona, tier } = usePersonalizationStore();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-ink mb-6">Dashboard</h1>
        
        {/* First Row: Persona Switch, Nudge Panel, Receipts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl shadow-soft bg-white p-4 flex items-center justify-center">
            <PersonaSwitcher showTier={true} />
          </div>
          <NudgePanel />
          <ReceiptsQuickView />
        </div>
      </div>

      {/* Main Dashboard Modules - 2-up on desktop, stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardOrchestrator />
      </div>
    </div>
  );
}