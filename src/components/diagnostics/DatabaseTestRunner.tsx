import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatabaseDiagnostics, DatabaseTestResult } from '@/hooks/useDatabaseDiagnostics';
import { Play, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const DatabaseTestRunner: React.FC = () => {
  const {
    isRunning,
    isLoading,
    results,
    error,
    lastRun,
    runDatabaseTests,
    runTransferValidationTests,
    runHsaComplianceTests,
    runAuditLoggingTests
  } = useDatabaseDiagnostics();

  const [activeTab, setActiveTab] = useState('all');

  const getStatusIcon = (status: 'PASS' | 'FAIL') => {
    return status === 'PASS' ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );
  };

  const getStatusBadge = (status: 'PASS' | 'FAIL') => {
    return (
      <Badge variant={status === 'PASS' ? 'success' : 'destructive'}>
        {status}
      </Badge>
    );
  };

  const TestResultCard: React.FC<{ test: DatabaseTestResult }> = ({ test }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon(test.pass_fail)}
            Test #{test.test_number}: {test.test_case}
          </CardTitle>
          {getStatusBadge(test.pass_fail)}
        </div>
        <CardDescription>
          <Badge variant="outline" className="mr-2">
            {test.area_feature}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <strong>Expected:</strong> {test.expected_result}
          </div>
          <div>
            <strong>Actual:</strong> {test.actual_result}
          </div>
          {test.notes && (
            <div>
              <strong>Notes:</strong> {test.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getStats = (testResults: DatabaseTestResult[]) => {
    const passed = testResults.filter(t => t.pass_fail === 'PASS').length;
    const failed = testResults.filter(t => t.pass_fail === 'FAIL').length;
    return { passed, failed, total: testResults.length };
  };

  const allStats = getStats(results);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Test Infrastructure</h2>
          <p className="text-muted-foreground">
            Real-time validation and diagnostics using Supabase functions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runDatabaseTests}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run All Tests
          </Button>
        </div>
      </div>

      {lastRun && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Last run: {new Date(lastRun).toLocaleString()} | 
            Tests: {allStats.total} | 
            Passed: {allStats.passed} | 
            Failed: {allStats.failed}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Error: {error.message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="transfer">Transfer Validation</TabsTrigger>
          <TabsTrigger value="hsa">HSA Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Logging</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-success">{allStats.passed}</div>
                <p className="text-sm text-muted-foreground">Passed</p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-destructive">{allStats.failed}</div>
                <p className="text-sm text-muted-foreground">Failed</p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{allStats.total}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
          </div>

          {isLoading || isRunning ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Running database tests...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((test) => (
                <TestResultCard key={test.test_number} test={test} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No test results yet. Click "Run All Tests" to start.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transfer">
          <div className="space-y-4">
            <Button
              onClick={runTransferValidationTests}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Transfer Validation Tests
            </Button>
            <p className="text-sm text-muted-foreground">
              Tests database transfer validation including insufficient funds, closed accounts, and valid transfers.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="hsa">
          <div className="space-y-4">
            <Button
              onClick={runHsaComplianceTests}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run HSA Compliance Tests
            </Button>
            <p className="text-sm text-muted-foreground">
              Tests HSA contribution limits, account status validation, and compliance rules.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="space-y-4">
            <Button
              onClick={runAuditLoggingTests}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Audit Logging Tests
            </Button>
            <p className="text-sm text-muted-foreground">
              Tests audit log creation, querying functionality, and data integrity.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};