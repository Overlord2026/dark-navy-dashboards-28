import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToolGate } from '@/components/tools/ToolGate';
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
        <Card key={persona.persona + (persona.segment || '')} className="h-full flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{persona.label}</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <CardDescription className="text-sm leading-relaxed mb-6 flex-1">
              {persona.benefit}
            </CardDescription>
            
            <div className="space-y-3">
              {withFeatureFlag('DEMOS_ENABLED',
                <DemoLauncher 
                  demoId={persona.demoId}
                  trigger={
                    <Button variant="outline" className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      See 60-second demo
                    </Button>
                  }
                />
              )}
              
              {withFeatureFlag('CATALOG_ENABLED',
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => handleCatalogOpen(persona.tags?.join(',') || persona.persona)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open catalog
                </Button>
              )}
              
              <Button 
                className="w-full bg-gold hover:bg-gold-hover text-navy"
                onClick={() => handleStartWorkspace(persona.persona + (persona.segment ? `-${persona.segment}` : ''))}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                {persona.cta}
              </Button>
              
              <div className="pt-2 text-center">
                <ShareButton 
                  text={`Check this out — a secure platform to organize everything in one place and keep a record you can trust: ${persona.label}`}
                  url={window.location.href}
                  className="text-muted-foreground hover:text-foreground text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};