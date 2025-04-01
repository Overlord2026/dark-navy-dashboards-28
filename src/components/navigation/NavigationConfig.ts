
import { 
  HomeIcon, 
  BarChart3Icon, 
  BookIcon, 
  CalculatorIcon, 
  ChartBarIcon, 
  CreditCardIcon, 
  FileIcon, 
  FileTextIcon, 
  GraduationCapIcon, 
  LayoutDashboardIcon, 
  LineChartIcon, 
  PiggyBankIcon, 
  ReceiptIcon, 
  SettingsIcon, 
  ShareIcon, 
  ShieldIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  WalletIcon,
  BuildingIcon,
  KeyIcon,
  MapPinIcon,
  LandmarkIcon,
  CoinsIcon,
  CircleDollarSignIcon,
  BanknoteIcon,
  ArrowLeftRightIcon,
  ShieldCheckIcon,
  FileTextIcon as FileShieldIcon,
  BookOpenIcon,
  Users2Icon,
  HeartHandshakeIcon,
  VaultIcon,
  GemIcon,
  BriefcaseIcon,
  TrendingUpIcon
} from "lucide-react";

import { NavItem } from "@/types/navigation";

// MAIN category
export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "Legacy Vault", 
    href: "/legacy-vault", 
    icon: VaultIcon 
  },
  { 
    title: "Tax Planning", 
    href: "/tax-budgets", 
    icon: ReceiptIcon 
  }
];

// WEALTH MANAGEMENT category
export const wealthManagementNavItems: NavItem[] = [
  { 
    title: "Financial Plans", 
    href: "/financial-plans", 
    icon: LineChartIcon 
  },
  { 
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    title: "Accounts", 
    href: "/accounts", 
    icon: WalletIcon 
  },
  { 
    title: "Properties", 
    href: "/properties", 
    icon: BuildingIcon 
  },
  { 
    title: "Social Security", 
    href: "/social-security", 
    icon: CircleDollarSignIcon 
  },
  { 
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  }
];

// BANKING category
export const bankingNavItems: NavItem[] = [
  { 
    title: "Cash Management", 
    href: "/cash-management", 
    icon: CoinsIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowLeftRightIcon 
  }
];

// COLLABORATION category
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
    icon: SettingsIcon 
  }
];

// INVESTMENTS categories (for the investments page)
export const investmentCategories: NavItem[] = [
  {
    title: "Private Equity",
    href: "/investments/alternative/private-equity",
    icon: BriefcaseIcon
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
  }
];

// Clean up exports - remove deprecated exports to prevent confusion
// These are empty arrays for backward compatibility if needed
export const educationSolutionsNavItems: NavItem[] = [];
export const familyWealthNavItems: NavItem[] = [];
export const securityNavItems: NavItem[] = [];
export const propertiesNavItems: NavItem[] = [];
