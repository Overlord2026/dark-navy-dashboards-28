
import { ReactNode } from "react";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: ReactNode;
  badge?: string;
  items?: NavigationItem[];
}
