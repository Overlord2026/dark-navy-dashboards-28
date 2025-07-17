import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { runComprehensiveDiagnostics, testPremiumFeatureGating, ComprehensiveDiagnosticResults } from '@/services/diagnostics/comprehensiveDiagnostics';
import { CheckCircle, AlertTriangle, XCircle, Play, RefreshCw } from 'lucide-react';

export const ComprehensiveDiagnosticRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ComprehensiveDiagnosticResults | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    toast.info('Running comprehensive diagnostics...', {
      description: 'Testing all feature tabs, sub-tabs, and button functionality'
    });

    try {
      const diagnosticResults = await runComprehensiveDiagnostics();
      const premiumTests = await testPremiumFeatureGating();
      
      // Add premium tests to the results
      diagnosticResults.navigation.premium = premiumTests;
      
      setResults(diagnosticResults);
      
      const { summary } = diagnosticResults;
      if (summary.overallStatus === 'success') {
        toast.success('All diagnostics passed!', {
          description: `${summary.successCount}/${summary.totalTests} tests successful`
        });
      } else if (summary.overallStatus === 'warning') {
        toast.warning('Diagnostics completed with warnings', {
          description: `${summary.warningCount} warnings, ${summary.errorCount} errors found`
        });
      } else {
        toast.error('Diagnostics found critical issues', {
          description: `${summary.errorCount} errors, ${summary.warningCount} warnings found`
        });
      }
    } catch (error) {
      toast.error('Diagnostic run failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      console.error('Diagnostic error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'warning' | 'error') => {
    const variants = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Comprehensive Application Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Full Diagnostic Check
                </>
              )}
            </Button>
            
            {results && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Last run:</span>
                {getStatusBadge(results.summary.overallStatus)}
                <span className="text-sm text-muted-foreground">
                  {results.summary.successCount}/{results.summary.totalTests} passed
                </span>
              </div>
            )}
          </div>

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{results.summary.successCount}</div>
                  <div className="text-sm text-green-700">Passed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                  <div className="text-2xl font-bold text-yellow-600">{results.summary.warningCount}</div>
                  <div className="text-sm text-yellow-700">Warnings</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">{results.summary.errorCount}</div>
                  <div className="text-sm text-red-700">Errors</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">{results.summary.totalTests}</div>
                  <div className="text-sm text-blue-700">Total Tests</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Test Categories</h3>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Navigation Routes</span>
                    <span className="text-sm text-muted-foreground">
                      {Object.values(results.navigation).flat().length} tests
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Feature Tabs</span>
                    <span className="text-sm text-muted-foreground">
                      {Object.keys(results.tabs).length} tests
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Button Functionality</span>
                    <span className="text-sm text-muted-foreground">
                      {results.buttons.length} tests
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Financial Plans</span>
                    <span className="text-sm text-muted-foreground">
                      {results.financialPlans.length} tests
                    </span>
                  </div>
                </div>
              </div>

              {(results.summary.warningCount > 0 || results.summary.errorCount > 0) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-600">Issues Found</h3>
                  {[...results.buttons, ...results.financialPlans, ...Object.values(results.navigation).flat(), ...Object.values(results.tabs)]
                    .filter(test => test.status !== 'success')
                    .slice(0, 10)
                    .map((test, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                        {getStatusIcon(test.status)}
                        <span className="font-medium">{test.route}</span>
                        <span className="text-muted-foreground">-</span>
                        <span>{test.message}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};