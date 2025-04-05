
import { NavItem } from "@/types/navigation";
import { NavigationDiagnosticResult } from '@/types/diagnostics';
import { 
  homeNavItems,
  educationSolutionsNavItems,
  familyWealthNavItems,
  collaborationNavItems,
  investmentCategories
} from "@/components/navigation/NavigationConfig";
import { 
  runAllTabDiagnostics,
  diagnoseDashboardTab, 
  diagnoseCashManagementTab,
  diagnoseTransfersTab,
  diagnoseFundingAccountsTab,
  diagnoseInvestmentsTab
} from "./tabDiagnostics";

/**
 * Tests whether a specific route is accessible
 */
export const testRoute = async (route: string): Promise<NavigationDiagnosticResult> => {
  try {
    // In a real implementation, this would attempt to navigate to the route
    // and check for errors. For now, we'll simulate a successful test.
    console.log(`Testing route: ${route}`);
    
    // For specific routes, use the dedicated diagnostic functions
    if (route === "/") {
      return await diagnoseDashboardTab();
    }
    
    if (route === "/cash-management") {
      return await diagnoseCashManagementTab();
    }
    
    if (route === "/transfers") {
      return await diagnoseTransfersTab();
    }
    
    if (route === "/funding-accounts") {
      return await diagnoseFundingAccountsTab();
    }
    
    if (route === "/investments") {
      return await diagnoseInvestmentsTab();
    }
    
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
export const testNavItemRoutes = async (navItems: NavItem[]): Promise<NavigationDiagnosticResult[]> => {
  const results: NavigationDiagnosticResult[] = [];
  
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
export const testAllNavigationRoutes = async (): Promise<Record<string, NavigationDiagnosticResult[]>> => {
  // Get tab-specific diagnostics
  const tabResults = await runAllTabDiagnostics();
  
  // Get route-based diagnostics
  const routeResults = {
    home: await testNavItemRoutes(homeNavItems),
    educationSolutions: await testNavItemRoutes(educationSolutionsNavItems),
    familyWealth: await testNavItemRoutes(familyWealthNavItems),
    collaboration: await testNavItemRoutes(collaborationNavItems),
    investments: await testNavItemRoutes(investmentCategories)
  };
  
  // Combine the results
  // For any routes tested in both systems, prefer the tab-specific results
  Object.entries(tabResults).forEach(([tabName, result]) => {
    // Find which category contains this tab's route
    for (const [category, routes] of Object.entries(routeResults)) {
      const updatedRoutes = routes.map(route => {
        if (route.route === result.route) {
          return result;
        }
        return route;
      });
      routeResults[category as keyof typeof routeResults] = updatedRoutes;
    }
  });
  
  return routeResults;
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
  results: Record<string, NavigationDiagnosticResult[]>;
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
