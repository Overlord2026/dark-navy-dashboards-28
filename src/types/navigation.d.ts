
import { ReactNode } from "react";

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
