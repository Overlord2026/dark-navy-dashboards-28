
import { BookOpen, Building2, Calculator, CreditCard, FileText, FolderArchive, Home, LineChart, ShieldCheck, ShoppingBag, Users } from "lucide-react";

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
  client: [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/"
    },
    {
      id: "cash-management",
      label: "Cash Management",
      icon: CreditCard,
      href: "/cash-management"
    },
    {
      id: "bills-management",
      label: "Bills Management",
      icon: Calculator,
      href: "/bills-management"
    },
    {
      id: "legacy-vault",
      label: "Legacy Vault",
      icon: FolderArchive,
      href: "/legacy-vault"
    },
  ],
  investments: [
    {
      id: "investments",
      label: "Investments",
      icon: LineChart,
      href: "/investments"
    },
    {
      id: "insurance",
      label: "Insurance",
      icon: ShieldCheck,
      href: "/insurance"
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
      id: "education",
      label: "Education",
      icon: BookOpen,
      href: "/education"
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
    id: "client",
    label: "Client Dashboard",
    items: navigationRegistry.client || [],
    defaultExpanded: true
  },
  {
    id: "investments",
    label: "Investments",
    items: navigationRegistry.investments || [],
    defaultExpanded: false
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: navigationRegistry.collaboration || [],
    defaultExpanded: false
  },
  {
    id: "admin",
    label: "Admin",
    items: navigationRegistry.admin || [],
    defaultExpanded: false
  }
];
