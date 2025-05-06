
import { BarChart3, Settings, Users, PieChart, Home, Wallet, Target, Link, FileCode2, LayoutGrid, Plug, Shield } from "lucide-react";
import { NavigationItem } from "@/types/navigationItem";

export const navigationData: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 'accounts',
    title: 'Bank Accounts',
    href: '/accounts',
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: 'investments',
    title: 'Investments',
    href: '/investments',
    icon: <PieChart className="w-5 h-5" />,
  },
  {
    id: 'budget',
    title: 'Budget',
    href: '/budget',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: 'goals',
    title: 'Goals',
    href: '/goals',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 'insurance',
    title: 'Insurance',
    href: '/insurance',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: 'integration',
    title: 'Project Integration',
    href: '/integration',
    icon: <Link className="w-5 h-5" />,
    badge: 'Connected',
    items: [
      {
        id: 'connected-projects',
        title: 'Connected Projects',
        href: '/integration/connected-projects',
        icon: <Link className="w-4 h-4" />,
      },
      {
        id: 'architecture',
        title: 'Architecture',
        href: '/integration/architecture',
        icon: <LayoutGrid className="w-4 h-4" />,
      },
      {
        id: 'api',
        title: 'API Integrations',
        href: '/integration/api',
        icon: <FileCode2 className="w-4 h-4" />,
        badge: 'SOC-2',
      },
      {
        id: 'plugins',
        title: 'Plugins',
        href: '/integration/plugins',
        icon: <Plug className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];
