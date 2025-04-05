
// This file is now a re-export from our modularized navigation structure
import { 
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  bottomNavItems,
  investmentCategories
} from '@/navigation';

// Re-export for backward compatibility
export {
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  bottomNavItems,
  investmentCategories
};

// Legacy exports (empty arrays to maintain backward compatibility)
export const wealthManagementNavItems = [];
export const bankingNavItems = [];
export const securityNavItems = [];
export const propertiesNavItems = [];
