
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
  icon: LucideIcon | ReactNode;
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

export interface MainMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface MainMenuCategory {
  id: string;
  label: string;
  items: MainMenuItem[];
}
