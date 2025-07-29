import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Users,
  CreditCard,
  Navigation,
  Shield,
  Target,
  Monitor,
  RefreshCw,
  FileText,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface CriticalFlow {
  id: string;
  name: string;
  category: 'onboarding' | 'payment' | 'dashboard' | 'auth' | 'navigation';
  description: string;
  steps: FlowStep[];
  personas: string[];
  priority: 'critical' | 'high' | 'medium';
  estimatedDuration: number; // minutes
  lastTested: string;
  status: 'not-started' | 'running' | 'passed' | 'failed' | 'partial';
  successRate: number;
  issues: string[];
}

interface FlowStep {
  id: string;
  action: string;
  expectedResult: string;
  route?: string;
  component?: string;
  validationCriteria: string[];
}

interface DemoScenario {
  id: string;
  persona: string;
  role: string;
  tier: string;
  scenario: string;
  duration: number; // minutes
  steps: string[];
  criticalPaths: string[];
  status: 'not-started' | 'running' | 'completed' | 'failed';
  completionRate: number;
  lastRun: string;
}

export function RegressionTestRunner() {
  const [criticalFlows, setCriticalFlows] = useState<CriticalFlow[]>([
    {
      id: 'FLOW-001',
      name: 'User Registration & Onboarding',
      category: 'onboarding',
      description: 'Complete user registration flow from signup to dashboard access',
      steps: [
        {
          id: 'STEP-001',
          action: 'Navigate to registration page',
          expectedResult: 'Registration form loads successfully',
          route: '/auth',
          validationCriteria: ['Form visible', 'No console errors', 'All fields present']
        },
        {
          id: 'STEP-002',
          action: 'Fill registration form with valid data',
          expectedResult: 'Form validation passes',
          validationCriteria: ['No validation errors', 'Submit button enabled']
        },
        {
          id: 'STEP-003',
          action: 'Submit registration',
          expectedResult: 'Account created successfully',
          validationCriteria: ['Success message shown', 'Redirect to dashboard']
        },
        {
          id: 'STEP-004',
          action: 'Complete profile setup',
          expectedResult: 'Profile information saved',
          validationCriteria: ['Profile data persisted', 'Role assigned correctly']
        },
        {
          id: 'STEP-005',
          action: 'Access appropriate dashboard',
          expectedResult: 'Dashboard loads with correct content',
          validationCriteria: ['Role-specific widgets', 'Navigation appropriate', 'No access errors']
        }
      ],
      personas: ['Client Basic', 'Client Premium', 'Advisor', 'Accountant'],
      priority: 'critical',
      estimatedDuration: 8,
      lastTested: '2024-01-28',
      status: 'passed',
      successRate: 95,
      issues: ['Minor styling issue on mobile']
    },
    {
      id: 'FLOW-002',
      name: 'Premium Subscription & Payment',
      category: 'payment',
      description: 'Upgrade from basic to premium subscription with payment processing',
      steps: [
        {
          id: 'STEP-006',
          action: 'Navigate to subscription settings',
          expectedResult: 'Subscription page loads',
          route: '/settings/subscription',
          validationCriteria: ['Current plan shown', 'Upgrade options visible']
        },
        {
          id: 'STEP-007',
          action: 'Select premium plan',
          expectedResult: 'Premium plan details displayed',
          validationCriteria: ['Pricing shown', 'Features listed', 'Payment form available']
        },
        {
          id: 'STEP-008',
          action: 'Enter payment information',
          expectedResult: 'Payment form validation works',
          validationCriteria: ['Card validation', 'Billing address required']
        },
        {
          id: 'STEP-009',
          action: 'Process payment',
          expectedResult: 'Payment succeeds and plan upgraded',
          validationCriteria: ['Payment confirmed', 'Plan status updated', 'Features unlocked']
        },
        {
          id: 'STEP-010',
          action: 'Verify premium features access',
          expectedResult: 'Premium features are accessible',
          validationCriteria: ['Advanced features visible', 'Gating removed', 'Tier updated']
        }
      ],
      personas: ['Client Basic'],
      priority: 'critical',
      estimatedDuration: 12,
      lastTested: '2024-01-27',
      status: 'partial',
      successRate: 80,
      issues: ['Payment gateway timeout on step 9', 'Feature gating delay']
    },
    {
      id: 'FLOW-003',
      name: 'Dashboard Core Navigation',
      category: 'dashboard',
      description: 'Test primary dashboard navigation and core functionality',
      steps: [
        {
          id: 'STEP-011',
          action: 'Login with valid credentials',
          expectedResult: 'Successful authentication and dashboard load',
          route: '/auth',
          validationCriteria: ['Authentication success', 'Correct dashboard', 'User session active']
        },
        {
          id: 'STEP-012',
          action: 'Navigate through main menu items',
          expectedResult: 'All navigation links work correctly',
          validationCriteria: ['No broken links', 'Correct routing', 'Role-appropriate access']
        },
        {
          id: 'STEP-013',
          action: 'Test core widgets and cards',
          expectedResult: 'All dashboard components load and function',
          validationCriteria: ['Data loads', 'Interactions work', 'No errors']
        },
        {
          id: 'STEP-014',
          action: 'Test search and filtering',
          expectedResult: 'Search functionality works across modules',
          validationCriteria: ['Search results accurate', 'Filters apply correctly']
        },
        {
          id: 'STEP-015',
          action: 'Test responsive design',
          expectedResult: 'Dashboard works on mobile and tablet',
          validationCriteria: ['Mobile responsive', 'Touch interactions', 'Readable on small screens']
        }
      ],
      personas: ['All'],
      priority: 'critical',
      estimatedDuration: 10,
      lastTested: '2024-01-29',
      status: 'passed',
      successRate: 98,
      issues: []
    },
    {
      id: 'FLOW-004',
      name: 'Role-Based Access Control',
      category: 'auth',
      description: 'Verify proper access control across different user roles',
      steps: [
        {
          id: 'STEP-016',
          action: 'Login as basic client',
          expectedResult: 'Basic client dashboard and features available',
          validationCriteria: ['Basic features only', 'Premium features gated', 'Upgrade prompts shown']
        },
        {
          id: 'STEP-017',
          action: 'Attempt to access premium features',
          expectedResult: 'Access denied or upgrade prompt shown',
          validationCriteria: ['Access blocked', 'Clear messaging', 'Upgrade path offered']
        },
        {
          id: 'STEP-018',
          action: 'Login as advisor',
          expectedResult: 'Advisor-specific features and client management available',
          validationCriteria: ['Client list visible', 'Advisor tools accessible', 'Client data secured']
        },
        {
          id: 'STEP-019',
          action: 'Test admin access controls',
          expectedResult: 'Admin features accessible only to admin users',
          validationCriteria: ['Admin dashboard available', 'User management accessible', 'System settings visible']
        }
      ],
      personas: ['Client Basic', 'Client Premium', 'Advisor', 'Admin'],
      priority: 'critical',
      estimatedDuration: 15,
      lastTested: '2024-01-28',
      status: 'failed',
      successRate: 70,
      issues: ['Admin wildcard routes showing ComingSoonPage', 'Premium tier detection inconsistent']
    },
    {
      id: 'FLOW-005',
      name: 'Professional Workflow Integration',
      category: 'navigation',
      description: 'Test workflow integration for professional roles',
      steps: [
        {
          id: 'STEP-020',
          action: 'Login as professional (advisor/accountant/attorney)',
          expectedResult: 'Professional dashboard loads with role-specific tools',
          validationCriteria: ['Professional tools visible', 'Client management available']
        },
        {
          id: 'STEP-021',
          action: 'Access client portfolio/case management',
          expectedResult: 'Client data and tools accessible',
          validationCriteria: ['Client list loads', 'Case management tools work']
        },
        {
          id: 'STEP-022',
          action: 'Test professional-specific features',
          expectedResult: 'Role-appropriate features function correctly',
          validationCriteria: ['Tax tools (accountant)', 'Legal documents (attorney)', 'Investment tools (advisor)']
        }
      ],
      personas: ['Advisor', 'Accountant', 'Attorney', 'Consultant'],
      priority: 'high',
      estimatedDuration: 12,
      lastTested: '2024-01-27',
      status: 'passed',
      successRate: 90,
      issues: ['Minor UX inconsistency in consultant lending access']
    }
  ]);

  const [demoScenarios, setDemoScenarios] = useState<DemoScenario[]>([
    {
      id: 'DEMO-001',
      persona: 'Client Basic',
      role: 'client',
      tier: 'basic',
      scenario: 'New client explores platform and considers upgrade',
      duration: 15,
      steps: [
        'Register new account',
        'Complete basic profile setup',
        'Explore dashboard and basic features',
        'Attempt to access premium feature (should be gated)',
        'View upgrade options and pricing',
        'Test mobile responsiveness',
        'Access help and support resources'
      ],
      criticalPaths: ['Registration', 'Dashboard Navigation', 'Feature Gating', 'Upgrade Flow'],
      status: 'completed',
      completionRate: 100,
      lastRun: '2024-01-29'
    },
    {
      id: 'DEMO-002',
      persona: 'Client Premium',
      role: 'client_premium',
      tier: 'premium',
      scenario: 'Premium client uses advanced features and manages wealth',
      duration: 20,
      steps: [
        'Login to premium account',
        'Access advanced analytics dashboard',
        'Use premium investment tools',
        'Test advanced reporting features',
        'Access premium support channels',
        'Manage subscription settings',
        'Test all premium-gated features'
      ],
      criticalPaths: ['Authentication', 'Premium Features', 'Advanced Tools', 'Subscription Management'],
      status: 'completed',
      completionRate: 95,
      lastRun: '2024-01-29'
    },
    {
      id: 'DEMO-003',
      persona: 'Financial Advisor',
      role: 'advisor',
      tier: 'elite',
      scenario: 'Advisor manages multiple clients and uses professional tools',
      duration: 25,
      steps: [
        'Login to advisor dashboard',
        'Review client portfolio overview',
        'Access individual client accounts',
        'Use advisor-specific analysis tools',
        'Generate client reports',
        'Test client communication features',
        'Manage advisor profile and credentials'
      ],
      criticalPaths: ['Advisor Dashboard', 'Client Management', 'Professional Tools', 'Reporting'],
      status: 'running',
      completionRate: 60,
      lastRun: '2024-01-29'
    },
    {
      id: 'DEMO-004',
      persona: 'Accountant/CPA',
      role: 'accountant',
      tier: 'premium',
      scenario: 'CPA uses tax planning and financial analysis tools',
      duration: 18,
      steps: [
        'Login to accountant dashboard',
        'Access tax planning tools',
        'Review client financial data',
        'Use advanced calculators and analysis',
        'Generate tax planning reports',
        'Test compliance and audit features',
        'Manage client collaboration tools'
      ],
      criticalPaths: ['Tax Tools', 'Client Data Access', 'Compliance Features', 'Reporting'],
      status: 'not-started',
      completionRate: 0,
      lastRun: 'Never'
    },
    {
      id: 'DEMO-005',
      persona: 'Attorney',
      role: 'attorney',
      tier: 'premium',
      scenario: 'Estate planning attorney uses legal document and planning tools',
      duration: 20,
      steps: [
        'Login to attorney dashboard',
        'Access estate planning tools',
        'Review client estate documents',
        'Use legal document templates',
        'Generate estate planning reports',
        'Test legal compliance features',
        'Manage client legal documentation'
      ],
      criticalPaths: ['Legal Tools', 'Document Management', 'Estate Planning', 'Compliance'],
      status: 'completed',
      completionRate: 100,
      lastRun: '2024-01-28'
    },
    {
      id: 'DEMO-006',
      persona: 'Business Consultant',
      role: 'consultant',
      tier: 'premium',
      scenario: 'Consultant uses business analysis and advisory tools',
      duration: 17,
      steps: [
        'Login to consultant dashboard',
        'Access business analysis tools',
        'Review client business metrics',
        'Use strategic planning features',
        'Generate business advisory reports',
        'Test lending and credit analysis',
        'Manage consultant client relationships'
      ],
      criticalPaths: ['Business Tools', 'Analytics', 'Lending Features', 'Client Management'],
      status: 'failed',
      completionRate: 75,
      lastRun: '2024-01-28'
    },
    {
      id: 'DEMO-007',
      persona: 'System Administrator',
      role: 'admin',
      tier: 'elite',
      scenario: 'Admin manages platform, users, and system configuration',
      duration: 30,
      steps: [
        'Login to admin dashboard',
        'Review system health and metrics',
        'Manage user accounts and roles',
        'Configure platform settings',
        'Test security and access controls',
        'Review audit logs and compliance',
        'Manage tenant and organization settings'
      ],
      criticalPaths: ['Admin Dashboard', 'User Management', 'Security Controls', 'System Configuration'],
      status: 'failed',
      completionRate: 40,
      lastRun: '2024-01-27'
    }
  ]);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const runFlow = async (flowId: string) => {
    setIsRunningTests(true);
    setActiveTest(flowId);
    
    // Simulate test execution
    setCriticalFlows(prev => prev.map(flow => 
      flow.id === flowId ? { ...flow, status: 'running' } : flow
    ));

    // Simulate test duration
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate test completion
    const success = Math.random() > 0.2; // 80% success rate
    setCriticalFlows(prev => prev.map(flow => 
      flow.id === flowId ? { 
        ...flow, 
        status: success ? 'passed' : 'failed',
        lastTested: new Date().toISOString().split('T')[0],
        successRate: success ? 95 : 65
      } : flow
    ));

    setIsRunningTests(false);
    setActiveTest(null);
    
    toast.success(`Flow ${flowId} completed: ${success ? 'PASSED' : 'FAILED'}`);
  };

  const runDemoScenario = async (scenarioId: string) => {
    setIsRunningTests(true);
    setActiveTest(scenarioId);
    
    setDemoScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId ? { ...scenario, status: 'running' } : scenario
    ));

    // Simulate demo execution
    await new Promise(resolve => setTimeout(resolve, 4000));

    const success = Math.random() > 0.15; // 85% success rate
    setDemoScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId ? { 
        ...scenario, 
        status: success ? 'completed' : 'failed',
        completionRate: success ? 100 : Math.floor(Math.random() * 50 + 50),
        lastRun: new Date().toISOString().split('T')[0]
      } : scenario
    ));

    setIsRunningTests(false);
    setActiveTest(null);
    
    toast.success(`Demo ${scenarioId} completed: ${success ? 'SUCCESS' : 'FAILED'}`);
  };

  const runAllCriticalFlows = async () => {
    setIsRunningTests(true);
    toast.info('Running all critical flows... This may take several minutes.');
    
    for (const flow of criticalFlows) {
      await runFlow(flow.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause between tests
    }
    
    setIsRunningTests(false);
    toast.success('All critical flows completed!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding': return <Users className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'dashboard': return <Monitor className="h-4 w-4" />;
      case 'auth': return <Shield className="h-4 w-4" />;
      default: return <Navigation className="h-4 w-4" />;
    }
  };

  const getOverallStats = () => {
    const totalFlows = criticalFlows.length;
    const passedFlows = criticalFlows.filter(f => f.status === 'passed').length;
    const failedFlows = criticalFlows.filter(f => f.status === 'failed').length;
    
    const totalScenarios = demoScenarios.length;
    const completedScenarios = demoScenarios.filter(s => s.status === 'completed').length;
    const failedScenarios = demoScenarios.filter(s => s.status === 'failed').length;
    
    return {
      flows: { total: totalFlows, passed: passedFlows, failed: failedFlows },
      scenarios: { total: totalScenarios, completed: completedScenarios, failed: failedScenarios },
      overallHealth: Math.round(((passedFlows + completedScenarios) / (totalFlows + totalScenarios)) * 100)
    };
  };

  const stats = getOverallStats();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Regression Test Runner</h1>
            <p className="text-muted-foreground">
              Critical flow testing and persona demo scenarios
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={runAllCriticalFlows}
              disabled={isRunningTests}
              className="flex items-center gap-2"
            >
              {isRunningTests ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run All Tests
            </Button>
            <Badge variant="outline" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {stats.overallHealth}% Health
            </Badge>
          </div>
        </div>

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Flows</p>
                <p className="text-2xl font-bold">{stats.flows.passed}/{stats.flows.total}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Demo Scenarios</p>
                <p className="text-2xl font-bold">{stats.scenarios.completed}/{stats.scenarios.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Tests</p>
                <p className="text-2xl font-bold text-red-600">{stats.flows.failed + stats.scenarios.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Health</p>
                <p className="text-2xl font-bold text-green-600">{stats.overallHealth}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="critical-flows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="critical-flows">Critical Flows</TabsTrigger>
            <TabsTrigger value="demo-scenarios">Demo Scenarios</TabsTrigger>
            <TabsTrigger value="test-results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="critical-flows">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Critical Flow Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalFlows.map((flow) => (
                    <Card key={flow.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(flow.status)}
                              {getCategoryIcon(flow.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{flow.name}</span>
                                <Badge variant={flow.priority === 'critical' ? 'destructive' : 'secondary'}>
                                  {flow.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {flow.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{flow.description}</p>
                              <div className="text-xs text-muted-foreground mb-3">
                                <strong>Duration:</strong> {flow.estimatedDuration}min • 
                                <strong> Personas:</strong> {flow.personas.join(', ')} • 
                                <strong> Success Rate:</strong> {flow.successRate}%
                              </div>
                              <div className="mb-2">
                                <div className="text-xs font-medium mb-1">Test Steps:</div>
                                <div className="grid md:grid-cols-2 gap-1 text-xs">
                                  {flow.steps.slice(0, 4).map((step, index) => (
                                    <div key={step.id} className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>{index + 1}. {step.action}</span>
                                    </div>
                                  ))}
                                  {flow.steps.length > 4 && (
                                    <div className="text-muted-foreground">+{flow.steps.length - 4} more steps</div>
                                  )}
                                </div>
                              </div>
                              {flow.issues.length > 0 && (
                                <Alert>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Issues:</strong> {flow.issues.join(', ')}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="text-right text-xs text-muted-foreground">
                              Last tested: {flow.lastTested}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => runFlow(flow.id)}
                              disabled={isRunningTests}
                              className="flex items-center gap-1"
                            >
                              {activeTest === flow.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                              {activeTest === flow.id ? 'Testing...' : 'Run Test'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo-scenarios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Persona Demo Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoScenarios.map((scenario) => (
                    <Card key={scenario.id} className="border-l-4 border-l-secondary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(scenario.status)}
                              <Users className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{scenario.persona}</span>
                                <Badge variant="outline">{scenario.role}</Badge>
                                <Badge variant="secondary">{scenario.tier}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{scenario.scenario}</p>
                              <div className="text-xs text-muted-foreground mb-3">
                                <strong>Duration:</strong> {scenario.duration}min • 
                                <strong> Completion:</strong> {scenario.completionRate}% • 
                                <strong> Last Run:</strong> {scenario.lastRun}
                              </div>
                              <div className="mb-2">
                                <Progress value={scenario.completionRate} className="mb-2" />
                                <div className="text-xs font-medium mb-1">Critical Paths:</div>
                                <div className="flex flex-wrap gap-1">
                                  {scenario.criticalPaths.map((path) => (
                                    <Badge key={path} variant="outline" className="text-xs">
                                      {path}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="text-right text-xs text-muted-foreground">
                              {scenario.steps.length} steps
                            </div>
                            <Button
                              size="sm"
                              onClick={() => runDemoScenario(scenario.id)}
                              disabled={isRunningTests}
                              className="flex items-center gap-1"
                            >
                              {activeTest === scenario.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                              {activeTest === scenario.id ? 'Running...' : 'Run Demo'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-results">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Results Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Critical Flow Results</h4>
                      <div className="space-y-2">
                        {criticalFlows.map((flow) => (
                          <div key={flow.id} className="flex items-center justify-between text-sm">
                            <span>{flow.name}</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(flow.status)}
                              <span className="text-muted-foreground">{flow.successRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Demo Scenario Results</h4>
                      <div className="space-y-2">
                        {demoScenarios.map((scenario) => (
                          <div key={scenario.id} className="flex items-center justify-between text-sm">
                            <span>{scenario.persona}</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(scenario.status)}
                              <span className="text-muted-foreground">{scenario.completionRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link to="/qa/analytics">
                      <Button variant="outline" className="w-full justify-start">
                        <Monitor className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </Link>
                    <Link to="/qa/issues">
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Issue Tracker
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        const failedTests = criticalFlows.filter(f => f.status === 'failed').length + 
                                          demoScenarios.filter(s => s.status === 'failed').length;
                        if (failedTests === 0) {
                          toast.success('🎉 All regression tests passed! Ready for production.');
                        } else {
                          toast.warning(`${failedTests} tests failed. Review and fix before launch.`);
                        }
                      }}
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}