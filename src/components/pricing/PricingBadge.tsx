import React from 'react';
import { BADGES, isPlanKey } from "@/config/tiers";

interface PricingBadgeProps {
  planKey: string;
}

function PricingBadge({ planKey }: PricingBadgeProps) {
  const label = isPlanKey(planKey) ? BADGES[planKey] : "Plan";
  return (
    <span className="ml-2 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/80">
      {label}
    </span>
  );
}

export default PricingBadge;
export { PricingBadge };