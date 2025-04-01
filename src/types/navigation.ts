
import { LucideIcon } from "lucide-react";

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
