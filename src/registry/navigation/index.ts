/**
 * Navigation Registry - Central Export Hub
 * Provides unified access to all navigation registries
 */

// Core Registry
export { default as NavigationRegistry } from "./NavigationRegistry";
export type { 
  NavigationNode, 
  NavigationCategory,
  NavigationRegistryConfig 
} from "./NavigationRegistry";

// Wealth Management Registry
export {
  initializeWealthManagementRegistry,
  getWealthManagementNavigation,
  getWealthNavigationByCategory,
  searchWealthNavigation,
  wealthManagementCategories,
  wealthManagementNodes,
  wealthManagementNavItems
} from "./WealthManagementRegistry";

// Registry Initialization Hook
export { useNavigationRegistry } from "./hooks/useNavigationRegistry";

// Registry Utilities
export * from "./utils/navigationUtils";

// Re-export legacy navigation for backward compatibility
export {
  navigationCategories,
  bottomNavItems,
  homeNavItems,
  educationNavItems,
  healthcareOptimizationNavItems,
  // DEPRECATED: familyWealthNavItems, // Now part of hierarchical Wealth Management
  collaborationNavItems,
  settingsNavItems,
  clientToolsNavItems
} from "../../components/navigation/NavigationRegistry";