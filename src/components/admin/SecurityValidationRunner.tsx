import React, { useState } from 'react';
import { SecurityValidator, SecurityValidationReport } from '@/test/SecurityValidator';
import { Shield, AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';

export function SecurityValidationRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<SecurityValidationReport | null>(null);

  const runValidation = async () => {
    setIsRunning(true);
    try {
      const validator = new SecurityValidator();
      const result = await validator.runFullValidation();
      setReport(result);
    } catch (error) {
      console.error('Security validation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bfo-card border border-bfo-gold/30">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-bfo-gold" />
        <h2 className="text-xl font-bold text-bfo-gold">Security Validation</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-white/80">
            Run comprehensive security tests to validate auth, RLS, and security definer usage.
          </p>
          <button
            onClick={runValidation}
            disabled={isRunning}
            className="px-4 py-2 bg-bfo-gold text-bfo-black rounded hover:bg-bfo-gold/90 disabled:opacity-50 flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run Validation'}
          </button>
        </div>

        {isRunning && (
          <div className="bg-bfo-purple/50 p-4 rounded">
            <div className="flex items-center gap-2 text-white">
              <div className="w-4 h-4 border-2 border-bfo-gold border-t-transparent rounded-full animate-spin"></div>
              Running security validation tests...
            </div>
          </div>
        )}

        {report && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className={`p-4 rounded flex items-center gap-3 ${
              report.overallStatus === 'PASS' ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'
            }`}>
              {report.overallStatus === 'PASS' ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <h3 className="font-semibold text-white">
                  {report.overallStatus === 'PASS' ? 'Security Validation Passed' : 'Security Validation Failed'}
                </h3>
                <p className="text-sm text-white/70">
                  {report.publishBlocked ? 'Publish blocked due to security issues' : 'All security checks passed'}
                </p>
              </div>
            </div>

            {/* Blocking Reasons */}
            {report.blockingReasons.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h4 className="font-semibold text-red-400">Blocking Issues</h4>
                </div>
                <ul className="text-white/80 text-sm space-y-1">
                  {report.blockingReasons.map((reason, i) => (
                    <li key={i}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Test Results Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Auth Tests */}
              <div className="bg-bfo-purple/30 p-4 rounded">
                <h4 className="font-semibold text-white mb-2">Authentication Tests</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/70">Total:</span>
                    <span className="text-white">{report.authResults.totalTests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Passed:</span>
                    <span className="text-green-400">{report.authResults.passed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Failed:</span>
                    <span className="text-red-400">{report.authResults.failed}</span>
                  </div>
                </div>
              </div>

              {/* RLS Tests */}
              <div className="bg-bfo-purple/30 p-4 rounded">
                <h4 className="font-semibold text-white mb-2">RLS Policy Tests</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/70">Total:</span>
                    <span className="text-white">{report.rlsResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Passed:</span>
                    <span className="text-green-400">{report.rlsResults.filter(r => r.status === 'PASS').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Failed:</span>
                    <span className="text-red-400">{report.rlsResults.filter(r => r.status === 'FAIL').length}</span>
                  </div>
                </div>
              </div>

              {/* Security Definer */}
              <div className="bg-bfo-purple/30 p-4 rounded">
                <h4 className="font-semibold text-white mb-2">Security Definer Scan</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/70">Functions:</span>
                    <span className="text-white">{report.securityDefinerResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Problematic:</span>
                    <span className="text-red-400">
                      {report.securityDefinerResults.filter(r => r.usedInDashboard && r.riskLevel !== 'LOW').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Reports */}
            <div className="border-t border-bfo-gold/20 pt-4">
              <h4 className="font-semibold text-white mb-3">Download Reports</h4>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => downloadReport('Auth_Smoke.json', JSON.stringify(report.authResults, null, 2))}
                  className="px-3 py-1 bg-bfo-purple text-white rounded text-sm hover:bg-bfo-purple/80 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Auth_Smoke.json
                </button>
                <button
                  onClick={() => {
                    const csv = 'table,policy,operation,status,expectedBehavior,actualBehavior,error\n' +
                      report.rlsResults.map(r => [r.table, r.policy, r.operation, r.status, r.expectedBehavior, r.actualBehavior, r.error || '']
                        .map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
                    downloadReport('RLS_Smoke.csv', csv);
                  }}
                  className="px-3 py-1 bg-bfo-purple text-white rounded text-sm hover:bg-bfo-purple/80 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  RLS_Smoke.csv
                </button>
                <button
                  onClick={() => {
                    const problematic = report.securityDefinerResults.filter(r => r.usedInDashboard && r.riskLevel !== 'LOW');
                    const csv = problematic.length === 0 
                      ? 'functionName,schemaName,riskLevel,usedInDashboard,recommendation\n'
                      : 'functionName,schemaName,riskLevel,usedInDashboard,recommendation\n' +
                        problematic.map(r => [r.functionName, r.schemaName, r.riskLevel, r.usedInDashboard.toString(), r.recommendation]
                          .map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
                    downloadReport('Definer_Views.csv', csv);
                  }}
                  className="px-3 py-1 bg-bfo-purple text-white rounded text-sm hover:bg-bfo-purple/80 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Definer_Views.csv
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}