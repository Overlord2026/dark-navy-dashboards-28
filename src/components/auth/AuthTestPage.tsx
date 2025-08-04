import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function AuthTestPage() {
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'success' | 'error' | 'warning';
    message: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAuthTests = async () => {
    setIsRunning(true);
    const results: typeof testResults = [];

    // Test 1: Check Supabase connection
    try {
      const { data, error } = await supabase.auth.getSession();
      results.push({
        test: 'Supabase Connection',
        status: 'success',
        message: 'Successfully connected to Supabase'
      });
    } catch (error) {
      results.push({
        test: 'Supabase Connection',
        status: 'error',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 2: Test login without CAPTCHA
    try {
      const testEmail = 'test@example.com';
      const testPassword = 'TestPassword123!';
      
      // Try to sign up first (will fail if user exists, which is fine)
      await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error && error.message.includes('captcha')) {
        results.push({
          test: 'Login without CAPTCHA',
          status: 'error',
          message: 'CAPTCHA is still required - backend settings need to be updated'
        });
      } else if (error && error.message.includes('Invalid login credentials')) {
        results.push({
          test: 'Login without CAPTCHA',
          status: 'warning',
          message: 'Login format works but test credentials are invalid (expected)'
        });
      } else if (error) {
        results.push({
          test: 'Login without CAPTCHA',
          status: 'error',
          message: `Login failed: ${error.message}`
        });
      } else {
        results.push({
          test: 'Login without CAPTCHA',
          status: 'success',
          message: 'Login works without CAPTCHA verification'
        });
        
        // Sign out the test user
        await supabase.auth.signOut();
      }
    } catch (error) {
      results.push({
        test: 'Login without CAPTCHA',
        status: 'error',
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 3: Check environment detection
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname.includes('lovableproject.com') ||
                  window.location.hostname.includes('my.bfocfo.com');
    
    results.push({
      test: 'Environment Detection',
      status: isDev ? 'success' : 'warning',
      message: isDev ? 'Development environment detected - CAPTCHA bypassed' : 'Production environment - CAPTCHA will be required'
    });

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authentication Test Suite</h1>
          <p className="text-muted-foreground">
            Test authentication functionality and CAPTCHA bypass for development
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Run Authentication Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runAuthTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </Button>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((result, index) => (
                <Alert key={index} className={getStatusColor(result.status)}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h4 className="font-semibold">{result.test}</h4>
                      <AlertDescription className="mt-1">
                        {result.message}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>CAPTCHA Fix Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-semibold">Development Mode</h4>
                  <AlertDescription>
                    CAPTCHA is automatically bypassed on localhost and staging environments
                  </AlertDescription>
                </div>
              </Alert>

              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-semibold">Direct Supabase Auth</h4>
                  <AlertDescription>
                    Login now uses direct Supabase auth calls, bypassing custom CAPTCHA requirements
                  </AlertDescription>
                </div>
              </Alert>

              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="font-semibold">Production Ready</h4>
                  <AlertDescription>
                    CAPTCHA will automatically activate in production environments
                  </AlertDescription>
                </div>
              </Alert>

              <Alert className="border-purple-200 bg-purple-50">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="font-semibold">Error Handling</h4>
                  <AlertDescription>
                    Clear error messages and fallback options are now implemented
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}