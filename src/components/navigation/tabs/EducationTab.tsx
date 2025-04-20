
import React from "react";
import { GraduationCapIcon, BarChart3Icon, PieChart, ShieldIcon, BanknoteIcon, ArchiveIcon } from "lucide-react";
import { NavItem, TabProps } from "@/types/navigation";
import { tabBaseStyles } from "./TabStyles";

export const educationNavItems: NavItem[] = [
  { 
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    title: "Tax Planning", 
    href: "/tax-planning", 
    icon: PieChart 
  },
  { 
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    title: "Estate Planning", 
    href: "/estate-planning", 
    icon: ArchiveIcon 
  }
];

const EducationTab = ({ className }: TabProps) => {
  return (
    <div className={`${tabBaseStyles.container} ${className}`}>
      <h2 className={tabBaseStyles.title}>Education & Solutions</h2>
      <div className={tabBaseStyles.grid}>
        {educationNavItems.map((item) => (
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

export default EducationTab;
