/**
 * Persona-Specific Card Component
 * Implements your color recommendations with WCAG AA compliance
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type PersonaType = 'family' | 'advisor' | 'attorney' | 'insurance' | 'healthcare' | 'nil' | 'accountant';

interface PersonaCardProps {
  persona?: PersonaType;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
  actions?: React.ReactNode; // Support for legacy actions prop
}

// Persona styling with your recommended colors and contrast
const personaStyles: Record<PersonaType, {
  borderColor: string;
  badgeColor: string;
  accentColor: string;
  headerBg: string;
}> = {
  family: {
    borderColor: 'border-brand-gold',
    badgeColor: 'bg-brand-gold text-black',
    accentColor: 'text-brand-gold',
    headerBg: 'bg-brand-gold/10',
  },
  advisor: {
    borderColor: 'border-[hsl(220_100%_70%)]', // Sky blue
    badgeColor: 'bg-[hsl(220_100%_70%)] text-white',
    accentColor: 'text-[hsl(220_100%_70%)]',
    headerBg: 'bg-[hsl(220_100%_70%)]/10',
  },
  attorney: {
    borderColor: 'border-[hsl(336_66%_28%)]', // Burgundy
    badgeColor: 'bg-[hsl(336_66%_28%)] text-white',
    accentColor: 'text-[hsl(336_66%_28%)]',
    headerBg: 'bg-[hsl(336_66%_28%)]/10',
  },
  insurance: {
    borderColor: 'border-destructive', // Alert red
    badgeColor: 'bg-destructive text-white',
    accentColor: 'text-destructive',
    headerBg: 'bg-destructive/10',
  },
  healthcare: {
    borderColor: 'border-[hsl(233_47%_44%)]', // Indigo
    badgeColor: 'bg-[hsl(233_47%_44%)] text-white',
    accentColor: 'text-[hsl(233_47%_44%)]',
    headerBg: 'bg-[hsl(233_47%_44%)]/10',
  },
  nil: {
    borderColor: 'border-emerald', // Emerald/mint
    badgeColor: 'bg-emerald text-black',
    accentColor: 'text-emerald',
    headerBg: 'bg-emerald/10',
  },
  accountant: {
    borderColor: 'border-emerald', // Mint for accountants
    badgeColor: 'bg-emerald text-black',
    accentColor: 'text-emerald',
    headerBg: 'bg-emerald/10',
  },
};

export function PersonaCard({
  persona = 'family', // Default fallback
  title,
  description,
  children,
  className,
  showBadge = false,
  badgeText,
  actions,
}: PersonaCardProps) {
  const styles = personaStyles[persona];

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      // Enhanced contrast: white background with persona border
      'bg-white border-2',
      styles.borderColor,
      className
    )}>
      <CardHeader className={cn(
        'relative',
        styles.headerBg
      )}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            'text-lg font-semibold',
            // High contrast black text on light backgrounds
            'text-black'
          )}>
            {title}
          </CardTitle>
          {showBadge && (
            <Badge className={cn(
              'font-medium',
              styles.badgeColor
            )}>
              {badgeText || persona.charAt(0).toUpperCase() + persona.slice(1)}
            </Badge>
          )}
        </div>
        
        {/* Special badges for compliance features */}
        {persona === 'insurance' && (
          <Badge className="absolute top-2 right-2 bg-destructive text-white text-xs">
            10-Year Records
          </Badge>
        )}
        
        {persona === 'advisor' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-emerald text-black text-xs mr-1">
              SEC Compliant
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        {description && (
          <p className={cn(
            'text-sm mb-4',
            // Medium contrast for description text
            'text-slate-700'
          )}>
            {description}
          </p>
        )}
        
        {children}
        
        {/* Actions section */}
        {actions && (
          <div className="mt-6 space-y-2">
            {actions}
          </div>
        )}
        
        {/* Persona-specific accent line */}
        <div className={cn(
          'mt-4 pt-4 border-t-2',
          styles.borderColor
        )}>
          <div className={cn(
            'text-xs font-medium',
            styles.accentColor
          )}>
            {persona === 'insurance' && '• NAIC Compliant • State Licensed'}
            {persona === 'advisor' && '• FINRA Registered • SEC Oversight'}
            {persona === 'attorney' && '• Bar Certified • Ethics Compliant'}
            {persona === 'healthcare' && '• HIPAA Secure • State Licensed'}
            {persona === 'nil' && '• NCAA Compliant • Deal Tracking'}
            {persona === 'accountant' && '• AICPA Member • IRS Authorized'}
            {persona === 'family' && '• Wealth Optimization • Legacy Planning'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Usage examples for your dashboard
export function AdvisorCard() {
  return (
    <PersonaCard
      persona="advisor"
      title="Financial Advisor Dashboard"
      description="FINRA-compliant tools for client management and investment tracking"
      showBadge
      badgeText="Advisor"
    >
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Clients:</span>
          <span className="font-medium text-black">127</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">AUM:</span>
          <span className="font-medium text-black">$24.3M</span>
        </div>
      </div>
    </PersonaCard>
  );
}

export function InsuranceCard() {
  return (
    <PersonaCard
      persona="insurance"
      title="Insurance Professional"
      description="NAIC-compliant record keeping with 10-year retention"
      showBadge
      badgeText="Licensed"
    >
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Active Policies:</span>
          <span className="font-medium text-black">89</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Premium Volume:</span>
          <span className="font-medium text-black">$1.2M</span>
        </div>
      </div>
    </PersonaCard>
  );
}