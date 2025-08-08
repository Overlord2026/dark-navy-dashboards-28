import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  Calculator, 
  Scale, 
  Shield, 
  Stethoscope, 
  Building2, 
  Crown, 
  Star,
  ArrowRight
} from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';
import { useNavigate } from 'react-router-dom';
import { usePersonaContext } from '@/hooks/usePersonaContext';

export function MarketplaceLandingPage() {
  const navigate = useNavigate();
  const { updatePersonaContext } = usePersonaContext();
  const heroLogoConfig = getLogoConfig('hero');
  const brandLogoConfig = getLogoConfig('brand');

  const personas = [
    {
      id: 'family',
      title: 'Client / Family',
      icon: Users,
      description: 'Access premium wealth management tools and resources',
      route: '/onboarding'
    },
    {
      id: 'advisor', 
      title: 'Financial Advisor',
      icon: TrendingUp,
      description: 'Connect with high-net-worth clients and expand your practice',
      route: '/professional-onboarding/advisor'
    },
    {
      id: 'accountant',
      title: 'CPA / Accountant', 
      icon: Calculator,
      description: 'Serve affluent families with specialized tax strategies',
      route: '/professional-onboarding/accountant'
    },
    {
      id: 'attorney',
      title: 'Attorney / Legal',
      icon: Scale,
      description: 'Provide estate planning and legal services to wealthy families',
      route: '/professional-onboarding/attorney'
    },
    {
      id: 'insurance',
      title: 'Insurance & Medicare Agent',
      icon: Shield,
      description: 'Offer comprehensive protection strategies and coverage',
      route: '/professional-onboarding/insurance'
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Longevity Consultant',
      icon: Stethoscope,
      description: 'Deliver premium health and wellness services',
      route: '/professional-onboarding/healthcare'
    },
    {
      id: 'realtor',
      title: 'Real Estate & Property Manager',
      icon: Building2,
      description: 'Manage luxury properties and real estate investments',
      route: '/professional-onboarding/realtor'
    },
    {
      id: 'admin',
      title: 'Elite Family Office Executive',
      icon: Crown,
      description: 'Coordinate comprehensive family office operations',
      route: '/professional-onboarding/admin'
    },
    {
      id: 'coach',
      title: 'Coach / Consultant',
      icon: Star,
      description: 'Guide affluent individuals and families to success',
      route: '/professional-onboarding/coach'
    }
  ];

  const handlePersonaClick = (persona: any) => {
    const personaData = {
      id: persona.id,
      title: persona.title,
      description: persona.description,
      ctaText: 'See My Benefits',
      route: persona.route
    };
    
    updatePersonaContext(persona.id, personaData);
    navigate(persona.route);
  };

  const handleJoinMarketplace = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Watermark - Faint gold tree */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={brandLogoConfig.src}
          alt=""
          className="w-[800px] h-[800px] object-contain opacity-[0.02]"
          style={{ filter: 'sepia(1) saturate(3) hue-rotate(30deg)' }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src={heroLogoConfig.src}
              alt="Boutique Family Office™"
              className="h-20 w-auto mx-auto mb-8 sm:h-24 md:h-28 lg:h-32"
            />
          </div>

          {/* Headlines */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight font-serif">
              Your Complete Wealth &{' '}
              <span className="text-gold">Health Command Center</span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              One secure platform. All the trusted experts and tools you need.
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
              From investments to estate planning, tax optimization to proactive healthcare — 
              discover everything the ultra-wealthy use, now accessible to every family.
            </p>
          </div>
        </div>
      </section>

      {/* Persona Cards Grid */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-serif">
              Choose Your Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select your professional category to see customized benefits and tools designed for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {personas.map((persona) => {
              const IconComponent = persona.icon;
              return (
                <Card 
                  key={persona.id}
                  className="group bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-gold/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handlePersonaClick(persona)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-gold" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground font-serif">
                      {persona.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {persona.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full bg-transparent border-gold/20 text-gold hover:bg-gold/10 hover:border-gold/40 transition-all duration-300 group-hover:scale-105"
                    >
                      See My Benefits
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gold/10 to-emerald/10 rounded-2xl p-12 border border-gold/20">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 font-serif">
              Ready to Join the Elite Network?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with the world's most trusted wealth professionals and access exclusive tools designed for financial success.
            </p>
            
            <Button
              onClick={handleJoinMarketplace}
              size="lg"
              className="bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-gold-foreground font-bold text-lg px-12 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Crown className="w-6 h-6 mr-3" />
              Join the Marketplace
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            
            <p className="text-sm text-muted-foreground/60 mt-6">
              * Vetted professionals only. Membership by invitation or application.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative z-10 py-16 px-4 border-t border-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gold mb-2">10,000+</div>
              <div className="text-muted-foreground">Trusted Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald mb-2">$50B+</div>
              <div className="text-muted-foreground">Assets Under Management</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold mb-2">25+</div>
              <div className="text-muted-foreground">Years Combined Experience</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}