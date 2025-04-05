
import { LucideIcon } from "lucide-react";

export interface MainMenuItem {
  id: string;
  title: string;
  label?: string; // Adding label for backward compatibility
  description?: string;
  icon?: LucideIcon;
  href: string;
  items?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  title: string;
  description?: string;
  href: string;
}

export interface NavCategory {
  id: string;
  label: string;
  items: MainMenuItem[];
  defaultExpanded?: boolean;
}

export interface BottomNavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
}

// Add NavItem for backward compatibility
export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
}
