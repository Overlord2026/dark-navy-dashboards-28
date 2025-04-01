
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

// MAIN category - updated to match the image
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
    href: "/tax-planning", 
    icon: CalculatorIcon 
  }
];

// WEALTH MANAGEMENT category - restructured
export const familyWealthNavItems: NavItem[] = [
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
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowLeftRightIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
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
