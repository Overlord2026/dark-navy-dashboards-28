
import {
  HomeIcon,
  LayoutDashboardIcon,
  UserIcon,
  HeartPulseIcon,
  KeyIcon,
  BookIcon,
  BarChart3Icon,
  GraduationCapIcon,
  FileTextIcon,
  BriefcaseIcon,
  HomeIcon as PropertyIcon,
  ShoppingBagIcon,
  UsersIcon,
  BuildingIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  ArrowRightLeftIcon,
  CreditCardIcon,
  ScrollTextIcon,
  BanknoteIcon,
  Settings2Icon,
  HelpCircleIcon,
  LifeBuoyIcon,
  Wallet,
  ExternalLink,
  WalletIcon,
  Shield,
} from "lucide-react";

// Home Section
export const homeNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon
  },
  {
    title: "Customer Profile",
    href: "/customer-profile",
    icon: UserIcon
  },
  {
    title: "Cash Management",
    href: "/cash-management",
    icon: BanknoteIcon
  },
  {
    title: "Transfers",
    href: "/transfers",
    icon: ArrowRightLeftIcon
  },
  {
    title: "Funding Accounts",
    href: "/funding-accounts",
    icon: Wallet
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: LandmarkIcon
  },
  {
    title: "Documents",
    href: "/documents",
    icon: BookIcon
  },
  {
    title: "Properties",
    href: "/properties",
    icon: PropertyIcon
  }
];

// Education & Solutions Section
export const educationSolutionsNavItems = [
  {
    title: "Education Center",
    href: "/education",
    icon: GraduationCapIcon
  },
  {
    title: "Financial Plans",
    href: "/financial-plans",
    icon: FileTextIcon
  },
  {
    title: "Investments",
    href: "/investments",
    icon: BarChart3Icon
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBagIcon
  },
  {
    title: "Lending",
    href: "/lending",
    icon: BuildingIcon
  },
  {
    title: "Insurance",
    href: "/insurance",
    icon: ShieldCheckIcon
  }
];

// Family Wealth Section
export const familyWealthNavItems = [
  {
    title: "Financial Plans",
    href: "/financial-plans",
    icon: FileTextIcon
  },
  {
    title: "Accounts Overview",
    href: "/accounts",
    icon: WalletIcon
  },
  {
    title: "Estate Planning",
    href: "/estate-planning",
    icon: ScrollTextIcon
  },
  {
    title: "Secure Family Vault",
    href: "/legacy-vault",
    icon: KeyIcon
  },
  {
    title: "Social Security",
    href: "/social-security",
    icon: HeartPulseIcon
  },
  {
    title: "Tax & Budgets",
    href: "/tax-budgets",
    icon: BriefcaseIcon
  }
];

// Collaboration Section
export const collaborationNavItems = [
  {
    title: "Family Members",
    href: "/sharing",
    icon: UsersIcon
  },
  {
    title: "Service Professionals",
    href: "/professionals",
    icon: BriefcaseIcon
  },
  {
    title: "Bills Management",
    href: "/bills-management",
    icon: CreditCardIcon
  }
];

// Bottom Nav Items
export const bottomNavItems = [
  {
    title: "Support",
    href: "/support",
    icon: LifeBuoyIcon
  },
  {
    title: "Security",
    href: "/security-settings",
    icon: Shield
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2Icon
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircleIcon
  }
];
