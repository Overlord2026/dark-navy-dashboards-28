import React from 'react';
import { PricingBadge } from './PricingBadge';
import { StatusBadge, StatusType } from './StatusBadge';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';
import { cn } from '@/lib/utils';

type PlanKey = FamilyPlanKey | AdvisorPlanKey;

interface CombinedBadgeProps {
  planKey?: PlanKey;
  status?: StatusType;
  statusLabel?: string;
  className?: string;
  showPlan?: boolean;
  showStatus?: boolean;
}

export function CombinedBadge({ 
  planKey, 
  status, 
  statusLabel, 
  className,
  showPlan = true,
  showStatus = true
}: CombinedBadgeProps) {
  const containerClass = cn('flex items-center gap-2', className);

  return (
    <div className={containerClass}>
      {showPlan && planKey && <PricingBadge planKey={planKey} />}
      {showStatus && status && <StatusBadge status={status} label={statusLabel} />}
    </div>
  );
}

// Helper function to parse status badges from array
export function parseStatusBadges(badges: string[]): StatusType[] {
  const statusMap: Record<string, StatusType> = {
    'Beta': 'beta',
    'Coming soon': 'coming-soon',
    'New': 'new',
    'Featured': 'featured',
  };

  return badges
    .map(badge => statusMap[badge])
    .filter((status): status is StatusType => status !== undefined);
}

export default CombinedBadge;