
import { 
  HomeIcon, 
  GraduationCapIcon, 
  BanknotesIcon, 
  ShieldCheckIcon, 
  BuildingLibraryIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  ScaleIcon, 
  ShareIcon, 
  UserIcon,
  WalletIcon,
  BriefcaseIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  BanknotesIcon as MoneyIcon
} from "lucide-react";
import { NavItem, BottomNavItem } from '@/types/navigation';

export const homeNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: HomeIcon,
    description: "Main dashboard overview"
  }
];

export const educationSolutionsNavItems: NavItem[] = [
  {
    title: "Education Center",
    href: "/education",
    icon: GraduationCapIcon,
    description: "Financial education resources"
  },
  {
    title: "Investments",
    href: "/investments",
    icon: BanknotesIcon,
    description: "Investment opportunities"
  },
  {
    title: "Insurance",
    href: "/insurance",
    icon: ShieldCheckIcon,
    description: "Insurance solutions"
  },
  {
    title: "Lending",
    href: "/lending",
    icon: BuildingLibraryIcon,
    description: "Lending solutions"
  }
];

export const familyWealthNavItems: NavItem[] = [
  {
    title: "Estate Planning",
    href: "/estate-planning",
    icon: ScaleIcon,
    description: "Estate planning tools"
  },
  {
    title: "Properties",
    href: "/properties",
    icon: BuildingLibraryIcon,
    description: "Property management"
  },
  {
    title: "Documents",
    href: "/documents",
    icon: DocumentTextIcon,
    description: "Document management"
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: WalletIcon,
    description: "Financial accounts"
  },
  {
    title: "Professionals",
    href: "/professionals",
    icon: UserGroupIcon,
    description: "Professional network"
  },
  {
    title: "Secure Vault",
    href: "/vault",
    icon: KeyIcon,
    description: "Secure document storage"
  }
];

export const collaborationNavItems: NavItem[] = [
  {
    title: "Sharing Hub",
    href: "/sharing",
    icon: ShareIcon,
    description: "Document sharing"
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserIcon,
    description: "User profile"
  }
];

export const bottomNavItems: BottomNavItem[] = [
  {
    id: "home",
    title: "Home",
    icon: HomeIcon,
    href: "/"
  },
  {
    id: "investments",
    title: "Invest",
    icon: BriefcaseIcon,
    href: "/investments"
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: WalletIcon,
    href: "/accounts"
  },
  {
    id: "documents",
    title: "Documents",
    icon: DocumentDuplicateIcon,
    href: "/documents"
  },
  {
    id: "more",
    title: "More",
    icon: UserIcon,
    href: "/more"
  }
];
