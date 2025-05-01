
import { runBasicChecks } from './basicChecks';
import { DiagnosticTestStatus } from './types';

export async function runDiagnostics() {
  // Run all diagnostic checks in parallel
  const [basicResults] = await Promise.all([
    runBasicChecks(),
    // Add other diagnostic checks here
  ]);

  // Combine all results
  const allResults = [...basicResults];

  // Calculate overall status
  const hasErrors = allResults.some(result => result.status === 'error');
  const hasWarnings = allResults.some(result => result.status === 'warning');
  
  let overall: DiagnosticTestStatus = 'success';
  if (hasErrors) overall = 'error';
  else if (hasWarnings) overall = 'warning';

  // Count results by status
  const success = allResults.filter(r => r.status === 'success').length;
  const warnings = allResults.filter(r => r.status === 'warning').length;
  const errors = allResults.filter(r => r.status === 'error').length;
  
  return {
    overall,
    total: allResults.length,
    success,
    warnings,
    errors,
    timestamp: new Date().toISOString(),
    results: allResults
  };
}

// Re-export types
export * from './types';
