
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

// 🏠 Home category
export const homeNavItems: NavItem[] = [
  { 
    title: "Dashboard Overview", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    title: "Customer Profile", 
    href: "/customer-profile", 
    icon: UserIcon 
  }
];

// 🎓 Education & Solutions category - moved Investments here
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
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  }
];

// 📊 Family Wealth category - removed Investments
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
    title: "Insurance & Annuities", 
    href: "/insurance", 
    icon: ShieldIcon,
    submenu: [
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
      }
    ]
  },
  { 
    title: "Banking", 
    href: "/banking", 
    icon: BanknoteIcon,
    submenu: [
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
    ]
  },
  { 
    title: "Legacy Vault", 
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
    icon: BuildingIcon,
    submenu: [
      {
        title: "Properties Overview",
        href: "/properties",
        icon: BuildingIcon
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
    ]
  }
];

// 🤝 Collaboration & Sharing category
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
