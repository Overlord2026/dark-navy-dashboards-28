
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface SubNavigationItem {
  title: string;
  href: string;
  icon?: ReactNode;
}

export interface NavigationProps {
  title: string;
  href: string;
  icon?: ReactNode;
  isMainNavItem: boolean;
  subItems?: SubNavigationItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
  submenu?: NavItem[];
}

export interface NavCategory {
  id: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
}
