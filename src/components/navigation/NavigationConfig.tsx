
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
    href: "/",
    icon: HomeIcon,
  }
];

export const educationSolutionsNavItems = [
  {
    title: "Education Center",
    href: "/education",
    icon: GraduationCapIcon,
  },
  {
    title: "Investments",
    href: "/investments",
    icon: BarChart3Icon,
  },
  {
    title: "Tax Planning",
    href: "/education/tax-planning",
    icon: PieChart,
  },
  {
    title: "Insurance",
    href: "/insurance",
    icon: ShieldIcon,
  },
  {
    title: "Lending",
    href: "/lending",
    icon: BanknoteIcon,
  },
  {
    title: "Estate Planning",
    href: "/estate-planning",
    icon: ArchiveIcon,
  }
];

export const familyWealthNavItems = [
  {
    title: "Financial Plans",
    href: "/financial-plans",
    icon: LineChartIcon,
  },
  {
    title: "Accounts Overview",
    href: "/accounts",
    icon: WalletIcon,
  },
  {
    title: "Personal Insurance",
    href: "/personal-insurance",
    icon: ShieldCheck,
  },
  {
    title: "Cash Management",
    href: "/cash-management",
    icon: BanknoteIcon,
  },
  {
    title: "Tax & Budgets",
    href: "/tax-budgets",
    icon: Calculator,
  },
  {
    title: "Transfers",
    href: "/transfers",
    icon: ArrowRightLeft,
  },
  {
    title: "Secure Family Vault",
    href: "/legacy-vault",
    icon: VaultIcon,
  },
  {
    title: "Social Security",
    href: "/social-security",
    icon: CircleDollarSignIcon,
  },
  {
    title: "Real Estate & Properties",
    href: "/properties",
    icon: BuildingIcon,
  },
  {
    title: "Bill Pay",
    href: "/billpay",
    icon: Receipt,
  }
];

export const collaborationNavItems = [
  {
    title: "Document Sharing",
    href: "/documents",
    icon: FileTextIcon,
  },
  {
    title: "Professional Access",
    href: "/professionals",
    icon: Users2Icon,
  },
  {
    title: "Family Member Access",
    href: "/sharing",
    icon: ShareIcon,
  }
];

export const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  }
];
