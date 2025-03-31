
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
  FileTextIcon as FileShieldIcon  // Using FileTextIcon as a replacement for FileShieldIcon
} from "lucide-react";

import { NavItem } from "@/types/navigation";

// Client Dashboard - primary navigation for daily use
export const mainNavItems: NavItem[] = [
  { 
    title: "Dashboard", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    title: "Accounts", 
    href: "/accounts", 
    icon: WalletIcon 
  },
  { 
    title: "Financial Plans", 
    href: "/financial-plans", 
    icon: LineChartIcon 
  },
  { 
    title: "Documents", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Legacy Vault", 
    href: "/legacy-vault", 
    icon: ShieldIcon
  }
];

// Financial Services - products and services offered
export const servicesNavItems: NavItem[] = [
  { 
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    title: "Annuities", 
    href: "/annuities", 
    icon: CoinsIcon 
  },
  { 
    title: "Fiduciary Friendly Annuities", 
    href: "/fiduciary-annuities", 
    icon: PiggyBankIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    title: "Cash Management", 
    href: "/cash-management", 
    icon: CoinsIcon 
  },
  { 
    title: "Marketplace", 
    href: "/marketplace", 
    icon: ShoppingBagIcon 
  }
];

// Planning & Management - financial planning tools
export const planningNavItems: NavItem[] = [
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: CalculatorIcon 
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowLeftRightIcon 
  },
  { 
    title: "Sharing", 
    href: "/sharing", 
    icon: ShareIcon 
  }
];

// Properties - real estate management
export const propertiesNavItems: NavItem[] = [
  { 
    title: "Properties", 
    href: "/properties", 
    icon: HomeIcon 
  },
  { 
    title: "Buildings", 
    href: "/properties?filter=buildings", 
    icon: BuildingIcon 
  },
  { 
    title: "Rentals", 
    href: "/properties?filter=rentals", 
    icon: KeyIcon 
  },
  { 
    title: "Locations", 
    href: "/properties?filter=locations", 
    icon: MapPinIcon 
  },
  { 
    title: "Investments", 
    href: "/properties?filter=investments", 
    icon: LandmarkIcon 
  }
];

// Security items
export const securityNavItems: NavItem[] = [
  { 
    title: "IP Protection", 
    href: "/ip-protection", 
    icon: FileShieldIcon  // Using the aliased icon
  },
  { 
    title: "Security Settings", 
    href: "/security-settings", 
    icon: ShieldCheckIcon 
  }
];

// Bottom navigation items
export const bottomNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help", 
    icon: SettingsIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: SettingsIcon 
  }
];
