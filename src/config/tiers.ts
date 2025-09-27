// Canonical plan keys used across app gating, badges, and checkout.
export type FamilyPlanKey = "free" | "premium" | "pro";
export type AdvisorPlanKey = "advisor_basic" | "advisor_premium";

export const BADGES = {
  free: "FREE",
  premium: "Premium",
  pro: "Pro",
  advisor_basic: "Basic",
  advisor_premium: "Premium",
} as const;

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
    // Functional gating properties for backward compatibility
    config: {
      free: { allowAggregation: false, vaultQuota: { files: 10, mb: 50 } },
      premium: { allowAggregation: true, aggLimit: 3, vaultQuota: { files: 200, mb: 2048 } },
      pro: { allowAggregation: true, aggLimit: 10, vaultQuota: { files: 1000, mb: 10240 } },
    },
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
    // Functional gating properties
    config: {
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
    },
  },
} as const;

// Legacy exports for backward compatibility
export const LEGACY_TIERS = {
  FREE: TIERS.families.config.free,
  PREMIUM: TIERS.families.config.premium,
  PRO: TIERS.families.config.pro,
} as const;

export const ADVISOR_TIERS = TIERS.advisor.config;

// Simple helpers to keep ToolsOverview/Catalog consistent.
export const isFamilyPlan = (k: string): k is FamilyPlanKey =>
  (["free", "premium", "pro"] as string[]).includes(k);

export const isAdvisorPlan = (k: string): k is AdvisorPlanKey =>
  (["advisor_basic", "advisor_premium"] as string[]).includes(k);

// Legacy type exports for backward compatibility
export type TierType = keyof typeof LEGACY_TIERS;
export type AdvisorTierType = keyof typeof ADVISOR_TIERS;