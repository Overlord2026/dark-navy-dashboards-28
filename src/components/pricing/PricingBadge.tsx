import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BADGES, getPlanType } from '@/config/tiers';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';
import { cn } from '@/lib/utils';

type PlanKey = FamilyPlanKey | AdvisorPlanKey;

interface PricingBadgeProps {
  planKey: PlanKey;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function PricingBadge({ planKey, variant, className }: PricingBadgeProps) {
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
  // Base styles using semantic tokens
  const baseStyles = 'font-medium';
  
  // Specific styles for each plan using design system tokens
  const planStyles: Record<PlanKey, string> = {
    // Family plans
    free: 'bg-muted text-muted-foreground border-muted-foreground/30',
    premium: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20', 
    pro: 'bg-secondary text-secondary-foreground border-secondary/50 hover:bg-secondary/80',
    
    // Advisor plans
    advisor_basic: 'bg-background text-foreground border-border hover:bg-muted',
    advisor_premium: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  };

  return cn(baseStyles, planStyles[planKey]);
}

export default PricingBadge;