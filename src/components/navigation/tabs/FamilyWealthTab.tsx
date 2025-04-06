
import React from "react";
import { 
  WalletIcon, 
  BuildingIcon, 
  BanknoteIcon, 
  ArrowRightLeft,
  CircleDollarSignIcon,
  Receipt,
  Calculator
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const familyWealthNavItems: NavItem[] = [
  { 
    title: "Accounts Overview", 
    href: "/accounts", 
    icon: WalletIcon 
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
      {/* Additional family wealth tab specific UI can be added here */}
    </div>
  );
};

export default FamilyWealthTab;
