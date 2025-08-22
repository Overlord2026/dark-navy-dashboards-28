import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Play, Shield, Users } from 'lucide-react';
import personaConfig from '@/config/personaConfig.json';
import { PublicNavigation } from '@/components/discover/PublicNavigation';
import { ShareButton } from '@/components/discover/ShareButton';

const PersonaPage: React.FC = () => {
  const { persona, segment } = useParams<{ persona: string; segment?: string }>();
  const navigate = useNavigate();

  // Find personas for the current route
  const currentPersonas = useMemo(() => {
    if (segment) {
      // Specific segment (e.g., /families/aspiring, /pros/insurance/life-annuity)
      return personaConfig.filter(p => 
        p.persona === persona && p.segment === segment
      );
    } else {
      // Base persona (e.g., /families, /pros/advisors)
      return personaConfig.filter(p => p.persona === persona);
    }
  }, [persona, segment]);

  // Group by segments if multiple exist
  const groupedPersonas = useMemo(() => {
    const groups: Record<string, typeof personaConfig> = {};
    currentPersonas.forEach(p => {
      const key = p.segment || 'default';
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [currentPersonas]);

  const hasMultipleSegments = Object.keys(groupedPersonas).length > 1;
  const firstPersona = currentPersonas[0];

  if (!firstPersona) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavigation />
        <div className="pt-[var(--header-stack)] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Persona Not Found</h1>
            <p className="text-muted-foreground mb-6">The persona you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/discover')}>
              Back to Discover
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartWorkspace = (personaData: typeof firstPersona) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.persona.cta', { 
        persona: personaData.persona,
        segment: personaData.segment,
        source: 'persona_page'
      });
    }
    
    navigate('/onboarding', { 
      state: { 
        persona: personaData.persona,
        segment: personaData.segment 
      }
    });
  };

  const handleDemo = (demoId: string) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.persona.demo.open', { 
        persona,
        segment,
        demoId,
        source: 'persona_page'
      });
    }
    
    navigate(`/demos/${demoId}`);
  };

  const renderPersonaCard = (personaData: typeof firstPersona) => (
    <Card key={personaData.demoId} className="bg-card border-border">
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {personaData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {personaData.label}
        </h2>
        
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {personaData.benefit}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg"
            onClick={() => handleStartWorkspace(personaData)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            {personaData.cta}
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            onClick={() => handleDemo(personaData.demoId)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="mr-2 h-5 w-5" />
            See 60-second demo
          </Button>
          
          <ShareButton 
            text={`Check this out — a secure platform to organize everything in one place and keep a record you can trust: ${personaData.label}`}
            url={window.location.href}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {hasMultipleSegments ? (
              // Multiple segments - show tabs
              <div>
                <header className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {persona === 'families' ? 'For Families' : 
                     persona === 'insurance' ? 'Insurance Professionals' :
                     persona === 'healthcare' ? 'Healthcare Professionals' :
                     'Professional Solutions'}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Choose the solution that fits your needs
                  </p>
                </header>

                <Tabs defaultValue={Object.keys(groupedPersonas)[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    {Object.keys(groupedPersonas).map(segmentKey => {
                      const segmentPersona = groupedPersonas[segmentKey][0];
                      const displayName = segmentKey === 'aspiring' ? 'Aspiring' :
                                        segmentKey === 'retirees' ? 'Retirees' :
                                        segmentKey === 'life-annuity' ? 'Life & Annuity' :
                                        segmentKey === 'medicare-ltc' ? 'Medicare & LTC' :
                                        segmentKey === 'providers' ? 'Providers' :
                                        segmentKey === 'influencers' ? 'Coaches' :
                                        segmentPersona.label;
                      return (
                        <TabsTrigger key={segmentKey} value={segmentKey}>
                          {displayName}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {Object.entries(groupedPersonas).map(([segmentKey, segmentPersonas]) => (
                    <TabsContent key={segmentKey} value={segmentKey}>
                      <div className="space-y-6">
                        {segmentPersonas.map(renderPersonaCard)}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              // Single segment - direct display
              <div className="space-y-6">
                {currentPersonas.map(renderPersonaCard)}
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">SOC2 Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Fiduciary Standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Patent Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonaPage;