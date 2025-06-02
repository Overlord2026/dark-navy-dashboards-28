
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
import { Badge } from "@/components/ui/badge";

export const familyWealthNavItems: NavItem[] = [
  { 
    title: "Financial Plans", 
    href: "/financial-plans", 
    icon: LineChartIcon 
  },
  { 
    title: "Accounts Overview", 
    href: "/client-accounts", 
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
    href: "/client-cash-management", 
    icon: BanknoteIcon,
    comingSoon: true
  },
  { 
    title: "Transfers", 
    href: "/client-transfers", 
    icon: ArrowRightLeft,
    comingSoon: true
  },
  { 
    title: "Properties", 
    href: "/client-properties", 
    icon: BuildingIcon 
  },
  { 
    title: "Tax & Budgets", 
    href: "/client-tax-budgets", 
    icon: Calculator,
    comingSoon: true
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
    href: "/client-billpay", 
    icon: Receipt,
    comingSoon: true
  }
];

const FamilyWealthTab = () => {
  return (
    <div className="family-wealth-tab">
      <h2 className="text-xl font-semibold mb-4">Family Wealth Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyWealthNavItems.map((item) => (
          <div 
            key={item.href}
            className={`p-4 border rounded-lg transition-colors flex items-center gap-3 ${
              item.comingSoon 
                ? 'cursor-not-allowed opacity-60 bg-muted/30' 
                : 'hover:bg-muted/50 cursor-pointer'
            }`}
            onClick={item.comingSoon ? undefined : () => window.location.href = item.href}
          >
            {item.icon && <item.icon className="h-5 w-5 text-primary" />}
            <div className="flex-1">
              <span>{item.title}</span>
              {item.comingSoon && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Coming Soon
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyWealthTab;
