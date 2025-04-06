
import React from "react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
  items?: NavItem[];
}

export interface SidebarProps {
  isLightTheme: boolean;
  collapsed: boolean;
  navItems: {
    [key: string]: NavItem[];
  };
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
  toggleTheme: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}
