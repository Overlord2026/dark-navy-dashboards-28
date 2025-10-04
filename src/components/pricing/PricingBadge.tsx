import tiersDefault, { BADGES as NAMED_BADGES, isPlanKey as NAMED_isPlanKey } from "@/config/tiers";

const FALLBACK_BADGES = {
  free: "FREE",
  premium: "Premium",
  pro: "Pro",
  advisor_basic: "Basic",
  advisor_premium: "Premium",
} as const;

const BADGES = NAMED_BADGES ?? (tiersDefault?.BADGES ?? FALLBACK_BADGES);
const isPlanKey = NAMED_isPlanKey ?? (tiersDefault?.isPlanKey ?? ((k: string) => k in FALLBACK_BADGES));

export default function PricingBadge({ planKey }: { planKey: string }) {
  const label = isPlanKey(planKey) ? (BADGES as any)[planKey] : "Plan";
  return (
    <span className="ml-2 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/80">
      {label}
    </span>
  );
}

export { PricingBadge };
