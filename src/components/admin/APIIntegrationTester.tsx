import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  TestTube, 
  AlertTriangle,
  ExternalLink,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
}

export function APIIntegrationTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testSummary, setTestSummary] = useState<TestSummary | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);
  const { toast } = useToast();

  const runAPITests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setTestSummary(null);
    
    console.log('🧪 [API Integration Tester] Starting comprehensive API tests...');
    
    try {
      const { data, error } = await supabase.functions.invoke('test-api-integrations');
      
      if (error) {
        console.error('❌ [API Integration Tester] Test suite failed:', error);
        toast({
          title: "Test Suite Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        setTestResults(data.results);
        setTestSummary(data.summary);
        setLastRunTime(data.timestamp);
        
        const { passed, failed } = data.summary;
        console.log(`📊 [API Integration Tester] Tests completed: ${passed} passed, ${failed} failed`);
        
        toast({
          title: "API Tests Completed",
          description: `${passed}/${data.summary.total} integrations tested successfully`,
          variant: failed > 0 ? "destructive" : "default",
        });
      } else {
        console.error('❌ [API Integration Tester] Test suite error:', data.error);
        toast({
          title: "Test Suite Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('💥 [API Integration Tester] Critical error:', err);
      toast({
        title: "Critical Error",
        description: "Failed to run API integration tests",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-run tests on component mount
  useEffect(() => {
    runAPITests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service.toLowerCase()) {
      case 'stripe': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'plaid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finnhub': return 'bg-green-100 text-green-800 border-green-200';
      case 'resend': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'alternative investments': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTroubleshootingLink = (service: string) => {
    switch (service.toLowerCase()) {
      case 'stripe': return 'https://dashboard.stripe.com/apikeys';
      case 'plaid': return 'https://dashboard.plaid.com/team/keys';
      case 'finnhub': return 'https://finnhub.io/dashboard';
      case 'resend': return 'https://resend.com/api-keys';
      default: return null;
    }
  };

  const failedTests = testResults.filter(r => r.status === 'error');
  const passedTests = testResults.filter(r => r.status === 'success');

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                API Integration Test Suite
              </CardTitle>
              <CardDescription>
                Verify all API connections with live test transactions
              </CardDescription>
            </div>
            <Button 
              onClick={runAPITests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {testSummary && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{testSummary.passed}</p>
                  <p className="text-sm text-green-600">Passed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{testSummary.failed}</p>
                  <p className="text-sm text-red-600">Failed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <TestTube className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-700">{testSummary.total}</p>
                  <p className="text-sm text-blue-600">Total Tests</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Success Rate</span>
                <span>{Math.round((testSummary.passed / testSummary.total) * 100)}%</span>
              </div>
              <Progress value={(testSummary.passed / testSummary.total) * 100} className="h-2" />
            </div>
            
            {lastRunTime && (
              <p className="text-xs text-muted-foreground mt-3">
                Last run: {new Date(lastRunTime).toLocaleString()}
              </p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Critical Failures Alert */}
      {failedTests.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🚨 Production Warning:</strong> {failedTests.length} critical API integration(s) failing. 
            These must be resolved before production deployment.
          </AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="grid gap-4">
          {testResults.map((result, index) => (
            <Card 
              key={index}
              className={`${result.status === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{result.service}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getServiceColor(result.service)}`}
                        >
                          {result.service}
                        </Badge>
                        <Badge 
                          variant={result.status === 'success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {result.status === 'success' ? 'CONNECTED' : 'FAILED'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      
                      {result.details && (
                        <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.status === 'error' && getTroubleshootingLink(result.service) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-700 border-red-300 hover:bg-red-100"
                      onClick={() => window.open(getTroubleshootingLink(result.service), '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Fix Keys
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isRunning && testResults.length === 0 && (
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="font-medium">Running API Integration Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Testing Stripe, Plaid, Finnhub, Resend, and other integrations...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions', '_blank')}
              className="justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Configure API Secrets
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const report = `API Integration Test Report
Generated: ${new Date().toISOString()}

Summary:
- Total Tests: ${testSummary?.total || 0}
- Passed: ${testSummary?.passed || 0}
- Failed: ${testSummary?.failed || 0}

Results:
${testResults.map(r => `${r.service}: ${r.status.toUpperCase()} - ${r.message}`).join('\n')}`;
                
                navigator.clipboard.writeText(report);
                toast({ title: "Report copied to clipboard" });
              }}
              className="justify-start"
            >
              Copy Test Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}