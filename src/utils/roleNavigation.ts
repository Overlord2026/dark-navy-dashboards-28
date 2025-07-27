import { NavItem } from '@/types/navigation';
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
  ActivityIcon,
  Users2Icon,
  SettingsIcon,
  FileTextIcon,
  Calculator,
  UserCheckIcon,
  BookOpenIcon,
  TrendingUpIcon
} from "lucide-react";

// Navigation configurations for different roles
export const getRoleNavigation = (role: string, tier?: 'basic' | 'premium'): NavItem[] => {
  const baseNavigation: NavItem[] = [
    { 
      id: 'home', 
      title: 'Dashboard', 
      href: '/', 
      icon: HomeIcon 
    }
  ];

  switch (role) {
    case 'client':
    case 'client_premium':
      return [
        ...baseNavigation,
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
            }
          ]
        },
        { 
          id: 'wealth', 
          title: 'Family Wealth Tools', 
          icon: BriefcaseIcon, 
          collapsible: true, 
          children: [
            { 
              id: 'wealth-overview', 
              title: 'Dashboard / Overview', 
              href: '/wealth', 
              icon: HomeIcon
            },
            { 
              id: 'wealth-accounts', 
              title: 'Accounts Overview', 
              href: '/wealth/accounts', 
              icon: WalletIcon
            },
            ...(tier === 'premium' ? [
              {
                id: 'premium-divider',
                title: '─── Premium Features ───',
                disabled: true,
                icon: ShieldIcon
              },
              {
                id: 'premium-tax-planning',
                title: 'Advanced Tax Planning',
                href: '/wealth/premium/tax',
                icon: PieChart,
                isPremium: true
              }
            ] : [])
          ]
        },
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
              icon: HomeIcon 
            }
          ]
        }
      ];

    case 'advisor':
      return [
        ...baseNavigation,
        {
          id: 'clients',
          title: 'Client Management',
          icon: Users2Icon,
          collapsible: true,
          children: [
            {
              id: 'client-list',
              title: 'Client List',
              href: '/advisor/clients',
              icon: Users2Icon
            },
            {
              id: 'prospect-management',
              title: 'Prospect Management',
              href: '/advisor/prospects',
              icon: UserCheckIcon
            }
          ]
        },
        {
          id: 'portfolio',
          title: 'Portfolio Management',
          icon: BarChart3Icon,
          collapsible: true,
          children: [
            {
              id: 'portfolio-overview',
              title: 'Portfolio Overview',
              href: '/advisor/portfolio',
              icon: BarChart3Icon
            },
            {
              id: 'performance',
              title: 'Performance Reports',
              href: '/advisor/performance',
              icon: TrendingUpIcon
            }
          ]
        },
        {
          id: 'business',
          title: 'Business Management',
          icon: BriefcaseIcon,
          collapsible: true,
          children: [
            {
              id: 'fee-billing',
              title: 'Fee & Billing',
              href: '/advisor/billing',
              icon: Calculator
            },
            {
              id: 'compliance',
              title: 'Compliance & Reporting',
              href: '/advisor/compliance',
              icon: FileTextIcon
            }
          ]
        }
      ];

    case 'accountant':
      return [
        ...baseNavigation,
        {
          id: 'tax-services',
          title: 'Tax Services',
          icon: Calculator,
          collapsible: true,
          children: [
            {
              id: 'tax-preparation',
              title: 'Tax Preparation',
              href: '/accountant/tax-prep',
              icon: FileTextIcon
            },
            {
              id: 'tax-planning',
              title: 'Tax Planning',
              href: '/accountant/tax-planning',
              icon: PieChart
            }
          ]
        },
        {
          id: 'bookkeeping',
          title: 'Bookkeeping',
          icon: BookOpenIcon,
          collapsible: true,
          children: [
            {
              id: 'general-ledger',
              title: 'General Ledger',
              href: '/accountant/ledger',
              icon: BookOpenIcon
            },
            {
              id: 'financial-statements',
              title: 'Financial Statements',
              href: '/accountant/statements',
              icon: BarChart3Icon
            }
          ]
        }
      ];

    case 'consultant':
      return [
        ...baseNavigation,
        {
          id: 'consulting-projects',
          title: 'Consulting Projects',
          icon: BriefcaseIcon,
          collapsible: true,
          children: [
            {
              id: 'active-projects',
              title: 'Active Projects',
              href: '/consultant/projects',
              icon: BriefcaseIcon
            },
            {
              id: 'client-assessments',
              title: 'Client Assessments',
              href: '/consultant/assessments',
              icon: FileTextIcon
            }
          ]
        },
        {
          id: 'knowledge-base',
          title: 'Knowledge Base',
          icon: BookOpenIcon,
          collapsible: true,
          children: [
            {
              id: 'methodologies',
              title: 'Methodologies',
              href: '/consultant/methodologies',
              icon: BookOpenIcon
            },
            {
              id: 'best-practices',
              title: 'Best Practices',
              href: '/consultant/best-practices',
              icon: TrendingUpIcon
            }
          ]
        }
      ];

    case 'attorney':
      return [
        ...baseNavigation,
        {
          id: 'legal-services',
          title: 'Legal Services',
          icon: FileTextIcon,
          collapsible: true,
          children: [
            {
              id: 'estate-planning',
              title: 'Estate Planning',
              href: '/attorney/estate-planning',
              icon: ArchiveIcon
            },
            {
              id: 'business-law',
              title: 'Business Law',
              href: '/attorney/business-law',
              icon: BriefcaseIcon
            }
          ]
        },
        {
          id: 'document-management',
          title: 'Document Management',
          icon: FileTextIcon,
          collapsible: true,
          children: [
            {
              id: 'contracts',
              title: 'Contracts',
              href: '/attorney/contracts',
              icon: FileTextIcon
            },
            {
              id: 'legal-research',
              title: 'Legal Research',
              href: '/attorney/research',
              icon: BookOpenIcon
            }
          ]
        }
      ];

    case 'admin':
    case 'tenant_admin':
    case 'system_administrator':
      return [
        ...baseNavigation,
        {
          id: 'user-management',
          title: 'User Management',
          icon: Users2Icon,
          collapsible: true,
          children: [
            {
              id: 'users',
              title: 'Users',
              href: '/admin/users',
              icon: Users2Icon
            },
            {
              id: 'roles',
              title: 'Roles & Permissions',
              href: '/admin/roles',
              icon: ShieldIcon
            }
          ]
        },
        {
          id: 'system-settings',
          title: 'System Settings',
          icon: SettingsIcon,
          collapsible: true,
          children: [
            {
              id: 'platform-settings',
              title: 'Platform Settings',
              href: '/admin/settings',
              icon: SettingsIcon
            },
            {
              id: 'monitoring',
              title: 'System Monitoring',
              href: '/admin/monitoring',
              icon: ActivityIcon
            }
          ]
        }
      ];

    default:
      return baseNavigation;
  }
};