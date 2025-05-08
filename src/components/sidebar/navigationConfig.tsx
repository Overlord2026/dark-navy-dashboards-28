
import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  FileLineChart, 
  FileText,
  BookOpen,
  Building2,
  MessageCircle,
  Settings,
  User,
  VaultIcon,
  BriefcaseIcon,
  Shield,
  Brain,
  Users2,
  Share2,
  BanknoteIcon,
  Home,
  Receipt,
  Network,
  Puzzle
} from 'lucide-react';

export const navSections = [
  {
    id: 'main',
    label: 'Main',
    icon: LayoutDashboard,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 'wealth',
    label: 'Wealth Management',
    icon: BriefcaseIcon,
    items: [
      {
        id: 'accounts',
        label: 'Accounts',
        href: '/accounts',
        icon: CreditCard,
      },
      {
        id: 'vault',
        label: 'Family Vault',
        href: '/legacy-vault',
        icon: VaultIcon,
      },
      {
        id: 'investments',
        label: 'Investments',
        href: '/investments',
        icon: BriefcaseIcon,
      },
      {
        id: 'properties',
        label: 'Properties',
        href: '/properties',
        icon: Home,
      },
      {
        id: 'billpay',
        label: 'Bill Pay',
        href: '/billpay',
        icon: Receipt,
      },
    ],
  },
  {
    id: 'planning',
    label: 'Planning',
    icon: FileLineChart,
    items: [
      {
        id: 'financial-plans',
        label: 'Financial Plans',
        href: '/financial-plans',
        icon: FileLineChart,
      },
      {
        id: 'tax-planning',
        label: 'Tax Planning',
        href: '/tax-planning',
        icon: FileText,
      },
      {
        id: 'estate-planning',
        label: 'Estate Planning',
        href: '/estate-planning',
        icon: Building2,
      },
      {
        id: 'insurance',
        label: 'Insurance',
        href: '/insurance',
        icon: Shield,
      },
      {
        id: 'lending',
        label: 'Lending',
        href: '/lending',
        icon: BanknoteIcon,
      },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    icon: BookOpen,
    items: [
      {
        id: 'education-center',
        label: 'Education Center',
        href: '/education',
        icon: BookOpen,
      },
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: MessageCircle,
    items: [
      {
        id: 'family-collaboration',
        label: 'Family Collaboration',
        href: '/sharing',
        icon: Share2,
      },
      {
        id: 'professional-collaboration',
        label: 'Professional Collaboration',
        href: '/professionals',
        icon: Users2,
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    icon: MessageCircle,
    items: [
      {
        id: 'ai-insights',
        label: 'AI Insights',
        href: '/ai-insights',
        icon: Brain,
      },
      {
        id: 'help',
        label: 'Help & Support',
        href: '/help',
        icon: MessageCircle,
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    items: [
      {
        id: 'profile',
        label: 'Profile',
        href: '/profile',
        icon: User,
      },
      {
        id: 'security',
        label: 'Security',
        href: '/security-settings',
        icon: Shield,
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
  {
    id: 'integration',
    label: 'Project Integration',
    icon: Network,
    href: '/integration',
    requireRoles: ['admin', 'advisor']
  },
];
