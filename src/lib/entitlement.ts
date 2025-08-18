import { entitlements } from "@/config/familiesEntitlements";
import type { PlanTier } from "@/config/familiesEntitlements";

export function featureMinPlan(featureKey: string): PlanTier | null {
  const order: PlanTier[] = ["basic", "premium", "elite"];
  const e = entitlements.find(x => x.key === featureKey);
  if (!e) return null;
  return order.find(p => e.plans.includes(p)) ?? null;
}

export function planIncludes(featureKey: string, plan: PlanTier | null | undefined) {
  if (!plan) return false;
  const e = entitlements.find(x => x.key === featureKey);
  return !!e && e.plans.includes(plan);
}