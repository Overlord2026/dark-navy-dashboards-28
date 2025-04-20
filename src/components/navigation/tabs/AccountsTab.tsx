
import React from "react";
import { WalletIcon, LandmarkIcon, BanknoteIcon, ArrowRightLeft } from "lucide-react";
import { NavItem, TabProps } from "@/types/navigation";
import { tabBaseStyles } from "./TabStyles";

export const accountsNavItems: NavItem[] = [
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
    title: "Transfers", 
    href: "/transfers", 
    icon: ArrowRightLeft 
  },
  { 
    title: "Funding Accounts", 
    href: "/funding-accounts", 
    icon: WalletIcon 
  }
];

const AccountsTab = ({ className }: TabProps) => {
  return (
    <div className={`${tabBaseStyles.container} ${className}`}>
      <h2 className={tabBaseStyles.title}>Accounts</h2>
      <div className={tabBaseStyles.grid}>
        {accountsNavItems.map((item) => (
          <a 
            key={item.href} 
            href={item.href}
            className={tabBaseStyles.item}
          >
            {item.icon && <item.icon className={tabBaseStyles.icon} />}
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AccountsTab;
