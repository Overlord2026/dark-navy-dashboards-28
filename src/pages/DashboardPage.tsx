import React from 'react';
import { DashboardOrchestrator } from '@/components/dashboard/DashboardOrchestrator';
import { NudgePanel } from '@/components/NudgePanel';
import { usePersonalizationStore } from '@/features/personalization/store';

export default function DashboardPage() {
  const { persona, tier } = usePersonalizationStore();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your personalized {persona} workspace with {tier} tier tools
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard Content */}
        <div className="lg:col-span-2">
          <DashboardOrchestrator />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NudgePanel />
        </div>
      </div>
    </div>
  );
}