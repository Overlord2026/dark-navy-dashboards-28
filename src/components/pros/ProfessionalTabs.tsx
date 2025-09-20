import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calculator, 
  Scale, 
  Gavel, 
  Home, 
  Shield, 
  Heart, 
  Stethoscope, 
  Megaphone 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { PROFESSIONAL_SEGMENTS } from '@/config/prosEntitlements';

const iconMap = {
  trending_up: TrendingUp,
  calculator: Calculator,
  scale: Scale,
  gavel: Gavel,
  home: Home,
  shield: Shield,
  heart: Heart,
  stethoscope: Stethoscope,
  megaphone: Megaphone
};

const segmentDetails = {
  advisor: {
    title: 'Financial Advisors',
    description: 'Comprehensive wealth management platform for independent advisors and RIAs',
    features: [
      'Client portal with branded experience',
      'Advanced portfolio analytics and reporting',
      'Compliance and regulatory tools',
      'CRM with automated workflows',
      'Risk assessment and modeling'
    ],
    cta: 'Start Advisor Setup'
  },
  cpa: {
    title: 'CPAs & Accountants',
    description: 'Tax planning and accounting practice management tools',
    features: [
      'Tax planning and optimization tools',
      'Client document collection and organization',
      'Quarterly reporting automation',
      'K-1 and partnership tracking',
      'Secure client communication portal'
    ],
    cta: 'Launch CPA Tools'
  },
  attorney_estate: {
    title: 'Estate Planning Attorneys',
    description: 'Complete estate planning and trust administration platform',
    features: [
      'Estate planning document generation',
      'Trust funding and administration',
      'Asset titling exception tracking',
      'Client beneficiary management',
      'Succession planning tools'
    ],
    cta: 'Access Legal Tools'
  },
  attorney_litigation: {
    title: 'Litigation Attorneys',
    description: 'Asset protection and litigation support services',
    features: [
      'Asset discovery and analysis',
      'Financial forensics tools',
      'Expert witness coordination',
      'Case financial modeling',
      'Secure evidence management'
    ],
    cta: 'Start Litigation Support'
  },
  realtor: {
    title: 'Real Estate Professionals',
    description: 'Complete real estate transaction and wealth building platform',
    features: [
      'Client net worth analysis',
      'Real estate investment tracking',
      'Property performance analytics',
      'Client financing optimization',
      'Transaction document management'
    ],
    cta: 'Launch Realtor Tools'
  },
  insurance_life: {
    title: 'Life & Annuity Insurance',
    description: 'Insurance case design and underwriting support',
    features: [
      'Life insurance needs analysis',
      'Annuity product comparison',
      'Underwriting packet preparation',
      'Client policy tracking',
      'Commission and production reports'
    ],
    cta: 'Access Insurance Tools'
  },
  insurance_health: {
    title: 'Medicare & LTC Insurance',
    description: 'Healthcare insurance and long-term care planning',
    features: [
      'Medicare supplement analysis',
      'Long-term care planning tools',
      'Health savings account optimization',
      'Claims and benefits tracking',
      'Client health profile management'
    ],
    cta: 'Start Health Planning'
  },
  healthcare: {
    title: 'Healthcare Providers',
    description: 'Practice management and patient financial wellness',
    features: [
      'Patient financial wellness assessments',
      'Practice revenue optimization',
      'Medical practice business planning',
      'Provider network coordination',
      'Health savings and benefits planning'
    ],
    cta: 'Launch Healthcare Tools'
  },
  influencer: {
    title: 'Influencers & Content Creators',
    description: 'Creator economy wealth management and brand monetization',
    features: [
      'Creator revenue tracking and optimization',
      'Brand partnership financial analysis',
      'Content monetization strategies',
      'Tax optimization for creators',
      'Personal brand asset management'
    ],
    cta: 'Start Creator Suite'
  }
};

export function ProfessionalTabs() {
  const [activeTab, setActiveTab] = useState('advisor');
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    analytics.track('pros.tab.selected', { segment: value });
  };

  const handleSegmentCTA = (segment: string) => {
    analytics.track('pros.cta.click', { 
      cta: 'segment_onboarding',
      segment,
      source: 'tabs'
    });
    
    // Route to specific professional hubs for accountants and attorneys
    if (segment === 'cpa') {
      navigate('/pros/accountants');
    } else if (segment === 'attorney_estate' || segment === 'attorney_litigation') {
      navigate('/pros/attorneys');
    } else if (segment === 'advisor') {
      navigate('/pros/advisors');
    } else {
      navigate(`/onboarding?persona=professional&segment=${segment}`);
    }
  };

  return (
    <div id="professional-tabs" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Choose Your Professional Path
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Tailored solutions for every type of financial professional, 
          from independent advisors to specialized service providers.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-8">
          {PROFESSIONAL_SEGMENTS.map((segment) => {
            const Icon = iconMap[segment.icon as keyof typeof iconMap];
            return (
              <TabsTrigger 
                key={segment.id} 
                value={segment.id}
                className="flex flex-col gap-1 p-3 text-xs"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{segment.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PROFESSIONAL_SEGMENTS.map((segment) => {
          const details = segmentDetails[segment.id as keyof typeof segmentDetails];
          const Icon = iconMap[segment.icon as keyof typeof iconMap];
          
          return (
            <TabsContent key={segment.id} value={segment.id}>
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{details.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {details.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      size="lg"
                      onClick={() => handleSegmentCTA(segment.id)}
                      className="px-8"
                    >
                      {details.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}