export type FamilyPlanKey = "free" | "premium" | "pro";
export type AdvisorPlanKey = "advisor_basic" | "advisor_premium";
export type PlanKey = FamilyPlanKey | AdvisorPlanKey;

export const BADGES: Record<PlanKey, string> = {
  free: "FREE",
  premium: "Premium",
  pro: "Pro",
  advisor_basic: "Basic",
  advisor_premium: "Premium",
};

export const TIERS = {
  families: {
    order: ["free", "premium", "pro"] as FamilyPlanKey[],
    checkout: {
      free: "/signup?plan=free",
      premium: "/pricing/checkout?plan=premium",
      pro: "/pricing/checkout?plan=pro",
    } as Record<FamilyPlanKey, string>,
  },
  advisor: {
    order: ["advisor_basic", "advisor_premium"] as AdvisorPlanKey[],
    checkout: {
      advisor_basic: "/pricing/checkout?plan=advisor_basic",
      advisor_premium: "/pricing/checkout?plan=advisor_premium",
    } as Record<AdvisorPlanKey, string>,
  },
} as const;

export const isFamilyPlan = (k: string): k is FamilyPlanKey =>
  (["free", "premium", "pro"] as const).includes(k as any);

export const isAdvisorPlan = (k: string): k is AdvisorPlanKey =>
  (["advisor_basic", "advisor_premium"] as const).includes(k as any);

export const isPlanKey = (k: string): k is PlanKey =>
  isFamilyPlan(k) || isAdvisorPlan(k);

// Legacy default export for old imports
const tiersDefault = { BADGES, TIERS, isFamilyPlan, isAdvisorPlan, isPlanKey };
export default tiersDefault;
