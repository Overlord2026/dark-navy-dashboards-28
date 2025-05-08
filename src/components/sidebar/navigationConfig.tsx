
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users,
  Network
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  items?: NavItem[];
  requireRoles?: string[];
}

export const navSections: NavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/"
  },
  {
    id: "education",
    label: "Education & Solutions",
    icon: BookOpen,
    items: [
      { label: "Education Center", href: "/education", icon: BookOpen },
      { label: "Courses", href: "/courses", icon: BookOpen },
      { label: "Guides", href: "/guides", icon: FileText }
    ]
  },
  {
    id: "planning",
    label: "Planning & Services",
    icon: FileText,
    items: [
      { label: "Financial Plans", href: "/financial-plans", icon: FileText },
      { label: "Tax Planning", href: "/tax-planning", icon: FileText },
      { label: "Estate Planning", href: "/estate-planning", icon: FileText }
    ]
  },
  {
    id: "wealth",
    label: "Wealth Management",
    icon: FileText,
    items: [
      { label: "Accounts", href: "/accounts", icon: FileText },
      { label: "Investments", href: "/investments", icon: FileText },
      { label: "Properties", href: "/properties", icon: FileText }
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: Users,
    href: "/sharing"
  },
  {
    id: "integration",
    label: "Project Integration",
    icon: Network,
    href: "/integration",
    requireRoles: ["admin", "advisor"] // This section requires admin or advisor role
  }
];
