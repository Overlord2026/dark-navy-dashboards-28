import React from 'react';
import PersonaCard from '@/components/ui/PersonaCard';
import { DemoLauncher } from './DemoLauncher';
import { ShareButton } from './ShareButton';
import { Play, ExternalLink, ArrowRight } from 'lucide-react';
import { PUBLIC_CONFIG, withFeatureFlag } from '@/config/publicConfig';
import { PERSONA_CONFIG } from '@/config/personaConfig';


export const PersonaCarousel: React.FC = () => {
  const handleCatalogOpen = (filter: string) => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.catalog.filter', { filter });
    }
    
    // Navigate to catalog with filter
    window.location.href = `/catalog?persona=${filter}`;
  };

  const handleStartWorkspace = (persona: string) => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { persona, source: 'persona_tile' });
    }
    
    // Navigate to onboarding
    window.location.href = `/onboarding?persona=${persona}`;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PERSONA_CONFIG.map((persona) => (
        <PersonaCard 
          key={persona.persona + (persona.segment || '')}
          title={persona.label}
          actions={
            <>
              {withFeatureFlag('DEMOS_ENABLED',
                <DemoLauncher 
                  demoId={persona.demoId}
                  trigger={
                    <a className="bfo-cta-secondary px-4 py-2 inline-flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      See 60-second demo
                    </a>
                  }
                />
              )}
              
              {withFeatureFlag('CATALOG_ENABLED',
                <a 
                  href={`/catalog?persona=${persona.tags?.join(',') || persona.persona}`}
                  className="bfo-cta-secondary px-4 py-2 inline-flex items-center gap-2"
                  onClick={() => handleCatalogOpen(persona.tags?.join(',') || persona.persona)}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open catalog
                </a>
              )}
              
              <a 
                href={`/onboarding?persona=${persona.persona + (persona.segment ? `-${persona.segment}` : '')}`}
                className="bfo-cta px-5 py-2 font-medium inline-flex items-center gap-2"
                onClick={() => handleStartWorkspace(persona.persona + (persona.segment ? `-${persona.segment}` : ''))}
              >
                <ArrowRight className="w-4 h-4" />
                {persona.cta}
              </a>
              
              <div className="pt-2 text-center w-full">
                <ShareButton 
                  text={`Check this out — a secure platform to organize everything in one place and keep a record you can trust: ${persona.label}`}
                  url={window.location.href}
                  className="bfo-link text-sm"
                />
              </div>
            </>
          }
        >
          <p>{persona.benefit}</p>
        </PersonaCard>
      ))}
    </div>
  );
};