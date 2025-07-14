
import { 
  HomeIcon, 
  GraduationCapIcon,
  BookIcon, 
  BarChart3Icon,
  FileTextIcon, 
  UserIcon, 
  WalletIcon,
  BuildingIcon,
  LandmarkIcon,
  CoinsIcon,
  BanknoteIcon,
  ShieldIcon,
  ShareIcon,
  Users2Icon,
  HeartHandshakeIcon,
  VaultIcon,
  BookOpenIcon,
  LineChartIcon,
  CircleDollarSignIcon,
  BriefcaseIcon,
  ArchiveIcon,
  SearchIcon,
  ArrowRightLeft,
  Calculator,
  PieChart,
  Receipt,
  Diamond,
  HeartIcon,
  ActivityIcon,
  StethoscopeIcon,
  PillIcon,
  FlaskConicalIcon,
  TrendingUpIcon,
  FolderHeartIcon,
  BookHeartIcon,
  ShareIcon as ShareDataIcon
} from "lucide-react";

import { NavItem } from "@/types/navigation";

// HOME category
export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    title: "Documents", 
    href: "/documents", 
    icon: BookIcon 
  }
];

// EDUCATION & SOLUTIONS category
export const educationSolutionsNavItems: NavItem[] = [
  { 
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    title: "Tax Planning", 
    href: "/tax-planning", 
    icon: PieChart 
  },
  { 
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    title: "Lending", 
    href: "/client-lending", 
    icon: BanknoteIcon 
  },
  { 
    title: "Estate Planning", 
    href: "/estate-planning", 
    icon: ArchiveIcon 
  }
];

// HEALTHCARE OPTIMIZATION category
export const healthcareOptimizationNavItems: NavItem[] = [
  { 
    title: "Health Dashboard", 
    href: "/healthcare-dashboard", 
    icon: ActivityIcon 
  },
  { 
    title: "HSA Accounts", 
    href: "/healthcare-hsa-accounts", 
    icon: WalletIcon 
  },
  { 
    title: "Healthcare Savings", 
    href: "/healthcare-savings", 
    icon: CircleDollarSignIcon 
  },
  { 
    title: "Healthcare Providers", 
    href: "/healthcare-providers", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Medications", 
    href: "/healthcare-medications", 
    icon: PillIcon 
  },
  { 
    title: "Supplements", 
    href: "/healthcare-supplements", 
    icon: FlaskConicalIcon 
  },
  { 
    title: "HealthSpan Expansion", 
    href: "/healthcare-healthspan", 
    icon: TrendingUpIcon 
  },
  { 
    title: "Healthcare Documents", 
    href: "/healthcare-documents", 
    icon: FolderHeartIcon 
  },
  { 
    title: "Knowledge & Support", 
    href: "/healthcare-knowledge", 
    icon: BookHeartIcon 
  },
  { 
    title: "Share Data", 
    href: "/healthcare-share-data", 
    icon: ShareDataIcon 
  }
];

// DEPRECATED: Family Wealth items moved to hierarchical Wealth Management structure
export const familyWealthNavItems: NavItem[] = [];

// COLLABORATION & SHARING category
export const collaborationNavItems: NavItem[] = [
  { 
    title: "Family Members", 
    href: "/sharing", 
    icon: ShareIcon 
  }
];

// Bottom navigation items
export const bottomNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: UserIcon 
  }
];

// INVESTMENTS categories
export const investmentCategories: NavItem[] = [
  {
    title: "Private Equity",
    href: "/investments/alternative/private-equity",
    icon: LandmarkIcon
  },
  {
    title: "Private Debt",
    href: "/investments/alternative/private-debt",
    icon: LandmarkIcon
  },
  {
    title: "Digital Assets",
    href: "/investments/alternative/digital-assets",
    icon: CoinsIcon
  },
  {
    title: "Real Assets",
    href: "/investments/alternative/real-assets",
    icon: BuildingIcon
  },
  {
    title: "Model Portfolios",
    href: "/investments/model-portfolios",
    icon: BriefcaseIcon
  },
  {
    title: "Stock Screener",
    href: "/investments/stock-screener",
    icon: SearchIcon
  }
];

// Remove deprecated exports for backward compatibility
export const wealthManagementNavItems: NavItem[] = [];
export const bankingNavItems: NavItem[] = [];
export const securityNavItems: NavItem[] = [];
export const propertiesNavItems: NavItem[] = [];
