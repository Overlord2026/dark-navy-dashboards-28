import { 
  HomeIcon, 
  LayersIcon,
  GraduationCapIcon,
  BarChart3Icon,
  PieChart,
  ShieldIcon,
  BanknoteIcon,
  ArchiveIcon,
  BriefcaseIcon,
  WalletIcon,
  LineChartIcon,
  Diamond,
  BuildingIcon,
  Calculator,
  ArrowRightLeft,
  VaultIcon,
  CircleDollarSignIcon,
  ActivityIcon,
  HeartHandshakeIcon,
  ShareIcon,
  Users2Icon,
  UserIcon,
  PillIcon,
  FlaskConicalIcon,
  TrendingUpIcon,
  FolderHeartIcon,
  BookHeartIcon,
  Grid3x3Icon,
  CreditCardIcon,
  DollarSignIcon,
  HomeIcon as PropertyIcon,
  TargetIcon,
  CalendarIcon,
  StarIcon,
  FileTextIcon,
  UserCheckIcon,
  RepeatIcon,
  BarChart2Icon,
  TestTubeIcon,
  ShieldCheckIcon,
  SettingsIcon,
  LockIcon,
  CrownIcon,
  GiftIcon,
  ZapIcon,
  TrendingDownIcon,
  TrendingUpIcon as ChartIcon,
  HandCoinsIcon,
  TreePineIcon,
  HeartIcon,
  PhoneIcon
} from "lucide-react";

import { NavItem } from "@/types/navigation";

// New hierarchical navigation structure
export const hierarchicalNav: NavItem[] = [
  // 1. Dashboard - Personalized for user/role
  { 
    id: 'dashboard', 
    title: 'Dashboard', 
    href: '/', 
    icon: HomeIcon 
  },

  // 2. Education & Solutions Catalog (Always Free)
  { 
    id: 'education-solutions', 
    title: 'Education & Solutions', 
    icon: GraduationCapIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'education-center', 
        title: 'Education Center', 
        href: '/education', 
        icon: GraduationCapIcon,
        children: [
          {
            id: 'guides',
            title: 'Guides & Resources',
            href: '/education/guides',
            icon: BookHeartIcon
          },
          {
            id: 'video-library',
            title: 'Video Library',
            href: '/education/videos',
            icon: FlaskConicalIcon
          },
          {
            id: 'faqs',
            title: 'FAQs & Support',
            href: '/education/faqs',
            icon: UserIcon
          },
          {
            id: 'scorecards',
            title: 'Scorecards & Checklists',
            href: '/education/scorecards',
            icon: Grid3x3Icon
          }
        ]
      },
      { 
        id: 'solutions-directory', 
        title: 'Solutions Directory', 
        href: '/solutions', 
        icon: LayersIcon,
        children: [
          {
            id: 'investment-solutions',
            title: 'Investment Solutions',
            href: '/solutions/investments',
            icon: BarChart3Icon
          },
          {
            id: 'retirement-solutions',
            title: 'Retirement & Annuities',
            href: '/solutions/retirement',
            icon: CalendarIcon
          },
          {
            id: 'insurance-solutions',
            title: 'Insurance Solutions',
            href: '/solutions/insurance',
            icon: ShieldIcon
          },
          {
            id: 'tax-solutions',
            title: 'Tax Planning',
            href: '/solutions/tax',
            icon: PieChart
          },
          {
            id: 'estate-solutions',
            title: 'Estate Planning',
            href: '/solutions/estate',
            icon: ArchiveIcon
          }
        ]
      }
    ]
  },

  // 3. Investments
  { 
    id: 'investments', 
    title: 'Investments', 
    icon: BarChart3Icon, 
    collapsible: true, 
    children: [
      { 
        id: 'investment-overview', 
        title: 'Overview', 
        href: '/investments', 
        icon: Grid3x3Icon,
        featureId: 'free'
      },
      { 
        id: 'portfolio-tools', 
        title: 'Portfolio Tools', 
        href: '/investments/portfolio', 
        icon: PieChart,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'investment-marketplace', 
        title: 'Investment Marketplace', 
        href: '/investments/marketplace', 
        icon: LayersIcon,
        featureId: 'premium_analytics_access',
        isPremium: true
      }
    ]
  },

  // 4. Annuities (standalone for visibility)
  { 
    id: 'annuities', 
    title: 'Annuities', 
    icon: ArchiveIcon,
    collapsible: true, 
    children: [
      { 
        id: 'annuities-overview', 
        title: 'Overview', 
        href: '/annuities', 
        icon: ArchiveIcon,
        featureId: 'free'
      },
      { 
        id: 'annuities-education', 
        title: 'Education Center', 
        href: '/annuities/learn', 
        icon: GraduationCapIcon,
        featureId: 'free'
      },
      { 
        id: 'annuities-calculators', 
        title: 'Calculators', 
        href: '/annuities/calculators', 
        icon: Calculator,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'annuities-marketplace', 
        title: 'Marketplace', 
        href: '/annuities/marketplace', 
        icon: LayersIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      },
      { 
        id: 'contract-analyzer', 
        title: 'Contract Analyzer', 
        href: '/annuities/analyze', 
        icon: FileTextIcon,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'fiduciary-review', 
        title: 'Fiduciary Review', 
        href: '/annuities/review', 
        icon: ShieldIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      }
    ]
  },

  // 5. Lending
  { 
    id: 'lending', 
    title: 'Lending', 
    icon: BanknoteIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'lending-overview', 
        title: 'Overview', 
        href: '/lending', 
        icon: Grid3x3Icon,
        featureId: 'free'
      },
      { 
        id: 'lending-prequalify', 
        title: 'Pre-Qualification', 
        href: '/lending/prequalify', 
        icon: UserCheckIcon,
        featureId: 'lending_access',
        isPremium: true
      },
      { 
        id: 'lending-application', 
        title: 'Apply for Loan', 
        href: '/lending/apply', 
        icon: FileTextIcon,
        featureId: 'lending_access',
        isPremium: true
      },
      { 
        id: 'lending-marketplace', 
        title: 'Partner Marketplace', 
        href: '/lending/partners', 
        icon: LayersIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      }
    ]
  },

  // 6. Insurance
  { 
    id: 'insurance', 
    title: 'Insurance', 
    icon: ShieldIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'insurance-overview', 
        title: 'Overview', 
        href: '/insurance', 
        icon: Grid3x3Icon,
        featureId: 'free'
      },
      { 
        id: 'needs-analysis', 
        title: 'Needs Analysis', 
        href: '/insurance/analysis', 
        icon: Calculator,
        featureId: 'free'
      },
      { 
        id: 'policy-manager', 
        title: 'Policy Manager', 
        href: '/insurance/policies', 
        icon: FileTextIcon,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'insurance-marketplace', 
        title: 'Insurance Marketplace', 
        href: '/insurance/marketplace', 
        icon: LayersIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      },
      { 
        id: 'advanced-strategies', 
        title: 'Medicare & LTC Planning', 
        href: '/insurance/advanced', 
        icon: HeartIcon,
        featureId: 'premium_analytics_access',
        isPremium: true
      }
    ]
  },

  // 7. Tax Planning
  { 
    id: 'tax-planning', 
    title: 'Tax Planning', 
    icon: PieChart, 
    collapsible: true, 
    children: [
      { 
        id: 'tax-overview', 
        title: 'Tax Readiness', 
        href: '/tax-planning', 
        icon: Grid3x3Icon,
        featureId: 'free'
      },
      { 
        id: 'tax-calculators', 
        title: 'Roth & Withdrawal Calculators', 
        href: '/tax-planning/calculators', 
        icon: Calculator,
        featureId: 'tax_access',
        isPremium: true
      },
      { 
        id: 'multi-year-analysis', 
        title: 'Multi-Year Tax Analysis', 
        href: '/tax-planning/analysis', 
        icon: BarChart3Icon,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'cpa-marketplace', 
        title: 'CPA Marketplace', 
        href: '/tax-planning/marketplace', 
        icon: LayersIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      }
    ]
  },

  // 8. Estate Planning
  { 
    id: 'estate-planning', 
    title: 'Estate Planning', 
    icon: ArchiveIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'estate-basics', 
        title: 'Basics & Education', 
        href: '/estate-planning', 
        icon: GraduationCapIcon,
        featureId: 'free'
      },
      { 
        id: 'document-checklist', 
        title: 'Document Checklist', 
        href: '/estate-planning/checklist', 
        icon: FileTextIcon,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'secure-vault', 
        title: 'Secure Document Vault', 
        href: '/estate-planning/vault', 
        icon: VaultIcon,
        featureId: 'premium_analytics_access',
        isPremium: true
      },
      { 
        id: 'family-legacy-vault', 
        title: 'Family Legacy Vault™', 
        href: '/family-vault', 
        icon: FolderHeartIcon,
        featureId: 'family_legacy_box',
        isPremium: true
      }
    ]
  },

  // 8.5. Advisor Tools (for advisor role only)
  { 
    id: 'advisor-tools', 
    title: 'Advisor Tools', 
    icon: BriefcaseIcon, 
    collapsible: true,
    children: [
      { 
        id: 'advisor-dashboard', 
        title: 'Advisor Dashboard', 
        href: '/advisor-dashboard', 
        icon: Grid3x3Icon
      },
      { 
        id: 'advisor-clients', 
        title: 'Client Management', 
        href: '/advisor/clients', 
        icon: Users2Icon
      },
      { 
        id: 'advisor-prospects', 
        title: 'Prospect Pipeline', 
        href: '/advisor/prospects', 
        icon: TargetIcon
      },
      { 
        id: 'advisor-portfolio', 
        title: 'Portfolio Tools', 
        href: '/advisor/portfolio', 
        icon: PieChart
      },
      { 
        id: 'advisor-resources', 
        title: 'Resource Center', 
        href: '/advisor/resources', 
        icon: BookHeartIcon
      },
      { 
        id: 'advisor-compliance', 
        title: 'Compliance', 
        href: '/advisor/compliance', 
        icon: ShieldCheckIcon
      }
    ]
  },

  // 9. Family Wealth Tools (Main App Core)
  { 
    id: 'wealth', 
    title: 'Family Wealth Tools', 
    icon: BriefcaseIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'wealth-overview', 
        title: 'Wealth Overview', 
        href: '/wealth', 
        icon: Grid3x3Icon,
        featureId: 'dashboard-overview'
      },
      { 
        id: 'wealth-accounts', 
        title: 'Accounts Management', 
        href: '/wealth/accounts', 
        icon: CreditCardIcon,
        featureId: 'accounts-overview'
      },
      {
        id: 'wealth-goals',
        title: 'Goals & Budgets',
        icon: TargetIcon,
        collapsible: true,
        children: [
          { 
            id: 'goals-overview', 
            title: 'Goals Overview', 
            href: '/wealth/goals', 
            icon: TargetIcon,
            featureId: 'goals-budgets'
          },
          { 
            id: 'budgets', 
            title: 'Budget Management', 
            href: '/wealth/goals/budgets', 
            icon: ArchiveIcon,
            featureId: 'goals-budgets'
          }
        ]
      },
      {
        id: 'wealth-cash',
        title: 'Cash & Transfers',
        icon: DollarSignIcon,
        href: '/wealth/cash',
        featureId: 'cash-transfers',
        collapsible: true,
        children: [
          { 
            id: 'cash-management', 
            title: 'Cash Management', 
            href: '/wealth/cash/management', 
            icon: WalletIcon,
            featureId: 'cash-transfers'
          },
          { 
            id: 'transfers', 
            title: 'Transfers', 
            href: '/wealth/cash/transfers', 
            icon: RepeatIcon,
            featureId: 'cash-transfers'
          }
        ]
      },
      { 
        id: 'wealth-properties', 
        title: 'Properties', 
        href: '/wealth/properties', 
        icon: PropertyIcon,
        featureId: 'properties-basic'
      },
      { 
        id: 'wealth-bill-pay', 
        title: 'Bill Pay', 
        href: '/wealth/bill-pay', 
        icon: CreditCardIcon,
        featureId: 'bill-pay-basic'
      },
      { 
        id: 'wealth-business', 
        title: 'Business Filings', 
        href: '/wealth/business-filings', 
        icon: BriefcaseIcon,
        featureId: 'business-filings'
      },
      { 
        id: 'wealth-docs', 
        title: 'Documents & Vault', 
        href: '/wealth/docs', 
        icon: VaultIcon,
        featureId: 'documents-vault'
      }
    ]
  },

  // 10. Health Optimization
  { 
    id: 'health', 
    title: 'Health Optimization', 
    icon: ActivityIcon,
    collapsible: true, 
    children: [
      { 
        id: 'health-overview', 
        title: 'Health Overview', 
        href: '/health', 
        icon: Grid3x3Icon 
      },
      {
        id: 'health-accounts',
        title: 'HSA & Health Accounts',
        icon: WalletIcon,
        collapsible: true,
        children: [
          { 
            id: 'hsa-overview', 
            title: 'HSA Management', 
            href: '/health/hsa', 
            icon: WalletIcon 
          },
          { 
            id: 'hsa-calculator', 
            title: 'HSA Calculator', 
            href: '/health/hsa/calculator', 
            icon: Calculator 
          }
        ]
      },
      {
        id: 'healthspan',
        title: 'Healthspan Optimization',
        icon: TrendingUpIcon,
        collapsible: true,
        children: [
          { 
            id: 'health-metrics', 
            title: 'Health Metrics', 
            href: '/health/metrics', 
            icon: BarChart2Icon 
          },
          { 
            id: 'biomarkers', 
            title: 'Lab & Biomarkers', 
            href: '/health/biomarkers', 
            icon: TestTubeIcon 
          },
          { 
            id: 'preventive-care', 
            title: 'Preventive Care', 
            href: '/health/preventive', 
            icon: ShieldCheckIcon 
          }
        ]
      },
      { 
        id: 'health-providers', 
        title: 'Healthcare Providers', 
        href: '/health/providers', 
        icon: HeartHandshakeIcon 
      },
      { 
        id: 'medical-vault', 
        title: 'Medical Document Vault', 
        href: '/health/documents', 
        icon: FolderHeartIcon 
      }
    ]
  },

  // 11. Marketplace
  { 
    id: 'marketplace', 
    title: 'Professional Marketplace', 
    icon: LayersIcon,
    collapsible: true, 
    children: [
      { 
        id: 'marketplace-overview', 
        title: 'Marketplace Overview', 
        href: '/marketplace', 
        icon: Grid3x3Icon,
        featureId: 'free'
      },
      { 
        id: 'advisor-directory', 
        title: 'Advisor Directory', 
        href: '/marketplace/advisors', 
        icon: Users2Icon,
        featureId: 'advisor_marketplace',
        isPremium: true
      },
      { 
        id: 'cpa-directory', 
        title: 'CPA Directory', 
        href: '/marketplace/cpas', 
        icon: PieChart,
        featureId: 'advisor_marketplace',
        isPremium: true
      },
      { 
        id: 'attorney-directory', 
        title: 'Attorney Directory', 
        href: '/marketplace/attorneys', 
        icon: ArchiveIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      },
      { 
        id: 'consultant-directory', 
        title: 'Consultant Directory', 
        href: '/marketplace/consultants', 
        icon: BriefcaseIcon,
        featureId: 'advisor_marketplace',
        isPremium: true
      }
    ]
  },

  // 12. Settings & Support
  { 
    id: 'settings', 
    title: 'Settings & Support', 
    icon: SettingsIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'profile-settings', 
        title: 'Profile Settings', 
        href: '/settings/profile', 
        icon: UserIcon 
      },
      { 
        id: 'subscription-settings', 
        title: 'Subscription', 
        href: '/settings/subscription', 
        icon: CrownIcon 
      },
      { 
        id: 'security-settings', 
        title: 'Security', 
        href: '/settings/security', 
        icon: LockIcon 
      },
      { 
        id: 'support', 
        title: 'Help & Support', 
        href: '/support', 
        icon: PhoneIcon 
      }
    ]
  }
];

// Helper function to convert hierarchical nav to flat structure for backward compatibility
export const convertToFlatNavigation = (hierarchicalNav: NavItem[]): Record<string, NavItem[]> => {
  const flatNav: Record<string, NavItem[]> = {};
  
  const processItem = (item: NavItem, categoryName?: string) => {
    if (item.children && item.children.length > 0) {
      // This is a category
      const categoryKey = categoryName || item.title.toLowerCase().replace(/\s+/g, '-');
      flatNav[categoryKey] = item.children;
      
      // Process nested children
      item.children.forEach(child => {
        if (child.children && child.children.length > 0) {
          processItem(child, `${categoryKey}-${child.title.toLowerCase().replace(/\s+/g, '-')}`);
        }
      });
    }
  };
  
  hierarchicalNav.forEach(item => processItem(item));
  
  return flatNav;
};

// Export flat navigation for backward compatibility
export const navigationData = convertToFlatNavigation(hierarchicalNav);