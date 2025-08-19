import React from 'react';
import { BFOHeader } from '@/components/site/BFOHeader';
import { HomeHero } from '@/components/site/HomeHero';
import { PersonaAwareContent } from '@/components/site/PersonaAwareContent';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export default function ProsPage() {
  return (
    <div className="min-h-screen bg-background">
      <BFOHeader />
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <HomeHero />
        <PersonaAwareContent />
      </main>
      <BrandedFooter />
    </div>
  );
}