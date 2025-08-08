import React, { useState } from 'react';
import { AnimatedTreeHero } from './AnimatedTreeHero';
import { PersonaGrid } from './PersonaGrid';
import { PlatformBenefits } from './PlatformBenefits';
import { MarketplaceTestimonials } from './MarketplaceTestimonials';
import { LandingNavigation } from './LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const MarketplaceLandingPage: React.FC = () => {
  const [layoutOption, setLayoutOption] = useState<'full-tree' | 'split'>('full-tree');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center">
        {layoutOption === 'full-tree' ? (
          <div className="w-full">
            {/* Full-Page Animated Tree Hero */}
            <div className="relative h-[80vh] flex flex-col items-center justify-center">
              <AnimatedTreeHero />
              
              {/* Centered Headlines */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
                <h1 className="font-serif text-6xl lg:text-8xl font-bold text-foreground mb-6 animate-fade-in">
                  The Boutique Family Office
                </h1>
                <h2 className="font-serif text-4xl lg:text-6xl font-bold text-gold mb-8 animate-fade-in animation-delay-300">
                  Marketplace
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl leading-relaxed animate-fade-in animation-delay-600">
                  Wealth. Health. Legacy. All in one secure, fiduciary-driven platform.
                </p>
              </div>
            </div>
            
            {/* Persona Grid Below Hero */}
            <div className="container mx-auto px-4 py-16">
              <PersonaGrid />
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-16">
            {/* Split Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left: Tree Animation */}
              <div className="relative h-[60vh] lg:h-[80vh]">
                <AnimatedTreeHero />
              </div>
              
              {/* Right: Headlines + Persona Grid */}
              <div className="space-y-8">
                <div className="text-left">
                  <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-4">
                    The Boutique Family Office
                  </h1>
                  <h2 className="font-serif text-3xl lg:text-5xl font-bold text-gold mb-6">
                    Marketplace
                  </h2>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
                    Select your role to see your customized tools & benefits.
                  </p>
                </div>
                <PersonaGrid compact />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Platform Benefits Section */}
      <section className="py-24 bg-card/30">
        <PlatformBenefits />
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <MarketplaceTestimonials />
      </section>

      {/* Layout Toggle (Admin/Dev Feature) */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
          <label className="text-sm text-muted-foreground block mb-2">Layout Option:</label>
          <select 
            value={layoutOption} 
            onChange={(e) => setLayoutOption(e.target.value as 'full-tree' | 'split')}
            className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground"
          >
            <option value="full-tree">Full Tree Hero</option>
            <option value="split">Split Layout</option>
          </select>
        </div>
      </div>

      <BrandedFooter />
    </div>
  );
};