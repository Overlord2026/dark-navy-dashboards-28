import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { QATestResult, APIIntegrationStatus } from '@/types/qa';

export function useAPIIntegrationTests() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QATestResult[]>([]);
  const [status, setStatus] = useState<APIIntegrationStatus>({
    plaid: 'testing',
    stripe: 'testing',
    resend: 'testing',
    database: 'testing'
  });
  const { toast } = useToast();

  const updateStatus = (service: keyof APIIntegrationStatus, newStatus: APIIntegrationStatus[keyof APIIntegrationStatus]) => {
    setStatus(prev => ({ ...prev, [service]: newStatus }));
  };

  const addResult = (result: Omit<QATestResult, 'timestamp'>) => {
    const newResult: QATestResult = {
      ...result,
      timestamp: new Date()
    };
    setResults(prev => [...prev, newResult]);
    return newResult;
  };

  const testPlaidConnection = async (): Promise<QATestResult> => {
    updateStatus('plaid', 'testing');
    const startTime = Date.now();
    
    try {
      const response = await supabase.functions.invoke('plaid-create-link-token');
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateStatus('plaid', 'error');
        return addResult({
          id: 'plaid-connection',
          name: 'Plaid API Connection',
          status: 'failed',
          message: 'Plaid connection failed',
          details: JSON.stringify(response.error),
          duration
        });
      }
      
      if (response.data?.link_token) {
        updateStatus('plaid', 'warning');
        return addResult({
          id: 'plaid-connection',
          name: 'Plaid API Connection',
          status: 'warning',
          message: 'Plaid sandbox connected (auth product approval pending)',
          details: 'Link token created successfully',
          duration
        });
      }
      
      updateStatus('plaid', 'error');
      return addResult({
        id: 'plaid-connection',
        name: 'Plaid API Connection',
        status: 'failed',
        message: 'Unexpected Plaid response',
        details: JSON.stringify(response.data),
        duration
      });
    } catch (error) {
      updateStatus('plaid', 'error');
      return addResult({
        id: 'plaid-connection',
        name: 'Plaid API Connection',
        status: 'failed',
        message: 'Network error during Plaid test',
        details: String(error),
        duration: Date.now() - startTime
      });
    }
  };

  const testStripeConnection = async (): Promise<QATestResult> => {
    updateStatus('stripe', 'testing');
    const startTime = Date.now();
    
    try {
      const response = await supabase.functions.invoke('check-subscription');
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateStatus('stripe', 'error');
        return addResult({
          id: 'stripe-connection',
          name: 'Stripe Integration',
          status: 'failed',
          message: 'Stripe connection failed',
          details: JSON.stringify(response.error),
          duration
        });
      }
      
      updateStatus('stripe', 'connected');
      return addResult({
        id: 'stripe-connection',
        name: 'Stripe Integration',
        status: 'passed',
        message: 'Stripe integration working',
        details: 'Subscription check completed successfully',
        duration
      });
    } catch (error) {
      updateStatus('stripe', 'error');
      return addResult({
        id: 'stripe-connection',
        name: 'Stripe Integration',
        status: 'failed',
        message: 'Network error during Stripe test',
        details: String(error),
        duration: Date.now() - startTime
      });
    }
  };

  const testResendConnection = async (): Promise<QATestResult> => {
    updateStatus('resend', 'testing');
    const startTime = Date.now();
    
    try {
      const response = await supabase.functions.invoke('check-api-keys', {
        body: { secretName: 'RESEND_API_KEY' }
      });
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateStatus('resend', 'error');
        return addResult({
          id: 'resend-connection',
          name: 'Resend Email Service',
          status: 'failed',
          message: 'Resend API key check failed',
          details: JSON.stringify(response.error),
          duration
        });
      }
      
      if (response.data?.exists) {
        updateStatus('resend', 'connected');
        return addResult({
          id: 'resend-connection',
          name: 'Resend Email Service',
          status: 'passed',
          message: 'Resend API configured correctly',
          details: 'API key exists and is accessible',
          duration
        });
      }
      
      updateStatus('resend', 'error');
      return addResult({
        id: 'resend-connection',
        name: 'Resend Email Service',
        status: 'failed',
        message: 'Resend API key not configured',
        details: 'API key is missing or empty',
        duration
      });
    } catch (error) {
      updateStatus('resend', 'error');
      return addResult({
        id: 'resend-connection',
        name: 'Resend Email Service',
        status: 'failed',
        message: 'Network error during Resend test',
        details: String(error),
        duration: Date.now() - startTime
      });
    }
  };

  const testDatabaseConnection = async (): Promise<QATestResult> => {
    updateStatus('database', 'testing');
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const duration = Date.now() - startTime;
      
      if (error) {
        updateStatus('database', 'error');
        return addResult({
          id: 'database-connection',
          name: 'Database Connection',
          status: 'failed',
          message: 'Database query failed',
          details: JSON.stringify(error),
          duration
        });
      }
      
      updateStatus('database', 'connected');
      return addResult({
        id: 'database-connection',
        name: 'Database Connection',
        status: 'passed',
        message: 'Database connection successful',
        details: 'Query executed successfully',
        duration
      });
    } catch (error) {
      updateStatus('database', 'error');
      return addResult({
        id: 'database-connection',
        name: 'Database Connection',
        status: 'failed',
        message: 'Network error during database test',
        details: String(error),
        duration: Date.now() - startTime
      });
    }
  };

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setStatus({
      plaid: 'testing',
      stripe: 'testing',
      resend: 'testing',
      database: 'testing'
    });

    try {
      const testPromises = [
        testPlaidConnection(),
        testStripeConnection(),
        testResendConnection(),
        testDatabaseConnection()
      ];

      await Promise.all(testPromises);

      const allResults = await Promise.all(testPromises);
      const passed = allResults.filter(r => r.status === 'passed').length;
      const failed = allResults.filter(r => r.status === 'failed').length;
      const warnings = allResults.filter(r => r.status === 'warning').length;

      toast({
        title: "API Integration Tests Complete",
        description: `${passed} passed, ${failed} failed, ${warnings} warnings`,
        variant: failed > 0 ? "destructive" : warnings > 0 ? "default" : "default"
      });
    } catch (error) {
      toast({
        title: "Test Suite Error",
        description: "Failed to complete all tests",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  }, []);

  return {
    isRunning,
    results,
    status,
    runAllTests
  };
}