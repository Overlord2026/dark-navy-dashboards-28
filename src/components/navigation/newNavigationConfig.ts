
import { ReactNode } from "react";
import { PieChart, BanknoteIcon, ArrowRightLeft, Receipt, Wallet, Calculator } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  label: string;
  href?: string;
  icon?: LucideIcon;  // Changed from ReactNode to LucideIcon
  children?: NavigationItem[];
}

export const navigation: NavigationItem[] = [
  {
    label: "Education & Solutions",
    children: [
      { label: "Education Center", href: "/education" },
      { label: "Investments", href: "/investments" },
      { label: "Tax Planning", href: "/education/tax-planning", icon: PieChart },
      { label: "Insurance", href: "/insurance" },
      { label: "Lending", href: "/lending" },
      { label: "Estate Planning", href: "/estate-planning" },
    ]
  },
  {
    label: "Financial Management",
    children: [
      { 
        label: "Cash Management", 
        href: "/cash-management", 
        icon: BanknoteIcon,
        children: [
          { label: "Transfers", href: "/transfers", icon: ArrowRightLeft },
          { label: "Bill Pay", href: "/billpay", icon: Receipt }
        ]
      },
      { label: "Accounts Overview", href: "/accounts", icon: Wallet },
      { label: "Tax & Budgets", href: "/tax-budgets", icon: Calculator },
    ]
  }
];
