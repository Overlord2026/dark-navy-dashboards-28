
import { 
  LineChartIcon,
  WalletIcon,
  BanknoteIcon,
  Calculator,
  ArrowRightLeft,
  VaultIcon,
  CircleDollarSignIcon,
  BuildingIcon,
  Receipt
} from "lucide-react";
import { NavItem } from "@/types/navigation";

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
    title: "Secure Family Vault", 
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
    icon: BuildingIcon 
  },
  { 
    title: "Bill Pay", 
    href: "/billpay", 
    icon: Receipt 
  }
];
