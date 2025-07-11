
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
  Diamond
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
    title: "All Assets", 
    href: "/all-assets", 
    icon: Diamond 
  },
  { 
    title: "Real Estate", 
    href: "/properties", 
    icon: BuildingIcon 
  },
  { 
    title: "Cash Management", 
    href: "/cash-management", 
    icon: BanknoteIcon,
    comingSoon: true
  },
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: Calculator 
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowRightLeft 
  },
  { 
    title: "Secure Family Vault", 
    href: "/legacy-vault", 
    icon: VaultIcon 
  },
  { 
    title: "Social Security", 
    href: "/client-social-security", 
    icon: CircleDollarSignIcon,
    submenu: [
      {
        title: "Business Filings",
        href: "/client-business-filings",
        icon: FileTextIcon
      }
    ]
  },
  { 
    title: "Bill Pay", 
    href: "/billpay", 
    icon: Receipt 
  }
];

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
