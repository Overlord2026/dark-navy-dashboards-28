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
  { 
    id: 'home', 
    title: 'Dashboard', 
    href: '/', 
    icon: HomeIcon 
  },

  // Prospect-facing catalog
  { 
    id: 'catalog', 
    title: 'Education & Solutions', 
    icon: LayersIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'edu', 
        title: 'Resources & Solutions Catalog', 
        href: '/client-education', 
        icon: GraduationCapIcon 
      },
      { 
        id: 'inv-sol', 
        title: 'Investment Solutions', 
        href: '/investments', 
        icon: BarChart3Icon 
      },
      { 
        id: 'tax-sol', 
        title: 'Tax Planning', 
        href: '/tax-planning', 
        icon: PieChart 
      },
      { 
        id: 'ins-sol', 
        title: 'Insurance Solutions', 
        href: '/insurance', 
        icon: ShieldIcon 
      },
      { 
        id: 'lend-sol', 
        title: 'Lending Solutions', 
        href: '/client-lending', 
        icon: BanknoteIcon 
      },
      { 
        id: 'estate-sol', 
        title: 'Estate Planning', 
        href: '/estate-planning', 
        icon: ArchiveIcon 
      },
    ]
  },

  // Family Wealth Tools - Basic & Premium with Clear Separation
  { 
    id: 'wealth', 
    title: 'Family Wealth Tools', 
    icon: BriefcaseIcon, 
    collapsible: true, 
    children: [
      // BASIC/SUBSCRIBER ACCESS - Family Wealth Tools
      { 
        id: 'wealth-overview', 
        title: 'Dashboard / Overview', 
        href: '/wealth', 
        icon: Grid3x3Icon,
        featureId: 'dashboard-overview'
      },
      { 
        id: 'wealth-accounts', 
        title: 'Accounts Overview', 
        href: '/wealth/accounts', 
        icon: CreditCardIcon,
        featureId: 'accounts-overview'
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
          },
        ],
      },
      {
        id: 'wealth-goals',
        title: 'Goals & Budgets',
        icon: TargetIcon,
        href: '/wealth/goals',
        featureId: 'goals-budgets',
        collapsible: true,
        children: [
          { 
            id: 'goals-retirement', 
            title: 'Retirement Goals', 
            href: '/wealth/goals/retirement', 
            icon: CalendarIcon,
            featureId: 'goals-budgets'
          },
          { 
            id: 'goals-bucket', 
            title: 'Bucket-List Goals', 
            href: '/wealth/goals/bucket-list', 
            icon: StarIcon,
            featureId: 'goals-budgets'
          },
          { 
            id: 'goals-budgets', 
            title: 'Budgets (Soon)', 
            href: '/wealth/goals/budgets', 
            icon: ArchiveIcon,
            featureId: 'goals-budgets',
            comingSoon: true
          },
        ],
      },
      { 
        id: 'wealth-docs', 
        title: 'Documents & Vault', 
        href: '/wealth/docs', 
        icon: VaultIcon,
        featureId: 'documents-vault'
      },
      { 
        id: 'wealth-ssn', 
        title: 'Social Security Optimization', 
        href: '/wealth/social-security', 
        icon: UserCheckIcon,
        featureId: 'social-security-optimization'
      },
      { 
        id: 'wealth-properties-basic', 
        title: 'Properties (Basic)', 
        href: '/wealth/properties', 
        icon: PropertyIcon,
        featureId: 'properties-basic'
      },
      { 
        id: 'wealth-business', 
        title: 'Business Filings', 
        href: '/wealth/business-filings', 
        icon: BriefcaseIcon,
        featureId: 'business-filings'
      },
      { 
        id: 'wealth-bill-pay', 
        title: 'Bill Pay (Basic)', 
        href: '/wealth/bill-pay', 
        icon: CreditCardIcon,
        featureId: 'bill-pay-basic',
        comingSoon: true
      },

      // PREMIUM FEATURES - Clearly marked and gated
      {
        id: 'premium-divider',
        title: '─── Premium Features ───',
        disabled: true,
        icon: CrownIcon
      },
      {
        id: 'premium-tax-planning',
        title: 'Advanced Tax Planning',
        icon: PieChart,
        isPremium: true,
        featureId: 'advanced-tax-planning',
        collapsible: true,
        children: [
          {
            id: 'high-net-worth-tax',
            title: 'High Net Worth Tax Strategies',
            href: '/wealth/premium/tax/high-net-worth',
            icon: TrendingUpIcon,
            isPremium: true,
            featureId: 'high-net-worth-tax'
          },
          {
            id: 'appreciated-stock',
            title: 'Appreciated Stock Solutions',
            href: '/wealth/premium/tax/appreciated-stock',
            icon: ChartIcon,
            isPremium: true,
            featureId: 'appreciated-stock-solutions'
          },
          {
            id: 'charitable-gifting',
            title: 'Charitable Gifting Optimizer',
            href: '/wealth/premium/tax/charitable-gifting',
            icon: HeartIcon,
            isPremium: true,
            featureId: 'charitable-gifting-optimizer'
          },
          {
            id: 'nua-espp-rsu',
            title: 'NUA/ESPP/RSU Optimizer',
            href: '/wealth/premium/tax/nua-espp-rsu',
            icon: ZapIcon,
            isPremium: true,
            featureId: 'nua-espp-rsu-optimizer'
          },
          {
            id: 'roth-conversion',
            title: 'Roth Conversion Analyzer',
            href: '/wealth/premium/tax/roth-conversion',
            icon: RepeatIcon,
            isPremium: true,
            featureId: 'roth-conversion-analyzer'
          },
          {
            id: 'state-residency',
            title: 'State Residency Analysis',
            href: '/wealth/premium/tax/state-residency',
            icon: PropertyIcon,
            isPremium: true,
            featureId: 'state-residency-analysis'
          },
          {
            id: 'trust-entity-tax',
            title: 'Trust/Entity Tax Planning',
            href: '/wealth/premium/tax/trust-entity',
            icon: BuildingIcon,
            isPremium: true,
            featureId: 'trust-entity-tax-planning'
          }
        ]
      },
      {
        id: 'advanced-property',
        title: 'Advanced Property Management',
        href: '/wealth/premium/properties',
        icon: PropertyIcon,
        isPremium: true,
        featureId: 'advanced-property-management'
      },
      {
        id: 'family-legacy-box',
        title: 'Family Legacy Box™',
        href: '/wealth/premium/legacy-box',
        icon: GiftIcon,
        isPremium: true,
        featureId: 'family-legacy-box'
      },
      {
        id: 'private-market-alpha',
        title: 'Private Market Alpha',
        href: '/wealth/premium/private-market',
        icon: TrendingUpIcon,
        isPremium: true,
        featureId: 'private-market-alpha'
      },
      {
        id: 'full-healthcare-optimization',
        title: 'Full Healthcare Optimization',
        href: '/health/premium',
        icon: HeartIcon,
        isPremium: true,
        featureId: 'full-healthcare-optimization'
      },
      {
        id: 'business-concierge',
        title: 'Business Concierge Tools',
        href: '/wealth/premium/business-concierge',
        icon: PhoneIcon,
        isPremium: true,
        featureId: 'business-concierge-tools'
      }
    ]
  },

  // Health Optimization section
  { 
    id: 'health', 
    title: 'Health Optimization', 
    icon: ActivityIcon,
    collapsible: true, 
    children: [
      { 
        id: 'h-overview', 
        title: 'Overview', 
        href: '/health', 
        icon: Grid3x3Icon 
      },
      {
        id: 'h-accounts',
        title: 'Accounts',
        icon: WalletIcon,
        collapsible: true,
        children: [
          { 
            id: 'h-hsa', 
            title: 'HSA Accounts', 
            icon: WalletIcon,
            collapsible: true,
            children: [
              { 
                id: 'h-hsa-overview', 
                title: 'HSA Overview', 
                href: '/healthcare-hsa-accounts', 
                icon: WalletIcon 
              },
              { 
                id: 'h-hsa-calculator', 
                title: 'Contribution Calculator', 
                href: '/health/accounts/hsa/calculator', 
                icon: Calculator 
              }
            ]
          }
        ]
      },
      {
        id: 'h-healthspan',
        title: 'Healthspan',
        icon: TrendingUpIcon,
        collapsible: true,
        children: [
          { 
            id: 'h-insights', 
            title: 'Insights', 
            href: '/healthcare-healthspan', 
            icon: TrendingUpIcon 
          },
          { 
            id: 'h-daily-metrics', 
            title: 'Daily Metrics', 
            href: '/health/metrics', 
            icon: BarChart2Icon 
          },
          { 
            id: 'h-lab-biomarkers', 
            title: 'Lab Biomarkers', 
            href: '/health/biomarkers', 
            icon: TestTubeIcon 
          },
          { 
            id: 'h-biological-age', 
            title: 'Biological A...', 
            href: '/health/biological-age', 
            icon: ActivityIcon 
          },
          { 
            id: 'h-preventive', 
            title: 'Preventive S...', 
            href: '/health/preventive', 
            icon: ShieldCheckIcon 
          },
          { 
            id: 'h-trends', 
            title: 'Trends & M...', 
            href: '/health/trends', 
            icon: BarChart2Icon 
          }
        ]
      },
      {
        id: 'h-care-team',
        title: 'Care Team',
        icon: HeartHandshakeIcon,
        collapsible: true,
        children: [
          { 
            id: 'h-providers', 
            title: 'Providers', 
            href: '/healthcare-providers', 
            icon: HeartHandshakeIcon 
          },
          { 
            id: 'h-share', 
            title: 'Share Data (...', 
            href: '/healthcare-share-data', 
            icon: ShareIcon 
          }
        ]
      },
      {
        id: 'h-pharmacy',
        title: 'Pharmacy',
        icon: PillIcon,
        collapsible: true,
        children: [
          { 
            id: 'h-meds', 
            title: 'Medications', 
            href: '/healthcare-medications', 
            icon: PillIcon 
          },
          { 
            id: 'h-supplements', 
            title: 'Supplements', 
            href: '/healthcare-supplements', 
            icon: FlaskConicalIcon 
          }
        ]
      },
      { 
        id: 'h-docs', 
        title: 'Docs & Directives', 
        href: '/healthcare-documents', 
        icon: FolderHeartIcon 
      },
      {
        id: 'h-knowledge',
        title: 'Knowledge',
        icon: BookHeartIcon,
        collapsible: true,
        children: [
          { 
            id: 'h-books', 
            title: 'Books', 
            href: '/healthcare-knowledge', 
            icon: BookHeartIcon 
          },
          { 
            id: 'h-coaching', 
            title: 'Coaching', 
            href: '/healthcare-coaching', 
            icon: UserIcon 
          },
          { 
            id: 'h-education', 
            title: 'Education', 
            href: '/healthcare-education', 
            icon: GraduationCapIcon 
          },
          { 
            id: 'h-recommendations', 
            title: 'Recommend...', 
            href: '/healthcare-recommendations', 
            icon: StarIcon 
          }
        ]
      },
      { 
        id: 'h-settings', 
        title: 'Settings', 
        href: '/healthcare-settings', 
        icon: SettingsIcon 
      },
      { 
        id: 'h-medical-records', 
        title: 'Medical Records', 
        href: '/health/records', 
        icon: FolderHeartIcon 
      }
    ]
  },
  
  // Collaboration section
  { 
    id: 'collab', 
    title: 'Collaboration', 
    icon: ShareIcon,
    collapsible: true, 
    children: [
      { 
        id: 'family', 
        title: 'Family Members', 
        href: '/sharing', 
        icon: Users2Icon 
      },
      { 
        id: 'contacts', 
        title: 'Trusted Contacts', 
        href: '/sharing', 
        icon: HeartHandshakeIcon 
      },
    ]
  },

  // Support section
  { 
    id: 'support', 
    title: 'Support', 
    icon: HeartHandshakeIcon,
    collapsible: true,
    children: [
      { 
        id: 'analytics', 
        title: 'Analytics', 
        href: '/analytics', 
        icon: BarChart3Icon 
      },
      { 
        id: 'webhooks', 
        title: 'Webhooks & CRM', 
        href: '/webhooks', 
        icon: ZapIcon 
      },
      { 
        id: 'help', 
        title: 'Help', 
        href: '/help-center', 
        icon: HeartHandshakeIcon 
      },
      { 
        id: 'settings', 
        title: 'Settings', 
        href: '/settings', 
        icon: UserIcon 
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