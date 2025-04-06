
import { NavigationTestResult } from "./types";
import { v4 as uuidv4 } from "uuid";
import { testNavigation } from "./navigationTests";
import { runAllTabDiagnostics } from "./tabDiagnostics";

/**
 * Test all navigation routes and return a comprehensive summary
 */
export async function testAllNavigationRoutes(): Promise<Record<string, NavigationTestResult[]>> {
  // Run navigation tests for all available routes
  const navigationResults = await testNavigation();
  
  // Organize results by category
  const results: Record<string, NavigationTestResult[]> = {
    home: navigationResults.filter(r => r.route.startsWith("/")),
    educationSolutions: navigationResults.filter(r => 
      r.route.startsWith("/education") || 
      r.route.startsWith("/investments") || 
      r.route.includes("tax-planning") ||
      r.route.includes("insurance") ||
      r.route.includes("lending") ||
      r.route.includes("estate-planning")
    ),
    familyWealth: navigationResults.filter(r => 
      r.route.includes("financial-plans") || 
      r.route.includes("cash-management") || 
      r.route.includes("transfers") || 
      r.route.includes("vault") ||
      r.route.includes("properties") ||
      r.route.includes("billpay") ||
      r.route.includes("social-security")
    ),
    collaboration: navigationResults.filter(r => 
      r.route.includes("documents") || 
      r.route.includes("professionals") || 
      r.route.includes("sharing")
    ),
    investments: navigationResults.filter(r => r.route.includes("investments"))
  };
  
  return results;
}

/**
 * Generate a summary of navigation diagnostics results
 */
export async function getNavigationDiagnosticsSummary() {
  // Run the tests
  const results = await testAllNavigationRoutes();
  const tabDiagnostics = await runAllTabDiagnostics();
  
  // Calculate statistics
  const allResults = Object.values(results).flat();
  const totalRoutes = allResults.length;
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
    results,
    tabDiagnostics,
    totalRoutes,
    successCount,
    warningCount,
    errorCount,
    overallStatus,
    timestamp: new Date().toISOString()
  };
}

// Update the types in the diagnostics.ts file to match what we have here
export interface NavigationDiagnosticSummary {
  results: Record<string, NavigationTestResult[]>;
  tabDiagnostics: Record<string, NavigationTestResult>;
  totalRoutes: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  overallStatus: "success" | "warning" | "error";
  timestamp: string;
}
