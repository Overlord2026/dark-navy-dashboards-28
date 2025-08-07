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
  Briefcase,
  ChevronRight,
  CheckCircle,
  Vault,
  BrainCircuit,
  Target,
  Building,
  GraduationCap,
  MessageSquare
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
    ctaText: 'See My Experience',
    route: '/persona-preview/family',
    featured: true
  },
  {
    id: 'advisor',
    title: 'Financial Advisor',
    icon: TrendingUp,
    description: 'All-in-one digital practice suite. Automate onboarding, analytics, campaigns, client collaboration, and compliance. Run your business on world-class tools.',
    ctaText: 'Explore Practice Suite',
    route: '/persona-preview/advisor'
  },
  {
    id: 'accountant',
    title: 'CPA / Accountant',
    icon: Calculator,
    description: 'Advanced practice platform. Manage client docs, CE tracking, tax analytics, secure comms, and compliance in one place.',
    ctaText: 'View Practice Tools',
    route: '/persona-preview/accountant'
  },
  {
    id: 'attorney',
    title: 'Attorney / Estate Planner',
    icon: Scale,
    description: 'Legal practice tools for estate, business, and compliance. Manage docs, CLE, clients, and connect with families and other professionals.',
    ctaText: 'Explore Legal Suite',
    route: '/persona-preview/attorney'
  },
  {
    id: 'insurance',
    title: 'Insurance Agent',
    icon: Shield,
    description: 'Sell and serve securely. Compliant call recording for Medicare, client onboarding, document storage, campaign tools, and referrals.',
    ctaText: 'See Agent Tools',
    route: '/persona-preview/insurance',
    subgroups: [
      {
        name: 'Medicare Specialist',
        description: 'Compliance recording & enrollment automation'
      }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare Consultant',
    icon: Heart,
    description: 'Power your clinic or consultancy. Patient health vaults, proactive analytics, community-building, and anchor tenant options.',
    ctaText: 'Power Your Practice',
    route: '/persona-preview/healthcare',
    subgroups: [
      {
        name: 'Anchor Clinic',
        description: 'Fountain Life, Sinclair Labs & leading clinics'
      }
    ]
  },
  {
    id: 'influencer',
    title: 'Thought Leader',
    icon: Star,
    description: 'Claim your reserved expert profile. Reach families, share research, build your wellness community, and access exclusive platform features.',
    ctaText: 'View VIP Profile',
    route: '/persona-preview/influencer',
    subgroups: [
      {
        name: 'Reserved Profiles',
        description: 'Huberman, Attia, Sinclair & expert network'
      }
    ]
  },
  {
    id: 'realtor',
    title: 'Property Manager',
    icon: Home,
    description: 'All-in-one property management and client platform. Manage listings, compliance, comms, and offer premium experiences to your clients.',
    ctaText: 'Manage Properties',
    route: '/persona-preview/realtor'
  },
  {
    id: 'business',
    title: 'Business Owner',
    icon: Briefcase,
    description: 'Executive dashboard for business owners. Manage company finances, employee benefits, succession planning, and executive perks.',
    ctaText: 'Executive Access',
    route: '/persona-preview/business'
  },
  {
    id: 'admin',
    title: 'Admin / Compliance',
    icon: Settings,
    description: 'Comprehensive dashboard for system oversight, compliance workflows, user management, and analytics.',
    ctaText: 'Admin Dashboard',
    route: '/persona-preview/admin'
  }
];

// Key Benefits for the platform
const keyBenefits = [
  {
    icon: Target,
    title: '360° Wealth Management',
    description: 'Comprehensive view of all assets, investments, and financial goals in one secure platform.'
  },
  {
    icon: Vault,
    title: 'Secure Family Vault',
    description: 'Encrypted storage for all important documents, wills, trusts, and legacy planning materials.'
  },
  {
    icon: Heart,
    title: 'Proactive Healthcare Hub',
    description: 'Health optimization, longevity planning, and wellness coordination for your entire family.'
  },
  {
    icon: Building,
    title: 'Family Office Marketplace',
    description: 'Connect with vetted professionals and access premium services tailored to your needs.'
  },
  {
    icon: BrainCircuit,
    title: 'AI Concierge Copilot',
    description: 'Smart assistant for reminders, insights, and proactive recommendations.'
  },
  {
    icon: TrendingUp,
    title: 'Practice Management',
    description: 'Professional tools for advisors, attorneys, CPAs, and other service providers.'
  },
  {
    icon: GraduationCap,
    title: 'Learning Center',
    description: 'Premium education, research, and training materials for all family members.'
  },
  {
    icon: MessageSquare,
    title: 'Secure Collaboration',
    description: 'Private messaging, document sharing, and family coordination tools.'
  }
];

export const UniversalLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handlePersonaSelect = (persona: PersonaCardData) => {
    // Store persona context in localStorage for the preview
    localStorage.setItem('selectedPersona', persona.id);
    localStorage.setItem('personaData', JSON.stringify(persona));
    
    // Navigate to the persona preview page
    navigate(persona.route);
  };

  const getPersonaGradient = (personaId: string) => {
    switch (personaId) {
      case 'family':
        return 'from-gold/20 to-navy/10 border-gold/30';
      case 'advisor':
        return 'from-emerald/20 to-navy/10 border-emerald/30';
      case 'accountant':
        return 'from-warning/20 to-navy/10 border-warning/30';
      case 'attorney':
        return 'from-destructive/20 to-navy/10 border-destructive/30';
      case 'insurance':
        return 'from-accent/20 to-navy/10 border-accent/30';
      case 'healthcare':
        return 'from-success/20 to-navy/10 border-success/30';
      case 'influencer':
        return 'from-gold/20 to-accent/10 border-gold/30';
      case 'realtor':
        return 'from-primary/20 to-navy/10 border-primary/30';
      case 'business':
        return 'from-navy/20 to-gold/10 border-navy/30';
      case 'admin':
        return 'from-muted/20 to-navy/10 border-muted/30';
      default:
        return 'from-navy/20 to-muted/10 border-border/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy/80">
      {/* Header Navigation */}
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-gold">
            Boutique Family Office™
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#benefits" className="text-muted-foreground hover:text-gold transition-colors">Solutions</a>
            <a href="#personas" className="text-muted-foreground hover:text-gold transition-colors">Choose Experience</a>
            <a href="#education" className="text-muted-foreground hover:text-gold transition-colors">Education</a>
            <a href="#marketplace" className="text-muted-foreground hover:text-gold transition-colors">Marketplace</a>
          </nav>
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
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
            Welcome to Boutique Family Office™
          </h1>
          <p className="text-2xl md:text-3xl text-gold mb-6 font-light">
            Your Global Wealth, Health & Family Command Center
          </p>
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl md:text-2xl text-foreground mb-4 font-medium">
              All Your Wealth. All Your Advisors. All Under One Roof.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Access world-class tools for clients, advisors, attorneys, accountants, healthcare experts, insurance agents, and more. 
              <br className="hidden md:block" />
              See your benefits. Choose your experience. Discover the difference.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gold text-navy hover:bg-gold/90 font-semibold text-lg px-8 py-4 touch-target"
              onClick={() => document.getElementById('personas')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Choose Your Experience
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-emerald text-emerald hover:bg-emerald hover:text-navy font-semibold text-lg px-8 py-4 touch-target"
              onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Benefits
            </Button>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section id="benefits" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              What You Get
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive platform designed for high-net-worth families and the professionals who serve them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="bg-background/50 border-border/50 hover:bg-background/80 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-lg bg-gold/10">
                      <IconComponent className="h-8 w-8 text-gold" />
                    </div>
                    <CardTitle className="text-lg font-serif text-foreground">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="text-center mb-20">
          <div className="bg-gradient-to-r from-gold/10 to-emerald/10 rounded-2xl p-12 border border-gold/20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Who Are You? Select Below to See Your Experience:
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Each persona gets a tailored dashboard, features, and experience designed for their specific needs.
            </p>
          </div>
        </section>

        {/* Persona Cards Grid */}
        <section id="personas" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {personaCards.map((persona) => {
              const IconComponent = persona.icon;
              
              return (
                <Card 
                  key={persona.id}
                  className={`
                    relative overflow-hidden cursor-pointer transition-all duration-300 
                    hover:scale-105 hover:shadow-2xl 
                    bg-gradient-to-br ${getPersonaGradient(persona.id)}
                    ${persona.featured ? 'ring-2 ring-gold/50' : ''}
                  `}
                  onClick={() => handlePersonaSelect(persona)}
                >
                  {persona.featured && (
                    <Badge className="absolute top-4 right-4 bg-gold text-navy font-semibold">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-foreground/10 backdrop-blur-sm">
                        <IconComponent className="h-8 w-8 text-gold" />
                      </div>
                      <CardTitle className="text-lg font-serif text-foreground leading-tight flex-1">
                        {persona.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <CardDescription className="text-foreground/80 leading-relaxed text-sm line-clamp-3">
                      {persona.description}
                    </CardDescription>
                    
                    {persona.subgroups && (
                      <div className="space-y-2">
                        {persona.subgroups.map((subgroup, index) => (
                          <div key={index} className="p-2 rounded-lg bg-foreground/5 border border-border/30">
                            <p className="text-xs font-medium text-emerald mb-1">
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
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Help Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto bg-background/50 border-border/50">
            <CardContent className="pt-8">
              <HelpCircle className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Need Help Choosing?
              </h3>
              <p className="text-muted-foreground mb-6">
                Not sure which experience is right for you? Take our quick assessment to find your perfect match.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowHelpModal(true)}
                className="border-gold text-gold hover:bg-gold hover:text-navy transition-all font-semibold touch-target"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Get a Quick Guide to Choosing Your Experience
              </Button>
            </CardContent>
          </Card>
        </section>
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