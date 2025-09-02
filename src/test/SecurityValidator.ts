import { AuthSmokeTest, AuthSmokeReport } from './AuthSmokeTest';
import { RLSSmokeTest, RLSTestResult } from './RLSSmokeTest';
import { SecurityDefinerScanner, SecurityDefinerResult } from './SecurityDefinerScanner';

export interface SecurityValidationReport {
  timestamp: string;
  overallStatus: 'PASS' | 'FAIL';
  authResults: AuthSmokeReport;
  rlsResults: RLSTestResult[];
  securityDefinerResults: SecurityDefinerResult[];
  publishBlocked: boolean;
  blockingReasons: string[];
}

/**
 * Main Security Validation Orchestrator
 * Runs all security tests and determines if publish should be blocked
 */
export class SecurityValidator {
  
  async runFullValidation(): Promise<SecurityValidationReport> {
    console.log('🔒 Starting Full Security Validation...');
    
    const timestamp = new Date().toISOString();
    const blockingReasons: string[] = [];

    // Run Auth Smoke Tests
    const authTester = new AuthSmokeTest();
    const authResults = await authTester.runAllTests();
    
    if (authResults.overallStatus === 'FAIL') {
      blockingReasons.push('Authentication tests failed');
    }

    // Run RLS Tests
    const rlsTester = new RLSSmokeTest();
    const rlsResults = await rlsTester.runAllTests();
    
    const rlsFailures = rlsResults.filter(r => r.status === 'FAIL');
    if (rlsFailures.length > 0) {
      blockingReasons.push(`${rlsFailures.length} RLS policy failures detected`);
    }

    // Run Security Definer Scan
    const definerScanner = new SecurityDefinerScanner();
    const securityDefinerResults = await definerScanner.scanSecurityDefiners();
    
    const problematicDefiners = definerScanner.getProblematicFunctions();
    if (problematicDefiners.length > 0) {
      blockingReasons.push(`${problematicDefiners.length} problematic SECURITY DEFINER functions in dashboard reads`);
    }

    // Determine overall status
    const overallStatus = blockingReasons.length === 0 ? 'PASS' : 'FAIL';
    const publishBlocked = blockingReasons.length > 0;

    const report: SecurityValidationReport = {
      timestamp,
      overallStatus,
      authResults,
      rlsResults,
      securityDefinerResults,
      publishBlocked,
      blockingReasons
    };

    // Write output files
    await this.writeOutputFiles(report, rlsTester, definerScanner);

    console.log(`Security Validation Complete: ${overallStatus}`);
    if (publishBlocked) {
      console.error('🚫 PUBLISH BLOCKED:', blockingReasons.join(', '));
    } else {
      console.log('✅ Security validation passed - publish allowed');
    }

    return report;
  }

  private async writeOutputFiles(
    report: SecurityValidationReport, 
    rlsTester: RLSSmokeTest, 
    definerScanner: SecurityDefinerScanner
  ): Promise<void> {
    try {
      // Create output directory structure
      const outDir = 'out/auth';
      
      // Write Auth_Smoke.json
      const authSmokeContent = JSON.stringify(report.authResults, null, 2);
      await this.writeFile(`${outDir}/Auth_Smoke.json`, authSmokeContent);

      // Write RLS_Smoke.csv
      const rlsCsvContent = rlsTester.exportToCsv();
      await this.writeFile(`${outDir}/RLS_Smoke.csv`, rlsCsvContent);

      // Write Definer_Views.csv (only problematic functions)
      const problematicDefiners = definerScanner.getProblematicFunctions();
      const definerCsvContent = this.exportProblematicDefinersToCsv(problematicDefiners);
      await this.writeFile(`${outDir}/Definer_Views.csv`, definerCsvContent);

      console.log('📄 Security validation reports written to /out/auth/');
    } catch (error) {
      console.error('Failed to write output files:', error);
    }
  }

  private exportProblematicDefinersToCsv(problematicFunctions: SecurityDefinerResult[]): string {
    if (problematicFunctions.length === 0) {
      // Return empty CSV with just headers as required
      return 'functionName,schemaName,riskLevel,usedInDashboard,recommendation\n';
    }

    const headers = ['functionName', 'schemaName', 'riskLevel', 'usedInDashboard', 'recommendation'];
    const rows = problematicFunctions.map(result => [
      result.functionName,
      result.schemaName,
      result.riskLevel,
      result.usedInDashboard.toString(),
      result.recommendation
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  private async writeFile(path: string, content: string): Promise<void> {
    // In a real implementation, this would write to the filesystem
    // For this demo, we'll log the content and path
    console.log(`Writing to ${path}:`);
    console.log(content.slice(0, 200) + (content.length > 200 ? '...' : ''));
    
    // Store in localStorage as a demo
    try {
      localStorage.setItem(`security_report_${path.replace(/[^a-zA-Z0-9]/g, '_')}`, content);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }
}