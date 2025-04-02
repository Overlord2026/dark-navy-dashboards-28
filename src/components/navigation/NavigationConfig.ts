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
  PieChart
} from "lucide-react";

import { NavItem } from "@/types/navigation";

// HOME category
export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
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
    title: "Proactive Tax Planning", 
    href: "/education/tax-planning", 
    icon: PieChart 
  },
  { 
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    title: "Estate Planning", 
    href: "/estate-planning", 
    icon: ArchiveIcon 
  }
];

// FAMILY WEALTH category
export const familyWealthNavItems: NavItem[] = [
  { 
    title: "Financial Plans", 
    href: "/financial-plans", 
    icon: LineChartIcon 
  },
  { 
    title: "Accounts Overview", 
    href: "/accounts", 
    icon: WalletIcon 
  },
  { 
    title: "Cash Management", 
    href: "/cash-management", 
    icon: BanknoteIcon
  },
  {
    title: "Transfers",
    href: "/transfers",
    icon: ArrowRightLeft
  },
  {
    title: "Funding Accounts",
    href: "/funding-accounts",
    icon: WalletIcon
  },
  { 
    title: "Secure Family Vault", 
    href: "/legacy-vault", 
    icon: VaultIcon 
  },
  { 
    title: "Social Security", 
    href: "/social-security", 
    icon: CircleDollarSignIcon 
  },
  { 
    title: "Real Estate & Properties", 
    href: "/properties", 
    icon: BuildingIcon 
  }
];

// COLLABORATION & SHARING category
export const collaborationNavItems: NavItem[] = [
  { 
    title: "Document Sharing", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Professional Access", 
    href: "/professionals", 
    icon: Users2Icon 
  },
  { 
    title: "Family Member Access", 
    href: "/sharing", 
    icon: ShareIcon 
  }
];

// Bottom navigation items (unchanged)
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

// INVESTMENTS categories (updated for Private Market Alpha and Stock Screener)
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
