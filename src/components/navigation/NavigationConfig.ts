
import { homeNavItems } from "./config/homeNavConfig";

// Export navigation configurations grouped by page
export {
  homeNavItems
};

// Add typings for navigation items
export interface NavItem {
  title: string;
  href: string;
  icon: any;
  sections?: {
    title: string;
    href: string;
  }[];
}

// Export commonly used navigation constants
export const DEFAULT_DASHBOARD_PATH = "/dashboard";
export const DEFAULT_AUTH_PATH = "/auth";
export const DEFAULT_LANDING_PATH = "/";
