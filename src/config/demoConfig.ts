export interface DemoStep {
  title: string;
  description: string;
  duration: number; // seconds
}

export interface DemoConfig {
  id: string;
  title: string;
  description: string;
  duration: number; // total seconds
  steps: DemoStep[];
  cta: string;
  route?: string;
}

export const DEMO_CONFIG: DemoConfig[] = [
  {
    id: "families-aspiring",
    title: "Aspiring Family Demo",
    description: "See how families build wealth systematically",
    duration: 60,
    steps: [
      { title: "Set Goals", description: "Define financial targets and timelines", duration: 15 },
      { title: "Link Accounts", description: "Connect banks and investment accounts", duration: 15 },
      { title: "Track Progress", description: "Monitor net worth and goal progress", duration: 15 },
      { title: "Plan Actions", description: "Get personalized next steps", duration: 15 }
    ],
    cta: "Start Your Family Workspace",
    route: "/onboarding?persona=families-aspiring"
  },
  {
    id: "families-retirees",
    title: "Retiree Family Demo",
    description: "Income planning and estate organization for retirees",
    duration: 60,
    steps: [
      { title: "Income Strategy", description: "Plan sustainable retirement income", duration: 15 },
      { title: "RMD Planning", description: "Optimize required distributions", duration: 15 },
      { title: "Estate Docs", description: "Organize wills, trusts, and beneficiaries", duration: 15 },
      { title: "Health Planning", description: "Longevity and care planning", duration: 15 }
    ],
    cta: "Start Your Retirement Workspace",
    route: "/onboarding?persona=families-retirees"
  },
  {
    id: "advisors",
    title: "Advisor Platform Demo",
    description: "Complete practice management for financial advisors",
    duration: 60,
    steps: [
      { title: "Client Onboarding", description: "Streamlined new client process", duration: 15 },
      { title: "Planning Tools", description: "Advanced financial planning suite", duration: 15 },
      { title: "Compliance", description: "Built-in compliance and documentation", duration: 15 },
      { title: "Client Portal", description: "Branded client experience", duration: 15 }
    ],
    cta: "Start Your Advisory Practice",
    route: "/onboarding?persona=advisors"
  },
  {
    id: "insurance-life-annuity",
    title: "Life & Annuity Demo",
    description: "Complete sales and compliance workflow",
    duration: 60,
    steps: [
      { title: "Needs Analysis", description: "Determine appropriate coverage", duration: 15 },
      { title: "Product Compare", description: "Side-by-side carrier comparison", duration: 15 },
      { title: "Compliance Check", description: "Suitability and replacement analysis", duration: 15 },
      { title: "Application Process", description: "Digital application and follow-up", duration: 15 }
    ],
    cta: "Start Your Insurance Practice",
    route: "/onboarding?persona=insurance-life-annuity"
  },
  {
    id: "annuities-solutions",
    title: "Annuities Solution Demo",
    description: "Education, calculators, and compliance tools",
    duration: 60,
    steps: [
      { title: "Annuities 101", description: "Learn SPIA, DIA, MYGA, FIA, VA types", duration: 15 },
      { title: "Income Calculator", description: "Estimate lifetime income scenarios", duration: 15 },
      { title: "Proposal Review", description: "Upload and analyze illustrations", duration: 15 },
      { title: "Fiduciary Index", description: "Best-in-class product shortlist", duration: 15 }
    ],
    cta: "Explore Annuities Tools",
    route: "/solutions/annuities"
  }
];

export const getDemoById = (id: string) => 
  DEMO_CONFIG.find(d => d.id === id);

export const getDemosByPersona = (persona: string) => 
  DEMO_CONFIG.filter(d => d.id.startsWith(persona));