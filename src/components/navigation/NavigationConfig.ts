
import { homeNavItems } from "./config/homeNavConfig";
import { educationNavItems } from "./config/educationNavConfig";
import { familyWealthNavItems } from "./config/wealthNavConfig";
import { collaborationNavItems } from "./config/collaborationNavConfig";
import { NavItem } from "@/types/navigation";

// Re-export all navigation items
export {
  homeNavItems,
  educationNavItems,
  familyWealthNavItems,
  collaborationNavItems,
};

// Bottom navigation items
export const bottomNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: UserIcon 
  }
];

// Remove deprecated exports for backward compatibility
export const wealthManagementNavItems: NavItem[] = [];
export const bankingNavItems: NavItem[] = [];
export const securityNavItems: NavItem[] = [];
export const propertiesNavItems: NavItem[] = [];
