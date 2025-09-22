
// Import all navigation tabs
import { homeNavItems } from "./tabs/HomeTab";
import { goalsNavItems } from "./tabs/GoalsTab";
import { accountsNavItems } from "./tabs/AccountsTab";
import { educationNavItems } from "./tabs/EducationTab";
import { healthcareOptimizationNavItems } from "./tabs/HealthcareOptimizationTab";
import { annuitiesNavItems } from "./tabs/AnnuitiesTab";
// DEPRECATED: import { familyWealthNavItems } from "./tabs/FamilyWealthTab";
import { collaborationNavItems } from "./tabs/CollaborationTab";
import { settingsNavItems } from "./tabs/SettingsTab";
import { clientToolsNavItems, professionalDashboardNavItems } from "./WealthManagementRegistry";
import { NavCategory } from "@/types/navigation";
import { Network } from "lucide-react";

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
    id: "goals",
    title: "GOALS & ASPIRATIONS",
    label: "GOALS & ASPIRATIONS",
    items: goalsNavItems,
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
    id: "annuities",
    title: "ANNUITIES",
    label: "ANNUITIES",
    items: annuitiesNavItems,
    defaultExpanded: true
  },
  {
    id: "client-tools",
    title: "CLIENT TOOLS",
    label: "CLIENT TOOLS",
    items: clientToolsNavItems,
    defaultExpanded: true
  },
  {
    id: "healthcare-optimization",
    title: "HEALTHCARE OPTIMIZATION",
    label: "HEALTHCARE OPTIMIZATION",
    items: healthcareOptimizationNavItems,
    defaultExpanded: true
  },
  // DEPRECATED: Family Wealth moved to hierarchical Client Tools > Wealth Management
  // {
  //   id: "family-wealth",
  //   title: "FAMILY WEALTH",
  //   label: "FAMILY WEALTH",
  //   items: familyWealthNavItems,
  //   defaultExpanded: true
  // },
  {
    id: "collaboration",
    title: "COLLABORATION & SHARING",
    label: "COLLABORATION & SHARING",
    items: collaborationNavItems,
    defaultExpanded: true
  },
  {
    id: "professional-dashboards",
    title: "PROFESSIONAL DASHBOARDS",
    label: "PROFESSIONAL DASHBOARDS",
    items: professionalDashboardNavItems,
    defaultExpanded: true
  },
  {
    id: "integration",
    title: "PROJECT INTEGRATION",
    label: "PROJECT INTEGRATION", 
    items: [
      {
        title: "Integration Hub",
        href: "/integration",
        icon: Network,
        label: "Manage project integrations and connections"
      }
    ],
    defaultExpanded: true
  }
];

// For bottom navigation
export const bottomNavItems = settingsNavItems;

// Export all tab components
export { default as HomeTab } from "./tabs/HomeTab";
export { default as GoalsTab } from "./tabs/GoalsTab";
export { default as AccountsTab } from "./tabs/AccountsTab";
export { default as EducationTab } from "./tabs/EducationTab";
export { default as HealthcareOptimizationTab } from "./tabs/HealthcareOptimizationTab";
export { default as FamilyWealthTab } from "./tabs/FamilyWealthTab";
export { default as CollaborationTab } from "./tabs/CollaborationTab";
export { default as SettingsTab } from "./tabs/SettingsTab";

// Re-export individual nav items for specific usage
export {
  homeNavItems,
  goalsNavItems,
  accountsNavItems,
  educationNavItems,
  healthcareOptimizationNavItems,
  // DEPRECATED: familyWealthNavItems, // Now part of hierarchical Wealth Management
  collaborationNavItems,
  settingsNavItems,
  clientToolsNavItems,
  professionalDashboardNavItems
};
