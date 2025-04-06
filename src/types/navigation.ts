
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
  submenu?: NavItem[]; // Adding this for compatibility with existing code
}

export interface NavCategory {
  id: string; // Adding the id property
  title: string;
  label?: string; // Adding optional label for compatibility
  items: NavItem[];
  defaultExpanded?: boolean; // Adding this for compatibility
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
