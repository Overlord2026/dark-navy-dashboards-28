import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, DollarSign, Shield, TrendingUp, Heart, Home } from 'lucide-react';
import { DemoLauncher } from '@/components/discover/DemoLauncher';
import { PatentFooter } from '@/components/ui/PatentFooter';

interface SolutionHub {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  demoId: string;
  status: 'active' | 'soon';
  benefits: string[];
}

const solutionHubs: SolutionHub[] = [
  {
    id: 'annuities',
    title: 'Annuities & Income Planning',
    description: 'Clear education, calculators, and suitability checks with a fiduciary shortlist.',
    icon: <DollarSign className="h-8 w-8 text-gold" />,
    route: '/solutions/annuities',
    demoId: 'solutions-annuities',
    status: 'active',
    benefits: ['Income Calculator', 'Suitability Assessment', 'Product Comparison', 'Fiduciary Reviews']
  },
  {
    id: 'private-markets',
    title: 'Private Markets & Investments',
    description: 'Curated private investments with built-in due diligence and compliance checks.',
    icon: <TrendingUp className="h-8 w-8 text-gold" />,
    route: '/solutions/private-markets',
    demoId: 'investments-private-markets',
    status: 'active',
    benefits: ['Due Diligence AI', 'Private Alpha Signals', 'Overlap Analysis', 'Liquidity Scoring']
  },
  {
    id: 'insurance',
    title: 'Insurance & Protection',
    description: 'Life, disability, and long-term care solutions with fiduciary analysis.',
    icon: <Shield className="h-8 w-8 text-gold" />,
    route: '/solutions/insurance',
    demoId: 'insurance-life-annuity',
    status: 'active',
    benefits: ['Policy Comparison', 'Needs Analysis', 'Surrender Optimization', 'Claims Support']
  },
  {
    id: 'estate-tax',
    title: 'Estate & Tax Planning',
    description: 'Comprehensive estate and tax strategies with document automation.',
    icon: <Users className="h-8 w-8 text-gold" />,
    route: '/solutions/estate-tax',
    demoId: 'attorneys',
    status: 'soon',
    benefits: ['Estate Planning', 'Tax Optimization', 'Document Generation', 'Compliance Tracking']
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Longevity',
    description: 'Health records, longevity planning, and provider coordination.',
    icon: <Heart className="h-8 w-8 text-gold" />,
    route: '/solutions/healthcare',
    demoId: 'healthcare-providers',
    status: 'soon',
    benefits: ['Health Records', 'Longevity Planning', 'Provider Network', 'Care Coordination']
  },
  {
    id: 'real-estate',
    title: 'Real Estate & Property',
    description: 'Property management, financing, and investment analysis tools.',
    icon: <Home className="h-8 w-8 text-gold" />,
    route: '/solutions/real-estate',
    demoId: 'realtor',
    status: 'soon',
    benefits: ['Property Analysis', 'Financing Options', 'Market Intelligence', 'Investment Tracking']
  }
];

export const Solutions: React.FC = () => {
  const handleSolutionClick = (hub: SolutionHub) => {
    if (hub.status === 'active') {
      window.location.href = hub.route;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Solutions Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive financial solutions organized by specialty. 
            Each hub contains tools, calculators, education, and compliance built-in.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutionHubs.map((hub) => (
            <Card 
              key={hub.id} 
              className={`h-full flex flex-col hover:shadow-lg transition-all cursor-pointer ${
                hub.status === 'soon' ? 'opacity-75' : ''
              }`}
              onClick={() => handleSolutionClick(hub)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {hub.icon}
                  {hub.status === 'soon' && (
                    <Badge variant="outline" className="text-xs">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{hub.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {hub.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 mb-6">
                  {hub.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mt-auto">
                  <DemoLauncher 
                    demoId={hub.demoId}
                    trigger={
                      <Button variant="outline" className="w-full">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        See Demo
                      </Button>
                    }
                  />
                  
                  {hub.status === 'active' ? (
                    <Button 
                      className="w-full bg-gold hover:bg-gold-hover text-navy"
                      onClick={() => handleSolutionClick(hub)}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Explore {hub.title}
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <PatentFooter />
    </div>
  );
};