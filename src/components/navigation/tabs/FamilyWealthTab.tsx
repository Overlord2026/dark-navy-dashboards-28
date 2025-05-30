
import React from "react";
import { 
  LineChartIcon, 
  BanknoteIcon, 
  ArrowRightLeft, 
  BuildingIcon, 
  VaultIcon,
  CircleDollarSignIcon,
  Receipt,
  Calculator,
  Diamond,
  BookIcon,
  WalletIcon
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
    title: "All Assets", 
    href: "/client-all-assets", 
    icon: Diamond 
  },
  { 
    title: "Documents", 
    href: "/client-documents", 
    icon: BookIcon 
  },
  { 
    title: "Cash Management", 
    href: "/cash-management", 
    icon: BanknoteIcon
  },
  { 
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowRightLeft 
  },
  { 
    title: "Properties", 
    href: "/properties", 
    icon: BuildingIcon 
  },
  { 
    title: "Tax & Budgets", 
    href: "/tax-budgets", 
    icon: Calculator 
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
    title: "Bill Pay", 
    href: "/billpay", 
    icon: Receipt 
  }
];

const FamilyWealthTab = () => {
  return (
    <div className="family-wealth-tab">
      <h2 className="text-xl font-semibold mb-4">Family Wealth Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyWealthNavItems.map((item) => (
          <a 
            key={item.href} 
            href={item.href}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3"
          >
            {item.icon && <item.icon className="h-5 w-5 text-primary" />}
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FamilyWealthTab;
