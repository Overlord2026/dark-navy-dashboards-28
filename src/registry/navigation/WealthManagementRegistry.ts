import {
  LayoutGridIcon,
  CreditCardIcon,
  DollarSignIcon,
  WalletIcon,
  RepeatIcon,
  HomeIcon,
  TargetIcon,
  CalendarIcon,
  StarIcon,
  ArchiveIcon,
  FileTextIcon,
  UserCheckIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  PieChartIcon,
  BarChart3Icon,
  BuildingIcon,
  LandmarkIcon,
  CoinsIcon,
  ShieldIcon,
  Calculator,
  Receipt,
  Users2Icon,
  SettingsIcon,
  DatabaseIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ArrowUpDownIcon,
  PointerIcon,
  Key,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

import { NavigationRegistry, NavigationNode, NavigationCategory } from "./NavigationRegistry";

/**
 * Wealth Management Navigation Registry
 * Comprehensive navigation structure for wealth management features
 */

// Core Wealth Management Categories
export const wealthManagementCategories: NavigationCategory[] = [
  {
    id: "wealth-overview",
    title: "Overview & Dashboard",
    label: "OVERVIEW",
    description: "Comprehensive wealth overview and analytics",
    items: [],
    defaultExpanded: true,
    permissions: ["wealth.read"],
    metadata: {
      icon: LayoutGridIcon,
      priority: 1,
      keywords: ["dashboard", "overview", "summary", "analytics"]
    }
  },
  {
    id: "wealth-accounts",
    title: "Accounts & Banking",
    label: "ACCOUNTS",
    description: "Account management and banking services",
    items: [],
    defaultExpanded: true,
    permissions: ["accounts.read"],
    metadata: {
      icon: CreditCardIcon,
      priority: 2,
      keywords: ["accounts", "banking", "balances", "transactions"]
    }
  },
  {
    id: "wealth-investments",
    title: "Investments & Markets",
    label: "INVESTMENTS",
    description: "Investment portfolio and market analysis",
    items: [],
    defaultExpanded: false,
    permissions: ["investments.read"],
    metadata: {
      icon: BarChart3Icon,
      priority: 3,
      keywords: ["investments", "portfolio", "stocks", "bonds", "markets"]
    }
  },
  {
    id: "wealth-planning",
    title: "Financial Planning",
    label: "PLANNING",
    description: "Financial goals and planning tools",
    items: [],
    defaultExpanded: false,
    permissions: ["planning.read"],
    metadata: {
      icon: TargetIcon,
      priority: 4,
      keywords: ["planning", "goals", "budgets", "forecasting"]
    }
  },
  {
    id: "wealth-estate",
    title: "Estate & Legacy",
    label: "ESTATE",
    description: "Estate planning and legacy management",
    items: [],
    defaultExpanded: false,
    permissions: ["estate.read"],
    metadata: {
      icon: ArchiveIcon,
      priority: 5,
      keywords: ["estate", "legacy", "trusts", "inheritance", "wills"]
    }
  },
  {
    id: "wealth-taxes",
    title: "Tax & Compliance",
    label: "TAXES",
    description: "Tax planning and compliance management",
    items: [],
    defaultExpanded: false,
    permissions: ["tax.read"],
    metadata: {
      icon: Calculator,
      priority: 6,
      keywords: ["tax", "compliance", "filing", "deductions", "planning"]
    }
  },
  {
    id: "wealth-services",
    title: "Services & Tools",
    label: "SERVICES",
    description: "Additional wealth management services",
    items: [],
    defaultExpanded: false,
    permissions: ["services.read"],
    metadata: {
      icon: BriefcaseIcon,
      priority: 7,
      keywords: ["services", "tools", "utilities", "support"]
    }
  }
];

// Detailed Navigation Nodes
export const wealthManagementNodes: NavigationNode[] = [
  // Overview & Dashboard
  {
    id: "wealth.overview.dashboard",
    title: "Wealth Dashboard",
    href: "/wealth",
    icon: LayoutGridIcon,
    category: "wealth-overview",
    priority: 1,
    metadata: {
      description: "Comprehensive wealth overview and key metrics",
      keywords: ["dashboard", "overview", "summary"]
    }
  },
  {
    id: "wealth.overview.net-worth",
    title: "Net Worth Tracker",
    href: "/wealth/net-worth",
    icon: TrendingUpIcon,
    category: "wealth-overview",
    priority: 2,
    metadata: {
      description: "Track and analyze net worth over time",
      keywords: ["net worth", "assets", "liabilities", "tracking"]
    }
  },
  {
    id: "wealth.overview.analytics",
    title: "Wealth Analytics",
    href: "/wealth/analytics",
    icon: PieChartIcon,
    category: "wealth-overview",
    priority: 3,
    metadata: {
      description: "Advanced wealth analytics and insights",
      keywords: ["analytics", "insights", "trends", "analysis"]
    }
  },

  // Accounts & Banking
  {
    id: "wealth.accounts.overview",
    title: "Accounts Overview",
    href: "/wealth/accounts",
    icon: CreditCardIcon,
    category: "wealth-accounts",
    priority: 1,
    metadata: {
      description: "View all accounts and balances",
      keywords: ["accounts", "balances", "overview"]
    }
  },
  {
    id: "wealth.accounts.cash",
    title: "Cash Management",
    href: "/wealth/cash",
    icon: DollarSignIcon,
    category: "wealth-accounts",
    priority: 2,
    children: [
      {
        id: "wealth.accounts.cash.management",
        title: "Cash Dashboard",
        href: "/wealth/cash/management",
        icon: WalletIcon,
        category: "wealth-accounts",
        subcategory: "cash",
        priority: 1
      },
      {
        id: "wealth.accounts.cash.sweep",
        title: "Cash Sweep",
        href: "/wealth/cash/sweep",
        icon: ArrowUpDownIcon,
        category: "wealth-accounts",
        subcategory: "cash",
        priority: 2
      },
      {
        id: "wealth.accounts.cash.yield",
        title: "Yield Optimization",
        href: "/wealth/cash/yield",
        icon: TrendingUpIcon,
        category: "wealth-accounts",
        subcategory: "cash",
        priority: 3
      }
    ],
    metadata: {
      description: "Comprehensive cash management tools",
      keywords: ["cash", "liquidity", "sweep", "yield"]
    }
  },
  {
    id: "wealth.accounts.transfers",
    title: "Transfers & Payments",
    href: "/wealth/transfers",
    icon: RepeatIcon,
    category: "wealth-accounts",
    priority: 3,
    children: [
      {
        id: "wealth.accounts.transfers.internal",
        title: "Internal Transfers",
        href: "/wealth/transfers/internal",
        icon: ArrowUpDownIcon,
        category: "wealth-accounts",
        subcategory: "transfers",
        priority: 1
      },
      {
        id: "wealth.accounts.transfers.external",
        title: "External Transfers",
        href: "/wealth/transfers/external",
        icon: RepeatIcon,
        category: "wealth-accounts",
        subcategory: "transfers",
        priority: 2
      },
      {
        id: "wealth.accounts.transfers.wire",
        title: "Wire Transfers",
        href: "/wealth/transfers/wire",
        icon: PointerIcon,
        category: "wealth-accounts",
        subcategory: "transfers",
        priority: 3
      }
    ],
    metadata: {
      description: "Transfer funds between accounts",
      keywords: ["transfers", "payments", "wire", "ach"]
    }
  },
  {
    id: "wealth.accounts.billpay",
    title: "Bill Pay",
    href: "/wealth/bill-pay",
    icon: Receipt,
    category: "wealth-accounts",
    priority: 4,
    comingSoon: true,
    metadata: {
      description: "Automated bill payment system",
      keywords: ["bills", "payments", "automation", "recurring"]
    }
  },

  // Investments & Markets
  {
    id: "wealth.investments.portfolio",
    title: "Portfolio Overview",
    href: "/wealth/investments",
    icon: BarChart3Icon,
    category: "wealth-investments",
    priority: 1,
    metadata: {
      description: "Comprehensive investment portfolio view",
      keywords: ["portfolio", "investments", "holdings", "performance"]
    }
  },
  {
    id: "wealth.investments.alternatives",
    title: "Alternative Investments",
    href: "/wealth/investments/alternatives",
    icon: LandmarkIcon,
    category: "wealth-investments",
    priority: 2,
    children: [
      {
        id: "wealth.investments.alternatives.private-equity",
        title: "Private Equity",
        href: "/wealth/investments/alternatives/private-equity",
        icon: BriefcaseIcon,
        category: "wealth-investments",
        subcategory: "alternatives",
        priority: 1
      },
      {
        id: "wealth.investments.alternatives.real-estate",
        title: "Real Estate",
        href: "/wealth/investments/alternatives/real-estate",
        icon: BuildingIcon,
        category: "wealth-investments",
        subcategory: "alternatives",
        priority: 2
      },
      {
        id: "wealth.investments.alternatives.digital-assets",
        title: "Digital Assets",
        href: "/wealth/investments/alternatives/digital-assets",
        icon: CoinsIcon,
        category: "wealth-investments",
        subcategory: "alternatives",
        priority: 3
      }
    ],
    metadata: {
      description: "Alternative investment opportunities",
      keywords: ["alternatives", "private equity", "real estate", "crypto"]
    }
  },
  {
    id: "wealth.investments.properties",
    title: "Real Estate",
    href: "/wealth/properties",
    icon: HomeIcon,
    category: "wealth-investments",
    priority: 3,
    metadata: {
      description: "Real estate portfolio management",
      keywords: ["real estate", "properties", "rentals", "reits"]
    }
  },

  // Financial Planning
  {
    id: "wealth.planning.goals",
    title: "Financial Goals",
    href: "/wealth/goals",
    icon: TargetIcon,
    category: "wealth-planning",
    priority: 1,
    children: [
      {
        id: "wealth.planning.goals.retirement",
        title: "Retirement Planning",
        href: "/wealth/goals/retirement",
        icon: CalendarIcon,
        category: "wealth-planning",
        subcategory: "goals",
        priority: 1
      },
      {
        id: "wealth.planning.goals.education",
        title: "Education Funding",
        href: "/wealth/goals/education",
        icon: BriefcaseIcon,
        category: "wealth-planning",
        subcategory: "goals",
        priority: 2
      },
      {
        id: "wealth.planning.goals.bucket-list",
        title: "Bucket List Goals",
        href: "/wealth/goals/bucket-list",
        icon: StarIcon,
        category: "wealth-planning",
        subcategory: "goals",
        priority: 3
      }
    ],
    metadata: {
      description: "Set and track financial goals",
      keywords: ["goals", "planning", "retirement", "education"]
    }
  },
  {
    id: "wealth.planning.budgets",
    title: "Budgets & Forecasting",
    href: "/wealth/budgets",
    icon: Calculator,
    category: "wealth-planning",
    priority: 2,
    comingSoon: true,
    metadata: {
      description: "Budget management and financial forecasting",
      keywords: ["budgets", "forecasting", "planning", "expenses"]
    }
  },
  {
    id: "wealth.planning.scenarios",
    title: "Scenario Planning",
    href: "/wealth/scenarios",
    icon: PieChartIcon,
    category: "wealth-planning",
    priority: 3,
    metadata: {
      description: "Model different financial scenarios",
      keywords: ["scenarios", "modeling", "what-if", "planning"]
    }
  },

  // Estate & Legacy
  {
    id: "wealth.estate.documents",
    title: "Estate Documents",
    href: "/wealth/estate/documents",
    icon: FileTextIcon,
    category: "wealth-estate",
    priority: 1,
    metadata: {
      description: "Manage estate planning documents",
      keywords: ["documents", "wills", "trusts", "estate"]
    }
  },
  {
    id: "wealth.estate.vault",
    title: "Family Vault",
    href: "/wealth/vault",
    icon: Lock,
    category: "wealth-estate",
    priority: 2,
    metadata: {
      description: "Secure document and information storage",
      keywords: ["vault", "security", "documents", "family"]
    }
  },
  {
    id: "wealth.estate.beneficiaries",
    title: "Beneficiaries",
    href: "/wealth/beneficiaries",  
    icon: Users2Icon,
    category: "wealth-estate",
    priority: 3,
    metadata: {
      description: "Manage beneficiary information",
      keywords: ["beneficiaries", "inheritance", "estate", "family"]
    }
  },

  // Tax & Compliance
  {
    id: "wealth.tax.planning",
    title: "Tax Planning",
    href: "/wealth/tax",
    icon: Calculator,
    category: "wealth-taxes",
    priority: 1,
    metadata: {
      description: "Strategic tax planning and optimization",
      keywords: ["tax", "planning", "optimization", "strategy"]
    }
  },
  {
    id: "wealth.tax.documents",
    title: "Tax Documents",
    href: "/wealth/tax/documents",
    icon: FileTextIcon,
    category: "wealth-taxes",
    priority: 2,
    metadata: {
      description: "Tax-related document management",
      keywords: ["tax documents", "forms", "filings", "records"]
    }
  },
  {
    id: "wealth.tax.business-filings",
    title: "Business Filings",
    href: "/wealth/business-filings",
    icon: BriefcaseIcon,
    category: "wealth-taxes",
    priority: 3,
    metadata: {
      description: "Business tax filings and compliance",
      keywords: ["business", "filings", "compliance", "corporate"]
    }
  },

  // Services & Tools
  {
    id: "wealth.services.social-security",
    title: "Social Security",
    href: "/wealth/social-security",
    icon: UserCheckIcon,
    category: "wealth-services",
    priority: 1,
    metadata: {
      description: "Social Security planning and optimization",
      keywords: ["social security", "benefits", "retirement", "optimization"]
    }
  },
  {
    id: "wealth.services.insurance",
    title: "Insurance Review",
    href: "/wealth/insurance",
    icon: ShieldIcon,
    category: "wealth-services",
    priority: 2,
    metadata: {
      description: "Comprehensive insurance portfolio review",
      keywords: ["insurance", "coverage", "risk", "protection"]
    }
  },
  {
    id: "wealth.services.tools",
    title: "Financial Tools",
    href: "/wealth/tools",
    icon: SettingsIcon,
    category: "wealth-services",
    priority: 3,
    children: [
      {
        id: "wealth.services.tools.calculators",
        title: "Calculators",
        href: "/wealth/tools/calculators",
        icon: Calculator,
        category: "wealth-services",
        subcategory: "tools",
        priority: 1
      },
      {
        id: "wealth.services.tools.reports",
        title: "Reports & Analytics",
        href: "/wealth/tools/reports",
        icon: BarChart3Icon,
        category: "wealth-services",
        subcategory: "tools",
        priority: 2
      }
    ],
    metadata: {
      description: "Financial planning tools and calculators",
      keywords: ["tools", "calculators", "utilities", "planning"]
    }
  }
];

/**
 * Initialize Wealth Management Navigation Registry
 */
export function initializeWealthManagementRegistry(): void {
  // Register all categories
  wealthManagementCategories.forEach(category => {
    NavigationRegistry.registerCategory(category);
  });

  // Register all nodes
  wealthManagementNodes.forEach(node => {
    NavigationRegistry.registerNode(node);
  });
}

/**
 * Get wealth management navigation tree
 */
export function getWealthManagementNavigation(): NavigationNode[] {
  return NavigationRegistry.buildNavigationTree("wealth-overview");
}

/**
 * Get navigation by category
 */
export function getWealthNavigationByCategory(categoryId: string): NavigationNode[] {
  return NavigationRegistry.getNodesByCategory(categoryId);
}

/**
 * Search wealth management navigation
 */
export function searchWealthNavigation(query: string, includeComingSoon = false): NavigationNode[] {
  return NavigationRegistry.searchNodes(query, {
    includeComingSoon,
    includeDisabled: false
  });
}

// Export for backward compatibility
export { wealthManagementNodes as wealthManagementNavItems };
export default wealthManagementNodes;