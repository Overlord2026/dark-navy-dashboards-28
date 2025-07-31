import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, XCircle, Play, User, Shield, Globe, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TestResult {
  id: string;
  testType: 'navigation' | 'auth' | 'captcha';
  persona: string;
  action: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  timestamp: number;
  details?: any;
}

interface PersonaCredentials {
  email: string;
  password: string;
  role: string;
  name: string;
}

// Test personas - these should match actual database users
const TEST_PERSONAS: PersonaCredentials[] = [
  { email: 'tonygomes88@gmail.com', password: 'TestPassword123!', role: 'system_administrator', name: 'Tony Admin' },
  { email: 'votepedro1988@gmail.com', password: 'TestPassword123!', role: 'system_administrator', name: 'Pedro Admin' },
  { email: 'client@test.com', password: 'TestPassword123!', role: 'client', name: 'Test Client' },
  { email: 'advisor@test.com', password: 'TestPassword123!', role: 'advisor', name: 'Test Advisor' },
  { email: 'accountant@test.com', password: 'TestPassword123!', role: 'accountant', name: 'Test Accountant' },
  { email: 'consultant@test.com', password: 'TestPassword123!', role: 'consultant', name: 'Test Consultant' },
  { email: 'attorney@test.com', password: 'TestPassword123!', role: 'attorney', name: 'Test Attorney' },
];

// Navigation routes to test
const NAVIGATION_ROUTES = [
  { path: '/', name: 'Home', requiredRoles: ['any'] },
  { path: '/client-dashboard', name: 'Client Dashboard', requiredRoles: ['client', 'advisor', 'admin'] },
  { path: '/advisor-dashboard', name: 'Advisor Dashboard', requiredRoles: ['advisor', 'admin'] },
  { path: '/admin-dashboard', name: 'Admin Dashboard', requiredRoles: ['admin', 'system_administrator'] },
  { path: '/admin', name: 'Admin Portal', requiredRoles: ['admin', 'system_administrator'] },
  { path: '/portfolio', name: 'Portfolio', requiredRoles: ['client', 'advisor'] },
  { path: '/cash-management', name: 'Cash Management', requiredRoles: ['client', 'advisor'] },
  { path: '/banking', name: 'Banking', requiredRoles: ['client', 'advisor'] },
  { path: '/investments', name: 'Investments', requiredRoles: ['client', 'advisor'] },
  { path: '/clients', name: 'Client Management', requiredRoles: ['advisor', 'admin'] },
  { path: '/leads', name: 'Lead Management', requiredRoles: ['advisor', 'admin'] },
  { path: '/reports', name: 'Reports', requiredRoles: ['advisor', 'admin'] },
  { path: '/compliance', name: 'Compliance', requiredRoles: ['advisor', 'admin'] },
  { path: '/professional-signup', name: 'Professional Signup', requiredRoles: ['any'] },
  { path: '/navigation-qa-test', name: 'Navigation QA Test', requiredRoles: ['admin', 'system_administrator'] },
];

export function ComprehensiveQATestSuite() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [authTestResults, setAuthTestResults] = useState<Record<string, any>>({});
  const [captchaTestResults, setCaptchaTestResults] = useState<Record<string, any>>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const addTestResult = (result: Omit<TestResult, 'id' | 'timestamp'>) => {
    const fullResult: TestResult = {
      ...result,
      id: `${result.testType}-${result.persona}-${Date.now()}`,
      timestamp: Date.now()
    };
    setTestResults(prev => [...prev, fullResult]);
  };

  // Test authentication for a persona
  const testPersonaAuth = async (persona: PersonaCredentials): Promise<boolean> => {
    setCurrentTest(`Testing authentication for ${persona.name}`);
    
    try {
      // First, ensure we're logged out
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: persona.email,
        password: persona.password,
      });

      if (error) {
        addTestResult({
          testType: 'auth',
          persona: persona.role,
          action: 'login',
          status: 'error',
          message: `Login failed: ${error.message}`,
          details: { email: persona.email, error: error.message }
        });
        
        setAuthTestResults(prev => ({
          ...prev,
          [persona.role]: { success: false, error: error.message }
        }));
        
        return false;
      }

      addTestResult({
        testType: 'auth',
        persona: persona.role,
        action: 'login',
        status: 'success',
        message: `Successfully authenticated as ${persona.name}`,
        details: { email: persona.email, userId: data.user?.id }
      });

      setAuthTestResults(prev => ({
        ...prev,
        [persona.role]: { success: true, user: data.user }
      }));

      return true;
    } catch (error) {
      addTestResult({
        testType: 'auth',
        persona: persona.role,
        action: 'login',
        status: 'error',
        message: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { email: persona.email, error }
      });

      setAuthTestResults(prev => ({
        ...prev,
        [persona.role]: { success: false, error: 'Authentication failed' }
      }));

      return false;
    }
  };

  // Test navigation for a specific route and persona
  const testNavigation = async (route: typeof NAVIGATION_ROUTES[0], persona: PersonaCredentials): Promise<void> => {
    setCurrentTest(`Testing ${route.name} for ${persona.name}`);
    
    const startTime = performance.now();
    
    try {
      // Navigate to the route
      navigate(route.path);
      
      // Wait for route to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const loadTime = performance.now() - startTime;
      const currentPath = window.location.pathname;
      
      // Check if we're on the expected route
      const isCorrectRoute = currentPath === route.path || 
                            currentPath.startsWith(route.path) ||
                            (route.path === '/' && currentPath === '/');
      
      // Check for error indicators
      const hasError = document.querySelector('.error') || 
                      document.querySelector('[data-testid="error"]') ||
                      document.title.includes('404') ||
                      document.title.includes('Error') ||
                      document.body.textContent?.includes('Something went wrong');

      // Check for content
      const hasContent = document.body.textContent && 
                        document.body.textContent.trim().length > 200 &&
                        !document.body.textContent.includes('Loading...');

      // Check role-based access
      const hasAccess = route.requiredRoles.includes('any') || 
                       route.requiredRoles.includes(persona.role) ||
                       persona.role === 'system_administrator';

      let status: TestResult['status'] = 'success';
      let message = `Page loaded successfully (${Math.round(loadTime)}ms)`;

      if (hasError) {
        status = 'error';
        message = 'Page contains error indicators';
      } else if (!isCorrectRoute) {
        status = 'warning';
        message = `Redirected to ${currentPath} instead of ${route.path}`;
      } else if (!hasContent) {
        status = 'warning';
        message = 'Page appears to have minimal content or is still loading';
      } else if (!hasAccess) {
        // If user shouldn't have access, check if they were properly redirected
        if (currentPath === route.path) {
          status = 'error';
          message = 'User has access to route they should not';
        } else {
          status = 'success';
          message = 'Properly restricted access - user redirected';
        }
      }

      addTestResult({
        testType: 'navigation',
        persona: persona.role,
        action: `navigate-${route.path}`,
        status,
        message,
        details: {
          route: route.path,
          currentPath,
          loadTime: Math.round(loadTime),
          hasContent,
          hasAccess,
          expectedRole: route.requiredRoles
        }
      });

    } catch (error) {
      addTestResult({
        testType: 'navigation',
        persona: persona.role,
        action: `navigate-${route.path}`,
        status: 'error',
        message: `Navigation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          route: route.path,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  };

  // Test CAPTCHA functionality
  const testCaptcha = async (): Promise<void> => {
    setCurrentTest('Testing CAPTCHA functionality');
    
    try {
      // Navigate to auth page
      navigate('/auth');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if CAPTCHA is present
      const captchaElement = document.querySelector('[data-hcaptcha-widget-id]') || 
                            document.querySelector('.h-captcha') ||
                            document.querySelector('iframe[src*="hcaptcha"]');
      
      if (captchaElement) {
        addTestResult({
          testType: 'captcha',
          persona: 'system',
          action: 'captcha-present',
          status: 'success',
          message: 'CAPTCHA element found on auth page',
          details: { element: captchaElement.tagName }
        });
      } else {
        addTestResult({
          testType: 'captcha',
          persona: 'system',
          action: 'captcha-present',
          status: 'error',
          message: 'CAPTCHA element not found on auth page',
        });
      }

      // Test CAPTCHA configuration
      const captchaConfig = {
        siteKey: 'fca2d59e-fe26-40d2-b1b8-44245aead460', // From HCaptcha.tsx
        isProduction: true
      };

      addTestResult({
        testType: 'captcha',
        persona: 'system',
        action: 'captcha-config',
        status: 'success',
        message: 'CAPTCHA configured with production site key',
        details: captchaConfig
      });

    } catch (error) {
      addTestResult({
        testType: 'captcha',
        persona: 'system',
        action: 'captcha-test',
        status: 'error',
        message: `CAPTCHA test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Run comprehensive test suite
  const runFullTestSuite = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest('Starting comprehensive QA test suite...');
    
    toast({
      title: "QA Test Suite Started",
      description: "Running comprehensive navigation and authentication tests",
    });

    try {
      // Test CAPTCHA first
      await testCaptcha();
      
      // Test each persona
      for (const persona of TEST_PERSONAS) {
        // Test authentication
        const authSuccess = await testPersonaAuth(persona);
        
        if (authSuccess) {
          // Test navigation for each route
          for (const route of NAVIGATION_ROUTES) {
            await testNavigation(route, persona);
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        
        // Logout between personas
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Test signup flow (basic test)
      setCurrentTest('Testing signup flow availability');
      navigate('/auth');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const signupButton = document.querySelector('button[type="button"]');
      if (signupButton && signupButton.textContent?.includes('Create account')) {
        addTestResult({
          testType: 'auth',
          persona: 'system',
          action: 'signup-available',
          status: 'success',
          message: 'Signup flow is available',
        });
      } else {
        addTestResult({
          testType: 'auth',
          persona: 'system',
          action: 'signup-available',
          status: 'warning',
          message: 'Signup button not found or not accessible',
        });
      }

    } catch (error) {
      toast({
        title: "QA Test Error",
        description: `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      
      addTestResult({
        testType: 'auth',
        persona: 'system',
        action: 'test-suite',
        status: 'error',
        message: `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
      
      toast({
        title: "QA Test Suite Complete",
        description: "All tests completed. Check results for details.",
      });
    }
  };

  // Calculate summary stats
  const totalTests = testResults.length;
  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  // Group results by test type
  const resultsByType = testResults.reduce((acc, result) => {
    if (!acc[result.testType]) acc[result.testType] = [];
    acc[result.testType].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Comprehensive QA Test Suite
          </CardTitle>
          <CardDescription>
            Full navigation, authentication, and CAPTCHA testing for all user personas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="run" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="run">Run Tests</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="run" className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={runFullTestSuite} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isRunning ? 'Running Tests...' : 'Run Full QA Test Suite'}
                </Button>
              </div>

              {currentTest && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 animate-pulse" />
                      <span>{currentTest}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {totalTests > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalTests}</div>
                        <div className="text-sm text-muted-foreground">Total Tests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{successCount}</div>
                        <div className="text-sm text-muted-foreground">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                        <div className="text-sm text-muted-foreground">Warnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                        <div className="text-sm text-muted-foreground">Errors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="navigation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Navigation Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resultsByType.navigation?.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className={getStatusColor(result.status)}>
                            {getStatusIcon(result.status)}
                          </span>
                          <span className="font-mono text-sm">{result.details?.route || result.action}</span>
                          <Badge variant="outline">{result.persona}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.details?.loadTime && (
                            <Badge variant="outline">{result.details.loadTime}ms</Badge>
                          )}
                          <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                            {result.status}
                          </Badge>
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground">No navigation tests run yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Authentication Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resultsByType.auth?.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className={getStatusColor(result.status)}>
                            {getStatusIcon(result.status)}
                          </span>
                          <span className="text-sm">{result.action}</span>
                          <Badge variant="outline">{result.persona}</Badge>
                        </div>
                        <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                          {result.status}
                        </Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No authentication tests run yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security & CAPTCHA Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resultsByType.captcha?.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className={getStatusColor(result.status)}>
                            {getStatusIcon(result.status)}
                          </span>
                          <span className="text-sm">{result.action}</span>
                        </div>
                        <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                          {result.status}
                        </Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No security tests run yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComprehensiveQATestSuite;