import React from 'react';
import { BFOHeader } from '@/components/site/BFOHeader';
import { HomeHero } from '@/components/site/HomeHero';
import { PersonaAwareContent } from '@/components/site/PersonaAwareContent';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export default function FamiliesPage() {
  return (
    <div className="min-h-screen bg-background">
      <BFOHeader />
      <main>
        <HomeHero />
        <PersonaAwareContent />
      </main>
      <BrandedFooter />
    </div>
  );
}