import React, { useEffect } from 'react';
import { BFOHeader } from '@/components/site/BFOHeader';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import { ProfessionalHero } from '@/components/pros/ProfessionalHero';
import { ProfessionalTabs } from '@/components/pros/ProfessionalTabs';
import { ProfessionalQuickActions } from '@/components/pros/ProfessionalQuickActions';
import { ProfessionalFeatures } from '@/components/pros/ProfessionalFeatures';
import { analytics } from '@/lib/analytics';

export default function ProsPage() {
  useEffect(() => {
    analytics.track('pros.home.viewed', {
      timestamp: Date.now(),
      source: 'direct'
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <BFOHeader />
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <ProfessionalHero />
        <ProfessionalTabs />
        <ProfessionalQuickActions />
        <ProfessionalFeatures />
      </main>
      <BrandedFooter />
    </div>
  );
}