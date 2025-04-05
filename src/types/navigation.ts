
import { LucideIcon } from "lucide-react";

export interface MainMenuItem {
  id: string;
  title: string;
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
