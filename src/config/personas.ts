// src/config/personas.ts
export type PersonaKey =
  | "advisors" | "accountants" | "attorneys" | "insurance"
  | "medicare" | "realtors" | "consultants"
  | "families_aspiring" | "families_retirees";

export type PersonaLink = { key: PersonaKey; label: string; to: string; blurb?: string };

// Service Professionals (cards on the Pros hub)
export const PROS: PersonaLink[] = [
  { key: "advisors",    label: "Financial Advisors",     to: "/pros/advisors",    blurb: "Planning, portfolios, PMA, workflows." },
  { key: "accountants", label: "Accountants",            to: "/pros/accountants", blurb: "Tax sync, docs, client collaboration." },
  { key: "attorneys",   label: "Attorneys",              to: "/pros/attorneys",   blurb: "Estate, entity, engagement handoffs." },
  { key: "insurance",   label: "Insurance",              to: "/pros/insurance",   blurb: "Policy reviews, annuities, LTC sync." },
  { key: "medicare",    label: "Medicare Specialists",   to: "/pros/medicare",    blurb: "Enrollment, plan fit, renewal tasks." },
  { key: "realtors",    label: "Realtors / PM",          to: "/pros/realtors",    blurb: "Properties, cash flows, closings." },
  { key: "consultants", label: "Consultants",            to: "/pros/consultants", blurb: "Biz ops, transitions, diligence." },
];

// Families (two segments)
export const FAMILIES: PersonaLink[] = [
  { key: "families_aspiring", label: "Aspiring Families", to: "/families/aspiring" },
  { key: "families_retirees", label: "Retirees",          to: "/families/retirees" },
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

// No default export on purpose to avoid ambiguity.
// If a previous default existed, imports will be normalized in step B.