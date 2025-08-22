import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DemoLauncher } from './DemoLauncher';
import { ShareButton } from './ShareButton';
import { Play, ExternalLink, ArrowRight } from 'lucide-react';

interface PersonaTile {
  id: string;
  title: string;
  benefit: string;
  demoId: string;
  catalogFilter: string;
}

const personas: PersonaTile[] = [
  {
    id: 'families',
    title: 'Families',
    benefit: 'All your financial and health life in one private workspace. Organize accounts, estate docs, properties, taxes, meds & tests; invite advisors/CPAs/attorneys/clinicians; export a clean "what & why" pack anytime.',
    demoId: 'families',
    catalogFilter: 'families'
  },
  {
    id: 'advisors',
    title: 'Advisors',
    benefit: 'A full-stack platform to run your practice—lead to lifelong client—in one place.',
    demoId: 'advisors',
    catalogFilter: 'advisor'
  },
  {
    id: 'cpas',
    title: 'CPAs',
    benefit: 'Engagements in one place—requests, deliverables, signatures, retention—organized and audit-ready.',
    demoId: 'cpas',
    catalogFilter: 'cpa'
  },
  {
    id: 'attorneys',
    title: 'Attorneys',
    benefit: 'Matters, authority, signatures, and the evidence trail—defensible and easy to share.',
    demoId: 'attorneys',
    catalogFilter: 'attorney'
  },
  {
    id: 'insurance',
    title: 'Insurance',
    benefit: 'Run quotes, replacements, enrollments and renewals—with receipts—without leaving the platform.',
    demoId: 'insurance',
    catalogFilter: 'insurance'
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    benefit: 'One secure window to the family\'s shared essentials. Prepare prior-auth packs, return results to the family vault—no extra portals.',
    demoId: 'healthcare',
    catalogFilter: 'healthcare'
  },
  {
    id: 'realtor',
    title: 'Realtor',
    benefit: 'Listings, offers, closings—plus your client\'s financial docs—organized and audit-ready.',
    demoId: 'realtor',
    catalogFilter: 'realtor'
  },
  {
    id: 'nil-athlete',
    title: 'NIL (Athlete/Parent)',
    benefit: 'Training → Disclosures → Offers → Payments—done right and kept on record.',
    demoId: 'nil-athlete',
    catalogFilter: 'nil-athlete'
  },
  {
    id: 'nil-school',
    title: 'NIL (School/Brand)',
    benefit: 'Publish rules once, verify automatically—fewer disputes, faster launches.',
    demoId: 'nil-school',
    catalogFilter: 'nil-school'
  }
];

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
      {personas.map((persona) => (
        <Card key={persona.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{persona.title}</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <CardDescription className="text-sm leading-relaxed mb-6 flex-1">
              {persona.benefit}
            </CardDescription>
            
            <div className="space-y-3">
              <DemoLauncher 
                demoId={persona.demoId}
                trigger={
                  <Button variant="outline" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    See 60-second demo
                  </Button>
                }
              />
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => handleCatalogOpen(persona.catalogFilter)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open catalog
              </Button>
              
              <Button 
                className="w-full bg-gold hover:bg-gold-hover text-navy"
                onClick={() => handleStartWorkspace(persona.id)}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Start workspace
              </Button>
              
              <div className="pt-2 text-center">
                <ShareButton 
                  text={`Check this out — a secure platform to organize everything in one place and keep a record you can trust: ${persona.title}`}
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