// src/config/personas.ts
export type PersonaKey =
  | "advisors" | "accountants" | "attorneys" | "insurance"
  | "medicare" | "realtors" | "consultants"
  | "families_aspiring" | "families_retirees";

export type PersonaLink = { key: PersonaKey; label: string; to: string; blurb?: string };

// Service Professionals
export const PROS: PersonaLink[] = [
  { key: "advisors",    label: "Financial Advisors", to: "/pros/advisors" },
  { key: "accountants", label: "Accountants",        to: "/pros/accountants" },
  { key: "attorneys",   label: "Attorneys",          to: "/pros/attorneys" },
  { key: "insurance",   label: "Insurance",          to: "/pros/insurance" },
  { key: "medicare",    label: "Medicare Specialists", to: "/pros/medicare" },
  { key: "realtors",    label: "Realtors / PM",      to: "/pros/realtors" },
  { key: "consultants", label: "Consultants",        to: "/pros/consultants" },
];

// Families
export const FAMILIES: PersonaLink[] = [
  { key: "families_aspiring", label: "Aspiring Families", to: "/families/aspiring" },
  { key: "families_retirees", label: "Retirees",          to: "/families/retirees" },
];

// Persona configurations for PersonaDashboard compatibility
export const PERSONA_CONFIGS = [
  {
    id: "advisors",
    name: "Financial Advisors",
    description: "Professional financial advisory services",
    route: "/pros/advisors",
    tools: [],
    subPersonas: []
  },
  {
    id: "accountants", 
    name: "Accountants",
    description: "Tax and accounting services",
    route: "/pros/accountants",
    tools: [],
    subPersonas: []
  },
  {
    id: "attorneys",
    name: "Attorneys", 
    description: "Legal and estate planning services",
    route: "/pros/attorneys",
    tools: [],
    subPersonas: []
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "Insurance and risk management",
    route: "/pros/insurance", 
    tools: [],
    subPersonas: []
  }
];

// no default export on purpose