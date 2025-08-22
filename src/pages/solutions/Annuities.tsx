import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, BookOpen, Shield, Users, ArrowRight, Play } from 'lucide-react';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import { PatentFooter } from '@/components/ui/PatentFooter';
import { PUBLIC_CONFIG, withFeatureFlag } from '@/config/publicConfig';

interface AnnuitySection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tools: string[];
  route: string;
  status: 'active' | 'soon';
}

const annuitySections: AnnuitySection[] = [
  {
    id: 'education',
    title: 'Annuity Education Center',
    description: 'Clear, unbiased education about annuity types, benefits, and suitability.',
    icon: <BookOpen className="h-6 w-6 text-gold" />,
    tools: ['Product Types Guide', 'Suitability Framework', 'Fee Analysis', 'Risk Assessment'],
    route: '/annuities/education',
    status: 'active'
  },
  {
    id: 'calculators',
    title: 'Income & Payout Calculators',
    description: 'Calculate income projections, surrender values, and optimal timing.',
    icon: <Calculator className="h-6 w-6 text-gold" />,
    tools: ['Income Calculator', 'Surrender Analyzer', 'Comparison Tool', 'Tax Impact Calculator'],
    route: '/annuities/calculators',
    status: 'active'
  },
  {
    id: 'suitability',
    title: 'Suitability Assessment',
    description: 'AI-powered suitability analysis with compliance documentation.',
    icon: <Shield className="h-6 w-6 text-gold" />,
    tools: ['Risk Tolerance Quiz', 'Suitability Score', 'Compliance Report', 'Documentation Pack'],
    route: '/annuities/suitability',
    status: 'active'
  },
  {
    id: 'fiduciary',
    title: 'Fiduciary Shortlist',
    description: 'Curated products that meet fiduciary standards with clear explanations.',
    icon: <Users className="h-6 w-6 text-gold" />,
    tools: ['Product Screening', 'Fee Comparison', 'Fiduciary Analysis', 'Provider Ratings'],
    route: '/annuities/fiduciary',
    status: 'soon'
  }
];

export const Annuities: React.FC = () => {
  const handleSectionClick = (section: AnnuitySection) => {
    if (section.status === 'active') {
      window.location.href = section.route;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Annuities & Income Planning
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Clear annuity education, calculators, proposal review with suitability checks, 
            and a fiduciary shortlist—finally in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {withFeatureFlag('DEMOS_ENABLED',
              <DemoLauncher 
                demoId="solutions-annuities"
                trigger={
                  <Button size="lg" className="bg-gold hover:bg-gold-hover text-navy">
                    <Play className="mr-2 h-5 w-5" />
                    See 60-Second Demo
                  </Button>
                }
              />
            )}
            <Button variant="outline" size="lg" asChild>
              <a href="/onboarding?focus=annuities">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Planning
              </a>
            </Button>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {annuitySections.map((section) => (
            <Card 
              key={section.id} 
              className={`h-full flex flex-col hover:shadow-lg transition-all cursor-pointer ${
                section.status === 'soon' ? 'opacity-75' : ''
              }`}
              onClick={() => handleSectionClick(section)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  {section.status === 'soon' && (
                    <Badge variant="outline" className="text-xs">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {section.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="space-y-2 mb-6">
                  {section.tools.map((tool, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {tool}
                    </div>
                  ))}
                </div>
                
                {section.status === 'active' ? (
                  <Button 
                    className="w-full"
                    onClick={() => handleSectionClick(section)}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Open Tools
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Benefits */}
        <div className="bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Why Our Annuity Platform?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fiduciary Standard</h3>
              <p className="text-sm text-muted-foreground">
                Every recommendation follows fiduciary principles with clear documentation.
              </p>
            </div>
            <div className="text-center">
              <Calculator className="h-12 w-12 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transparent Calculations</h3>
              <p className="text-sm text-muted-foreground">
                See exactly how projections work with step-by-step breakdowns.
              </p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Education First</h3>
              <p className="text-sm text-muted-foreground">
                Understand before you commit with our comprehensive education center.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <PatentFooter />
    </div>
  );
};