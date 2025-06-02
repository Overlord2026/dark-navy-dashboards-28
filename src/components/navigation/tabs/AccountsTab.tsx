
import React from "react";
import { WalletIcon, LandmarkIcon, BanknoteIcon, ArrowRightLeft } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const accountsNavItems: NavItem[] = [
  { 
    title: "Accounts Overview", 
    href: "/accounts", 
    icon: WalletIcon 
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
    title: "Funding Accounts", 
    href: "/funding-accounts", 
    icon: WalletIcon 
  },
];

const AccountsTab = () => {
  return (
    <div className="accounts-tab">
      {/* Additional accounts tab specific UI can be added here */}
    </div>
  );
};

export default AccountsTab;
