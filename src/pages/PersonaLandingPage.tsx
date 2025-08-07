import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Calculator, 
  Scale, 
  Shield, 
  Heart, 
  Star, 
  Home, 
  BookOpen, 
  Settings,
  HelpCircle,
  LogIn,
  ArrowRight,
  Crown,
  Briefcase
} from 'lucide-react';
import { PersonaHelpModal } from '@/components/persona/PersonaHelpModal';

export interface PersonaCardData {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  ctaText: string;
  subgroups?: Array<{
    name: string;
    description: string;
  }>;
  route: string;
  featured?: boolean;
}

// Persona configuration with routing information
const personaCards: PersonaCardData[] = [
  {
    id: 'family',
    title: 'Client / Family',
    icon: Crown,
    description: 'Experience your all-in-one family wealth & health hub. Total control, secure digital vault, professional guidance, and premium resources—no sales pressure, just value.',
    ctaText: 'Claim My Profile',
    route: '/auth?persona=family&type=signup',
    featured: true
  },
  {
    id: 'advisor',
    title: 'Financial Advisor',
    icon: TrendingUp,
    description: 'All-in-one digital practice suite. Automate onboarding, analytics, campaigns, client collaboration, and compliance. Run your business on world-class tools.',
    ctaText: 'Get Started',
    route: '/auth?persona=advisor&type=signup'
  },
  {
    id: 'accountant',
    title: 'CPA / Accountant / Enrolled Agent',
    icon: Calculator,
    description: 'Advanced practice platform. Manage client docs, CE tracking, tax analytics, secure comms, and compliance in one place.',
    ctaText: 'Start Free Trial',
    route: '/auth?persona=accountant&type=signup'
  },
  {
    id: 'attorney',
    title: 'Attorney / Estate Planner',
    icon: Scale,
    description: 'Legal practice tools for estate, business, and compliance. Manage docs, CLE, clients, and connect with families and other professionals.',
    ctaText: 'Join Network',
    route: '/auth?persona=attorney&type=signup'
  },
  {
    id: 'insurance',
    title: 'Insurance Agent / Healthcare / Medicare Specialist',
    icon: Shield,
    description: 'Sell and serve securely. Compliant call recording for Medicare, client onboarding, document storage, campaign tools, and referrals.',
    ctaText: 'Start Selling',
    route: '/auth?persona=insurance&type=signup',
    subgroups: [
      {
        name: 'Medicare Supplement Specialist',
        description: 'Record and archive your enrollments for compliance—fully automated.'
      }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Longevity Consultant',
    icon: Heart,
    description: 'Power your clinic or consultancy. Patient health vaults, proactive analytics, community-building, and anchor tenant options.',
    ctaText: 'Power Your Practice',
    route: '/auth?persona=healthcare&type=signup',
    subgroups: [
      {
        name: 'Leading Clinic Partner',
        description: 'Fountain Life, Sinclair Labs, Robbins, Diamandis, or leading clinic? Claim your anchor tenant portal.'
      }
    ]
  },
  {
    id: 'influencer',
    title: 'Thought Leader / Influencer',
    icon: Star,
    description: 'Claim your reserved expert profile. Reach families, share research, build your wellness community, and access exclusive platform features.',
    ctaText: 'Claim Profile',
    route: '/auth?persona=influencer&type=signup',
    subgroups: [
      {
        name: 'VIP Expert',
        description: 'Huberman, Attia, Sinclair, Sophia, etc.—click here for reserved profiles.'
      }
    ]
  },
  {
    id: 'realtor',
    title: 'Property Manager / Realtor',
    icon: Home,
    description: 'All-in-one property management and client platform. Manage listings, compliance, comms, and offer premium experiences to your clients.',
    ctaText: 'Manage Properties',
    route: '/auth?persona=realtor&type=signup'
  },
  {
    id: 'coach',
    title: 'Coach / Consultant',
    icon: BookOpen,
    description: 'Enhance your client practice. Custom tools for tracking, education, and community-building.',
    ctaText: 'Build Practice',
    route: '/auth?persona=coach&type=signup'
  },
  {
    id: 'admin',
    title: 'Admin / Compliance Officer',
    icon: Settings,
    description: 'Comprehensive dashboard for system oversight, compliance workflows, user management, and analytics.',
    ctaText: 'Access Dashboard',
    route: '/auth?persona=admin&type=signup'
  }
];

export const PersonaLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handlePersonaSelect = (persona: PersonaCardData) => {
    // Store persona context in localStorage for the onboarding flow
    localStorage.setItem('selectedPersona', persona.id);
    localStorage.setItem('personaData', JSON.stringify(persona));
    
    // Navigate to the appropriate route
    navigate(persona.route);
  };

  const getPersonaGradient = (personaId: string) => {
    switch (personaId) {
      case 'family':
        return 'from-gold/20 to-navy/10';
      case 'advisor':
        return 'from-emerald/20 to-navy/10';
      case 'accountant':
        return 'from-warning/20 to-navy/10';
      case 'attorney':
        return 'from-destructive/20 to-navy/10';
      case 'insurance':
        return 'from-accent/20 to-navy/10';
      case 'healthcare':
        return 'from-success/20 to-navy/10';
      case 'influencer':
        return 'from-gold/20 to-accent/10';
      case 'realtor':
        return 'from-primary/20 to-navy/10';
      case 'coach':
        return 'from-emerald/20 to-accent/10';
      case 'admin':
        return 'from-muted/20 to-navy/10';
      default:
        return 'from-navy/20 to-muted/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy/80">
      {/* Header Navigation */}
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-gold">
            Family Office Marketplace
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelpModal(true)}
              className="text-foreground hover:text-gold transition-colors touch-target"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth?type=login')}
              className="border-gold text-gold hover:bg-gold hover:text-navy transition-all touch-target"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Welcome to the Boutique Family Office Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
            <span className="text-gold font-semibold">Wealth</span>, <span className="text-emerald font-semibold">Health</span>, and <span className="text-primary font-semibold">Family</span>. All in one secure place.
          </p>
          <p className="text-lg text-muted-foreground">
            Discover what's possible when premium technology meets personalized service.
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {personaCards.map((persona) => {
            const IconComponent = persona.icon;
            
            return (
              <Card 
                key={persona.id}
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl border-border/50
                  bg-gradient-to-br ${getPersonaGradient(persona.id)}
                  ${persona.featured ? 'ring-2 ring-gold/50' : ''}
                `}
                onClick={() => handlePersonaSelect(persona)}
              >
                {persona.featured && (
                  <Badge className="absolute top-4 right-4 bg-gold text-navy font-semibold">
                    Popular
                  </Badge>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-foreground/10 backdrop-blur-sm">
                      <IconComponent className="h-8 w-8 text-gold" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-serif text-foreground leading-tight">
                        {persona.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <CardDescription className="text-foreground/80 leading-relaxed line-clamp-4">
                    {persona.description}
                  </CardDescription>
                  
                  {persona.subgroups && (
                    <div className="space-y-2">
                      {persona.subgroups.map((subgroup, index) => (
                        <div key={index} className="p-3 rounded-lg bg-foreground/5 border border-border/30">
                          <p className="text-sm font-medium text-emerald mb-1">
                            {subgroup.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subgroup.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-gold text-navy hover:bg-gold/90 transition-all font-semibold touch-target group"
                    size="lg"
                  >
                    {persona.ctaText}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowHelpModal(true)}
            className="text-muted-foreground hover:text-gold transition-colors touch-target"
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            Not sure? Click here to get a quick guide to choosing your experience.
          </Button>
        </div>
      </main>

      {/* Help Modal */}
      <PersonaHelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        personas={personaCards}
      />
    </div>
  );
};