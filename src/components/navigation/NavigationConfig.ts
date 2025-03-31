
import { 
  BarChart3Icon, 
  HomeIcon, 
  BuildingIcon, 
  FileTextIcon, 
  ShareIcon, 
  LineChartIcon, 
  ShieldIcon, 
  BanknoteIcon, 
  CoinsIcon, 
  ArrowLeftRightIcon, 
  CalculatorIcon, 
  ShoppingBag,
  GraduationCapIcon,
  BookOpenIcon,
  UserRoundIcon,
  WalletIcon
} from "lucide-react";

export type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  disabled?: boolean;
};

export type NavigationCategory = {
  id: string;
  label: string;
  items: NavigationItem[];
  defaultExpanded?: boolean;
};

export const navigationCategories: NavigationCategory[] = [
  {
    id: "main",
    label: "Main",
    defaultExpanded: true,
    items: [
      { id: "home", label: "Home", icon: HomeIcon, href: "/dashboard" },
      { id: "education", label: "Education Center", icon: GraduationCapIcon, href: "/education" },
      { id: "legacy-vault", label: "Legacy Vault", icon: BookOpenIcon, href: "/legacy-vault" },
      { id: "tax-budgets", label: "Tax Planning", icon: CalculatorIcon, href: "/tax-budgets" },
    ]
  },
  {
    id: "wealth-management",
    label: "Wealth Management",
    defaultExpanded: true,
    items: [
      { id: "financial-plans", label: "Financial Plans", icon: LineChartIcon, href: "/financial-plans" },
      { id: "investments", label: "Investments", icon: BarChart3Icon, href: "/investments" },
      { id: "accounts", label: "Accounts", icon: WalletIcon, href: "/accounts" },
      { id: "properties", label: "Properties", icon: HomeIcon, href: "/properties" },
      { id: "social-security", label: "Social Security", icon: CoinsIcon, href: "/social-security" },
      { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
    ]
  },
  {
    id: "banking",
    label: "Banking",
    items: [
      { id: "cash-management", label: "Cash Management", icon: WalletIcon, href: "/cash-management" },
      { id: "lending", label: "Lending", icon: BanknoteIcon, href: "/lending" },
      { id: "transfers", label: "Transfers", icon: ArrowLeftRightIcon, href: "/transfers" },
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: [
      { id: "documents", label: "Documents", icon: FileTextIcon, href: "/documents" },
      { id: "sharing", label: "Sharing", icon: ShareIcon, href: "/sharing" },
      { id: "marketplace", label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
    ]
  },
];

// Helper function to find navigation item by ID
export const findNavigationItem = (id: string): NavigationItem | undefined => {
  for (const category of navigationCategories) {
    const item = category.items.find(item => item.id === id);
    if (item) return item;
  }
  return undefined;
};

// Helper function to check if a path matches a navigation item
export const isActiveNavItem = (path: string, item: NavigationItem): boolean => {
  if (item.href === '/dashboard' && path === '/') return true;
  return path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
};
