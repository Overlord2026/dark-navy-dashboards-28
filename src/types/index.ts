
import { ReactNode } from "react";

// Navigation Types
export interface MainNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  id: string;
}

export interface SidebarNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  id: string;
}
