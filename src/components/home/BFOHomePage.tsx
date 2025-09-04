import React from 'react';
import { BFOHeader } from '@/components/site/BFOHeader';
import { HomeHero } from '@/components/site/HomeHero';
import { PersonaAwareContent } from '@/components/site/PersonaAwareContent';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export function BFOHomePage() {
  return (
    <div className="min-h-screen bg-[#0B2239]">
      <BFOHeader />
      <main>
        <HomeHero />
        <PersonaAwareContent />
      </main>
      <BrandedFooter />
    </div>
  );
}