
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  title?: string;
  label?: string;
  href?: string;
  icon?: React.ElementType | ReactNode;
  items?: NavItem[];
  badge?: string;
}

export interface NavCategory {
  id: string;
  title?: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
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
