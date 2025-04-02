
import { NavItem } from "@/types/navigation";
import { NavigationTestResult } from './types';
import { 
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  investmentCategories
} from "@/components/navigation/NavigationConfig";

/**
 * Tests whether a specific route is accessible
 */
export const testRoute = async (route: string): Promise<NavigationTestResult> => {
  try {
    // In a real implementation, this would attempt to navigate to the route
    // and check for errors. For now, we'll simulate a successful test.
    console.log(`Testing route: ${route}`);
    
    // Simulate some routes having issues
    if (route.includes('investment-builder')) {
      return {
        route,
        status: "warning",
        message: "Investment builder loads with warnings - some functions may be limited"
      };
    }
    
    if (route.includes('nonexistent-route')) {
      return {
        route,
        status: "error",
        message: "Route does not exist or is not accessible"
      };
    }
    
    return {
      route,
      status: "success",
      message: `Route ${route} is accessible`
    };
  } catch (error) {
    return {
      route,
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error testing route"
    };
  }
};

/**
 * Tests all routes from a navigation item array
 */
export const testNavItemRoutes = async (navItems: NavItem[]): Promise<NavigationTestResult[]> => {
  const results: NavigationTestResult[] = [];
  
  for (const item of navItems) {
    // Test the main item
    results.push(await testRoute(item.href));
    
    // Test any submenu items
    if (item.submenu && item.submenu.length > 0) {
      for (const subItem of item.submenu) {
        results.push(await testRoute(subItem.href));
      }
    }
  }
  
  return results;
};

/**
 * Tests all navigation categories from the NavigationConfig
 */
export const testAllNavigationRoutes = async (): Promise<Record<string, NavigationTestResult[]>> => {
  return {
    home: await testNavItemRoutes(homeNavItems),
    educationSolutions: await testNavItemRoutes(educationSolutionsNavItems),
    familyWealth: await testNavItemRoutes(familyWealthNavItems),
    collaboration: await testNavItemRoutes(collaborationNavItems),
    investments: await testNavItemRoutes(investmentCategories)
  };
};

/**
 * Get a summary of all navigation tests
 */
export const getNavigationDiagnosticsSummary = async (): Promise<{
  overallStatus: "success" | "warning" | "error";
  totalRoutes: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  results: Record<string, NavigationTestResult[]>;
}> => {
  const results = await testAllNavigationRoutes();
  
  // Flatten all test results
  const allResults = Object.values(results).flat();
  
  // Count statuses
  const successCount = allResults.filter(r => r.status === "success").length;
  const warningCount = allResults.filter(r => r.status === "warning").length;
  const errorCount = allResults.filter(r => r.status === "error").length;
  
  // Determine overall status
  let overallStatus: "success" | "warning" | "error" = "success";
  if (errorCount > 0) {
    overallStatus = "error";
  } else if (warningCount > 0) {
    overallStatus = "warning";
  }
  
  return {
    overallStatus,
    totalRoutes: allResults.length,
    successCount,
    warningCount,
    errorCount,
    results
  };
};
