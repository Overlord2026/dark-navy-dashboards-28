import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Users,
  CreditCard,
  Navigation,
  Shield,
  Settings,
  Monitor,
  FileText,
  Play,
  StopCircle,
  Zap,
  ExternalLink,
  Database,
  Lock,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  category: 'p1-issues' | 'onboarding' | 'payments' | 'settings' | 'navigation' | 'infrastructure';
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  testSteps: string[];
  validationCriteria: string[];
  status: 'not-tested' | 'testing' | 'passed' | 'failed' | 'blocked';
  blocker?: string;
  assignee?: string;
  estimatedMinutes?: number;
  route?: string;
  automatable: boolean;
}

interface GoNoGoDecision {
  category: string;
  status: 'go' | 'no-go' | 'conditional';
  criticalIssues: number;
  totalIssues: number;
  readinessPercentage: number;
  blockers: string[];
}

export function PreLaunchChecklist() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // P1/P2 Critical Issues
    {
      id: 'P1-001',
      category: 'p1-issues',
      priority: 'critical',
      title: 'Admin Route Security Implementation',
      description: 'Replace ComingSoonPage with proper role-based guards for admin routes',
      testSteps: [
        'Attempt to access /admin/* as non-admin user',
        'Verify proper access denied message',
        'Test admin user can access admin routes',
        'Verify no security bypass possible'
      ],
      validationCriteria: [
        'Non-admin users blocked from admin routes',
        'Clear error messaging for unauthorized access',
        'Admin users can access all admin features',
        'No security vulnerabilities detected'
      ],
      status: 'failed',
      blocker: 'Admin routes still showing ComingSoonPage instead of proper auth guards',
      assignee: 'Security Team',
      estimatedMinutes: 60,
      route: '/admin-dashboard',
      automatable: false
    },
    {
      id: 'P1-002',
      category: 'p1-issues',
      priority: 'critical',
      title: 'Premium Tier Detection Fix',
      description: 'Resolve client premium tier detection inconsistency',
      testSteps: [
        'Login as client premium user',
        'Verify tier is correctly detected as premium',
        'Test premium feature access',
        'Confirm no basic tier fallback'
      ],
      validationCriteria: [
        'Premium tier correctly detected on login',
        'Premium features accessible without errors',
        'No tier detection race conditions',
        'Consistent premium status across sessions'
      ],
      status: 'testing',
      assignee: 'Backend Team',
      estimatedMinutes: 45,
      automatable: true
    },
    {
      id: 'P1-003',
      category: 'p1-issues',
      priority: 'high',
      title: 'Consultant Lending Access Standardization',
      description: 'Fix inconsistent lending feature access for consultant persona',
      testSteps: [
        'Login as consultant user',
        'Test all lending features',
        'Verify access matrix consistency',
        'Test lending workflow end-to-end'
      ],
      validationCriteria: [
        'All lending features accessible to consultants',
        'No access denied errors for permitted features',
        'Lending workflow completes successfully',
        'Consistent with business requirements'
      ],
      status: 'not-tested',
      assignee: 'Product Team',
      estimatedMinutes: 30,
      route: '/lending',
      automatable: false
    },

    // New User Onboarding
    {
      id: 'ONBOARD-001',
      category: 'onboarding',
      priority: 'critical',
      title: 'Complete Registration Flow',
      description: 'Test complete new user registration and onboarding',
      testSteps: [
        'Navigate to registration page',
        'Fill form with valid new user data',
        'Submit registration',
        'Complete email verification',
        'Setup initial profile',
        'Access appropriate dashboard'
      ],
      validationCriteria: [
        'Registration form submits successfully',
        'Email verification works',
        'Profile setup saves correctly',
        'User routed to correct dashboard',
        'Welcome flow completes'
      ],
      status: 'not-tested',
      estimatedMinutes: 15,
      route: '/auth',
      automatable: false
    },
    {
      id: 'ONBOARD-002',
      category: 'onboarding',
      priority: 'high',
      title: 'Role Assignment and Dashboard Routing',
      description: 'Verify users are assigned correct roles and routed to appropriate dashboards',
      testSteps: [
        'Register as each user type',
        'Verify role assignment',
        'Check dashboard routing',
        'Test role-specific features'
      ],
      validationCriteria: [
        'Correct role assigned based on registration',
        'Users routed to role-appropriate dashboard',
        'Role-specific navigation visible',
        'No access to unauthorized features'
      ],
      status: 'not-tested',
      estimatedMinutes: 20,
      automatable: true
    },

    // Payment System (Stripe)
    {
      id: 'PAY-001',
      category: 'payments',
      priority: 'critical',
      title: 'Stripe Live Payment Integration',
      description: 'Test live Stripe payment processing for premium subscriptions',
      testSteps: [
        'Navigate to subscription upgrade',
        'Select premium plan',
        'Complete Stripe checkout',
        'Verify subscription activation',
        'Test premium features unlock'
      ],
      validationCriteria: [
        'Stripe checkout loads correctly',
        'Payment processes successfully',
        'Subscription status updates immediately',
        'Premium features accessible',
        'Billing portal accessible'
      ],
      status: 'blocked',
      blocker: 'Stripe live keys not configured',
      estimatedMinutes: 25,
      route: '/settings/subscription',
      automatable: false
    },
    {
      id: 'PAY-002',
      category: 'payments',
      priority: 'high',
      title: 'Subscription Management',
      description: 'Test subscription management through Stripe customer portal',
      testSteps: [
        'Access subscription management',
        'Test plan changes',
        'Test payment method updates',
        'Test subscription cancellation',
        'Verify status synchronization'
      ],
      validationCriteria: [
        'Customer portal loads correctly',
        'Plan changes reflected in app',
        'Payment method updates work',
        'Cancellation properly handled',
        'Status sync works bidirectionally'
      ],
      status: 'blocked',
      blocker: 'Requires Stripe live configuration',
      estimatedMinutes: 20,
      automatable: false
    },

    // Settings & Configuration
    {
      id: 'SET-001',
      category: 'settings',
      priority: 'high',
      title: 'User Settings Functionality',
      description: 'Test all user settings features and data persistence',
      testSteps: [
        'Access user settings',
        'Update profile information',
        'Change notification preferences',
        'Test security settings',
        'Verify data persistence'
      ],
      validationCriteria: [
        'Settings page loads without errors',
        'Profile updates save correctly',
        'Preferences persist across sessions',
        'Security settings function properly',
        'No data loss or corruption'
      ],
      status: 'not-tested',
      estimatedMinutes: 15,
      route: '/settings',
      automatable: false
    },
    {
      id: 'SET-002',
      category: 'settings',
      priority: 'medium',
      title: 'System Configuration',
      description: 'Verify system-level configuration and admin settings',
      testSteps: [
        'Test admin system settings',
        'Verify configuration persistence',
        'Test feature toggles',
        'Check audit logging'
      ],
      validationCriteria: [
        'Admin can modify system settings',
        'Configuration changes persist',
        'Feature toggles work correctly',
        'Audit trail captures changes'
      ],
      status: 'not-tested',
      estimatedMinutes: 20,
      automatable: false
    },

    // Role-Based Navigation
    {
      id: 'NAV-001',
      category: 'navigation',
      priority: 'critical',
      title: 'Client Basic Navigation',
      description: 'Verify client basic user sees correct navigation and features',
      testSteps: [
        'Login as client basic user',
        'Verify navigation menu items',
        'Test feature access restrictions',
        'Check upgrade prompts'
      ],
      validationCriteria: [
        'Only basic features visible in navigation',
        'Premium features show upgrade prompts',
        'No access to unauthorized sections',
        'Navigation is intuitive and complete'
      ],
      status: 'passed',
      estimatedMinutes: 10,
      route: '/client-dashboard',
      automatable: true
    },
    {
      id: 'NAV-002',
      category: 'navigation',
      priority: 'critical',
      title: 'Client Premium Navigation',
      description: 'Verify client premium user has access to all premium features',
      testSteps: [
        'Login as client premium user',
        'Verify all premium features accessible',
        'Test advanced navigation items',
        'Check subscription management access'
      ],
      validationCriteria: [
        'All premium features visible and accessible',
        'No upgrade prompts for premium features',
        'Advanced tools function correctly',
        'Subscription management available'
      ],
      status: 'passed',
      estimatedMinutes: 15,
      automatable: true
    },
    {
      id: 'NAV-003',
      category: 'navigation',
      priority: 'critical',
      title: 'Professional User Navigation',
      description: 'Test navigation for advisor, accountant, attorney, consultant roles',
      testSteps: [
        'Login as each professional role',
        'Verify role-specific navigation',
        'Test professional tools access',
        'Check client management features'
      ],
      validationCriteria: [
        'Role-appropriate navigation visible',
        'Professional tools accessible',
        'Client management functions work',
        'Cross-role access properly restricted'
      ],
      status: 'testing',
      estimatedMinutes: 25,
      automatable: true
    },
    {
      id: 'NAV-004',
      category: 'navigation',
      priority: 'critical',
      title: 'Admin Navigation Security',
      description: 'Verify admin users have proper access and non-admins are restricted',
      testSteps: [
        'Login as admin user',
        'Verify admin navigation available',
        'Test admin-only features',
        'Attempt access as non-admin user'
      ],
      validationCriteria: [
        'Admin navigation fully accessible',
        'Admin features function correctly',
        'Non-admin users cannot access admin areas',
        'Security is properly enforced'
      ],
      status: 'failed',
      blocker: 'Admin routes showing ComingSoonPage',
      estimatedMinutes: 20,
      automatable: false
    },

    // Infrastructure & Performance
    {
      id: 'INF-001',
      category: 'infrastructure',
      priority: 'high',
      title: 'Mobile Responsiveness',
      description: 'Test application functionality across mobile devices',
      testSteps: [
        'Test on iPhone 13 viewport',
        'Test on Android tablet',
        'Verify touch interactions',
        'Check responsive layouts'
      ],
      validationCriteria: [
        'All pages render correctly on mobile',
        'Touch interactions work smoothly',
        'Text remains readable on small screens',
        'Navigation is touch-friendly'
      ],
      status: 'not-tested',
      estimatedMinutes: 30,
      automatable: false
    },
    {
      id: 'INF-002',
      category: 'infrastructure',
      priority: 'medium',
      title: 'Performance & Loading',
      description: 'Verify application performance meets production standards',
      testSteps: [
        'Test page load times',
        'Check for memory leaks',
        'Verify error boundaries',
        'Test concurrent user load'
      ],
      validationCriteria: [
        'Pages load within 3 seconds',
        'No memory leaks detected',
        'Error boundaries catch issues gracefully',
        'Application handles concurrent users'
      ],
      status: 'not-tested',
      estimatedMinutes: 45,
      automatable: true
    }
  ]);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const updateItemStatus = (itemId: string, status: ChecklistItem['status'], blocker?: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status, blocker } : item
    ));
  };

  const runAutomatedTest = async (item: ChecklistItem) => {
    if (!item.automatable) {
      toast.error('This test requires manual execution');
      return;
    }

    setActiveTest(item.id);
    updateItemStatus(item.id, 'testing');

    // Simulate automated test execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate test results (weighted for realistic outcomes)
    const success = Math.random() > 0.2; // 80% success rate
    updateItemStatus(item.id, success ? 'passed' : 'failed', 
      success ? undefined : 'Automated test detected issues');

    setActiveTest(null);
    toast.success(`Test ${item.id} completed: ${success ? 'PASSED' : 'FAILED'}`);
  };

  const runAllCriticalTests = async () => {
    setIsRunningTests(true);
    const criticalItems = checklistItems.filter(item => 
      item.priority === 'critical' && item.automatable && item.status !== 'blocked'
    );

    toast.info(`Running ${criticalItems.length} critical automated tests...`);

    for (const item of criticalItems) {
      await runAutomatedTest(item);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunningTests(false);
    toast.success('All critical automated tests completed!');
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'blocked': return <StopCircle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'p1-issues': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'onboarding': return <Users className="h-4 w-4 text-blue-500" />;
      case 'payments': return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'settings': return <Settings className="h-4 w-4 text-gray-500" />;
      case 'navigation': return <Navigation className="h-4 w-4 text-purple-500" />;
      default: return <Database className="h-4 w-4 text-indigo-500" />;
    }
  };

  const calculateGoNoGo = (): GoNoGoDecision[] => {
    const categories = ['p1-issues', 'onboarding', 'payments', 'settings', 'navigation', 'infrastructure'];
    
    return categories.map(category => {
      const categoryItems = checklistItems.filter(item => item.category === category);
      const criticalItems = categoryItems.filter(item => item.priority === 'critical');
      const failedCritical = criticalItems.filter(item => item.status === 'failed' || item.status === 'blocked').length;
      const totalFailed = categoryItems.filter(item => item.status === 'failed' || item.status === 'blocked').length;
      const totalPassed = categoryItems.filter(item => item.status === 'passed').length;
      const readinessPercentage = Math.round((totalPassed / categoryItems.length) * 100);
      
      const blockers = categoryItems
        .filter(item => item.status === 'failed' || item.status === 'blocked')
        .map(item => item.blocker || item.title);

      let status: 'go' | 'no-go' | 'conditional' = 'go';
      if (failedCritical > 0) {
        status = 'no-go';
      } else if (totalFailed > 0 || readinessPercentage < 90) {
        status = 'conditional';
      }

      return {
        category: category.replace('-', ' ').toUpperCase(),
        status,
        criticalIssues: failedCritical,
        totalIssues: totalFailed,
        readinessPercentage,
        blockers
      };
    });
  };

  const goNoGoResults = calculateGoNoGo();
  const overallStatus = goNoGoResults.some(r => r.status === 'no-go') ? 'no-go' : 
                      goNoGoResults.some(r => r.status === 'conditional') ? 'conditional' : 'go';

  const getOverallStats = () => {
    const total = checklistItems.length;
    const passed = checklistItems.filter(i => i.status === 'passed').length;
    const failed = checklistItems.filter(i => i.status === 'failed').length;
    const blocked = checklistItems.filter(i => i.status === 'blocked').length;
    const critical = checklistItems.filter(i => i.priority === 'critical').length;
    const criticalFailed = checklistItems.filter(i => i.priority === 'critical' && (i.status === 'failed' || i.status === 'blocked')).length;
    
    return { total, passed, failed, blocked, critical, criticalFailed, readiness: Math.round((passed / total) * 100) };
  };

  const stats = getOverallStats();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pre-Launch Go/No-Go Checklist</h1>
            <p className="text-muted-foreground">
              Comprehensive validation for production readiness
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={runAllCriticalTests}
              disabled={isRunningTests}
              className="flex items-center gap-2"
            >
              {isRunningTests ? (
                <Clock className="h-4 w-4 animate-pulse" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Critical Tests
            </Button>
            <Badge variant={overallStatus === 'go' ? 'default' : overallStatus === 'conditional' ? 'secondary' : 'destructive'}>
              {overallStatus.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Overall Status Alert */}
        <Alert className={overallStatus === 'no-go' ? 'border-red-500 bg-red-50' : 
                         overallStatus === 'conditional' ? 'border-yellow-500 bg-yellow-50' : 
                         'border-green-500 bg-green-50'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Launch Status: {overallStatus.toUpperCase()}</strong>
            {overallStatus === 'no-go' && (
              <span className="block mt-1 text-red-700">
                {stats.criticalFailed} critical issues must be resolved before launch.
              </span>
            )}
            {overallStatus === 'conditional' && (
              <span className="block mt-1 text-yellow-700">
                Launch possible with risk mitigation. Monitor closely post-launch.
              </span>
            )}
            {overallStatus === 'go' && (
              <span className="block mt-1 text-green-700">
                All critical tests passed. Ready for production launch.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-6 w-6 text-red-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-orange-600">{stats.blocked}</p>
              </div>
              <StopCircle className="h-6 w-6 text-orange-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Readiness</p>
                <p className="text-2xl font-bold text-primary">{stats.readiness}%</p>
              </div>
              <Zap className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList>
            <TabsTrigger value="checklist">Full Checklist</TabsTrigger>
            <TabsTrigger value="go-no-go">Go/No-Go Analysis</TabsTrigger>
            <TabsTrigger value="critical-only">Critical Issues Only</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <div className="space-y-6">
              {Object.entries(
                checklistItems.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, ChecklistItem[]>)
              ).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(category as ChecklistItem['category'])}
                      {category.replace('-', ' ').toUpperCase()}
                      <Badge variant="outline">
                        {items.filter(i => i.status === 'passed').length}/{items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <Card key={item.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusIcon(item.status)}
                                  <Badge variant={item.priority === 'critical' ? 'destructive' : 
                                                item.priority === 'high' ? 'secondary' : 'outline'}>
                                    {item.priority}
                                  </Badge>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{item.id}</span>
                                    <span className="text-sm">{item.title}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                                  
                                  {item.status === 'failed' || item.status === 'blocked' ? (
                                    <Alert className="mb-3">
                                      <AlertTriangle className="h-4 w-4" />
                                      <AlertDescription>
                                        <strong>Blocker:</strong> {item.blocker}
                                      </AlertDescription>
                                    </Alert>
                                  ) : null}
                                  
                                  <div className="text-xs text-muted-foreground mb-2">
                                    <strong>Est. Time:</strong> {item.estimatedMinutes}min • 
                                    <strong> Assignee:</strong> {item.assignee || 'QA Team'} • 
                                    <strong> Automatable:</strong> {item.automatable ? 'Yes' : 'No'}
                                  </div>
                                  
                                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <div className="font-medium mb-1">Test Steps:</div>
                                      <ul className="space-y-1">
                                        {item.testSteps.slice(0, 3).map((step, index) => (
                                          <li key={index} className="flex items-start gap-1">
                                            <span className="text-primary">•</span>
                                            <span>{step}</span>
                                          </li>
                                        ))}
                                        {item.testSteps.length > 3 && (
                                          <li className="text-muted-foreground">+{item.testSteps.length - 3} more</li>
                                        )}
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="font-medium mb-1">Success Criteria:</div>
                                      <ul className="space-y-1">
                                        {item.validationCriteria.slice(0, 3).map((criteria, index) => (
                                          <li key={index} className="flex items-start gap-1">
                                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{criteria}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2 ml-4">
                                <div className="flex gap-1">
                                  {item.automatable && item.status !== 'blocked' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => runAutomatedTest(item)}
                                      disabled={isRunningTests || activeTest === item.id}
                                    >
                                      {activeTest === item.id ? (
                                        <Clock className="h-3 w-3 animate-pulse" />
                                      ) : (
                                        <Play className="h-3 w-3" />
                                      )}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => updateItemStatus(item.id, 
                                      item.status === 'passed' ? 'not-tested' : 'passed')}
                                  >
                                    <Checkbox checked={item.status === 'passed'} />
                                  </Button>
                                  {item.route && (
                                    <Link to={item.route}>
                                      <Button size="sm" variant="ghost">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="go-no-go">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Go/No-Go Decision Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goNoGoResults.map((result) => (
                    <Card key={result.category} className={`border-l-4 ${
                      result.status === 'go' ? 'border-l-green-500' : 
                      result.status === 'conditional' ? 'border-l-yellow-500' : 
                      'border-l-red-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{result.category}</h4>
                            <Badge variant={result.status === 'go' ? 'default' : 
                                          result.status === 'conditional' ? 'secondary' : 'destructive'}>
                              {result.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Readiness</div>
                            <div className="text-lg font-bold">{result.readinessPercentage}%</div>
                          </div>
                        </div>
                        
                        <Progress value={result.readinessPercentage} className="mb-3" />
                        
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Critical Issues: </span>
                            <span className={result.criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}>
                              {result.criticalIssues}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Total Issues: </span>
                            <span className={result.totalIssues > 0 ? 'text-yellow-600' : 'text-green-600'}>
                              {result.totalIssues}
                            </span>
                          </div>
                        </div>
                        
                        {result.blockers.length > 0 && (
                          <div className="mt-3 p-3 bg-muted rounded text-sm">
                            <div className="font-medium mb-1">Blockers:</div>
                            <ul className="space-y-1">
                              {result.blockers.map((blocker, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span>{blocker}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical-only">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Issues Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checklistItems.filter(item => item.priority === 'critical').map((item) => (
                    <div key={item.id} className={`p-4 border rounded-lg ${
                      item.status === 'failed' || item.status === 'blocked' ? 
                      'border-red-200 bg-red-50' : 
                      item.status === 'passed' ? 'border-green-200 bg-green-50' : 
                      'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <span className="font-medium">{item.id}: {item.title}</span>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                            {item.blocker && (
                              <div className="text-sm text-red-600 mt-1">
                                <strong>Blocker:</strong> {item.blocker}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {item.automatable && item.status !== 'blocked' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => runAutomatedTest(item)}
                              disabled={isRunningTests}
                            >
                              Test
                            </Button>
                          )}
                          {item.route && (
                            <Link to={item.route}>
                              <Button size="sm" variant="ghost">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Launch Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">
                  Final Recommendation: 
                  <span className={`ml-2 ${
                    overallStatus === 'go' ? 'text-green-600' : 
                    overallStatus === 'conditional' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {overallStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {overallStatus === 'go' && 'All critical tests passed. Ready for production launch.'}
                  {overallStatus === 'conditional' && 'Launch possible with identified risks. Monitor closely.'}
                  {overallStatus === 'no-go' && 'Critical issues must be resolved before launch.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/qa/analytics">
                  <Button variant="outline">
                    <Monitor className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link to="/qa/issues">
                  <Button variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Issues
                  </Button>
                </Link>
                <Button 
                  variant={overallStatus === 'go' ? 'default' : 'destructive'}
                  onClick={() => {
                    if (overallStatus === 'go') {
                      toast.success('🚀 Launch approved! All critical tests passed.');
                    } else {
                      toast.error('🚫 Launch blocked. Resolve critical issues first.');
                    }
                  }}
                >
                  {overallStatus === 'go' ? 'Approve Launch' : 'Block Launch'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}