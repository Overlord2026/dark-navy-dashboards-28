export type ToolType = 'Tool' | 'Guide' | 'Course' | 'Admin';
export type PersonaType = 'family' | 'retiree' | 'advisor' | 'attorney' | 'cpa' | 'insurance' | 'healthcare' | 'realtor' | 'nil' | 'school' | 'brand' | 'coach' | 'aspiring' | 'athlete';
export type SolutionType = 'investments' | 'annuities' | 'insurance' | 'tax' | 'estate' | 'health' | 'practice' | 'compliance' | 'nil';
export type GoalType = 'plan' | 'prove' | 'organize' | 'collaborate' | 'comply' | 'learn' | 'compare' | 'optimize' | 'do';

export interface CatalogTool {
  key: string;
  label: string;
  summary: string;
  type: ToolType;
  personas: PersonaType[];
  solutions: SolutionType[];
  goals: GoalType[];
  tags: string[];
  route: string;
  status: 'ready' | 'beta' | 'coming-soon';
}

export const CATALOG_TOOLS: CatalogTool[] = [
  /* ---------- INVESTMENTS ---------- */
  {
    key: "retirement-roadmap",
    label: "Retirement Roadmap",
    summary: "Turn assets into lifetime income with sequence-risk guardrails.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["investments"],
    goals: ["plan", "prove"],
    tags: ["planning", "income"],
    route: "/tools/retirement-roadmap",
    status: "ready"
  },
  {
    key: "rmd-check",
    label: "RMD Check",
    summary: "Compute your RMD path and avoid penalties.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["investments", "tax"],
    goals: ["plan", "comply"],
    tags: ["rmd", "compliance"],
    route: "/tools/rmd-check",
    status: "ready"
  },
  {
    key: "ss-optimizer",
    label: "Social Security Optimizer",
    summary: "Choose the best claim strategy, including spousal/survivor.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["investments"],
    goals: ["plan"],
    tags: ["social-security"],
    route: "/tools/social-security",
    status: "ready"
  },
  {
    key: "entity-trust-map",
    label: "Entity & Trust Map",
    summary: "Visualize entities, trusts, accounts, and roles.",
    type: "Tool",
    personas: ["family", "retiree", "advisor", "attorney"],
    solutions: ["investments", "estate"],
    goals: ["organize", "collaborate"],
    tags: ["diagram"],
    route: "/tools/entity-trust-map",
    status: "ready"
  },

  /* ---------- PRIVATE MARKETS ---------- */
  {
    key: "private-markets",
    label: "Private Markets",
    summary: "Access curated private investments—once reserved for the ultra-wealthy.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["investments"],
    goals: ["plan", "prove"],
    tags: ["private-markets", "compliance"],
    route: "/solutions/investments/private-markets",
    status: "ready"
  },
  {
    key: "capital-calls-k1",
    label: "Capital Calls & K-1 Hub",
    summary: "Track calls and store K-1s; export to your CPA.",
    type: "Tool",
    personas: ["family", "retiree", "advisor", "cpa"],
    solutions: ["investments", "tax"],
    goals: ["organize", "prove"],
    tags: ["private-markets"],
    route: "/tools/calls-k1",
    status: "ready"
  },

  /* ---------- ANNUITIES HUB ---------- */
  {
    key: "annuities-education",
    label: "Annuities 101",
    summary: "Understand SPIA, DIA, MYGA, FIA, VA—the tradeoffs in plain English.",
    type: "Guide",
    personas: ["family", "retiree", "advisor"],
    solutions: ["annuities"],
    goals: ["learn"],
    tags: ["annuities", "education"],
    route: "/solutions/annuities/learn",
    status: "ready"
  },
  {
    key: "annuities-calcs",
    label: "Annuity Calculators",
    summary: "Estimate income and compare features—SPIA, DIA, MYGA, FIA, VA.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["annuities"],
    goals: ["plan", "compare"],
    tags: ["annuities", "calculator"],
    route: "/solutions/annuities/calculators",
    status: "ready"
  },
  {
    key: "annuities-review",
    label: "Proposal Review",
    summary: "Upload illustrations—get checklist answers and suitability checks with proof.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["annuities"],
    goals: ["comply", "prove"],
    tags: ["annuities", "compliance", "proof"],
    route: "/solutions/annuities/review",
    status: "ready"
  },
  {
    key: "annuities-index",
    label: "Fiduciary Index",
    summary: "Best-in-class shortlist by category, based on transparent, fiduciary rules.",
    type: "Admin",
    personas: ["family", "retiree", "advisor"],
    solutions: ["annuities"],
    goals: ["compare"],
    tags: ["annuities", "index"],
    route: "/solutions/annuities/index",
    status: "ready"
  },

  /* ---------- INSURANCE ---------- */
  {
    key: "life-needs-analysis",
    label: "Life Needs Analysis",
    summary: "Right-size coverage with simple sliders.",
    type: "Tool",
    personas: ["advisor", "family"],
    solutions: ["insurance"],
    goals: ["plan"],
    tags: ["life", "insurance"],
    route: "/tools/life-needs",
    status: "ready"
  },
  {
    key: "annuity-analyzer",
    label: "Annuity Analyzer",
    summary: "Compare riders, fees, surrender schedules at a glance.",
    type: "Tool",
    personas: ["advisor", "family", "retiree"],
    solutions: ["insurance", "annuities"],
    goals: ["compare"],
    tags: ["annuity", "compare"],
    route: "/tools/annuity-analyzer",
    status: "ready"
  },
  {
    key: "1035-helper",
    label: "1035 Exchange Helper",
    summary: "Check if a replacement is justified—before you move.",
    type: "Tool",
    personas: ["advisor", "family", "retiree"],
    solutions: ["insurance", "annuities"],
    goals: ["comply", "prove"],
    tags: ["1035", "replacement", "suitability"],
    route: "/tools/1035-helper",
    status: "ready"
  },
  {
    key: "medicare-compare",
    label: "Medicare Plan Compare",
    summary: "Compare Med Supp/Part D plans and capture disclosures.",
    type: "Tool",
    personas: ["advisor", "insurance"],
    solutions: ["insurance"],
    goals: ["plan", "comply"],
    tags: ["medicare", "ltc"],
    route: "/tools/medicare-compare",
    status: "ready"
  },
  {
    key: "ltc-planner",
    label: "Long-Term Care Planner",
    summary: "Estimate costs and plan funding paths.",
    type: "Tool",
    personas: ["advisor", "family", "retiree", "insurance"],
    solutions: ["insurance"],
    goals: ["plan"],
    tags: ["ltc"],
    route: "/tools/ltc-planner",
    status: "ready"
  },

  /* ---------- TAX PLANNING ---------- */
  {
    key: "roth-ladder",
    label: "Roth Conversion Ladder",
    summary: "Multi-year conversion plan with tax guardrails.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["tax"],
    goals: ["plan", "optimize"],
    tags: ["roth", "tax"],
    route: "/tools/roth-ladder",
    status: "ready"
  },
  {
    key: "taxhub-diy",
    label: "TaxHub DIY",
    summary: "Collect, map and export tax data—with receipts for every step.",
    type: "Tool",
    personas: ["family", "retiree", "advisor", "cpa"],
    solutions: ["tax"],
    goals: ["organize", "prove"],
    tags: ["tax", "mapping", "export"],
    route: "/tools/taxhub-diy",
    status: "ready"
  },
  {
    key: "daf-crt",
    label: "DAF / CRT Gifting",
    summary: "Plan charitable gifts and generate the right documents.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["tax", "estate"],
    goals: ["plan"],
    tags: ["charitable"],
    route: "/tools/gifting",
    status: "ready"
  },
  {
    key: "nua-analyzer",
    label: "NUA Analyzer",
    summary: "See tax tradeoffs when distributing employer stock.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["tax", "investments"],
    goals: ["optimize", "prove"],
    tags: ["nua"],
    route: "/tools/nua-analyzer",
    status: "ready"
  },

  /* ---------- ESTATE ---------- */
  {
    key: "wealth-vault",
    label: "Wealth Vault",
    summary: "Keep wills, trusts, deeds and beneficiaries in one place.",
    type: "Tool",
    personas: ["family", "retiree", "advisor", "attorney"],
    solutions: ["estate"],
    goals: ["organize", "prove"],
    tags: ["vault", "keep-safe", "legal-hold"],
    route: "/tools/wealth-vault",
    status: "ready"
  },
  {
    key: "beneficiary-center",
    label: "Beneficiary Center",
    summary: "Find and fix mismatches across accounts.",
    type: "Tool",
    personas: ["family", "retiree", "advisor"],
    solutions: ["estate", "investments", "insurance"],
    goals: ["organize", "comply"],
    tags: ["beneficiaries"],
    route: "/tools/beneficiary-center",
    status: "ready"
  },
  {
    key: "financial-poa",
    label: "Financial POA & Proof-of-Authority",
    summary: "Grant limited or trading authority; show a QR to verify scope.",
    type: "Tool",
    personas: ["family", "retiree"],
    solutions: ["estate", "investments"],
    goals: ["collaborate", "prove"],
    tags: ["authority", "qr"],
    route: "/tools/financial-poa",
    status: "ready"
  },

  /* ---------- HEALTH & LONGEVITY ---------- */
  {
    key: "longevity-hub",
    label: "Longevity Hub",
    summary: "Turn trusted guidance into protocols; track screenings and wearables.",
    type: "Tool",
    personas: ["family", "retiree", "coach", "healthcare"],
    solutions: ["health"],
    goals: ["plan", "do", "prove"],
    tags: ["protocols", "screenings", "wearables"],
    route: "/family/longevity",
    status: "ready"
  },
  {
    key: "consent-passport",
    label: "Consent Passport (HIPAA)",
    summary: "Share minimum-necessary health slices with revoke anytime.",
    type: "Tool",
    personas: ["family", "healthcare"],
    solutions: ["health"],
    goals: ["collaborate", "prove"],
    tags: ["consent", "hipaa"],
    route: "/tools/consent-passport",
    status: "ready"
  },

  /* ---------- PRACTICE MANAGEMENT ---------- */
  {
    key: "engagement-tracker",
    label: "Engagement Tracker",
    summary: "Track tasks, signatures, and approvals across pros.",
    type: "Tool",
    personas: ["advisor", "cpa", "attorney", "insurance", "realtor"],
    solutions: ["practice"],
    goals: ["organize", "prove"],
    tags: ["pm"],
    route: "/tools/engagement-tracker",
    status: "ready"
  },
  {
    key: "supervisor-dashboard",
    label: "Supervisor Dashboard",
    summary: "Review queue with filters; export compliance packs.",
    type: "Admin",
    personas: ["advisor", "insurance", "nil", "school"],
    solutions: ["practice", "compliance"],
    goals: ["comply", "prove"],
    tags: ["supervision", "export"],
    route: "/admin/supervision",
    status: "ready"
  },
  {
    key: "receipts-viewer",
    label: "Receipts Viewer",
    summary: "See and verify Proof Slips across actions.",
    type: "Admin",
    personas: ["family", "advisor", "cpa", "attorney", "insurance", "healthcare", "realtor", "nil", "school", "brand"],
    solutions: ["compliance"],
    goals: ["prove"],
    tags: ["proof", "anchor"],
    route: "/receipts",
    status: "ready"
  },

  /* ---------- COURSES / GUIDES ---------- */
  {
    key: "money-in-7",
    label: "Money in 7 Steps",
    summary: "A practical path from chaos to control.",
    type: "Course",
    personas: ["family", "aspiring"],
    solutions: ["investments", "tax", "estate"],
    goals: ["learn"],
    tags: ["course"],
    route: "/courses/money-in-7",
    status: "ready"
  },
  {
    key: "nil-basics",
    label: "NIL Basics",
    summary: "Do NIL right—training, disclosures, deals, payments.",
    type: "Course",
    personas: ["nil", "athlete", "school"],
    solutions: ["nil"],
    goals: ["learn"],
    tags: ["course", "compliance"],
    route: "/courses/nil-basics",
    status: "ready"
  }
];

export const CATALOG_CATEGORIES = {
  investments: {
    title: "Investments",
    description: "Retirement planning, Social Security, and investment tools",
    icon: "TrendingUp"
  },
  annuities: {
    title: "Annuities",
    description: "Education, calculators, and compliance tools for annuities",
    icon: "Calculator"
  },
  insurance: {
    title: "Insurance",
    description: "Life, health, and long-term care planning tools",
    icon: "Shield"
  },
  tax: {
    title: "Tax Planning",
    description: "Tax optimization and compliance tools",
    icon: "Receipt"
  },
  estate: {
    title: "Estate",
    description: "Estate planning and wealth management tools",
    icon: "FileText"
  },
  health: {
    title: "Health & Longevity",
    description: "Health protocols and compliance tools",
    icon: "Heart"
  },
  practice: {
    title: "Practice Management",
    description: "Tools for financial professionals",
    icon: "Users"
  },
  compliance: {
    title: "Compliance",
    description: "Audit trails and proof systems",
    icon: "CheckCircle"
  },
  nil: {
    title: "NIL",
    description: "Name, Image, Likeness compliance and management",
    icon: "Award"
  }
} as const;

// Helper functions for filtering
export const getToolsByCategory = (category: SolutionType) => 
  CATALOG_TOOLS.filter(tool => tool.solutions.includes(category));

export const getToolsByPersona = (persona: PersonaType) => 
  CATALOG_TOOLS.filter(tool => tool.personas.includes(persona));

export const getToolsByType = (type: ToolType) => 
  CATALOG_TOOLS.filter(tool => tool.type === type);

export const getToolsByGoal = (goal: GoalType) => 
  CATALOG_TOOLS.filter(tool => tool.goals.includes(goal));