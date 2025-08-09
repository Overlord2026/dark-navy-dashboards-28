import React from 'react';
import { PersonaCard } from './PersonaCard';
import { Users, Briefcase, Calculator, Scale, Shield, Heart, Home, Building } from 'lucide-react';

interface PersonaGridProps {
  compact?: boolean;
}

export const PersonaGrid: React.FC<PersonaGridProps> = ({ compact = false }) => {
  const personas = [
    {
      id: 'client',
      title: 'Clients & Families',
      icon: Users,
      benefits: [
        'Wealth dashboard & secure vault',
        'Investment & lending access',
        'Tax & estate planning tools'
      ],
      route: '/persona/client'
    },
    {
      id: 'advisor',
      title: 'Financial Advisors',
      icon: Briefcase,
      benefits: [
        'Practice management suite',
        'Lead-to-sale engine',
        'Compliance & client analytics'
      ],
      route: '/persona/advisor'
    },
    {
      id: 'cpa',
      title: 'Accountants / CPAs',
      icon: Calculator,
      benefits: [
        'Client tax portal & document vault',
        'CE tracking & marketing engine',
        'Compliance dashboard'
      ],
      route: '/persona/cpa'
    },
    {
      id: 'attorney',
      title: 'Attorneys (Estate/Litigation)',
      icon: Scale,
      benefits: [
        'Estate & trust management',
        'Client vault & CLE tracking',
        'Legal compliance tools'
      ],
      route: '/persona/attorney'
    },
    {
      id: 'insurance',
      title: 'Insurance / IMO / FMO',
      icon: Shield,
      benefits: [
        'Policy management & client comms',
        'Medicare call recording compliance',
        'Premium marketing tools'
      ],
      route: '/persona/insurance'
    },
    {
      id: 'healthcare',
      title: 'Healthcare / Medicare',
      icon: Heart,
      benefits: [
        'Patient record vault & wellness tools',
        'Marketplace for advanced diagnostics',
        'Longevity planning suite'
      ],
      route: '/persona/healthcare'
    },
    {
      id: 'realtor',
      title: 'Realtors',
      icon: Home,
      benefits: [
        'Listings & property vault',
        'Tenant management tools',
        'Client portal & analytics'
      ],
      route: '/persona/realtor'
    },
    {
      id: 'org',
      title: 'Organizations (Teams/Leagues/Associations)',
      icon: Building,
      benefits: [
        'Multi-entity management',
        'Team coordination tools',
        'Group analytics & reporting'
      ],
      route: '/persona/org'
    }
  ];

  return (
    <div className="w-full">
      {/* Desktop: 2 rows x 4 columns */}
      <div className={`${compact ? 'hidden' : 'hidden md:grid'} md:grid-cols-4 gap-6 max-w-7xl mx-auto`}>
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            {...persona}
            compact={false}
          />
        ))}
      </div>

      {/* Mobile: Scrollable chips */}
      <div className={`${compact ? 'block' : 'block md:hidden'} w-full`}>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-4 scrollbar-hide">
          {personas.map((persona) => (
            <div key={persona.id} className="flex-shrink-0 w-72 snap-start">
              <PersonaCard
                {...persona}
                compact={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tablet: Grid layout for compact mode */}
      {compact && (
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              {...persona}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};