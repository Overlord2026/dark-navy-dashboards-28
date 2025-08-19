import React, { useState } from 'react';
import { FamilyHero } from '@/components/families/FamilyHero';
import FamiliesToolsBand from '@/components/families/FamiliesToolsBand';
import { FAMILY_SEGMENTS } from '@/data/familySegments';
import { analytics } from '@/lib/analytics';

const FamiliesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <FamilyHero />
        
        <div className="container mx-auto px-4 py-8 space-y-8">
        <FamiliesToolsBand />
        <section>
          <h2 className="text-xl font-semibold">Explore your path</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {FAMILY_SEGMENTS.map(s => (
              <button key={s.slug} className="text-left p-4 border rounded-xl hover:bg-muted"
                onClick={() => analytics.track('segment.view', { segment:s.slug })}>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.blurb}</div>
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