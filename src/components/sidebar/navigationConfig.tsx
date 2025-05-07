
import React from "react";
import {
  Home,
  BarChart3,
  BookOpen,
  Settings,
  Users,
  FileText,
  Banknote,
  Building2,
  Heart,
  FileStack,
  ShieldCheck,
  Network
} from "lucide-react";

export const navigationConfig = [
  {
    id: "home",
    label: "Dashboard",
    href: "/",
    icon: Home,
    items: []
  },
  {
    id: "wealth",
    label: "Wealth",
    icon: Banknote,
    items: [
      { label: "Accounts", href: "/accounts", icon: <BarChart3 size={16} /> },
      { label: "Investments", href: "/investments", icon: <BarChart3 size={16} /> },
      { label: "Properties", href: "/properties", icon: <Building2 size={16} /> },
    ]
  },
  {
    id: "planning",
    label: "Planning",
    icon: FileText,
    items: [
      { label: "Financial Plans", href: "/financial-plans", icon: <BarChart3 size={16} /> },
      { label: "Estate", href: "/estate-planning", icon: <FileText size={16} /> },
      { label: "Tax", href: "/tax-planning", icon: <FileStack size={16} /> },
      { label: "Insurance", href: "/insurance", icon: <ShieldCheck size={16} /> },
      { label: "Healthcare", href: "/healthcare", icon: <Heart size={16} /> }
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    href: "/professionals",
    icon: Users,
    items: []
  },
  {
    id: "integration",
    label: "Project Integration",
    href: "/integration",
    icon: Network,
    items: []
  },
  {
    id: "education",
    label: "Education",
    href: "/education",
    icon: BookOpen,
    items: []
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    items: []
  }
];

// Export the navigationConfig as navSections to match the import in Sidebar.tsx
export const navSections = navigationConfig;
