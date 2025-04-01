
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
  VaultIcon
} from "lucide-react";

import { NavItem } from "@/types/navigation";

// Main Home category
export const homeNavItems: NavItem[] = [
  { 
    title: "Dashboard", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    title: "Customer Profile", 
    href: "/customer-profile", 
    icon: UserIcon 
  }
];

// Education & Solutions category
export const educationSolutionsNavItems: NavItem[] = [
  { 
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "Marketplace", 
    href: "/marketplace", 
    icon: ShoppingBagIcon 
  },
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: CalculatorIcon 
  }
];

// Family Wealth category
export const familyWealthNavItems: NavItem[] = [
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
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    title: "Properties", 
    href: "/properties", 
    icon: BuildingIcon 
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
    title: "Social Security", 
    href: "/social-security", 
    icon: CircleDollarSignIcon 
  },
  { 
    title: "Legacy Vault", 
    href: "/legacy-vault", 
    icon: VaultIcon 
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
  }
];

// Collaboration & Sharing category
export const collaborationNavItems: NavItem[] = [
  { 
    title: "Sharing", 
    href: "/sharing", 
    icon: ShareIcon 
  },
  { 
    title: "Professionals", 
    href: "/professionals", 
    icon: Users2Icon 
  },
  { 
    title: "Documents", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Bill Management", 
    href: "/bills-management", 
    icon: ReceiptIcon 
  }
];

// Security category
export const securityNavItems: NavItem[] = [
  { 
    title: "IP Protection", 
    href: "/ip-protection", 
    icon: FileShieldIcon
  },
  { 
    title: "Security Settings", 
    href: "/security-settings", 
    icon: ShieldCheckIcon 
  }
];

// Properties sub-menu
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
