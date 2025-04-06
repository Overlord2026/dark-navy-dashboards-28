
import {
  HomeIcon,
  BarChart3Icon,
  ShieldIcon,
  BanknoteIcon,
  WalletIcon,
  FileTextIcon,
  ShareIcon,
  GraduationCapIcon,
  BuildingIcon,
  Users2Icon,
  VaultIcon,
  LineChartIcon,
  CircleDollarSignIcon,
  ArchiveIcon,
  PieChart,
  ArrowRightLeft,
  Calculator,
  Receipt,
  ShieldCheck,
  Settings,
  HelpCircle
} from "lucide-react";

// Navigation item types
export const homeNavItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    id: "home"
  }
];

export const educationSolutionsNavItems = [
  {
    title: "Education Center",
    href: "/education",
    icon: GraduationCapIcon,
    id: "education"
  },
  {
    title: "Investments",
    href: "/investments",
    icon: BarChart3Icon,
    id: "investments"
  },
  {
    title: "Tax Planning",
    href: "/education/tax-planning",
    icon: PieChart,
    id: "tax-planning"
  },
  {
    title: "Insurance",
    href: "/insurance",
    icon: ShieldIcon,
    id: "insurance"
  },
  {
    title: "Lending",
    href: "/lending",
    icon: BanknoteIcon,
    id: "lending"
  },
  {
    title: "Estate Planning",
    href: "/estate-planning",
    icon: ArchiveIcon,
    id: "estate-planning"
  }
];

export const familyWealthNavItems = [
  {
    title: "Financial Plans",
    href: "/financial-plans",
    icon: LineChartIcon,
    id: "financial-plans"
  },
  {
    title: "Accounts Overview",
    href: "/accounts",
    icon: WalletIcon,
    id: "accounts"
  },
  {
    title: "Personal Insurance",
    href: "/personal-insurance",
    icon: ShieldCheck,
    id: "personal-insurance"
  },
  {
    title: "Cash Management",
    href: "/cash-management",
    icon: BanknoteIcon,
    id: "cash-management"
  },
  {
    title: "Tax & Budgets",
    href: "/tax-budgets",
    icon: Calculator,
    id: "tax-budgets"
  },
  {
    title: "Transfers",
    href: "/transfers",
    icon: ArrowRightLeft,
    id: "transfers"
  },
  {
    title: "Secure Family Vault",
    href: "/legacy-vault",
    icon: VaultIcon,
    id: "legacy-vault"
  },
  {
    title: "Social Security",
    href: "/social-security",
    icon: CircleDollarSignIcon,
    id: "social-security"
  },
  {
    title: "Real Estate & Properties",
    href: "/properties",
    icon: BuildingIcon,
    id: "properties"
  },
  {
    title: "Bill Pay",
    href: "/billpay",
    icon: Receipt,
    id: "billpay"
  }
];

export const collaborationNavItems = [
  {
    title: "Document Sharing",
    href: "/documents",
    icon: FileTextIcon,
    id: "documents"
  },
  {
    title: "Professional Access",
    href: "/professionals",
    icon: Users2Icon,
    id: "professionals"
  },
  {
    title: "Family Member Access",
    href: "/sharing",
    icon: ShareIcon,
    id: "sharing"
  }
];

export const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    id: "settings"
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    id: "help"
  }
];
