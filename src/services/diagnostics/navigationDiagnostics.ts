
import { homeNavItems, educationSolutionsNavItems, familyWealthNavItems, collaborationNavItems, bottomNavItems } from "@/components/navigation/NavigationConfig";
import { NavigationDiagnosticResult } from "@/types/diagnostics";

async function testRoute(route: string): Promise<NavigationDiagnosticResult> {
  try {
    const response = await fetch(route);
    if (!response.ok) {
      return {
        route: route,
        status: "error",
        message: `Failed to fetch route: ${route}. Status: ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return {
        route: route,
        status: "warning",
        message: `Route ${route} did not return an HTML response. Content Type: ${contentType || 'Unknown'}`,
      };
    }

    return {
      route: route,
      status: "success",
      message: `Successfully fetched route: ${route}`,
    };
  } catch (error: any) {
    return {
      route: route,
      status: "error",
      message: `Exception during fetch for route ${route}: ${error.message}`,
    };
  }
}

export function testAllNavigationRoutes() {
  // Test categories by combining all nav items
  const allNavItems = [
    ...homeNavItems,
    ...educationSolutionsNavItems,
    ...familyWealthNavItems,
    ...collaborationNavItems,
    ...bottomNavItems,
  ];

  // Execute tests for all navigation items
  const routeTestPromises = allNavItems.map(item => testRoute(item.href));

  // Await all tests and transform results into a keyed object
  return Promise.all(routeTestPromises)
    .then(results => {
      return results.reduce((acc: Record<string, NavigationDiagnosticResult[]>, result) => {
        const category = allNavItems.find(item => item.href === result.route);
        if (category) {
          acc[category.title] = acc[category.title] || [];
          acc[category.title].push(result);
        }
        return acc;
      }, {});
    });
}

// Add the missing function that's being imported by multiple components
export async function getNavigationDiagnosticsSummary() {
  try {
    // Get all navigation route test results
    const resultsMap = await testAllNavigationRoutes();
    
    // Flatten the results for summary calculations
    const allResults = Object.values(resultsMap).flat();
    
    // Calculate stats
    const totalRoutes = allResults.length;
    const successCount = allResults.filter(r => r.status === "success").length;
    const warningCount = allResults.filter(r => r.status === "warning").length;
    const errorCount = allResults.filter(r => r.status === "error").length;
    
    // Determine overall status
    let overallStatus = "success";
    if (errorCount > 0) {
      overallStatus = "error";
    } else if (warningCount > 0) {
      overallStatus = "warning";
    }
    
    return {
      results: resultsMap,
      totalRoutes,
      successCount,
      warningCount,
      errorCount,
      overallStatus
    };
  } catch (error) {
    console.error("Error generating navigation diagnostics summary:", error);
    throw error;
  }
}
