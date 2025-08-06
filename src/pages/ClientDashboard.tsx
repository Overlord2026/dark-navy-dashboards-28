import React from 'react';
import { PersonaDashboardLayout } from '@/components/dashboard/PersonaDashboardLayout';
import { WelcomeBanner } from '@/components/client/WelcomeBanner';
import { DashboardMetrics } from '@/components/client/DashboardMetrics';
import { ActionQuickLinks } from '@/components/client/ActionQuickLinks';
import { GoalCenter } from '@/components/client/GoalCenter';
import { FamilyVaultSnapshot } from '@/components/client/FamilyVaultSnapshot';
import { MarketplaceHighlights } from '@/components/client/MarketplaceHighlights';
import { EducationResources } from '@/components/client/EducationResources';
import { CelebrationProgress } from '@/components/client/CelebrationProgress';
import { SupportAlerts } from '@/components/client/SupportAlerts';

export function ClientDashboard() {
  return (
    <PersonaDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Dashboard Metrics - Top Row */}
        <DashboardMetrics />

        {/* Action Quick Links */}
        <ActionQuickLinks />

        {/* Goal Center & Timeline */}
        <GoalCenter />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Family Legacy Vault Snapshot */}
          <FamilyVaultSnapshot />

          {/* Celebration Progress */}
          <CelebrationProgress />
        </div>

        {/* Marketplace Highlights */}
        <MarketplaceHighlights />

        {/* Education & Resources */}
        <EducationResources />

        {/* Support & Alerts - Floating */}
        <SupportAlerts />
      </div>
    </PersonaDashboardLayout>
  );
}