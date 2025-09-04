import React from 'react';
import { PersonaCard } from '@/components/ui/PersonaCard';
import { BFOHeader } from '@/components/site/BFOHeader';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import analytics from '@/lib/analytics';

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
              <PersonaCard
                title="For Families"
                actions={
                  <>
                    <a 
                      href="/families"
                      className="bfo-cta px-6 py-3 font-medium w-full text-center"
                      onClick={handleFamilyClick}
                    >
                      See How It Works
                    </a>
                    <a 
                      href="/families"
                      className="bfo-cta-secondary px-6 py-3 w-full text-center"
                      onClick={handleFamilyClick}
                    >
                      Try the Value Calculator
                    </a>
                  </>
                }
              >
                <h3 className="text-xl font-semibold text-bfo-gold mb-4">
                  Your Private Family Office—On Your Terms
                </h3>
                <p className="leading-relaxed">
                  You choose the team. You control the plan. We coordinate investments, tax, estate, insurance, and healthcare—so your family thrives for generations.
                </p>
              </PersonaCard>

              {/* Professionals Card */}
              <PersonaCard
                title="For Service Pros"
                actions={
                  <>
                    <a 
                      href="/pros"
                      className="bfo-cta px-6 py-3 font-medium w-full text-center"
                      onClick={handleProsClick}
                    >
                      Explore Tools
                    </a>
                    <a 
                      href="/pros"
                      className="bfo-cta-secondary px-6 py-3 w-full text-center"
                      onClick={handleProsClick}
                    >
                      Book a Demo
                    </a>
                  </>
                }
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  A Growth & Compliance OS for Professionals
                </h3>
                <p className="leading-relaxed mb-4">
                  Win ideal clients, automate follow-ups, coordinate with the family office, and keep audits clean.
                </p>
                <div className="text-sm text-white/60">
                  Advisors · CPAs · Attorneys · Insurance · Healthcare · Realtors · Bank/Trust
                </div>
              </PersonaCard>
            </div>
          </div>
        </section>
      </main>

      <BrandedFooter />
    </div>
  );
};