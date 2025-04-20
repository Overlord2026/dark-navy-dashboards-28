
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
  title: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
}

export interface TabProps {
  isActive?: boolean;
  className?: string;
}
