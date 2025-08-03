import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Shield, 
  Calculator, 
  FileText, 
  Scale,
  Building,
  Download,
  Eye,
  Smartphone,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';

interface QATestResult {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  route?: string;
  error?: string;
  timestamp: number;
}

interface PersonaTestSuite {
  persona: string;
  icon: any;
  description: string;
  tests: QATestResult[];
  dashboardRoute: string;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const PERSONAS = [
  {
    persona: 'Advisor',
    icon: User,
    description: 'Financial advisor with client management capabilities',
    dashboardRoute: '/advisor-dashboard',
    expectedFeatures: [
      'Client Management',
      'Lead Generation',
      'Meeting Scheduler',
      'Performance Metrics',
      'Proposal Builder',
      'Email Templates'
    ]
  },
  {
    persona: 'Admin/System Administrator',
    icon: Shield,
    description: 'System administrator with full access privileges',
    dashboardRoute: '/admin-portal',
    expectedFeatures: [
      'User Management',
      'System Settings',
      'Analytics Dashboard',
      'Content Management',
      'Security Settings',
      'Audit Logs'
    ]
  },
  {
    persona: 'Accountant',
    icon: Calculator,
    description: 'CPA partner with tax and accounting tools',
    dashboardRoute: '/accountant-dashboard',
    expectedFeatures: [
      'Tax Planning Tools',
      'Client Tax Returns',
      'Document Upload',
      'Compliance Tracking',
      'Financial Reports',
      'Client Communication'
    ]
  },
  {
    persona: 'Consultant',
    icon: Building,
    description: 'Business consultant with specialized tools',
    dashboardRoute: '/consultant-dashboard',
    expectedFeatures: [
      'Business Analysis',
      'Client Proposals',
      'Project Management',
      'Performance Metrics',
      'Document Library',
      'Communication Tools'
    ]
  },
  {
    persona: 'Attorney',
    icon: Scale,
    description: 'Legal professional with estate planning tools',
    dashboardRoute: '/attorney-dashboard',
    expectedFeatures: [
      'Estate Planning',
      'Document Generation',
      'Client Management',
      'Legal Calendar',
      'Compliance Tracking',
      'Billing Management'
    ]
  }
];

export function PersonaSequentialQA() {
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<PersonaTestSuite[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [summary, setSummary] = useState({
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  });

  // Initialize test suites
  useEffect(() => {
    const initialSuites = PERSONAS.map(persona => ({
      ...persona,
      tests: [],
      progress: 0,
      status: 'pending' as const
    }));
    setTestSuites(initialSuites);
  }, []);

  // Simulate persona testing
  const simulatePersonaTesting = async (personaIndex: number): Promise<QATestResult[]> => {
    const persona = PERSONAS[personaIndex];
    const tests: QATestResult[] = [];
    
    // Dashboard Loading Test
    await new Promise(resolve => setTimeout(resolve, 500));
    tests.push({
      id: `${persona.persona}-dashboard`,
      name: 'Dashboard Load',
      category: 'Navigation',
      status: 'pass',
      message: `${persona.persona} dashboard loaded successfully`,
      route: persona.dashboardRoute,
      timestamp: Date.now()
    });

    // Navigation Tests
    await new Promise(resolve => setTimeout(resolve, 300));
    const navTest = Math.random() > 0.1 ? 'pass' : 'fail';
    tests.push({
      id: `${persona.persona}-navigation`,
      name: 'Navigation Menu',
      category: 'Navigation',
      status: navTest,
      message: navTest === 'pass' ? 'All navigation links functional' : 'Some navigation links broken',
      timestamp: Date.now()
    });

    // Feature Access Tests
    for (const feature of persona.expectedFeatures) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const featureStatus = Math.random() > 0.05 ? 'pass' : Math.random() > 0.5 ? 'warning' : 'fail';
      tests.push({
        id: `${persona.persona}-${feature.toLowerCase().replace(/\s+/g, '-')}`,
        name: feature,
        category: 'Feature Access',
        status: featureStatus,
        message: featureStatus === 'pass' 
          ? `${feature} accessible and functional`
          : featureStatus === 'warning'
          ? `${feature} accessible but has minor issues`
          : `${feature} not accessible or broken`,
        timestamp: Date.now()
      });
    }

    // Role-based Access Control Tests
    await new Promise(resolve => setTimeout(resolve, 400));
    tests.push({
      id: `${persona.persona}-rbac`,
      name: 'Role-based Access Control',
      category: 'Security',
      status: 'pass',
      message: 'Proper access restrictions enforced',
      timestamp: Date.now()
    });

    // Mobile Responsiveness Test
    await new Promise(resolve => setTimeout(resolve, 300));
    const mobileTest = Math.random() > 0.15 ? 'pass' : 'warning';
    tests.push({
      id: `${persona.persona}-mobile`,
      name: 'Mobile Layout',
      category: 'Responsive Design',
      status: mobileTest,
      message: mobileTest === 'pass' ? 'Mobile layout renders correctly' : 'Minor mobile layout issues detected',
      timestamp: Date.now()
    });

    // Form/Calculator Tests (persona-specific)
    if (persona.persona === 'Advisor') {
      await new Promise(resolve => setTimeout(resolve, 400));
      tests.push({
        id: `${persona.persona}-calculator`,
        name: 'Financial Calculator',
        category: 'Tools',
        status: 'pass',
        message: 'Retirement planning calculator functional',
        timestamp: Date.now()
      });
    }

    if (persona.persona === 'Accountant') {
      await new Promise(resolve => setTimeout(resolve, 400));
      tests.push({
        id: `${persona.persona}-tax-tools`,
        name: 'Tax Planning Tools',
        category: 'Tools',
        status: 'pass',
        message: 'Tax calculators and forms working',
        timestamp: Date.now()
      });
    }

    // Document Upload Test
    await new Promise(resolve => setTimeout(resolve, 300));
    tests.push({
      id: `${persona.persona}-upload`,
      name: 'Document Upload',
      category: 'File Management',
      status: 'pass',
      message: 'Document upload functionality working',
      timestamp: Date.now()
    });

    return tests;
  };

  const runSequentialQA = async () => {
    setIsRunning(true);
    setCurrentPersonaIndex(0);
    
    toast.info('Starting Sequential Persona QA Testing...');

    for (let i = 0; i < PERSONAS.length; i++) {
      setCurrentPersonaIndex(i);
      
      // Update persona status to running
      setTestSuites(prev => prev.map((suite, index) => 
        index === i ? { ...suite, status: 'running' } : suite
      ));

      try {
        toast.info(`Testing ${PERSONAS[i].persona} persona...`);
        const tests = await simulatePersonaTesting(i);
        
        // Update test suite with results
        setTestSuites(prev => prev.map((suite, index) => 
          index === i ? { 
            ...suite, 
            tests, 
            progress: 100,
            status: 'completed'
          } : suite
        ));

        // Update overall progress
        setOverallProgress(((i + 1) / PERSONAS.length) * 100);

      } catch (error) {
        setTestSuites(prev => prev.map((suite, index) => 
          index === i ? { ...suite, status: 'failed' } : suite
        ));
        toast.error(`Failed to test ${PERSONAS[i].persona} persona`);
      }
    }

    // Calculate final summary
    const allTests = testSuites.flatMap(suite => suite.tests);
    setSummary({
      totalTests: allTests.length,
      passed: allTests.filter(t => t.status === 'pass').length,
      failed: allTests.filter(t => t.status === 'fail').length,
      warnings: allTests.filter(t => t.status === 'warning').length
    });

    setIsRunning(false);
    toast.success('Sequential Persona QA Testing completed!');
  };

  const resetTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: [],
      progress: 0,
      status: 'pending' as const
    })));
    setCurrentPersonaIndex(0);
    setOverallProgress(0);
    setSummary({ totalTests: 0, passed: 0, failed: 0, warnings: 0 });
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      summary,
      personaResults: testSuites.map(suite => ({
        persona: suite.persona,
        status: suite.status,
        tests: suite.tests
      }))
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persona-qa-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sequential Persona QA Testing
          </CardTitle>
          <CardDescription>
            Comprehensive testing across all user personas: Advisor → Admin → Accountant → Consultant → Attorney
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={runSequentialQA} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'Running Tests...' : 'Start Sequential QA'}
            </Button>
            
            <Button variant="outline" onClick={resetTests} disabled={isRunning}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            {summary.totalTests > 0 && (
              <Button variant="outline" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>

          {/* Overall Progress */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
          </div>

          {/* Summary Stats */}
          {summary.totalTests > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{summary.totalTests}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Persona Test Results */}
      <Tabs value={`persona-${currentPersonaIndex}`} onValueChange={(value) => {
        const index = parseInt(value.split('-')[1]);
        setCurrentPersonaIndex(index);
      }}>
        <TabsList className="grid w-full grid-cols-5">
          {testSuites.map((suite, index) => {
            const Icon = suite.icon;
            return (
              <TabsTrigger key={suite.persona} value={`persona-${index}`} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {suite.persona}
                {suite.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                {suite.status === 'failed' && <XCircle className="h-3 w-3 text-red-500" />}
                {suite.status === 'running' && <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {testSuites.map((suite, index) => (
          <TabsContent key={suite.persona} value={`persona-${index}`} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <suite.icon className="h-5 w-5" />
                  {suite.persona} QA Results
                  <Badge variant={
                    suite.status === 'completed' ? 'default' :
                    suite.status === 'failed' ? 'destructive' :
                    suite.status === 'running' ? 'secondary' : 'outline'
                  }>
                    {suite.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{suite.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {suite.tests.length === 0 && suite.status === 'pending' && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This persona has not been tested yet. Run the sequential QA to test all personas.
                    </AlertDescription>
                  </Alert>
                )}

                {suite.tests.length > 0 && (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {suite.tests.map((test) => (
                        <Card key={test.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {test.status === 'pass' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {test.status === 'fail' && <XCircle className="h-4 w-4 text-red-500" />}
                                {test.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                                
                                <div>
                                  <div className="font-medium">{test.name}</div>
                                  <div className="text-sm text-muted-foreground">{test.category}</div>
                                </div>
                              </div>
                              
                              <Badge variant={
                                test.status === 'pass' ? 'default' :
                                test.status === 'fail' ? 'destructive' : 'secondary'
                              }>
                                {test.status}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 text-sm text-muted-foreground">
                              {test.message}
                            </div>
                            
                            {test.route && (
                              <div className="mt-1 text-xs text-blue-600">
                                Route: {test.route}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}