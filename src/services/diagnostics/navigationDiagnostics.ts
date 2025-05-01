
import { v4 as uuidv4 } from 'uuid';
import { NavigationTestResult } from '@/types/diagnostics';

// Simulate an API call to get navigation diagnostics
export const getNavigationDiagnosticsSummary = async () => {
  // This would be a real API call in a production environment
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sample diagnostic data with corrected properties
  const results: Record<string, NavigationTestResult[]> = {
    home: [
      { id: uuidv4(), route: "/", status: "success", message: "Dashboard loads correctly", timestamp: Date.now() },
      { id: uuidv4(), route: "/accounts", status: "success", message: "Accounts page loads correctly", timestamp: Date.now() }
    ],
    educationSolutions: [
      { id: uuidv4(), route: "/education", status: "success", message: "Education center loads correctly", timestamp: Date.now() },
      { id: uuidv4(), route: "/education/tax-planning", status: "success", message: "Tax planning education loads correctly", timestamp: Date.now() },
      { id: uuidv4(), route: "/financial-plans", status: "warning", message: "Performance issues detected", timestamp: Date.now() }
    ],
    familyWealth: [
      { id: uuidv4(), route: "/all-assets", status: "success", message: "All assets page loads correctly", timestamp: Date.now() },
      { id: uuidv4(), route: "/properties", status: "warning", message: "Properties page slow to load", timestamp: Date.now() },
      { id: uuidv4(), route: "/estate-planning", status: "success", message: "Estate planning page loads correctly", timestamp: Date.now() }
    ],
    collaboration: [
      { id: uuidv4(), route: "/sharing", status: "success", message: "Sharing page loads correctly", timestamp: Date.now() },
      { id: uuidv4(), route: "/professionals", status: "warning", message: "Missing mobile optimizations", timestamp: Date.now() }
    ],
    investments: [
      { id: uuidv4(), route: "/investments", status: "success", message: "Investments page loads correctly", timestamp: Date.now() },
      { id: uuidv4(), route: "/investments/stock-screener", status: "error", message: "API endpoint unavailable", timestamp: Date.now() },
      { id: uuidv4(), route: "/investments/model-portfolios", status: "success", message: "Model portfolios page loads correctly", timestamp: Date.now() }
    ]
  };
  
  // Count results by status
  const allResults = Object.values(results).flat();
  const totalRoutes = allResults.length;
  const successCount = allResults.filter(r => r.status === "success").length;
  const warningCount = allResults.filter(r => r.status === "warning").length;
  const errorCount = allResults.filter(r => r.status === "error").length;
  
  // Determine overall status
  const overallStatus = 
    errorCount > 0 ? "error" : 
    warningCount > 0 ? "warning" : 
    "success";
  
  return {
    results,
    overallStatus,
    totalRoutes,
    successCount,
    warningCount,
    errorCount
  };
};

// Add function to test all navigation routes
export const testAllNavigationRoutes = async (): Promise<Record<string, NavigationTestResult[]>> => {
  const summary = await getNavigationDiagnosticsSummary();
  return summary.results;
};
