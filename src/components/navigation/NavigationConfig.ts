
import {
  LayoutDashboard,
  FileText,
  Users,
  Coins,
  Landmark,
  TrendingUp,
  ShieldCheck,
  PiggyBank,
  Building2,
  Wallet,
  LucideIcon,
  Activity,
  ShoppingBag,
  FileIcon,
  Shield
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  subItems?: NavItem[];
}

export interface NavCategory {
  id: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
}

// Utility function to register a new navigation item
let navigationItems: NavItem[] = [];

export const registerNavItem = (item: NavItem) => {
  navigationItems.push(item);
};

export const navigationCategories: NavCategory[] = [
  {
    id: "wealth-management",
    label: "Wealth Management",
    defaultExpanded: true,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "properties",
        label: "Properties",
        href: "/properties",
        icon: Landmark,
      },
      {
        id: "investments",
        label: "Investments",
        href: "/investments",
        icon: TrendingUp,
      },
      {
        id: "financial-plans",
        label: "Financial Plans",
        href: "/financial-plans",
        icon: FileText,
      },
      {
        id: "accounts",
        label: "Accounts",
        href: "/accounts",
        icon: Wallet,
      },
      {
        id: "insurance",
        label: "Insurance",
        href: "/insurance",
        icon: Shield
      },
      {
        id: "social-security",
        label: "Social Security",
        href: "/social-security",
        icon: ShieldCheck,
      },
    ]
  },
  {
    id: "banking",
    label: "Banking",
    items: [
      {
        id: "cash-management",
        label: "Cash Management",
        href: "/cash-management",
        icon: Coins,
      },
      {
        id: "lending",
        label: "Lending",
        href: "/lending",
        icon: PiggyBank,
      },
      {
        id: "transfers",
        label: "Transfers",
        href: "/transfers",
        icon: Building2,
      },
      {
        id: "bills-management",
        label: "Bills Management",
        href: "/bills-management",
        icon: FileText,
      },
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: [
      {
        id: "sharing",
        label: "Sharing",
        href: "/sharing",
        icon: Users,
      },
      {
        id: "ip-protection",
        label: "IP Protection",
        href: "/ip-protection",
        icon: FileShield,
      },
    ]
  },
  {
    id: "marketplace",
    label: "Marketplace",
    items: [
      {
        id: "marketplace",
        label: "Marketplace",
        href: "/marketplace",
        icon: ShoppingBag,
      },
      {
        id: "family-office-directory",
        label: "Family Office Directory",
        href: "/family-office-directory",
        icon: Users,
      },
      {
        id: "data-import",
        label: "Data Import",
        href: "/data-import",
        icon: FileIcon,
      },
    ]
  },
  {
    id: "documents",
    label: "Documents",
    items: [
      {
        id: "documents",
        label: "Documents",
        href: "/documents",
        icon: FileText,
      },
      {
        id: "legacy-vault",
        label: "Legacy Vault",
        href: "/legacy-vault",
        icon: FileShield,
      },
    ]
  },
  {
    id: "system-diagnostics",
    label: "System Diagnostics",
    items: [
      {
        id: "system-diagnostics",
        label: "System Diagnostics",
        href: "/system-diagnostics",
        icon: Activity,
      },
    ]
  },
];
