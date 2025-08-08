import React from 'react';
import { PersonaCard } from './PersonaCard';
import { Users, Briefcase, Calculator, Scale, Shield, Heart, Home, Crown, Target } from 'lucide-react';

interface PersonaGridProps {
  compact?: boolean;
}

export const PersonaGrid: React.FC<PersonaGridProps> = ({ compact = false }) => {
  const personas = [
    {
      id: 'client-family',
      title: 'Client / Family',
      icon: Users,
      benefits: [
        'Wealth dashboard & secure vault',
        'Investment & lending access',
        'Tax & estate planning tools'
      ],
      route: '/client-family-onboarding',
      learnMoreRoute: '/client-family-persona'
    },
    {
      id: 'financial-advisor',
      title: 'Financial Advisor',
      icon: Briefcase,
      benefits: [
        'Practice management suite',
        'Lead-to-sale engine',
        'Compliance & client analytics'
      ],
      route: '/advisor-onboarding',
      learnMoreRoute: '/advisor-persona'
    },
    {
      id: 'cpa-accountant',
      title: 'CPA / Accountant',
      icon: Calculator,
      benefits: [
        'Client tax portal & document vault',
        'CE tracking & marketing engine',
        'Compliance dashboard'
      ],
      route: '/accountant-onboarding',
      learnMoreRoute: '/accountant-persona'
    },
    {
      id: 'attorney-legal',
      title: 'Attorney / Legal',
      icon: Scale,
      benefits: [
        'Estate & trust management',
        'Client vault & CLE tracking',
        'Legal compliance tools'
      ],
      route: '/attorney-onboarding',
      learnMoreRoute: '/attorney-persona'
    },
    {
      id: 'insurance-medicare',
      title: 'Insurance + Medicare Agent',
      icon: Shield,
      benefits: [
        'Policy management & client comms',
        'Medicare call recording compliance',
        'Premium marketing tools'
      ],
      route: '/insurance-onboarding',
      learnMoreRoute: '/insurance-persona'
    },
    {
      id: 'healthcare-longevity',
      title: 'Healthcare & Longevity',
      icon: Heart,
      benefits: [
        'Patient record vault & wellness tools',
        'Marketplace for advanced diagnostics',
        'Longevity planning suite'
      ],
      route: '/healthcare-onboarding',
      learnMoreRoute: '/healthcare-persona'
    },
    {
      id: 'real-estate',
      title: 'Real Estate / Property',
      icon: Home,
      benefits: [
        'Listings & property vault',
        'Tenant management tools',
        'Client portal & analytics'
      ],
      route: '/realtor-onboarding',
      learnMoreRoute: '/realtor-persona'
    },
    {
      id: 'elite-family-office',
      title: 'Elite Family Office Executive',
      icon: Crown,
      benefits: [
        'Multi-entity management',
        'Premium analytics & concierge',
        'Global asset oversight'
      ],
      route: '/elite-family-office-onboarding',
      learnMoreRoute: '/elite-family-office-persona'
    },
    {
      id: 'coach-consultant',
      title: 'Coach / Consultant',
      icon: Target,
      benefits: [
        'Client portal & booking system',
        'Marketing tools & digital vault',
        'Revenue optimization suite'
      ],
      route: '/coach-onboarding',
      learnMoreRoute: '/coach-persona'
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Choose Your Professional Path
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each persona is designed with specialized tools, compliance features, and growth engines tailored to your profession.
        </p>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1 lg:grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} max-w-7xl mx-auto`}>
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            {...persona}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};