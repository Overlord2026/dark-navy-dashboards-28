
import { Home, TrendingUp, Building, Briefcase, Key } from "lucide-react";
import { LoanCategory } from "../types";

export const loanCategories: LoanCategory[] = [
  {
    id: "home-loans",
    title: "Home Loans",
    description: "Mortgages and financing solutions for residential properties.",
    icon: Home,
    colorLight: "#E6F7FF",
    colorDark: "#0072F5",
  },
  {
    id: "securities-loans",
    title: "Securities-Based Lending",
    description: "Use your investment portfolio as collateral for flexible financing.",
    icon: TrendingUp,
    colorLight: "#E6FFFA",
    colorDark: "#00B8A9",
  },
  {
    id: "commercial-loans",
    title: "Commercial Loans",
    description: "Financing solutions for business expenses and growth opportunities.",
    icon: Building,
    colorLight: "#FFF3E6",
    colorDark: "#FF8A00",
  },
  {
    id: "specialty-loans",
    title: "Specialty Financing",
    description: "Custom lending solutions for unique assets and opportunities.",
    icon: Briefcase,
    colorLight: "#F3E6FF",
    colorDark: "#8A00FF",
  },
  {
    id: "personal-loans",
    title: "Personal Loans",
    description: "Flexible financing for personal needs and major expenses.",
    icon: Key,
    colorLight: "#E6FFE6",
    colorDark: "#00C853",
  }
];
