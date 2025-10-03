import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calculator, 
  GraduationCap, 
  Gavel, 
  Heart, 
  Shield,
  BookOpen,
  Building,
  ShoppingCart,
  DollarSign,
  Lock,
  Presentation
} from 'lucide-react';
import { useEventTracking } from '@/hooks/useEventTracking';

const personas = [
  {
    id: 'client',
    title: 'Client & Family',
    description: 'Comprehensive wealth management platform',
    benefits: [
      'Net worth tracking & optimization',
      'Tax-efficient planning strategies', 
      'Estate & healthcare coordination',
      'Private investment access',
      'Family governance tools'
    ],
    route: '/onboarding/client',
    icon: Users,
    gradient: 'from-primary to-primary-foreground'
  },
  {
    id: 'advisor',
    title: 'Financial Advisor', 
    description: 'Advanced tools for modern advisors',
    benefits: [
      'Client portfolio oversight',
      'Advanced tax modeling',
      'Estate planning workflows',
      'Compliance automation',
      'Client onboarding system'
    ],
    route: '/onboarding/advisor',
    icon: Presentation,
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'cpa',
    title: 'CPA / Accountant',
    description: 'Tax planning & optimization suite',
    benefits: [
      'Multi-year tax projections',
      'Entity structure optimization',
      'State residency planning',
      'Advanced retirement strategies',
      'Client collaboration tools'
    ],
    route: '/onboarding/cpa',
    icon: Calculator,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'attorney',
    title: 'Attorney (Estate/Litigation)',
    description: 'Legal practice management tools',
    benefits: [
      'Estate planning workflows',
      'Document automation',
      'Client matter tracking',
      'Secure document vault',
      'Family governance structures'
    ],
    route: '/onboarding/attorney', 
    icon: Gavel,
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'health',
    title: 'Healthcare & Longevity',
    description: 'Health wealth integration platform',
    benefits: [
      'HSA optimization strategies',
      'Longevity planning tools',
      'Healthcare cost modeling',
      'Provider network access',
      'Preventive care tracking'
    ],
    route: '/onboarding/health',
    icon: Heart,
    gradient: 'from-rose-500 to-rose-600'
  },
  {
    id: 'insurance',
    title: 'Insurance & Medicare',
    description: 'Insurance optimization & analysis',
    benefits: [
      'Medicare optimization',
      'Life insurance modeling',
      'Long-term care planning',
      'Risk assessment tools',
      'Claims management'
    ],
    route: '/onboarding/insurance',
    icon: Shield,
    gradient: 'from-orange-500 to-orange-600'
  }
];

const footerLinks = [
  { label: 'Education', href: '/education-hub', icon: BookOpen },
  { label: 'Solutions', href: '/solutions-hub', icon: Building },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  { label: 'Pricing', href: '/pricing', icon: DollarSign },
  { label: 'Security', href: '/security', icon: Lock }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { trackEvent } = useEventTracking();

  const handlePersonaClick = (persona: typeof personas[0]) => {
    trackEvent('persona_selected', `${persona.id}:${persona.title}`);
    navigate(persona.route);
  };

  const handlePrimaryCTA = () => {
    trackEvent('primary_cta_clicked', 'client_onboarding');
    navigate('/onboarding/client');
  };

  const scrollToPersonas = () => {
    trackEvent('secondary_cta_clicked', 'scroll_to_personas');
    document.getElementById('personas')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleValueCalculator = () => {
    trackEvent('value_calculator_clicked', 'sticky_button');
    navigate('/value-calculator');
  };

  return (
    <div className="min-h-screen bg-[#0B2239] text-white">
      {/* Sticky Value Calculator Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleValueCalculator}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground"
        >
          <Calculator className="mr-2 h-5 w-5" />
          See your savings
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Wealth + Health,{' '}
                <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                  Unified.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your Family Office—investments, taxes, estate, healthcare—on one secure platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handlePrimaryCTA}
                size="lg"
                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Users className="mr-2 h-5 w-5" />
                I'm a Client
              </Button>
              <Button
                onClick={scrollToPersonas}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                I'm a Professional
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Grid */}
      <section id="personas" className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-xl text-muted-foreground">
              Tailored tools and workflows for every financial professional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {personas.map((persona) => {
              const IconComponent = persona.icon;
              return (
                <Card
                  key={persona.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => handlePersonaClick(persona)}
                >
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${persona.gradient}`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{persona.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {persona.description}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {persona.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        See Tools
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-muted/10 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {footerLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  onClick={() => {
                    trackEvent('footer_link_clicked', link.label);
                    navigate(link.href);
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <IconComponent className="h-4 w-4" />
                  {link.label}
                </Button>
              );
            })}
          </div>
          
          <div className="text-center mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2024 Build Family Office. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}