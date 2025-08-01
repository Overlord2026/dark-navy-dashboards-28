import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Play, 
  Download,
  RefreshCw,
  Shield,
  Navigation,
  Upload,
  MousePointer,
  AlertCircle
} from 'lucide-react';
import { qaTestRunner, QATestResult } from '@/utils/qaTestRunner';
import { getEnvironmentConfig } from '@/utils/environment';

export function QATestDashboard() {
  const [testResults, setTestResults] = useState<QATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);
  const env = getEnvironmentConfig();

  const runTests = async () => {
    setIsRunning(true);
    setCurrentTest('Initializing tests...');
    setTestResults([]);

    try {
      // Run authentication tests
      setCurrentTest('Running authentication tests...');
      await qaTestRunner.runAuthenticationTests();
      
      // Run navigation tests
      setCurrentTest('Running navigation tests...');
      await qaTestRunner.runNavigationTests();
      
      // Run upload tests
      setCurrentTest('Running upload tests...');
      await qaTestRunner.runUploadTests();
      
      // Run UI interaction tests
      setCurrentTest('Running UI interaction tests...');
      await qaTestRunner.runUIInteractionTests();
      
      // Run error handling tests
      setCurrentTest('Running error handling tests...');
      await qaTestRunner.runErrorHandlingTests();

      // Get all results
      const allResults = await qaTestRunner.runAllTests();
      setTestResults(allResults);
      setLastRunTime(new Date());
      
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const downloadReport = () => {
    const report = qaTestRunner.generateReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'skipped':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      skipped: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Authentication':
        return <Shield className="h-4 w-4" />;
      case 'Navigation':
        return <Navigation className="h-4 w-4" />;
      case 'Upload':
        return <Upload className="h-4 w-4" />;
      case 'UI Interaction':
        return <MousePointer className="h-4 w-4" />;
      case 'Error Handling':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, QATestResult[]>);

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.status === 'pass').length;
  const failedTests = testResults.filter(r => r.status === 'fail').length;
  const warningTests = testResults.filter(r => r.status === 'warning').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA Test Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive testing suite for authentication, navigation, upload, and UI functionality
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          {testResults.length > 0 && (
            <Button 
              variant="outline" 
              onClick={downloadReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      {/* Environment Info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Environment:</strong> {env.isDevelopment ? 'Development' : env.isStaging ? 'Staging' : 'Production'} |{' '}
          <strong>MFA Status:</strong> {env.isProduction ? 'Enforced' : 'Disabled for QA/Dev'} |{' '}
          <strong>QA Bypass:</strong> {env.qaBypassEnabled ? 'Enabled' : 'Disabled'}
        </AlertDescription>
      </Alert>

      {/* Test Progress */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Running Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{currentTest}</p>
              <Progress value={undefined} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results Summary */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Passed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passedTests}</div>
              <p className="text-xs text-muted-foreground">
                {totalTests > 0 ? Math.round(passedTests/totalTests*100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedTests}</div>
              <p className="text-xs text-muted-foreground">
                {totalTests > 0 ? Math.round(failedTests/totalTests*100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warningTests}</div>
              <p className="text-xs text-muted-foreground">
                {totalTests > 0 ? Math.round(warningTests/totalTests*100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">
                {lastRunTime ? `Run at ${lastRunTime.toLocaleTimeString()}` : 'No runs yet'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      {testResults.length > 0 && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="ui">UI Interaction</TabsTrigger>
            <TabsTrigger value="errors">Error Handling</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Test Results Overview</CardTitle>
                <CardDescription>
                  Summary of all test categories and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(groupedResults).map(([category, results]) => {
                    const categoryPassed = results.filter(r => r.status === 'pass').length;
                    const categoryFailed = results.filter(r => r.status === 'fail').length;
                    const categoryWarnings = results.filter(r => r.status === 'warning').length;
                    const categoryTotal = results.length;

                    return (
                      <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(category)}
                          <div>
                            <h3 className="font-medium">{category}</h3>
                            <p className="text-sm text-muted-foreground">
                              {categoryTotal} tests • {categoryPassed} passed • {categoryFailed} failed • {categoryWarnings} warnings
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {categoryFailed > 0 && <Badge variant="destructive">{categoryFailed} failed</Badge>}
                          {categoryWarnings > 0 && <Badge variant="secondary">{categoryWarnings} warnings</Badge>}
                          {categoryFailed === 0 && categoryWarnings === 0 && <Badge variant="default">All passed</Badge>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {Object.entries(groupedResults).map(([category, results]) => (
            <TabsContent key={category.toLowerCase()} value={category.toLowerCase().replace(' ', '')}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category} Tests
                  </CardTitle>
                  <CardDescription>
                    Detailed results for {category.toLowerCase()} testing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h4 className="font-medium">{result.testName}</h4>
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                            {result.details && (
                              <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(result.status)}
                          <span className="text-xs text-muted-foreground">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Getting Started */}
      {testResults.length === 0 && !isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Run the comprehensive QA test suite to validate your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This dashboard will run tests for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Authentication flows for all user roles</li>
                <li>Navigation and route protection</li>
                <li>File upload and document parsing</li>
                <li>UI interactions and button functionality</li>
                <li>Error handling and logging</li>
              </ul>
              <Button onClick={runTests} className="w-full">
                Start Testing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}