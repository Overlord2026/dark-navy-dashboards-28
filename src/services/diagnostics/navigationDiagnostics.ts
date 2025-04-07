
// Simulate an API call to get navigation diagnostics
export const getNavigationDiagnosticsSummary = async () => {
  // This would be a real API call in a production environment
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sample diagnostic data
  const results = {
    home: [
      { route: "/", status: "success", message: "Dashboard loads correctly" },
      { route: "/accounts", status: "success", message: "Accounts page loads correctly" }
    ],
    educationSolutions: [
      { route: "/education", status: "success", message: "Education center loads correctly" },
      { route: "/education/tax-planning", status: "success", message: "Tax planning education loads correctly" },
      { route: "/financial-plans", status: "warning", message: "Performance issues detected" }
    ],
    familyWealth: [
      { route: "/all-assets", status: "success", message: "All assets page loads correctly" },
      { route: "/properties", status: "warning", message: "Properties page slow to load" },
      { route: "/estate-planning", status: "success", message: "Estate planning page loads correctly" }
    ],
    collaboration: [
      { route: "/sharing", status: "success", message: "Sharing page loads correctly" },
      { route: "/professionals", status: "warning", message: "Missing mobile optimizations" }
    ],
    investments: [
      { route: "/investments", status: "success", message: "Investments page loads correctly" },
      { route: "/investments/stock-screener", status: "error", message: "API endpoint unavailable" },
      { route: "/investments/model-portfolios", status: "success", message: "Model portfolios page loads correctly" }
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
