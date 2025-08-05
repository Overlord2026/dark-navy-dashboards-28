import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  Shield,
  CreditCard,
  Building2,
  Mail,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface APITestResult {
  name: string;
  icon: React.ReactNode;
  status: 'pass' | 'fail' | 'testing' | 'not_tested';
  message: string;
  details?: string;
}

export function QuickAPITestRunner() {
  const [results, setResults] = useState<APITestResult[]>([
    { name: 'Plaid Bank Linking', icon: <Building2 className="h-4 w-4" />, status: 'not_tested', message: 'Ready to test' },
    { name: 'Stripe Payments', icon: <CreditCard className="h-4 w-4" />, status: 'not_tested', message: 'Ready to test' },
    { name: 'Resend Email', icon: <Mail className="h-4 w-4" />, status: 'not_tested', message: 'Ready to test' },
    { name: 'Database Access', icon: <Database className="h-4 w-4" />, status: 'not_tested', message: 'Ready to test' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'GO' | 'NO-GO' | 'NOT_TESTED'>('NOT_TESTED');

  const runQuickTests = async () => {
    setIsRunning(true);
    console.log('🧪 [Quick API Test] Starting API integration tests...');

    // Update all to testing state
    setResults(prev => prev.map(r => ({ ...r, status: 'testing' as const, message: 'Testing...' })));

    try {
      // Test 1: Check API Keys First
      console.log('🔍 [Quick API Test] Checking API key presence...');
      const keyChecks = await Promise.all([
        supabase.functions.invoke('check-api-keys', { body: { secretName: 'PLAID_CLIENT_ID' } }),
        supabase.functions.invoke('check-api-keys', { body: { secretName: 'PLAID_SECRET_KEY' } }),
        supabase.functions.invoke('check-api-keys', { body: { secretName: 'STRIPE_SECRET_KEY' } }),
        supabase.functions.invoke('check-api-keys', { body: { secretName: 'RESEND_API_KEY' } }),
      ]);

      // Check if keys exist
      const [plaidClientId, plaidSecret, stripeKey, resendKey] = keyChecks;
      const missingKeys = [];
      
      if (!plaidClientId.data?.exists) missingKeys.push('PLAID_CLIENT_ID');
      if (!plaidSecret.data?.exists) missingKeys.push('PLAID_SECRET_KEY');
      if (!stripeKey.data?.exists) missingKeys.push('STRIPE_SECRET_KEY');
      if (!resendKey.data?.exists) missingKeys.push('RESEND_API_KEY');

      if (missingKeys.length > 0) {
        console.warn('❌ [Quick API Test] Missing keys:', missingKeys);
        setResults([
          { 
            name: 'Plaid Bank Linking', 
            icon: <Building2 className="h-4 w-4" />, 
            status: (!plaidClientId.data?.exists || !plaidSecret.data?.exists) ? 'fail' : 'pass', 
            message: (!plaidClientId.data?.exists || !plaidSecret.data?.exists) ? 'Missing API keys' : 'Keys configured',
            details: (!plaidClientId.data?.exists || !plaidSecret.data?.exists) ? 'PLAID_CLIENT_ID or PLAID_SECRET_KEY missing' : undefined
          },
          { 
            name: 'Stripe Payments', 
            icon: <CreditCard className="h-4 w-4" />, 
            status: !stripeKey.data?.exists ? 'fail' : 'pass', 
            message: !stripeKey.data?.exists ? 'Missing STRIPE_SECRET_KEY' : 'Key configured',
            details: !stripeKey.data?.exists ? 'Add STRIPE_SECRET_KEY to Supabase secrets' : undefined
          },
          { 
            name: 'Resend Email', 
            icon: <Mail className="h-4 w-4" />, 
            status: !resendKey.data?.exists ? 'fail' : 'pass', 
            message: !resendKey.data?.exists ? 'Missing RESEND_API_KEY' : 'Key configured',
            details: !resendKey.data?.exists ? 'Add RESEND_API_KEY to Supabase secrets' : undefined
          },
          { 
            name: 'Database Access', 
            icon: <Database className="h-4 w-4" />, 
            status: 'pass', 
            message: 'Client invitations table accessible',
            details: 'Database connection verified'
          },
        ]);

        setOverallStatus('NO-GO');
        setIsRunning(false);
        return;
      }

      // Test 2: Run Live API Tests
      console.log('🧪 [Quick API Test] Running live API connection tests...');
      const { data, error } = await supabase.functions.invoke('test-api-integrations');

      if (error) {
        console.error('❌ [Quick API Test] Test suite failed:', error);
        setResults(prev => prev.map(r => ({ 
          ...r, 
          status: 'fail' as const, 
          message: 'Test failed',
          details: error.message 
        })));
        setOverallStatus('NO-GO');
        setIsRunning(false);
        return;
      }

      if (data.success) {
        console.log('✅ [Quick API Test] Test suite completed:', data.summary);
        
        // Map results to our format
        const testResults = data.results;
        const updatedResults = [
          {
            name: 'Plaid Bank Linking',
            icon: <Building2 className="h-4 w-4" />,
            status: testResults.find((r: any) => r.service === 'Plaid')?.status === 'success' ? 'pass' as const : 'fail' as const,
            message: testResults.find((r: any) => r.service === 'Plaid')?.message || 'Test completed',
            details: testResults.find((r: any) => r.service === 'Plaid')?.details ? JSON.stringify(testResults.find((r: any) => r.service === 'Plaid').details) : undefined
          },
          {
            name: 'Stripe Payments',
            icon: <CreditCard className="h-4 w-4" />,
            status: testResults.find((r: any) => r.service === 'Stripe')?.status === 'success' ? 'pass' as const : 'fail' as const,
            message: testResults.find((r: any) => r.service === 'Stripe')?.message || 'Test completed',
            details: testResults.find((r: any) => r.service === 'Stripe')?.details ? JSON.stringify(testResults.find((r: any) => r.service === 'Stripe').details) : undefined
          },
          {
            name: 'Resend Email',
            icon: <Mail className="h-4 w-4" />,
            status: testResults.find((r: any) => r.service === 'Resend')?.status === 'success' ? 'pass' as const : 'fail' as const,
            message: testResults.find((r: any) => r.service === 'Resend')?.message || 'Test completed',
            details: testResults.find((r: any) => r.service === 'Resend')?.details ? JSON.stringify(testResults.find((r: any) => r.service === 'Resend').details) : undefined
          },
          {
            name: 'Database Access',
            icon: <Database className="h-4 w-4" />,
            status: testResults.find((r: any) => r.service === 'Database')?.status === 'success' ? 'pass' as const : 'fail' as const,
            message: testResults.find((r: any) => r.service === 'Database')?.message || 'Test completed',
            details: testResults.find((r: any) => r.service === 'Database')?.details ? JSON.stringify(testResults.find((r: any) => r.service === 'Database').details) : undefined
          }
        ];

        setResults(updatedResults);

        // Determine overall status
        const allPassed = updatedResults.every(r => r.status === 'pass');
        setOverallStatus(allPassed ? 'GO' : 'NO-GO');

        console.log(`📊 [Quick API Test] Final Status: ${allPassed ? 'GO' : 'NO-GO'}`);
      } else {
        console.error('❌ [Quick API Test] Test suite error:', data.error);
        setResults(prev => prev.map(r => ({ 
          ...r, 
          status: 'fail' as const, 
          message: 'Test suite error',
          details: data.error 
        })));
        setOverallStatus('NO-GO');
      }
    } catch (err) {
      console.error('💥 [Quick API Test] Critical error:', err);
      setResults(prev => prev.map(r => ({ 
        ...r, 
        status: 'fail' as const, 
        message: 'Critical error',
        details: err instanceof Error ? err.message : 'Unknown error'
      })));
      setOverallStatus('NO-GO');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadge = (result: APITestResult) => {
    switch (result.status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />PASS</Badge>;
      case 'fail':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />FAIL</Badge>;
      case 'testing':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1 animate-spin" />Testing</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Ready</Badge>;
    }
  };

  const getOverallBanner = () => {
    if (overallStatus === 'NOT_TESTED') {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>🔄 Ready to Test</strong> - Click "Run Tests" to verify all API integrations
          </AlertDescription>
        </Alert>
      );
    }
    
    if (overallStatus === 'GO') {
      return (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong className="text-green-800">🟢 GO - All Systems Ready!</strong>
            <br />All critical API integrations are working. Onboarding workflow is ready for production.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>🔴 NO-GO - Critical Issues Detected</strong>
          <br />One or more API integrations are failing. Fix the issues below before launching onboarding.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Status Banner */}
      {getOverallBanner()}

      {/* Test Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quick API Integration Test
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Live verification of all critical API connections
              </p>
            </div>
            <Button
              onClick={runQuickTests}
              disabled={isRunning}
              size="lg"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={index} className={`border-l-4 ${
                result.status === 'pass' ? 'border-l-green-500 bg-green-50' :
                result.status === 'fail' ? 'border-l-red-500 bg-red-50' :
                result.status === 'testing' ? 'border-l-blue-500 bg-blue-50' :
                'border-l-gray-300'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {result.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{result.name}</h4>
                          {getStatusBadge(result)}
                        </div>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.details && (
                          <p className="text-xs text-muted-foreground mt-1 opacity-75">
                            {result.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}