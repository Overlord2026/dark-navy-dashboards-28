import entitlements from "@/config/familiesEntitlements";

export type PlanTier = "basic" | "premium" | "elite";

export function featureMinPlan(featureKey: string): PlanTier | null {
  const order: PlanTier[] = ["basic", "premium", "elite"];
  
  for (const planTier of order) {
    if (entitlements.plans[planTier].features.includes(featureKey)) {
      return planTier;
    }
  }
  return null;
}

export function planIncludes(featureKey: string, plan: PlanTier | null | undefined) {
  if (!plan) return false;
  return entitlements.plans[plan]?.features.includes(featureKey) ?? false;
}