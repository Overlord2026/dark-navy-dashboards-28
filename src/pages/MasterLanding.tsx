import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAppEventTracking } from '@/hooks/useEventTracking';
import { 
  Calculator, 
  Users, 
  Building, 
  Scale, 
  Heart, 
  Shield,
  TreePine,
  ArrowRight,
  TrendingUp,
  Globe
} from 'lucide-react';

const personas = [
  {
    id: 'client-family',
    title: 'Client Family',
    description: 'Comprehensive wealth management for growing families',
    icon: Users,
    route: '/marketplace?persona=client'
  },
  {
    id: 'financial-advisor',
    title: 'Financial Advisor',
    description: 'Tools and resources for financial professionals',
    icon: TrendingUp,
    route: '/marketplace?persona=advisor'
  },
  {
    id: 'accountant',
    title: 'Accountant',
    description: 'Tax planning and compliance solutions',
    icon: Calculator,
    route: '/marketplace?persona=accountant'
  },
  {
    id: 'attorney',
    title: 'Attorney',
    description: 'Estate planning and legal services',
    icon: Scale,
    route: '/estate-planning'
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Medical professionals financial planning',
    icon: Heart,
    route: '/marketplace?persona=healthcare'
  },
  {
    id: 'insurance',
    title: 'Insurance',
    description: 'Risk management and protection strategies',
    icon: Shield,
    route: '/marketplace?persona=insurance'
  }
];

const secondRowPersonas = [
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'Large organization financial solutions',
    icon: Building,
    route: '/marketplace?persona=enterprise'
  },
  {
    id: 'nonprofit',
    title: 'Nonprofit',
    description: 'Mission-driven organization support',
    icon: Globe,
    route: '/marketplace?persona=nonprofit'
  }
];

export default function MasterLanding() {
  const navigate = useNavigate();
  const { trackLandingView, trackPersonaCardClick, trackCtaClick } = useAppEventTracking();

  useEffect(() => {
    trackLandingView();
  }, [trackLandingView]);

  const handlePersonaClick = (persona: typeof personas[0]) => {
    trackPersonaCardClick(persona.id);
    navigate(persona.route);
  };

  const handleCalculatorClick = () => {
    trackCtaClick('calculate_savings', '/value-calculator');
    navigate('/value-calculator');
  };

  const handleMarketplaceClick = () => {
    trackCtaClick('explore_marketplace', '/marketplace');
    navigate('/marketplace');
  };

  const handleMagicLinkClick = () => {
    trackCtaClick('magic_link');
    navigate('/magic-link');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section with Animated Tree */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Tree Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <TreePine className="h-24 w-24 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
              Build Family Office
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive wealth management and family office services
              <br />
              for families, professionals, and organizations
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={handleCalculatorClick}
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-all duration-200"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Your Savings
              </Button>
              <Button
                onClick={handleMarketplaceClick}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 hover:scale-105 transition-all duration-200"
              >
                <Globe className="h-5 w-5 mr-2" />
                Explore Marketplace
              </Button>
            </div>

            {/* Magic Link */}
            <div className="text-center">
              <Button
                onClick={handleMagicLinkClick}
                variant="ghost"
                className="text-muted-foreground hover:text-primary"
              >
                Already invited? Enter your magic link
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Cards - First Row */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored solutions for every financial need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            return (
              <Card
                key={persona.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur-sm"
                onClick={() => handlePersonaClick(persona)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {persona.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{persona.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Second Row - Revealed on Scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto opacity-75">
          {secondRowPersonas.map((persona) => {
            const IconComponent = persona.icon;
            return (
              <Card
                key={persona.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-card/30 backdrop-blur-sm"
                onClick={() => handlePersonaClick(persona)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {persona.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{persona.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-card/30 border-t">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of families and professionals who have optimized their wealth management strategy
          </p>
          <Button
            onClick={handleCalculatorClick}
            size="lg"
            className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-glow hover:scale-105 transition-all duration-200"
          >
            Start Your Free Calculation
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}