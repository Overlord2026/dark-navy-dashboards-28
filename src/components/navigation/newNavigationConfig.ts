
import { ReactNode } from "react";
import { PieChart } from "lucide-react";

interface NavigationItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
}

export const navigation: NavigationItem[] = [
  {
    label: "Education & Solutions",
    children: [
      { label: "Education Center", href: "/education" },
      { label: "Investments", href: "/investments" },
      { label: "Insurance", href: "/insurance" },
      { label: "Lending", href: "/lending" },
      { label: "Estate Planning", href: "/estate-planning" },
      { label: "Proactive Tax Planning", href: "/education/tax-planning", icon: <PieChart /> },
    ]
  },
  // You can add other sections here as needed
];
