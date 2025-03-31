
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
    title: "Documents", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Sharing", 
    href: "/sharing", 
    icon: ShareIcon 
  },
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
    title: "Cash Management", 
    href: "/cash-management", 
    icon: CoinsIcon 
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowLeftRightIcon 
  },
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: CalculatorIcon 
  },
  { 
    title: "Marketplace", 
    href: "/marketplace", 
    icon: ShoppingBagIcon 
  }
];

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
