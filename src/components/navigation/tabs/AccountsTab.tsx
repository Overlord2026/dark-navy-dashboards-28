
import React from "react";
import { WalletIcon, LandmarkIcon, BanknoteIcon, ArrowRightLeft } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Badge } from "@/components/ui/badge";

export const accountsNavItems: NavItem[] = [
  { 
    title: "Accounts Overview", 
    href: "/client-accounts", 
    icon: WalletIcon 
  },
  { 
    title: "Cash Management", 
    href: "/client-cash-management", 
    icon: BanknoteIcon 
  },
  { 
    title: "Transfers", 
    href: "/client-transfers", 
    icon: ArrowRightLeft
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
      <h2 className="text-xl font-semibold mb-4">Accounts Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountsNavItems.map((item) => (
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

export default AccountsTab;
