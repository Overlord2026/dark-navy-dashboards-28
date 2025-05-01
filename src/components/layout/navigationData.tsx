import React from 'react';
import {
  LayoutDashboard,
  Settings,
  User,
  Network,
  Activity,
  CreditCard,
  HelpCircle,
  Contact2,
  LucideIcon,
  Wallet,
  FileText,
  Coins,
  TrendingUp,
  MessageSquare,
  Calendar,
  ListChecks,
  FileSearch2,
  Building2,
  Mailbox,
  ScrollText,
  File,
  FolderKanban,
  LineChart,
  BarChart,
  PieChart,
  KanbanSquare,
  ListOrdered,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  PanelTopBottom,
  PanelLeftRight,
  Panel,
  Layout,
  LayoutList,
  LayoutGrid,
  LayoutKanban,
  LayoutRows,
  LayoutColumns,
  LayoutSections,
  LayoutDashboard as LayoutDashboardIcon,
  LayoutTemplate,
  LayoutSchema,
  LayoutPanelLeft,
  LayoutPanelRight,
  LayoutPanelTop,
  LayoutPanelBottom,
  LayoutPanelTopBottom,
  LayoutPanelLeftRight,
  LayoutPanel,
  LayoutAlignLeft,
  LayoutAlignCenter,
  LayoutAlignRight,
  LayoutJustify,
  LayoutList as LayoutListIcon,
  LayoutGrid as LayoutGridIcon,
  LayoutKanban as LayoutKanbanIcon,
  LayoutRows as LayoutRowsIcon,
  LayoutColumns as LayoutColumnsIcon,
  LayoutSections as LayoutSectionsIcon,
  LayoutTemplate as LayoutTemplateIcon,
  LayoutSchema as LayoutSchemaIcon,
  LayoutPanelLeft as LayoutPanelLeftIcon,
  LayoutPanelRight as LayoutPanelRightIcon,
  LayoutPanelTop as LayoutPanelTopIcon,
  LayoutPanelBottom as LayoutPanelBottomIcon,
  LayoutPanelTopBottom as LayoutPanelTopBottomIcon,
  LayoutPanelLeftRight as LayoutPanelLeftRightIcon,
  LayoutPanel as LayoutPanelIcon,
  LayoutAlignLeft as LayoutAlignLeftIcon,
  LayoutAlignCenter as LayoutAlignCenterIcon,
  LayoutAlignRight as LayoutAlignRightIcon,
  LayoutJustify as LayoutJustifyIcon,
} from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
  items: NavItem[];
};

export type MainNavItem = NavItem;

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const dashboardNavigationData: SidebarNavItem[] = [
  {
    title: 'Wealth Overview',
    icon: LayoutDashboard,
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Net Worth',
        href: '/dashboard/net-worth',
        icon: Wallet,
      },
      {
        title: 'Transactions',
        href: '/dashboard/transactions',
        icon: CreditCard,
      },
      {
        title: 'Budgeting',
        href: '/dashboard/budgeting',
        icon: Coins,
      },
    ],
  },
  {
    title: 'Investments',
    icon: TrendingUp,
    items: [
      {
        title: 'Portfolio',
        href: '/investments/portfolio',
        icon: PieChart,
      },
      {
        title: 'Research',
        href: '/investments/research',
        icon: FileSearch2,
      },
      {
        title: 'Trading',
        href: '/investments/trading',
        icon: LineChart,
      },
    ],
  },
  {
    title: 'Planning & Insights',
    icon: ListChecks,
    items: [
      {
        title: 'Financial Goals',
        href: '/planning/goals',
        icon: ListOrdered,
      },
      {
        title: 'Retirement',
        href: '/planning/retirement',
        icon: Calendar,
      },
      {
        title: 'Tax Optimization',
        href: '/planning/tax',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Insurance',
    icon: ShieldCheck,
    items: [
      {
        title: 'Policies',
        href: '/insurance/policies',
        icon: File,
      },
      {
        title: 'Claims',
        href: '/insurance/claims',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Real Estate',
    icon: Building2,
    items: [
      {
        title: 'Properties',
        href: '/real-estate/properties',
        icon: Building2,
      },
      {
        title: 'Mortgages',
        href: '/real-estate/mortgages',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Documents',
    icon: FileText,
    items: [
      {
        title: 'Vault',
        href: '/documents/vault',
        icon: FolderKanban,
      },
      {
        title: 'Statements',
        href: '/documents/statements',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    items: [
      {
        title: 'Messages',
        href: '/communication/messages',
        icon: MessageSquare,
      },
      {
        title: 'Notifications',
        href: '/communication/notifications',
        icon: Mailbox,
      },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      {
        title: 'Profile',
        href: '/settings/profile',
        icon: User,
      },
      {
        title: 'Account',
        href: '/settings/account',
        icon: Settings,
      },
    ],
  },
  {
    title: "Project Integration",
    href: "/integration",
    icon: <Network className="h-5 w-5" />, // Make sure to import Network from lucide-react
    items: [
      {
        title: "Connected Projects",
        href: "/integration/connected-projects",
      },
      {
        title: "Architecture",
        href: "/integration/architecture",
      },
      {
        title: "API Integrations",
        href: "/integration/api",
      },
      {
        title: "Plugins",
        href: "/integration/plugins",
      },
    ],
  },
];

export const advisorNavigationData: SidebarNavItem[] = [
  {
    title: 'Advisor Overview',
    icon: LayoutDashboard,
    items: [
      {
        title: 'Dashboard',
        href: '/advisor/dashboard',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Client Management',
        href: '/advisor/clients',
        icon: Users,
      },
      {
        title: 'Portfolio Analysis',
        href: '/advisor/portfolio-analysis',
        icon: BarChart,
      },
    ],
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    items: [
      {
        title: 'Messages',
        href: '/advisor/communication/messages',
        icon: MessageSquare,
      },
      {
        title: 'Notifications',
        href: '/advisor/communication/notifications',
        icon: Mailbox,
      },
    ],
  },
  {
    title: 'Resources',
    icon: FileText,
    items: [
      {
        title: 'Research',
        href: '/advisor/resources/research',
        icon: FileSearch2,
      },
      {
        title: 'Templates',
        href: '/advisor/resources/templates',
        icon: LayoutTemplate,
      },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      {
        title: 'Profile',
        href: '/advisor/settings/profile',
        icon: User,
      },
      {
        title: 'Account',
        href: '/advisor/settings/account',
        icon: Settings,
      },
    ],
  },
];

export const marketingNavigationData: SidebarNavItem[] = [
  {
    title: 'Marketing Overview',
    icon: LayoutDashboard,
    items: [
      {
        title: 'Dashboard',
        href: '/marketing/dashboard',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Campaigns',
        href: '/marketing/campaigns',
        icon: TrendingUp,
      },
      {
        title: 'Analytics',
        href: '/marketing/analytics',
        icon: BarChart,
      },
    ],
  },
  {
    title: 'Content',
    icon: ScrollText,
    items: [
      {
        title: 'Blog Posts',
        href: '/marketing/content/blog',
        icon: ScrollText,
      },
      {
        title: 'Email Templates',
        href: '/marketing/content/email',
        icon: Mailbox,
      },
    ],
  },
  {
    title: 'Social Media',
    icon: Network,
    items: [
      {
        title: 'Posts',
        href: '/marketing/social/posts',
        icon: MessageSquare,
      },
      {
        title: 'Analytics',
        href: '/marketing/social/analytics',
        icon: BarChart,
      },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      {
        title: 'Profile',
        href: '/marketing/settings/profile',
        icon: User,
      },
      {
        title: 'Account',
        href: '/marketing/settings/account',
        icon: Settings,
      },
    ],
  },
];

export const adminNavigationData: SidebarNavItem[] = [
  {
    title: 'Admin Overview',
    icon: LayoutDashboard,
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'System Logs',
        href: '/admin/logs',
        icon: Activity,
      },
    ],
  },
  {
    title: 'System Configuration',
    icon: Settings,
    items: [
      {
        title: 'Settings',
        href: '/admin/settings/system',
        icon: Settings,
      },
      {
        title: 'Integrations',
        href: '/admin/settings/integrations',
        icon: Network,
      },
    ],
  },
  {
    title: 'Data Management',
    icon: FileText,
    items: [
      {
        title: 'Backups',
        href: '/admin/data/backups',
        icon: File,
      },
      {
        title: 'Database',
        href: '/admin/data/database',
        icon: FolderKanban,
      },
    ],
  },
  {
    title: 'Security',
    icon: ShieldCheck,
    items: [
      {
        title: 'Firewall',
        href: '/admin/security/firewall',
        icon: ShieldCheck,
      },
      {
        title: 'Audits',
        href: '/admin/security/audits',
        icon: ListChecks,
      },
    ],
  },
];

export const mainNavigation: MainNavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Features',
    href: '/#features',
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
  {
    title: 'Login',
    href: '/auth',
  },
];

export const siteConfig = {
  name: 'Boutique Family Office',
  description:
    'Your personalized path to lasting prosperity. Choose the approach that best matches your financial journey.',
  url: 'https://localhost:3000',
  ogImage: 'https://ui.shadcn.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/shadcn/ui',
  },
  mainNav: mainNavigation,
  sidebarNav: dashboardNavigationData,
};

export default siteConfig;
