
import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  User,
  Puzzle,
  Boxes,
} from "lucide-react";

// Main navigation items
export const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />
  },
  {
    label: "Project Integration",
    href: "/integration",
    icon: <Boxes size={18} />
  }
];

// Bottom navigation items (typically settings, profile, etc.)
export const bottomNavigationItems = [
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={18} />
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <User size={18} />
  }
];

// These are for the advisor dashboard
export const advisorNavigationItems = [
  {
    label: "Advisor Dashboard",
    href: "/advisor/dashboard",
    icon: <LayoutDashboard size={18} />
  },
  {
    label: "Clients",
    href: "/advisor/clients",
    icon: <User size={18} />
  }
];
