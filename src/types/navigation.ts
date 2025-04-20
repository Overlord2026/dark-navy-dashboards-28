
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  items?: NavItem[];
}

export interface NavCategory {
  id: string;
  label: string;
  defaultExpanded?: boolean;
  items: NavItem[];
}
