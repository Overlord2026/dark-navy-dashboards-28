import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Shield, 
  Gift, 
  Heart, 
  Building, 
  Landmark, 
  BarChart3, 
  Crown, 
  Briefcase, 
  GraduationCap, 
  Stethoscope, 
  Lock, 
  Scale, 
  Home 
} from 'lucide-react';

interface CatalogItem {
  slug: string;
  title: string;
  summary: string;
  freeBlurb: string;
  premiumBlurb: string;
  icon: React.ComponentType<{ className?: string }>;
}

const catalogItems: CatalogItem[] = [
  {
    slug: 'investment-management',
    title: 'Investment Management',
    summary: 'Comprehensive portfolio optimization and wealth growth strategies',
    freeBlurb: 'Basic portfolio tracking and market insights',
    premiumBlurb: 'Advanced analytics, custom strategies, and dedicated portfolio management',
    icon: TrendingUp
  },
  {
    slug: 'tax-planning',
    title: 'Tax Planning',
    summary: 'Advanced tax strategies and optimization for high-net-worth families',
    freeBlurb: 'Tax planning fundamentals and basic strategies',
    premiumBlurb: 'Sophisticated tax structures, offshore planning, and ongoing optimization',
    icon: DollarSign
  },
  {
    slug: 'estate-planning',
    title: 'Estate Planning',
    summary: 'Legacy preservation and multi-generational wealth transfer',
    freeBlurb: 'Estate planning basics and document templates',
    premiumBlurb: 'Complex trust structures, dynasty planning, and family governance',
    icon: Users
  },
  {
    slug: 'risk-management',
    title: 'Insurance & Risk Management',
    summary: 'Comprehensive protection strategies for family wealth',
    freeBlurb: 'Basic insurance needs analysis',
    premiumBlurb: 'Captive insurance, sophisticated coverage design, and risk mitigation',
    icon: Shield
  },
  {
    slug: 'wealth-transfer',
    title: 'Wealth Transfer',
    summary: 'Strategic transfer of assets to next generations',
    freeBlurb: 'Gift and transfer planning basics',
    premiumBlurb: 'Advanced transfer techniques, valuation discounts, and tax optimization',
    icon: Gift
  },
  {
    slug: 'philanthropic-planning',
    title: 'Philanthropic Planning',
    summary: 'Charitable giving strategies and foundation management',
    freeBlurb: 'Basic charitable giving strategies',
    premiumBlurb: 'Private foundations, DAFs, and complex charitable structures',
    icon: Heart
  },
  {
    slug: 'trust-administration',
    title: 'Trust & Estate Administration',
    summary: 'Professional management of trusts and estate assets',
    freeBlurb: 'Trust basics and administration overview',
    premiumBlurb: 'Full-service trust administration and fiduciary services',
    icon: Building
  },
  {
    slug: 'private-banking',
    title: 'Private Banking',
    summary: 'Exclusive banking services and credit solutions',
    freeBlurb: 'Private banking service overview',
    premiumBlurb: 'Dedicated relationship management and custom credit facilities',
    icon: Landmark
  },
  {
    slug: 'alternative-investments',
    title: 'Alternative Investments',
    summary: 'Access to private equity, hedge funds, and unique opportunities',
    freeBlurb: 'Alternative investment education and market insights',
    premiumBlurb: 'Direct access to exclusive deals and due diligence support',
    icon: BarChart3
  },
  {
    slug: 'family-governance',
    title: 'Family Governance',
    summary: 'Structure and decision-making frameworks for family enterprises',
    freeBlurb: 'Family governance fundamentals',
    premiumBlurb: 'Custom governance structures, family constitutions, and board services',
    icon: Crown
  },
  {
    slug: 'concierge-services',
    title: 'Concierge Services',
    summary: 'Lifestyle management and family support services',
    freeBlurb: 'Basic concierge service information',
    premiumBlurb: 'Full-service lifestyle management and family office coordination',
    icon: Briefcase
  },
  {
    slug: 'education-planning',
    title: 'Education Planning',
    summary: 'Strategic planning for children\'s educational journey',
    freeBlurb: '529 plans and basic education funding',
    premiumBlurb: 'Private school planning, college consulting, and multi-generational strategies',
    icon: GraduationCap
  },
  {
    slug: 'healthcare-planning',
    title: 'Healthcare Planning',
    summary: 'Comprehensive healthcare coordination and advocacy',
    freeBlurb: 'Healthcare planning basics',
    premiumBlurb: 'Medical advocacy, specialist coordination, and wellness programs',
    icon: Stethoscope
  },
  {
    slug: 'technology-security',
    title: 'Technology & Security',
    summary: 'Digital asset protection and family cyber security',
    freeBlurb: 'Basic cyber security guidance',
    premiumBlurb: 'Comprehensive digital security, privacy protection, and tech consulting',
    icon: Lock
  },
  {
    slug: 'legal-services',
    title: 'Legal Services',
    summary: 'Specialized legal counsel for family enterprises',
    freeBlurb: 'Legal service provider directory',
    premiumBlurb: 'Dedicated legal counsel and specialized family office attorneys',
    icon: Scale
  },
  {
    slug: 'real-estate',
    title: 'Real Estate Services',
    summary: 'Investment property management and real estate strategies',
    freeBlurb: 'Real estate investment basics',
    premiumBlurb: 'Property management, deal sourcing, and real estate family office services',
    icon: Home
  }
];

export function CatalogGrid() {
  const navigate = useNavigate();

  const handleGetStarted = (slug: string) => {
    navigate(`/catalog/${slug}`);
  };

  const handleLearnMore = (slug: string) => {
    navigate(`/solutions/${slug}`);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Solution Catalog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {catalogItems.map((item) => (
            <Card key={item.slug} className="border-border hover:border-brand-gold/50 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <item.icon className="h-8 w-8 text-brand-gold mb-3" />
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black w-full"
                    onClick={() => handleGetStarted(item.slug)}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 w-full"
                    onClick={() => handleLearnMore(item.slug)}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}