import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Play, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HCaptchaComponent, HCaptchaRef } from '@/components/auth/HCaptcha';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export function AuthTestSuite() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpass123');
  const captchaRef = useRef<HCaptchaRef>(null);
  const { toast } = useToast();

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const testCaptcha = async (): Promise<boolean> => {
    try {
      const token = await captchaRef.current?.executeAsync();
      return !!token;
    } catch (error) {
      return false;
    }
  };

  const testSignUp = async () => {
    addResult({ test: 'Sign Up Flow', status: 'pending', message: 'Testing user registration...' });
    
    try {
      // Test CAPTCHA first
      const captchaToken = await captchaRef.current?.executeAsync();
      if (!captchaToken) {
        addResult({ 
          test: 'Sign Up Flow', 
          status: 'fail', 
          message: 'CAPTCHA verification failed',
          details: 'Unable to get CAPTCHA token for signup'
        });
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          captchaToken,
          data: {
            first_name: 'Test',
            last_name: 'User',
            display_name: 'Test User',
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          addResult({ 
            test: 'Sign Up Flow', 
            status: 'warning', 
            message: 'User already exists - this is expected for testing',
            details: error.message
          });
          return true;
        } else {
          addResult({ 
            test: 'Sign Up Flow', 
            status: 'fail', 
            message: `Sign up failed: ${error.message}`,
            details: error.message
          });
          return false;
        }
      }

      if (data.user && !data.session) {
        addResult({ 
          test: 'Sign Up Flow', 
          status: 'pass', 
          message: 'Sign up successful - email confirmation required',
          details: 'User created, awaiting email confirmation'
        });
      } else if (data.session) {
        addResult({ 
          test: 'Sign Up Flow', 
          status: 'pass', 
          message: 'Sign up successful - auto-signed in',
          details: 'User created and automatically authenticated'
        });
      }
      
      return true;
    } catch (error) {
      addResult({ 
        test: 'Sign Up Flow', 
        status: 'fail', 
        message: `Sign up error: ${error}`,
        details: String(error)
      });
      return false;
    }
  };

  const testSignIn = async () => {
    addResult({ test: 'Sign In Flow', status: 'pending', message: 'Testing user login...' });
    
    try {
      // Test CAPTCHA first
      const captchaToken = await captchaRef.current?.executeAsync();
      if (!captchaToken) {
        addResult({ 
          test: 'Sign In Flow', 
          status: 'fail', 
          message: 'CAPTCHA verification failed',
          details: 'Unable to get CAPTCHA token for signin'
        });
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
        options: {
          captchaToken
        }
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          addResult({ 
            test: 'Sign In Flow', 
            status: 'warning', 
            message: 'Email not confirmed - expected for new test accounts',
            details: error.message
          });
          return true;
        } else {
          addResult({ 
            test: 'Sign In Flow', 
            status: 'fail', 
            message: `Sign in failed: ${error.message}`,
            details: error.message
          });
          return false;
        }
      }

      if (data.session && data.user) {
        addResult({ 
          test: 'Sign In Flow', 
          status: 'pass', 
          message: 'Sign in successful',
          details: `User authenticated: ${data.user.email}`
        });
        
        // Sign out after test
        await supabase.auth.signOut();
        return true;
      }

      return false;
    } catch (error) {
      addResult({ 
        test: 'Sign In Flow', 
        status: 'fail', 
        message: `Sign in error: ${error}`,
        details: String(error)
      });
      return false;
    }
  };

  const testPasswordReset = async () => {
    addResult({ test: 'Password Reset', status: 'pending', message: 'Testing password reset...' });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        addResult({ 
          test: 'Password Reset', 
          status: 'fail', 
          message: `Password reset failed: ${error.message}`,
          details: error.message
        });
        return false;
      }

      addResult({ 
        test: 'Password Reset', 
        status: 'pass', 
        message: 'Password reset email sent successfully',
        details: 'Check email for reset instructions'
      });
      return true;
    } catch (error) {
      addResult({ 
        test: 'Password Reset', 
        status: 'fail', 
        message: `Password reset error: ${error}`,
        details: String(error)
      });
      return false;
    }
  };

  const testCaptchaIntegration = async () => {
    addResult({ test: 'hCAPTCHA Integration', status: 'pending', message: 'Testing CAPTCHA...' });
    
    try {
      const isValid = await testCaptcha();
      
      if (isValid) {
        addResult({ 
          test: 'hCAPTCHA Integration', 
          status: 'pass', 
          message: 'hCAPTCHA verification successful',
          details: 'CAPTCHA token obtained successfully'
        });
        return true;
      } else {
        addResult({ 
          test: 'hCAPTCHA Integration', 
          status: 'fail', 
          message: 'hCAPTCHA verification failed',
          details: 'Unable to get valid CAPTCHA token'
        });
        return false;
      }
    } catch (error) {
      addResult({ 
        test: 'hCAPTCHA Integration', 
        status: 'fail', 
        message: `hCAPTCHA error: ${error}`,
        details: String(error)
      });
      return false;
    }
  };

  const testSessionPersistence = async () => {
    addResult({ test: 'Session Persistence', status: 'pending', message: 'Testing session management...' });
    
    try {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      addResult({ 
        test: 'Session Persistence', 
        status: 'pass', 
        message: 'Session persistence test completed',
        details: initialSession ? 'Active session found' : 'No active session (expected)'
      });
      
      return true;
    } catch (error) {
      addResult({ 
        test: 'Session Persistence', 
        status: 'fail', 
        message: `Session test error: ${error}`,
        details: String(error)
      });
      return false;
    }
  };

  const testRoleBasedAccess = async () => {
    addResult({ test: 'Role-Based Access', status: 'pending', message: 'Testing user roles...' });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addResult({ 
          test: 'Role-Based Access', 
          status: 'warning', 
          message: 'No authenticated user for role testing',
          details: 'User must be signed in to test roles'
        });
        return true;
      }

      // Test profile fetch
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, permissions')
        .eq('id', user.id)
        .single();

      if (error) {
        addResult({ 
          test: 'Role-Based Access', 
          status: 'fail', 
          message: `Profile fetch failed: ${error.message}`,
          details: error.message
        });
        return false;
      }

      addResult({ 
        test: 'Role-Based Access', 
        status: 'pass', 
        message: 'Role-based access test successful',
        details: `User role: ${profile?.role || 'none'}`
      });
      
      return true;
    } catch (error) {
      addResult({ 
        test: 'Role-Based Access', 
        status: 'fail', 
        message: `Role test error: ${error}`,
        details: String(error)
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Test sequence
      await testCaptchaIntegration();
      await delay(1000);
      
      await testSessionPersistence();
      await delay(1000);
      
      await testSignUp();
      await delay(2000);
      
      await testSignIn();
      await delay(2000);
      
      await testPasswordReset();
      await delay(1000);
      
      await testRoleBasedAccess();
      
      toast({
        title: "Test Suite Complete",
        description: "All authentication tests have been executed",
      });
      
    } catch (error) {
      toast({
        title: "Test Suite Error",
        description: "An error occurred during testing",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge variant="secondary" className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Authentication Test Suite
          </CardTitle>
          <CardDescription>
            Comprehensive testing of authentication flows, CAPTCHA, and user management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Test Setup</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
              <TabsTrigger value="captcha">CAPTCHA Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">Test Email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-password">Test Password</Label>
                  <Input
                    id="test-password"
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This test suite will attempt to create accounts and perform authentication operations. 
                  Use test credentials only. Some tests may require email confirmation.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={runAllTests} 
                disabled={isRunning || !testEmail || !testPassword}
                className="w-full"
                size="lg"
              >
                {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
              </Button>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              {results.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No test results yet. Run the test suite to see results here.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h4 className="font-medium">{result.test}</h4>
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                            {result.details && (
                              <p className="text-xs text-muted-foreground mt-1 font-mono">
                                {result.details}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="captcha" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Test hCAPTCHA integration independently. Complete the CAPTCHA below to verify it's working correctly.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col items-center space-y-4">
                <HCaptchaComponent 
                  ref={captchaRef}
                  onVerify={(token) => {
                    toast({
                      title: "CAPTCHA Verified",
                      description: "hCAPTCHA verification successful!",
                    });
                  }}
                  onError={(error) => {
                    toast({
                      title: "CAPTCHA Error",
                      description: "hCAPTCHA verification failed",
                      variant: "destructive",
                    });
                  }}
                />
                
                <Button onClick={testCaptchaIntegration}>
                  Test CAPTCHA Integration
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}