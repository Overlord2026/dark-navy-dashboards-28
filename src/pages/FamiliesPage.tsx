import React, { useState } from 'react';
import { FamilyHero } from '@/components/families/FamilyHero';
import FamiliesToolsBand from '@/components/families/FamiliesToolsBand';
import { FAMILY_SEGMENTS } from '@/data/familySegments';
import { analytics } from '@/lib/analytics';

const FamiliesPage = () => {
  return (
    <div className="min-h-screen bg-bfo-black">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <FamilyHero />
        
        <div className="container mx-auto px-4 py-8 space-y-8">
        <FamiliesToolsBand />
        <section>
          <h2 className="text-xl font-semibold text-white">Explore your path</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {FAMILY_SEGMENTS.map(s => (
              <button key={s.slug} className="bfo-card text-left p-6 hover:shadow-lg transition-all duration-200"
                onClick={() => analytics.track('segment.view', { segment:s.slug })}>
                <div className="font-medium text-white">{s.title}</div>
                <div className="text-sm text-white/70">{s.blurb}</div>
              </button>
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default FamiliesPage;