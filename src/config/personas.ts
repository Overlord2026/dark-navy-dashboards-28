export type PersonaKey =
  | "advisors" | "accountants" | "attorneys" | "insurance"
  | "medicare" | "realtors" | "consultants"
  | "families_aspiring" | "families_retirees";

export const PROS: { key: PersonaKey; label: string; to: string; blurb: string }[] = [
  { key: "advisors",    label: "Advisors",    to: "/pros/advisors",    blurb: "Planning, portfolios, PMA, workflows." },
  { key: "accountants", label: "Accountants", to: "/pros/accountants", blurb: "Tax sync, docs, client collaboration." },
  { key: "attorneys",   label: "Attorneys",   to: "/pros/attorneys",   blurb: "Estate, entity, engagement handoffs." },
  { key: "insurance",   label: "Insurance",   to: "/pros/insurance",   blurb: "Policy reviews, annuities, LTC sync." },
  { key: "medicare",    label: "Medicare",    to: "/pros/medicare",    blurb: "Enrollment, plan fit, renewal tasks." },
  { key: "realtors",    label: "Realtors / PM", to: "/pros/realtors",  blurb: "Properties, cash flows, closings." },
  { key: "consultants", label: "Consultants", to: "/pros/consultants", blurb: "Biz ops, transitions, diligence." },
];

export const FAMILIES = [
  { key: "families_aspiring" as PersonaKey,  label: "Aspiring Families", to: "/families/aspiring"  },
  { key: "families_retirees" as PersonaKey,  label: "Retirees",          to: "/families/retirees"  },
];

// Legacy compatibility for existing PersonaDashboard
export const PERSONA_CONFIGS = [
  {
    id: "advisor",
    name: "Financial Advisor",
    category: "professional",
    tools: [],
    receipts: [],
    subPersonas: []
  }
];