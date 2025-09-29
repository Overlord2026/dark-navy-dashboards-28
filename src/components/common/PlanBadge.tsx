import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BADGES } from '@/config/tiers';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';
import { cn } from '@/lib/utils';

type PlanKey = FamilyPlanKey | AdvisorPlanKey;

interface PlanBadgeProps {
  planKey: PlanKey;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Inline helper to determine plan type
function getPlanType(planKey: string): 'family' | 'advisor' | 'unknown' {
  if (['free', 'premium', 'pro'].includes(planKey)) return 'family';
  if (['advisor_basic', 'advisor_premium'].includes(planKey)) return 'advisor';
  return 'unknown';
}

export function PlanBadge({ planKey, className, variant }: PlanBadgeProps) {
  const badgeText = BADGES[planKey];
  const planType = getPlanType(planKey);
  
  // Auto-determine variant based on plan if not specified
  const badgeVariant = variant || getBadgeVariant(planKey);
  const badgeClassName = cn(getBadgeClassName(planKey, planType), className);

  return (
    <Badge variant={badgeVariant} className={badgeClassName}>
      {badgeText}
    </Badge>
  );
}

function getBadgeVariant(planKey: PlanKey): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (planKey) {
    case 'free':
      return 'default';
    case 'premium':
    case 'advisor_premium':
      return 'secondary';
    case 'pro':
      return 'outline';
    case 'advisor_basic':
      return 'outline';
    default:
      return 'default';
  }
}

function getBadgeClassName(planKey: PlanKey, planType: string): string {
  // Base styles for different plan types
  const baseStyles = {
    family: '',
    advisor: 'border-blue-200 text-blue-700',
  };

  // Specific styles for each plan
  const planStyles: Record<PlanKey, string> = {
    // Family plans
    free: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
    premium: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200', 
    pro: 'bg-brand-gold/20 text-brand-gold border-brand-gold hover:bg-brand-gold/30',
    
    // Advisor plans
    advisor_basic: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-300',
    advisor_premium: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  };

  return cn(
    baseStyles[planType as keyof typeof baseStyles] || baseStyles.family,
    planStyles[planKey]
  );
}

export default PlanBadge;