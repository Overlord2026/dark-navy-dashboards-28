
import {
  VaultIcon,
  LineChartIcon,
  WalletIcon,
  BuildingIcon,
  BanknoteIcon,
  Calculator,
  ArrowRightLeft,
  HeartPulseIcon,
  CircleDollarSignIcon,
  Receipt,
  Diamond,
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const familyWealthNavItems: NavItem[] = [
  { 
    id: "family-vault",
    title: "Secure Family Vault", 
    href: "/legacy-vault", 
    icon: VaultIcon 
  },
  { 
    id: "financial-plans",
    title: "Financial Plans", 
    href: "/financial-plans", 
    icon: LineChartIcon 
  },
  { 
    id: "accounts",
    title: "Accounts Overview", 
    href: "/accounts", 
    icon: WalletIcon 
  },
  { 
    id: "assets",
    title: "All Assets", 
    href: "/all-assets", 
    icon: Diamond 
  },
  { 
    id: "real-estate",
    title: "Real Estate", 
    href: "/properties", 
    icon: BuildingIcon 
  },
  { 
    id: "cash-management",
    title: "Cash Management", 
    href: "/cash-management", 
    icon: BanknoteIcon
  },
  { 
    id: "tax-budgets",
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: Calculator 
  },
  { 
    id: "transfers",
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowRightLeft 
  },
  { 
    id: "healthcare",
    title: "Healthcare", 
    href: "/healthcare", 
    icon: HeartPulseIcon 
  },
  { 
    id: "social-security",
    title: "Social Security", 
    href: "/social-security", 
    icon: CircleDollarSignIcon 
  },
  { 
    id: "bill-pay",
    title: "Bill Pay", 
    href: "/billpay", 
    icon: Receipt 
  }
];
