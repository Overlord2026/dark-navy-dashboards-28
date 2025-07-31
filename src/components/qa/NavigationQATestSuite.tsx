import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, XCircle, Play, User, Shield, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface QATestResult {
  id: string;
  route: string;
  persona: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  timestamp: number;
  loadTime?: number;
  hasContent?: boolean;
  navigationWorks?: boolean;
}

interface PersonaCredentials {
  email: string;
  password: string;
  role: string;
  name: string;
}

const DEFAULT_PERSONAS: PersonaCredentials[] = [
  { email: 'client@test.com', password: 'password123', role: 'client', name: 'Test Client' },
  { email: 'advisor@test.com', password: 'password123', role: 'advisor', name: 'Test Advisor' },
  { email: 'accountant@test.com', password: 'password123', role: 'accountant', name: 'Test Accountant' },
  { email: 'consultant@test.com', password: 'password123', role: 'consultant', name: 'Test Consultant' },
  { email: 'attorney@test.com', password: 'password123', role: 'attorney', name: 'Test Attorney' },
  { email: 'admin@test.com', password: 'password123', role: 'admin', name: 'Test Admin' },
];

const NAVIGATION_ROUTES = [
  // Core routes
  { path: '/', name: 'Home' },
  { path: '/client-dashboard', name: 'Client Dashboard' },
  { path: '/advisor-dashboard', name: 'Advisor Dashboard' },
  { path: '/admin-dashboard', name: 'Admin Dashboard' },
  
  // Client routes
  { path: '/portfolio', name: 'Portfolio' },
  { path: '/cash-management', name: 'Cash Management' },
  { path: '/banking', name: 'Banking' },
  { path: '/cards', name: 'Credit Cards' },
  { path: '/investments', name: 'Investments' },
  { path: '/financial-plans', name: 'Financial Plans' },
  { path: '/transfers', name: 'Transfers' },
  { path: '/documents', name: 'Documents' },
  { path: '/insurance', name: 'Insurance' },
  { path: '/estate-planning', name: 'Estate Planning' },
  { path: '/profile', name: 'Profile' },
  { path: '/settings', name: 'Settings' },
  
  // Advisor routes
  { path: '/clients', name: 'Client Management' },
  { path: '/leads', name: 'Lead Management' },
  { path: '/reports', name: 'Reports' },
  { path: '/compliance', name: 'Compliance' },
  
  // Business routes
  { path: '/projects', name: 'Projects' },
  { path: '/calendar', name: 'Calendar' },
  { path: '/collaboration', name: 'Collaboration' },
  { path: '/professional-compliance', name: 'Professional Compliance' },
  
  // Healthcare
  { path: '/healthcare', name: 'Healthcare' },
  { path: '/healthcare/documents', name: 'Healthcare Documents' },
  { path: '/healthcare/medications', name: 'Medications' },
  { path: '/healthcare/providers', name: 'Healthcare Providers' },
  
  // Admin routes
  { path: '/admin', name: 'Admin Panel' },
  { path: '/navigation-diagnostics', name: 'Navigation Diagnostics' },
  { path: '/auth-test', name: 'Auth Test' },
];

export function NavigationQATestSuite() {
  const [testResults, setTestResults] = useState<QATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaCredentials | null>(null);
  const [personas, setPersonas] = useState<PersonaCredentials[]>(DEFAULT_PERSONAS);
  const [selectedPersona, setSelectedPersona] = useState(0);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [authResults, setAuthResults] = useState<Record<string, any>>({});
  
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const testPersonaAuthentication = async (persona: PersonaCredentials): Promise<boolean> => {
    try {
      console.log(`Testing authentication for ${persona.name} (${persona.email})`);
      
      // First, ensure we're logged out
      await supabase.auth.signOut();
      
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: persona.email,
        password: persona.password,
      });

      if (error) {
        console.error(`Auth failed for ${persona.name}:`, error.message);
        setAuthResults(prev => ({
          ...prev,
          [persona.role]: { success: false, error: error.message }
        }));
        return false;
      }

      console.log(`Auth successful for ${persona.name}`);
      setAuthResults(prev => ({
        ...prev,
        [persona.role]: { success: true, user: data.user }
      }));
      
      return true;
    } catch (error) {
      console.error(`Auth error for ${persona.name}:`, error);
      setAuthResults(prev => ({
        ...prev,
        [persona.role]: { success: false, error: 'Authentication failed' }
      }));
      return false;
    }
  };

  const testRoute = async (route: typeof NAVIGATION_ROUTES[0], persona: PersonaCredentials): Promise<QATestResult> => {
    const startTime = performance.now();
    
    try {
      // Navigate to the route
      navigate(route.path);
      
      // Wait a bit for the route to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loadTime = performance.now() - startTime;
      
      // Check if we're on the expected route
      const currentPath = window.location.pathname;
      const isCorrectRoute = currentPath === route.path || currentPath.startsWith(route.path);
      
      // Check for common error indicators
      const hasErrorIndicators = document.querySelector('.error') || 
                                document.querySelector('[data-testid="error"]') ||
                                document.title.includes('404') ||
                                document.title.includes('Error');

      // Check if page has content
      const hasContent = document.body.textContent && document.body.textContent.trim().length > 100;
      
      const status = hasErrorIndicators ? 'error' : 
                    !isCorrectRoute ? 'warning' :
                    !hasContent ? 'warning' : 'success';
      
      const message = hasErrorIndicators ? 'Page contains error indicators' :
                     !isCorrectRoute ? `Redirected to ${currentPath} instead of ${route.path}` :
                     !hasContent ? 'Page appears to have minimal content' :
                     `Page loaded successfully (${Math.round(loadTime)}ms)`;

      return {
        id: `${persona.role}-${route.path}`,
        route: route.path,
        persona: persona.role,
        status,
        message,
        timestamp: Date.now(),
        loadTime: Math.round(loadTime),
        hasContent,
        navigationWorks: isCorrectRoute
      };
    } catch (error) {
      return {
        id: `${persona.role}-${route.path}`,
        route: route.path,
        persona: persona.role,
        status: 'error',
        message: `Navigation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
        loadTime: performance.now() - startTime,
        hasContent: false,
        navigationWorks: false
      };
    }
  };

  const runFullQATest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    toast({
      title: "QA Test Started",
      description: "Running comprehensive navigation tests for all personas",
    });

    try {
      for (const persona of personas) {
        setCurrentPersona(persona);
        
        // Test authentication for this persona
        const authSuccess = await testPersonaAuthentication(persona);
        
        if (!authSuccess) {
          // Add failed auth result
          const authResult: QATestResult = {
            id: `${persona.role}-auth`,
            route: '/auth',
            persona: persona.role,
            status: 'error',
            message: `Authentication failed for ${persona.name}`,
            timestamp: Date.now(),
            hasContent: false,
            navigationWorks: false
          };
          setTestResults(prev => [...prev, authResult]);
          continue;
        }

        // Test each route for this persona
        for (const route of NAVIGATION_ROUTES) {
          try {
            const result = await testRoute(route, persona);
            setTestResults(prev => [...prev, result]);
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`Error testing ${route.path} for ${persona.role}:`, error);
          }
        }
        
        // Logout before testing next persona
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      toast({
        title: "QA Test Error", 
        description: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setCurrentPersona(null);
      
      toast({
        title: "QA Test Complete",
        description: "Navigation testing finished for all personas",
      });
    }
  };

  const testSinglePersona = async () => {
    if (selectedPersona >= personas.length) return;
    
    const persona = personas[selectedPersona];
    setIsRunning(true);
    setCurrentPersona(persona);
    
    // Clear previous results for this persona
    setTestResults(prev => prev.filter(r => r.persona !== persona.role));
    
    try {
      const authSuccess = await testPersonaAuthentication(persona);
      
      if (authSuccess) {
        for (const route of NAVIGATION_ROUTES) {
          const result = await testRoute(route, persona);
          setTestResults(prev => [...prev, result]);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    } finally {
      setIsRunning(false);
      setCurrentPersona(null);
    }
  };

  const addCustomPersona = () => {
    if (!customEmail || !customPassword) {
      toast({
        title: "Error",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    const newPersona: PersonaCredentials = {
      email: customEmail,
      password: customPassword,
      role: customEmail.split('@')[0],
      name: `Custom ${customEmail.split('@')[0]}`
    };

    setPersonas([...personas, newPersona]);
    setCustomEmail('');
    setCustomPassword('');
    
    toast({
      title: "Persona Added",
      description: `Added ${newPersona.name} to test suite`,
    });
  };

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

  // Group results by persona
  const resultsByPersona = testResults.reduce((acc, result) => {
    if (!acc[result.persona]) acc[result.persona] = [];
    acc[result.persona].push(result);
    return acc;
  }, {} as Record<string, QATestResult[]>);

  // Calculate summary stats
  const totalTests = testResults.length;
  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Navigation QA Test Suite
          </CardTitle>
          <CardDescription>
            Comprehensive testing of navigation and authentication for all user personas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="test">Run Tests</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="auth">Auth Status</TabsTrigger>
            </TabsList>

            <TabsContent value="test" className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={runFullQATest} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isRunning ? 'Running Full Test...' : 'Run Full QA Test'}
                </Button>
                
                <Button 
                  onClick={testSinglePersona} 
                  disabled={isRunning}
                  variant="outline"
                >
                  Test Selected Persona
                </Button>
              </div>

              {currentPersona && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Currently testing: <strong>{currentPersona.name}</strong></span>
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

            <TabsContent value="results" className="space-y-4">
              {Object.entries(resultsByPersona).map(([persona, results]) => (
                <Card key={persona}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {persona.charAt(0).toUpperCase() + persona.slice(1)} Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <span className={getStatusColor(result.status)}>
                              {getStatusIcon(result.status)}
                            </span>
                            <span className="font-mono text-sm">{result.route}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.loadTime && (
                              <Badge variant="outline">{result.loadTime}ms</Badge>
                            )}
                            <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                              {result.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="personas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test Personas</CardTitle>
                  <CardDescription>
                    Manage user personas for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {personas.map((persona, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{persona.name}</div>
                          <div className="text-sm text-muted-foreground">{persona.email}</div>
                        </div>
                        <Badge>{persona.role}</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Add Custom Persona</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="custom-email">Email</Label>
                        <Input
                          id="custom-email"
                          type="email"
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          placeholder="test@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="custom-password">Password</Label>
                        <Input
                          id="custom-password"
                          type="password"
                          value={customPassword}
                          onChange={(e) => setCustomPassword(e.target.value)}
                          placeholder="password"
                        />
                      </div>
                    </div>
                    <Button onClick={addCustomPersona} className="mt-2">
                      Add Persona
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Status</CardTitle>
                  <CardDescription>
                    Current authentication status for each persona
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(authResults).map(([role, result]) => (
                      <div key={role} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <Badge className="bg-green-100 text-green-800">Authenticated</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                          {result.error && (
                            <span className="text-sm text-red-600">{result.error}</span>
                          )}
                        </div>
                      </div>
                    ))}
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

export default NavigationQATestSuite;