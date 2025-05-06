
// Import all navigation tabs
import { homeNavItems } from "./tabs/HomeTab";
import { accountsNavItems } from "./tabs/AccountsTab";
import { educationNavItems } from "./tabs/EducationTab";
import { familyWealthNavItems } from "./tabs/FamilyWealthTab";
import { collaborationNavItems } from "./tabs/CollaborationTab";
import { settingsNavItems } from "./tabs/SettingsTab";
import { NavCategory } from "@/types/navigation";

// Define navigation categories
export const navigationCategories: NavCategory[] = [
  {
    id: "home",
    title: "HOME",
    label: "HOME",
    items: homeNavItems,
    defaultExpanded: true
  },
  {
    id: "education-solutions",
    title: "EDUCATION & SOLUTIONS",
    label: "EDUCATION & SOLUTIONS",
    items: educationNavItems,
    defaultExpanded: true
  },
  {
    id: "family-wealth",
    title: "FAMILY WEALTH",
    label: "FAMILY WEALTH",
    items: familyWealthNavItems,
    defaultExpanded: true
  },
  {
    id: "collaboration",
    title: "COLLABORATION & SHARING",
    label: "COLLABORATION & SHARING",
    items: collaborationNavItems,
    defaultExpanded: true
  }
];

// For bottom navigation
export const bottomNavItems = settingsNavItems;

// Export all tab components
export { default as HomeTab } from "./tabs/HomeTab";
export { default as AccountsTab } from "./tabs/AccountsTab";
export { default as EducationTab } from "./tabs/EducationTab";
export { default as FamilyWealthTab } from "./tabs/FamilyWealthTab";
export { default as CollaborationTab } from "./tabs/CollaborationTab";
export { default as SettingsTab } from "./tabs/SettingsTab";

// Re-export individual nav items for specific usage
export {
  homeNavItems,
  accountsNavItems,
  educationNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  settingsNavItems
};
