/**
 * Dynamic Tool Card Component
 * Uses standardized HSL color system with persona-specific styling
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonaType } from './PersonaCard';

interface ToolCardProps {
  title: string;
  features: string[];
  tagline: string;
  persona: PersonaType;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
}

// Persona-specific styling using our HSL system
const personaToolStyles: Record<PersonaType, {
  cardBg: string;
  borderColor: string;
  iconColor: string;
  taglineColor: string;
}> = {
  family: {
    cardBg: 'bg-brand-black', // Pure black background
    borderColor: 'border-brand-gold', // Gold border
    iconColor: 'text-brand-gold',
    taglineColor: 'text-brand-gold',
  },
  advisor: {
    cardBg: 'bg-[hsl(210_65%_13%)]', // Navy background
    borderColor: 'border-[hsl(220_100%_70%)]', // Sky blue border
    iconColor: 'text-[hsl(220_100%_70%)]',
    taglineColor: 'text-[hsl(220_100%_70%)]',
  },
  attorney: {
    cardBg: 'bg-[hsl(210_65%_13%)]', // Navy background
    borderColor: 'border-[hsl(336_66%_28%)]', // Burgundy border
    iconColor: 'text-[hsl(336_66%_28%)]',
    taglineColor: 'text-[hsl(336_66%_28%)]',
  },
  insurance: {
    cardBg: 'bg-[hsl(210_65%_13%)]', // Navy background
    borderColor: 'border-destructive', // Alert red border
    iconColor: 'text-destructive',
    taglineColor: 'text-destructive',
  },
  healthcare: {
    cardBg: 'bg-[hsl(210_65%_13%)]', // Navy background
    borderColor: 'border-[hsl(233_47%_44%)]', // Indigo border
    iconColor: 'text-[hsl(233_47%_44%)]',
    taglineColor: 'text-[hsl(233_47%_44%)]',
  },
  nil: {
    cardBg: 'bg-[hsl(210_65%_13%)]', // Navy background
    borderColor: 'border-emerald', // Emerald border
    iconColor: 'text-emerald',
    taglineColor: 'text-emerald',
  },
  accountant: {
    cardBg: 'bg-[hsl(210_65%_13%)]', // Navy background
    borderColor: 'border-emerald', // Mint border
    iconColor: 'text-emerald',
    taglineColor: 'text-emerald',
  },
};

export function ToolCard({
  title,
  features,
  tagline,
  persona,
  icon: Icon,
  className,
  onClick,
}: ToolCardProps) {
  const styles = personaToolStyles[persona];

  return (
    <div
      className={cn(
        // Base card styling with proper contrast
        'rounded-lg p-4 border-2 shadow-lg transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1 cursor-pointer',
        // Persona-specific colors from our HSL system
        styles.cardBg,
        styles.borderColor,
        className
      )}
      onClick={onClick}
    >
      {/* Icon and Title Row */}
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <Icon 
            className={cn('h-6 w-6', styles.iconColor)} 
            strokeWidth={2}
          />
        )}
        <h3 className="text-white font-semibold text-lg">
          {title}
        </h3>
      </div>

      {/* Features List */}
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li 
            key={index} 
            className="text-white/90 text-sm flex items-start gap-2"
          >
            <span className={cn('text-xs mt-1', styles.iconColor)}>•</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Tagline */}
      <p className={cn(
        'text-sm font-medium italic',
        styles.taglineColor
      )}>
        {tagline}
      </p>
    </div>
  );
}

// Example usage components for different personas
export function RegBIToolCard() {
  return (
    <ToolCard
      title="Reg BI Tracker"
      persona="advisor"
      features={[
        'Automated compliance monitoring',
        'Client interaction logging', 
        'Suitability analysis reports',
        'Real-time violation alerts'
      ]}
      tagline="Stay compliant, save hours"
    />
  );
}

export function InsuranceRecordsCard() {
  return (
    <ToolCard
      title="10-Year Records Vault"
      persona="insurance"
      features={[
        'NAIC-compliant record retention',
        'Automated policy tracking',
        'Claim documentation system',
        'Audit-ready reports'
      ]}
      tagline="Secure. Compliant. Accessible."
    />
  );
}

export function AttorneyEthicsCard() {
  return (
    <ToolCard
      title="Ethics Compliance Hub"
      persona="attorney"
      features={[
        'Bar rule monitoring',
        'Conflict checking system',
        'Trust account reconciliation',
        'CLE credit tracking'
      ]}
      tagline="Ethical practice, simplified"
    />
  );
}

export function NILComplianceCard() {
  return (
    <ToolCard
      title="NIL Deal Tracker"
      persona="nil"
      features={[
        'NCAA compliance verification',
        'Deal structure analysis',
        'Revenue reporting tools',
        'Coach notification system'
      ]}
      tagline="Game-changing compliance"
    />
  );
}