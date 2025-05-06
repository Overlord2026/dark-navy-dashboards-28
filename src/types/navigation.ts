
import { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  items?: NavItem[];
}

export interface SidebarProps {
  isLightTheme: boolean;
  collapsed: boolean;
  navItems: any;
  expandedSubmenus: Record<string, boolean>;
  toggleSubmenu: (id: string) => void;
  toggleTheme: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}
