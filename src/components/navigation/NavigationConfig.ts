
import { 
  BookOpen, 
  Building2, 
  Calculator, 
  Calendar, 
  CreditCard, 
  FileText, 
  FolderArchive, 
  Home, 
  LineChart, 
  ShieldCheck, 
  ShoppingBag, 
  Users,
  Wallet,
  ArrowRightLeft,
  Share,
  GraduationCap,
  Receipt,
  Building,
  CoinsIcon,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  subItems?: NavSubItem[];
};

export type NavSubItem = {
  id: string;
  label: string;
  href: string;
};

export type NavCategory = {
  id: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
};

// Create navigation registry to allow dynamic registration
const navigationRegistry: Record<string, NavItem[]> = {
  main: [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/"
    },
    {
      id: "education",
      label: "Education Center",
      icon: GraduationCap,
      href: "/education"
    },
    {
      id: "legacy-vault",
      label: "Legacy Vault",
      icon: FolderArchive,
      href: "/legacy-vault"
    },
    {
      id: "tax-planning",
      label: "Tax Planning",
      icon: Receipt,
      href: "/tax-budgets"
    },
  ],
  wealth_management: [
    {
      id: "financial-plans",
      label: "Financial Plans",
      icon: LineChart,
      href: "/financial-plans"
    },
    {
      id: "investments",
      label: "Investments",
      icon: LineChart,
      href: "/investments"
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: Wallet,
      href: "/accounts"
    },
    {
      id: "properties",
      label: "Properties",
      icon: Building,
      href: "/properties"
    },
    {
      id: "social-security",
      label: "Social Security",
      icon: CoinsIcon,
      href: "/social-security"
    },
    {
      id: "insurance",
      label: "Insurance",
      icon: ShieldCheck,
      href: "/insurance"
    },
  ],
  banking: [
    {
      id: "cash-management",
      label: "Cash Management",
      icon: CreditCard,
      href: "/cash-management"
    },
    {
      id: "lending",
      label: "Lending",
      icon: CreditCard,
      href: "/lending"
    },
    {
      id: "transfers",
      label: "Transfers",
      icon: ArrowRightLeft,
      href: "/transfers"
    },
    {
      id: "bills-management",
      label: "Bills Management",
      icon: Calculator,
      href: "/bills-management"
    },
  ],
  collaboration: [
    {
      id: "family-office-directory",
      label: "Family Office Directory",
      icon: Building2,
      href: "/family-office-directory"
    },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: ShoppingBag,
      href: "/marketplace"
    },
    {
      id: "sharing",
      label: "Sharing",
      icon: Share,
      href: "/sharing"
    },
    {
      id: "ip-protection",
      label: "IP Protection",
      icon: ShieldCheck,
      href: "/ip-protection"
    },
  ],
  admin: [
    {
      id: "profile",
      label: "Profile",
      icon: Users,
      href: "/profile"
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: CreditCard,
      href: "/subscription"
    },
    {
      id: "advisor-profile",
      label: "Advisor Profile",
      icon: Users,
      href: "/advisor-profile"
    },
    {
      id: "system-diagnostics",
      label: "System Diagnostics",
      icon: FileText,
      href: "/system-diagnostics"
    },
  ]
};

// Function to register new navigation items in a category
export const registerNavItem = (categoryId: string, item: NavItem) => {
  if (!navigationRegistry[categoryId]) {
    navigationRegistry[categoryId] = [];
  }
  
  // Check if item with same id already exists
  const existingItemIndex = navigationRegistry[categoryId].findIndex(
    navItem => navItem.id === item.id
  );
  
  if (existingItemIndex >= 0) {
    // Replace existing item
    navigationRegistry[categoryId][existingItemIndex] = item;
  } else {
    // Add new item
    navigationRegistry[categoryId].push(item);
  }
};

// Create categories from registry
export const navigationCategories: NavCategory[] = [
  {
    id: "main",
    label: "MAIN",
    items: navigationRegistry.main || [],
    defaultExpanded: true
  },
  {
    id: "wealth_management",
    label: "WEALTH MANAGEMENT",
    items: navigationRegistry.wealth_management || [],
    defaultExpanded: true
  },
  {
    id: "banking",
    label: "BANKING",
    items: navigationRegistry.banking || [],
    defaultExpanded: false
  },
  {
    id: "collaboration",
    label: "COLLABORATION",
    items: navigationRegistry.collaboration || [],
    defaultExpanded: false
  },
  {
    id: "admin",
    label: "ADMIN",
    items: navigationRegistry.admin || [],
    defaultExpanded: false
  }
];
