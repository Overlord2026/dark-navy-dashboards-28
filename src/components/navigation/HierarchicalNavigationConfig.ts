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
  BookHeartIcon
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
        icon: WalletIcon,
        collapsible: true, 
        children: [
          { 
            id: 'w-over', 
            title: 'Financial Plans', 
            href: '/financial-plans', 
            icon: LineChartIcon 
          },
          { 
            id: 'w-acc', 
            title: 'Accounts Overview', 
            href: '/accounts', 
            icon: WalletIcon 
          },
          { 
            id: 'w-assets', 
            title: 'All Assets', 
            href: '/all-assets', 
            icon: Diamond 
          },
          { 
            id: 'w-cash', 
            title: 'Cash Management', 
            href: '/cash-management', 
            icon: BanknoteIcon,
            comingSoon: true
          },
          { 
            id: 'w-transfers', 
            title: 'Transfers', 
            href: '/transfers', 
            icon: ArrowRightLeft 
          },
          { 
            id: 'w-goals', 
            title: 'Tax & Budgets', 
            href: '/tax-budgets', 
            icon: Calculator 
          },
          { 
            id: 'w-prop', 
            title: 'Properties', 
            href: '/properties', 
            icon: BuildingIcon 
          },
          { 
            id: 'w-vault', 
            title: 'Secure Family Vault', 
            href: '/legacy-vault', 
            icon: VaultIcon 
          },
          { 
            id: 'w-ssa', 
            title: 'Social Security', 
            href: '/client-social-security', 
            icon: CircleDollarSignIcon 
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
            href: '/healthcare-dashboard', 
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
            title: 'Healthcare Documents', 
            href: '/healthcare-documents', 
            icon: FolderHeartIcon 
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