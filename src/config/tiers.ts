// Canonical plan keys used across app gating, badges, and checkout.
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
    features: {
      free: [
        "Catalog & Guides",
        "Education Center",
        "Vault (starter storage)",
        "Templates & Checklists",
        "Pros directory",
      ],
      premium: [
        "Wealth Wall & Reports",
        "SWAG™ Roadmap workspace",
        "Goals & Budget (enhanced)",
        "Limited account connections",
        "More storage",
      ],
      pro: [
        "All Premium features",
        "Tax Planner (advanced)",
        "Estate Organizer (advanced)",
        "Expanded connections & exports",
        "Share with spouse/pro",
      ],
    },
    checkout: {
      free: "/signup?plan=free",
      premium: "/pricing/checkout?plan=premium",
      pro: "/pricing/checkout?plan=pro",
    } as Record<FamilyPlanKey, string>,
  },
  advisor: {
    order: ["advisor_basic", "advisor_premium"] as AdvisorPlanKey[],
    features: {
      advisor_basic: [
        "Up to 100 client seats",
        "Branded advisor portal",
        "Core reports & e-signature links",
        "CSV/CRM export",
        "Email support",
      ],
      advisor_premium: [
        "Up to 300 client seats",
        "Custom branding",
        "Advanced reports & exports",
        "SWAG™ templates & workflows",
        "Priority support • Zapier API",
      ],
    },
    checkout: {
      advisor_basic: "/pricing/checkout?plan=advisor_basic",
      advisor_premium: "/pricing/checkout?plan=advisor_premium",
    } as Record<AdvisorPlanKey, string>,
  },
} as const;

export const isFamilyPlan = (k: string): k is FamilyPlanKey =>
  (["free", "premium", "pro"] as string[]).includes(k);

export const isAdvisorPlan = (k: string): k is AdvisorPlanKey =>
  (["advisor_basic", "advisor_premium"] as string[]).includes(k);

export const isPlanKey = (k: string): k is PlanKey =>
  isFamilyPlan(k) || isAdvisorPlan(k);

// Legacy compatibility for existing code
export const LEGACY_TIERS = {
  FREE: { allowAggregation: false, vaultQuota: { files: 10, mb: 50 } },
  PREMIUM: { allowAggregation: true, aggLimit: 3, vaultQuota: { files: 200, mb: 2048 } },
  PRO: { allowAggregation: true, aggLimit: 10, vaultQuota: { files: 1000, mb: 10240 } },
} as const;

export const ADVISOR_TIERS = {
  advisor_basic: {
    clientSeats: 100,
    branding: 'basic',
    reports: 'core',
    integrations: 'csv',
    support: 'email'
  },
  advisor_premium: {
    clientSeats: 300,
    branding: 'custom',
    reports: 'advanced',
    integrations: 'zapier',
    support: 'priority'
  }
} as const;

// Utility function to determine plan type
export function getPlanType(planKey: string): 'family' | 'advisor' | 'unknown' {
  if (isFamilyPlan(planKey)) return 'family';
  if (isAdvisorPlan(planKey)) return 'advisor';
  return 'unknown';
}

// Legacy type exports for backward compatibility
export type TierType = keyof typeof LEGACY_TIERS;
export type AdvisorTierType = keyof typeof ADVISOR_TIERS;