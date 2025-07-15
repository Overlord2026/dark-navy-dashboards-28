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
  RepeatIcon
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
        title: 'Education Center', 
        href: '/education', 
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

  // Authenticated client workspace
  { 
    id: 'client', 
    title: 'Client Tools', 
    icon: BriefcaseIcon, 
    collapsible: true, 
    children: [
      { 
        id: 'wealth', 
        title: 'Wealth Management', 
        icon: BriefcaseIcon,
        href: '/wealth',
        collapsible: true, 
        children: [
          { 
            id: 'wealth-overview', 
            title: 'Overview', 
            href: '/wealth', 
            icon: Grid3x3Icon 
          },
          { 
            id: 'wealth-accounts', 
            title: 'Accounts Overview', 
            href: '/wealth/accounts', 
            icon: CreditCardIcon 
          },
          {
            id: 'wealth-cash',
            title: 'Cash & Transfers',
            icon: DollarSignIcon,
            href: '/wealth/cash',
            collapsible: true,
            children: [
              { 
                id: 'cash-management', 
                title: 'Cash Management', 
                href: '/wealth/cash/management', 
                icon: WalletIcon 
              },
              { 
                id: 'transfers', 
                title: 'Transfers', 
                href: '/wealth/cash/transfers', 
                icon: RepeatIcon 
              },
            ],
          },
          { 
            id: 'wealth-properties', 
            title: 'Properties', 
            href: '/wealth/properties', 
            icon: PropertyIcon 
          },
          {
            id: 'wealth-goals',
            title: 'Goals & Budgets',
            icon: TargetIcon,
            href: '/wealth/goals',
            collapsible: true,
            children: [
              { 
                id: 'goals-retirement', 
                title: 'Retirement Goals', 
                href: '/wealth/goals/retirement', 
                icon: CalendarIcon 
              },
              { 
                id: 'goals-bucket', 
                title: 'Bucket-List Goals', 
                href: '/wealth/goals/bucket-list', 
                icon: StarIcon 
              },
              { 
                id: 'goals-budgets', 
                title: 'Budgets (Soon)', 
                href: '/wealth/goals/budgets', 
                icon: ArchiveIcon,
                disabled: true 
              },
            ],
          },
          { 
            id: 'wealth-docs', 
            title: 'Documents & Vault', 
            href: '/wealth/docs', 
            icon: FileTextIcon 
          },
          { 
            id: 'wealth-ssn', 
            title: 'Social Security', 
            href: '/wealth/social-security', 
            icon: UserCheckIcon 
          },
          { 
            id: 'wealth-business', 
            title: 'Business Filings', 
            href: '/wealth/business-filings', 
            icon: BriefcaseIcon 
          },
          { 
            id: 'wealth-bill-pay', 
            title: 'Bill Pay (Soon)', 
            href: '/wealth/bill-pay', 
            icon: CreditCardIcon,
            disabled: true 
          },
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
            id: 'h-dash', 
            title: 'Health Dashboard', 
            href: '/health', 
            icon: ActivityIcon 
          },
          { 
            id: 'h-hsa', 
            title: 'HSA Accounts', 
            href: '/healthcare-hsa-accounts', 
            icon: WalletIcon 
          },
          { 
            id: 'h-save', 
            title: 'Healthcare Savings', 
            href: '/healthcare-savings', 
            icon: CircleDollarSignIcon 
          },
          { 
            id: 'h-providers', 
            title: 'Healthcare Providers', 
            href: '/healthcare-providers', 
            icon: HeartHandshakeIcon 
          },
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
          },
          { 
            id: 'h-healthspan', 
            title: 'HealthSpan Expansion', 
            href: '/healthcare-healthspan', 
            icon: TrendingUpIcon 
          },
          { 
            id: 'h-docs', 
            title: 'Medical Records', 
            href: '/health/records', 
            icon: FolderHeartIcon 
          },
          { 
            id: 'h-metrics', 
            title: 'Health Metrics', 
            href: '/health/metrics', 
            icon: ActivityIcon 
          },
          { 
            id: 'h-knowledge', 
            title: 'Knowledge & Support', 
            href: '/healthcare-knowledge', 
            icon: BookHeartIcon 
          },
          { 
            id: 'h-share', 
            title: 'Share Data', 
            href: '/healthcare-share-data', 
            icon: ShareIcon 
          }
        ]
      },
      
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
        id: 'help', 
        title: 'Help', 
        href: '/help', 
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