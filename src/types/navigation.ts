
import React from "react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
  items?: NavItem[];
  children?: NavItem[]; // New property for hierarchical structure
  submenu?: NavItem[]; // Adding this for compatibility with existing code
  comingSoon?: boolean; // Adding this for coming soon functionality
  collapsible?: boolean; // For collapsible menu items
  priority?: number; // Priority for sorting
  id?: string; // Optional ID for navigation nodes
}

export interface NavCategory {
  id: string; // Adding the id property
  title: string;
  label: string; // Changing from optional to required
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
