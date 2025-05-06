
import React from "react";
import { GraduationCapIcon, BarChart3Icon, PieChart, ShieldIcon, BanknoteIcon, ArchiveIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const educationNavItems: NavItem[] = [
  { 
    id: "education-center",
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    id: "investments",
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    id: "tax-planning",
    title: "Tax Planning", 
    href: "/tax-planning", 
    icon: PieChart 
  },
  { 
    id: "insurance",
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    id: "lending",
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    id: "estate-planning",
    title: "Estate Planning", 
    href: "/estate-planning", 
    icon: ArchiveIcon 
  }
];

const EducationTab = () => {
  return (
    <div className="education-tab">
      <h2 className="text-xl font-semibold mb-4">Education & Solutions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {educationNavItems.map((item) => (
          <a 
            key={item.href} 
            href={item.href}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3"
          >
            {item.icon && <item.icon className="h-5 w-5 text-primary" />}
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EducationTab;
