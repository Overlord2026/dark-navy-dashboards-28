export type PersonaRoot = "families" | "professionals";

export type FamilySegment =
  | "aspiring"
  | "younger-families"
  | "wealthy-hnw"
  | "executives"
  | "retirees"
  | "business-owners"
  | "athletes-entertainers";

export type ProSegment =
  | "advisor"
  | "cpa" 
  | "accountant"
  | "attorney-estate"
  | "attorney-litigation"
  | "realtor"
  | "insurance-annuity"
  | "insurance-life"
  | "insurance-medicare"
  | "insurance-ltc"
  | "healthcare-provider"
  | "influencer";

export type PersonaSegment = FamilySegment | ProSegment;

// Legacy compatibility
export type ProfessionalSegment = ProSegment;

export interface LinkItem { 
  label: string; 
  href: string; 
  description?: string; 
}

export interface LinkGroup { 
  heading: string; 
  items: LinkItem[]; 
}

export interface MenuConfig { 
  label: string; 
  groups: LinkGroup[]; 
}

export const familySegments: LinkItem[] = [
  { label: "Aspiring Families", href: "/families/aspiring", description:"Building wealth foundations" },
  { label: "Younger Families", href: "/families/younger-families", description:"Growing with children" },
  { label: "Wealthy Families", href: "/families/wealthy-hnw", description:"High net worth management" },
  { label: "Executives", href: "/families/executives", description:"Equity compensation & tax" },
  { label: "Retirees", href: "/families/retirees", description:"Income & legacy planning" },
  { label: "Business Owners", href: "/families/business-owners", description:"Exit & succession" },
  { label: "Athletes & Entertainers", href: "/families/athletes-entertainers", description:"Irregular income, protection" },
];

export const proSegments: LinkItem[] = [
  { label: "Financial Advisors", href: "/pros/advisor" },
  { label: "CPAs", href: "/pros/cpa" },
  { label: "Estate Attorneys", href: "/pros/attorney-estate" },
  { label: "Litigation Attorneys", href: "/pros/attorney-litigation" },
  { label: "Realtors", href: "/pros/realtor" },
  { label: "Annuity Insurance", href: "/pros/insurance-annuity" },
  { label: "Life Insurance", href: "/pros/insurance-life" },
  { label: "Medicare Insurance", href: "/pros/insurance-medicare" },
  { label: "LTC Insurance", href: "/pros/insurance-ltc" },
  { label: "Healthcare Providers", href: "/pros/healthcare-provider" },
  { label: "Influencers", href: "/pros/influencer" },
];

export const servicesMenu: MenuConfig = {
  label: "Services",
  groups: [
    {
      heading: "Core Services",
      items: [
        { label: "Planning", href: "/services/planning", description:"Comprehensive planning" },
        { label: "Investments", href: "/services/investments", description:"Portfolio management" },
        { label: "Tax Planning", href: "/services/tax", description:"Proactive tax strategies" },
        { label: "Estate Planning", href: "/services/estate", description:"Wealth transfer & legacy" },
        { label: "Entity Structures", href: "/services/entities", description:"LLC, trusts, FLPs" },
        { label: "Document Management", href: "/services/doc-vault", description:"Secure vault" },
        { label: "Education & Concierge", href: "/services/education-concierge", description:"Learning & support" },
      ],
    },
  ],
};

export const solutionsMenu: MenuConfig = {
  label: "Solutions",
  groups: [
    {
      heading: "Income & Retirement",
      items: [
        { label: "Income Now", href: "/solutions/income-now", description:"Current income optimization" },
        { label: "Income Later", href: "/tools/target-analyzer", description:"Target retirement analyzer" },
        { label: "RMDs", href: "/solutions/rmds", description:"Required distributions" },
      ],
    },
    {
      heading: "Tax & Compliance",
      items: [
        { label: "K-1 Season", href: "/solutions/k1-season" },
        { label: "Capital Calls", href: "/solutions/capital-calls" },
        { label: "Entity Renewals", href: "/solutions/entity-renewals" },
      ],
    },
    {
      heading: "Executive & Business",
      items: [
        { label: "Equity Compensation", href: "/solutions/equity-comp" },
        { label: "10b5-1 Plans", href: "/solutions/10b5-1" },
        { label: "Exit Planning", href: "/solutions/exit" },
      ],
    },
    {
      heading: "Healthcare",
      items: [
        { label: "Medicare Coverage", href: "/solutions/medicare" },
        { label: "Immunization Programs", href: "/solutions/immunizations" },
        { label: "LTC Planning", href: "/solutions/ltc" },
        { label: "Care Coordination", href: "/solutions/care-coordination" },
        { label: "Longevity & Healthspan", href: "/solutions/longevity" },
      ],
    },
  ],
};

export const personaMenus: Record<PersonaRoot, MenuConfig> = {
  families: { label: "For Families", groups: [{ heading: "Family Types", items: familySegments }] },
  professionals:{ label: "For Professionals", groups:[{ heading:"Professional Services", items: proSegments }] },
};

// New dual header navigation types
export enum Persona {
  FAMILY = 'family',
  PROFESSIONAL = 'pro'
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  href: string;
  description?: string;
  segment?: PersonaSegment;
}

export const FAMILY_MENU_GROUPS: MenuGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Aspiring Families', href: '/families/aspiring' },
      { label: 'Younger Families', href: '/families/younger' }
    ]
  }
];

export const PROFESSIONAL_MENU_GROUPS: MenuGroup[] = [
  {
    label: 'Financial Services',
    items: [
      { label: 'Financial Advisors', href: '/pros/advisor', segment: 'advisor' },
      { label: 'CPAs', href: '/pros/cpa', segment: 'cpa' },
      { label: 'Accountants', href: '/pros/accountants', segment: 'accountant' }
    ]
  },
  {
    label: 'Legal Services',
    items: [
      { label: 'Estate Attorneys', href: '/pros/attorney-estate', segment: 'attorney-estate' },
      { label: 'Litigation Attorneys', href: '/pros/attorney-litigation', segment: 'attorney-litigation' }
    ]
  },
  {
    label: 'Insurance',
    items: [
      { label: 'Life Insurance', href: '/pros/insurance-life', segment: 'insurance-life' },
      { label: 'Medicare', href: '/pros/insurance-medicare', segment: 'insurance-medicare' }
    ]
  }
];

export const RESOURCE_MENU_GROUPS: MenuGroup[] = [];
export const EDUCATION_MENU_GROUPS: MenuGroup[] = [];
export const SOLUTIONS_MENU_GROUPS: MenuGroup[] = [];

export const ctas = {
  seeHowItWorks: { label: "See How It Works", href: "/how-it-works" },
  valueCalculator:{ label: "Try the Value Calculator", href: "/tools/value-calculator" },
  invitation:{ label: "I have an invitation", href: "/invite" },
  getStarted:{ label: "Get Started", href: "/onboarding?persona=family&segment=retirees" },
};