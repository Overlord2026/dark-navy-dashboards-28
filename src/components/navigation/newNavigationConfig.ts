
import { ReactNode } from "react";
import { PieChart } from "lucide-react";
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
      { label: "Proactive Tax Planning", href: "/education/tax-planning", icon: PieChart },
      { label: "Insurance", href: "/insurance" },
      { label: "Lending", href: "/lending" },
      { label: "Estate Planning", href: "/estate-planning" },
    ]
  },
  // You can add other sections here as needed
];
