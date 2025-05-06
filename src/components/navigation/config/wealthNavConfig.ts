
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
    title: "Secure Family Vault", 
    href: "/legacy-vault", 
    icon: VaultIcon 
  },
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
    title: "All Assets", 
    href: "/all-assets", 
    icon: Diamond 
  },
  { 
    title: "Real Estate", 
    href: "/properties", 
    icon: BuildingIcon 
  },
  { 
    title: "Cash Management", 
    href: "/cash-management", 
    icon: BanknoteIcon
  },
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: Calculator 
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowRightLeft 
  },
  { 
    title: "Healthcare", 
    href: "/healthcare", 
    icon: HeartPulseIcon 
  },
  { 
    title: "Social Security", 
    href: "/social-security", 
    icon: CircleDollarSignIcon 
  },
  { 
    title: "Bill Pay", 
    href: "/billpay", 
    icon: Receipt 
  }
];
