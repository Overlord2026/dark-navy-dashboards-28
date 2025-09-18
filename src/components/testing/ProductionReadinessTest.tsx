import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCheckout } from "@/hooks/useCheckout";
import { useStripePortal } from "@/hooks/useStripePortal";
import { analytics } from "@/lib/analytics";
import { CheckCircle, XCircle, Loader2, AlertCircle, Clock } from "lucide-react";

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  message: string;
  details?: any;
  timestamp?: string;
}

export function ProductionReadinessTest() {
  const { toast } = useToast();
  const { createCheckoutSession, isLoading: checkoutLoading } = useCheckout();
  const { openPortal, isLoading: portalLoading } = useStripePortal();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (name: string, result: Partial<TestResult>) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => r.name === name ? { ...r, ...result, timestamp: new Date().toISOString() } : r);
      } else {
        return [...prev, { name, status: 'pending', message: '', ...result, timestamp: new Date().toISOString() }];
      }
    });
  };

  // Stripe Integration Tests
  const testStripeIntegration = async () => {
    updateTestResult('Stripe Checkout', { status: 'running', message: 'Testing checkout session creation...' });
    
    try {
      // Test with a test price ID - you should replace with your actual test price
      const testPriceId = 'price_test_123'; // Replace with actual test price ID
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: testPriceId,
          successUrl: `${window.location.origin}/test-success`,
          cancelUrl: `${window.location.origin}/test-cancel`
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        updateTestResult('Stripe Checkout', { 
          status: 'passed', 
          message: 'Checkout session created successfully',
          details: { url: data.url.substring(0, 50) + '...' }
        });
      } else {
        updateTestResult('Stripe Checkout', { 
          status: 'failed', 
          message: 'No checkout URL returned' 
        });
      }
    } catch (error) {
      updateTestResult('Stripe Checkout', { 
        status: 'failed', 
        message: `Stripe test failed: ${error}`,
        details: error 
      });
    }
  };

  const testStripePortal = async () => {
    updateTestResult('Stripe Portal', { status: 'running', message: 'Testing customer portal access...' });
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        updateTestResult('Stripe Portal', { 
          status: 'passed', 
          message: 'Customer portal session created successfully',
          details: { url: data.url.substring(0, 50) + '...' }
        });
      } else {
        updateTestResult('Stripe Portal', { 
          status: 'failed', 
          message: 'No portal URL returned' 
        });
      }
    } catch (error) {
      updateTestResult('Stripe Portal', { 
        status: 'failed', 
        message: `Portal test failed: ${error}`,
        details: error 
      });
    }
  };

  // Plaid Integration Tests
  const testPlaidIntegration = async () => {
    updateTestResult('Plaid Link Token', { status: 'running', message: 'Testing Plaid link token creation...' });
    
    try {
      const response = await supabase.functions.invoke('plaid-create-link-token');
      
      if (response.error) {
        updateTestResult('Plaid Link Token', { 
          status: 'failed', 
          message: 'Plaid connection failed',
          details: response.error 
        });
      } else if (response.data?.link_token) {
        updateTestResult('Plaid Link Token', { 
          status: 'passed', 
          message: 'Plaid link token created successfully',
          details: {
            token: response.data.link_token.substring(0, 20) + '...',
            expiration: response.data.expiration
          }
        });
      } else {
        updateTestResult('Plaid Link Token', { 
          status: 'failed', 
          message: 'Unexpected response from Plaid',
          details: response.data 
        });
      }
    } catch (error) {
      updateTestResult('Plaid Link Token', { 
        status: 'failed', 
        message: `Plaid test failed: ${error}`,
        details: error 
      });
    }
  };

  // Analytics Integration Tests
  const testAnalyticsTracking = async () => {
    updateTestResult('Analytics Events', { status: 'running', message: 'Testing PostHog event tracking...' });
    
    try {
      // Test various event types
      const testEvents = [
        { name: 'page_view', data: { page: '/production-test' } },
        { name: 'feature_used', data: { feature: 'production_readiness_test' } },
        { name: 'conversion', data: { type: 'test_conversion' } },
        { name: 'error', data: { message: 'test_error', context: 'production_test' } }
      ];

      let successCount = 0;
      for (const event of testEvents) {
        try {
          analytics.track(event.name, event.data);
          successCount++;
        } catch (err) {
          console.error(`Failed to track ${event.name}:`, err);
        }
      }

      if (successCount === testEvents.length) {
        updateTestResult('Analytics Events', { 
          status: 'passed', 
          message: `All ${testEvents.length} test events tracked successfully`,
          details: { events: testEvents.map(e => e.name) }
        });
      } else {
        updateTestResult('Analytics Events', { 
          status: 'warning', 
          message: `${successCount}/${testEvents.length} events tracked successfully`,
          details: { successCount, totalEvents: testEvents.length }
        });
      }
    } catch (error) {
      updateTestResult('Analytics Events', { 
        status: 'failed', 
        message: `Analytics test failed: ${error}`,
        details: error 
      });
    }
  };

  // Database Performance Test
  const testDatabasePerformance = async () => {
    updateTestResult('Database Performance', { status: 'running', message: 'Testing database query performance...' });
    
    try {
      const startTime = Date.now();
      
      // Test a few common queries
      const tests = [
        supabase.from('profiles').select('id, email, role').limit(10),
        supabase.from('audit_logs').select('id, event_type, created_at').limit(10),
        supabase.from('analytics_events').select('id, event_type, created_at').limit(10)
      ];

      const results = await Promise.all(tests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const hasErrors = results.some(r => r.error);
      
      if (hasErrors) {
        updateTestResult('Database Performance', { 
          status: 'failed', 
          message: 'Database queries failed',
          details: results.filter(r => r.error).map(r => r.error)
        });
      } else if (duration > 2000) {
        updateTestResult('Database Performance', { 
          status: 'warning', 
          message: `Queries completed but took ${duration}ms (slow)`,
          details: { duration, threshold: 2000 }
        });
      } else {
        updateTestResult('Database Performance', { 
          status: 'passed', 
          message: `Database queries completed in ${duration}ms`,
          details: { duration, queriesCount: tests.length }
        });
      }
    } catch (error) {
      updateTestResult('Database Performance', { 
        status: 'failed', 
        message: `Database test failed: ${error}`,
        details: error 
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      await Promise.all([
        testStripeIntegration(),
        testStripePortal(),
        testPlaidIntegration(),
        testAnalyticsTracking(),
        testDatabasePerformance()
      ]);
      
      toast({
        title: "Production Tests Complete",
        description: "All tests have finished running. Check results below."
      });
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Some tests failed to complete.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'running': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const testSummary = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed').length,
    warnings: testResults.filter(r => r.status === 'warning').length,
    running: testResults.filter(r => r.status === 'running').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Readiness Test Suite</CardTitle>
          <CardDescription>
            Comprehensive testing of Stripe, Plaid, Analytics, and Database integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center mb-6">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run All Tests'
              )}
            </Button>
            
            {testResults.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50">
                  ✓ {testSummary.passed} Passed
                </Badge>
                {testSummary.failed > 0 && (
                  <Badge variant="destructive">
                    ✗ {testSummary.failed} Failed
                  </Badge>
                )}
                {testSummary.warnings > 0 && (
                  <Badge variant="secondary" className="bg-yellow-50">
                    ⚠ {testSummary.warnings} Warnings
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {testResults.map((result) => (
              <div 
                key={result.name}
                className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer">View Details</summary>
                    <pre className="mt-2 p-2 bg-black/5 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
                {result.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}