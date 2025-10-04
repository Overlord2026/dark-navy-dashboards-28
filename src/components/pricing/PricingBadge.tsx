import { BADGES, isPlanKey } from "@/config/tiers";

export default function PricingBadge({ planKey }: { planKey: string }) {
  const label = isPlanKey(planKey) ? BADGES[planKey] : "Plan";
  return (
    <span className="ml-2 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/80">
      {label}
    </span>
  );
}
