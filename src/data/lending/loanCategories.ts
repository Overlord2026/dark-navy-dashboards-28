
import { LucideIcon, Home, Building, CreditCard, Briefcase, BarChart } from "lucide-react";

export interface LoanCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const loanCategories: LoanCategory[] = [
  {
    id: "home-loans",
    title: "Home Loans",
    description: "Mortgages for buying a home.",
    icon: Home,
    href: "/lending/home-loans"
  },
  {
    id: "securities-loans",
    title: "Securities-Based Loans",
    description: "Using your investment portfolio as collateral for a line of credit.",
    icon: BarChart,
    href: "/lending/securities-loans"
  },
  {
    id: "commercial-loans",
    title: "Commercial Loans",
    description: "Financing for business expenses.",
    icon: Building,
    href: "/lending/commercial-loans"
  },
  {
    id: "specialty-loans",
    title: "Specialty Loans",
    description: "Specialized financing solutions for unique needs.",
    icon: Briefcase,
    href: "/lending/specialty-loans"
  },
  {
    id: "personal-loans",
    title: "Personal Loans",
    description: "Unsecured loans for personal expenses.",
    icon: CreditCard,
    href: "/lending/personal-loans"
  }
];
