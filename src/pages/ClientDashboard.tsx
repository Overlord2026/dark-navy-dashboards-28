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
import { PersonalizedCTA } from '@/components/client/PersonalizedCTA';
import { MilestoneTracker } from '@/components/client/MilestoneTracker';
import { RetirementTimeline } from '@/components/client/RetirementTimeline';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { usePersona } from '@/hooks/usePersona';
import { CEUpsellCard } from '@/components/compliance/CEUpsellCard';
import { usePersonaRole } from '@/hooks/usePersonaRole';
import K401BenefitsBand from '@/features/k401/BenefitsBand';

export function ClientDashboard() {
  // Track dashboard metrics for A/B testing
  useDashboardMetrics();
  const { personaConfig } = usePersona();
  const { persona: cePersona, isEligibleForCE } = usePersonaRole();

  return (
    <PersonaDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Personalized CTA */}
        <PersonalizedCTA />

        {/* CE Upsell Card - Above the fold for eligible personas */}
        {isEligibleForCE && cePersona && (
          <CEUpsellCard userPersona={cePersona} />
        )}

        {/* Dashboard Metrics - Top Row */}
        <DashboardMetrics />

        {/* Action Quick Links */}
        <ActionQuickLinks />

        {/* Persona-specific features */}
        {personaConfig.features.showRetirementTimeline && <RetirementTimeline />}
        {personaConfig.features.showMilestoneTracker && <MilestoneTracker />}

        {/* Goal Center & Timeline */}
        <GoalCenter />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Family Legacy Vault Snapshot - Only for HNW and Family Admin */}
          {personaConfig.features.showLegacyVault && <FamilyVaultSnapshot />}

          {/* Celebration Progress */}
          <CelebrationProgress />
        </div>

        {/* 401(k) Benefits */}
        <K401BenefitsBand persona="family" />

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