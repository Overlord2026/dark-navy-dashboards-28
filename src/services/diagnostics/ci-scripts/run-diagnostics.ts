
#!/usr/bin/env node

import { runAllTabDiagnostics } from '../tabDiagnostics';
import { testFinancialPlanOperations } from '../financialPlanTests';

async function runDiagnostics() {
  console.log("Running tab diagnostics...");
  const tabResults = await runAllTabDiagnostics();
  console.log("Tab diagnostics results:", JSON.stringify(tabResults, null, 2));

  console.log("Running financial plan tests...");
  const planResults = await testFinancialPlanOperations();
  console.log("Financial plan test results:", JSON.stringify(planResults, null, 2));
}

runDiagnostics().catch(error => {
  console.error("Error running diagnostics:", error);
  process.exit(1);
});
