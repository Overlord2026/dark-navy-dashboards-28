
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
  Share2,
  Building,
  Users
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
        icon: <LayoutDashboard className="h-4 w-4" />,
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
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        id: 'vault',
        label: 'Family Vault',
        href: '/legacy-vault',
        icon: <VaultIcon className="h-4 w-4" />,
      },
      {
        id: 'investments',
        label: 'Investments',
        href: '/investments',
        icon: <BriefcaseIcon className="h-4 w-4" />,
      },
      {
        id: 'insurance',
        label: 'Insurance',
        href: '/insurance',
        icon: <Shield className="h-4 w-4" />,
      },
      {
        id: 'properties',
        label: 'Properties',
        href: '/properties',
        icon: <Building className="h-4 w-4" />,
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
        icon: <FileLineChart className="h-4 w-4" />,
      },
      {
        id: 'tax-planning',
        label: 'Tax Planning',
        href: '/tax-planning',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'estate-planning',
        label: 'Estate Planning',
        href: '/estate-planning',
        icon: <Building2 className="h-4 w-4" />,
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
        icon: <BookOpen className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: Users,
    items: [
      {
        id: 'professionals',
        label: 'Service Professionals',
        href: '/professionals',
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: 'sharing',
        label: 'Family Member Access',
        href: '/sharing',
        icon: <User className="h-4 w-4" />,
      },
      {
        id: 'project-integration',
        label: 'Project Integration',
        href: '/integration',
        icon: <Share2 className="h-4 w-4" />,
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
        icon: <Brain className="h-4 w-4" />,
      },
      {
        id: 'help',
        label: 'Help & Support',
        href: '/help',
        icon: <MessageCircle className="h-4 w-4" />,
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
        icon: <User className="h-4 w-4" />,
      },
      {
        id: 'security',
        label: 'Security',
        href: '/security-settings',
        icon: <Shield className="h-4 w-4" />,
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];
