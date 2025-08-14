import React from 'react';
import { Button } from '@/components/ui/button';
import { BFOHeader } from '@/components/site/BFOHeader';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import { analytics } from '@/lib/analytics';

export const SplitHeroLanding: React.FC = () => {
  const handleFamilyClick = () => {
    localStorage.setItem('persona_group', 'family');
    document.cookie = 'persona_group=family;path=/;SameSite=Lax';
    window.dispatchEvent(new CustomEvent('persona-switched', { detail: { group: 'family' } }));
    analytics.track('persona.selected', { group: 'family', source: 'split_hero' });
    analytics.track('hero.cta.clicked', { group: 'family', cta: 'see_how_it_works' });
    window.location.href = '/families';
  };

  const handleProsClick = () => {
    localStorage.setItem('persona_group', 'pro');
    document.cookie = 'persona_group=pro;path=/;SameSite=Lax';
    window.dispatchEvent(new CustomEvent('persona-switched', { detail: { group: 'pro' } }));
    analytics.track('persona.selected', { group: 'pro', source: 'split_hero' });
    analytics.track('hero.cta.clicked', { group: 'pro', cta: 'explore_tools' });
    window.location.href = '/pros';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BFOHeader showPersonaBanner={false} />
      
      <main className="flex-1">
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
                Choose Your Path
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tailored solutions for families and financial service professionals
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Families Card */}
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    For Families
                  </h2>
                  <h3 className="text-xl font-semibold text-emerald-600 mb-4">
                    Your Private Family Office—On Your Terms
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You choose the team. You control the plan. We coordinate investments, tax, estate, insurance, and healthcare—so your family thrives for generations.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleFamilyClick}
                  >
                    See How It Works
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    onClick={handleFamilyClick}
                  >
                    Try the Value Calculator
                  </Button>
                </div>
              </div>

              {/* Professionals Card */}
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    For Service Pros
                  </h2>
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">
                    A Growth & Compliance OS for Professionals
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Win ideal clients, automate follow-ups, coordinate with the family office, and keep audits clean.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleProsClick}
                  >
                    Explore Tools
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={handleProsClick}
                  >
                    Book a Demo
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Advisors · CPAs · Attorneys · Insurance · Healthcare · Realtors · Bank/Trust
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BrandedFooter />
    </div>
  );
};