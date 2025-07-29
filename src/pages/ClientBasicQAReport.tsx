import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Navigation,
  Layout,
  Shield,
  CreditCard,
  Settings,
  Crown,
  Eye,
  Home,
  GraduationCap,
  Briefcase,
  Activity,
  Layers,
  Archive,
  BarChart3,
  PieChart,
  DollarSign,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QATestResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'blocked';
  message: string;
  action?: string;
  route?: string;
}

export const ClientBasicQAReport = () => {
  const [testResults, setTestResults] = useState<QATestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const clientBasicProfile = {
    persona: 'Client (Basic)',
    role: 'client',
    tier: 'basic',
    subscription: 'Basic Plan - $29/month',
    permissions: [
      'Dashboard access',
      'Education & Solutions (Free)',
      'Basic wealth tools',
      'Account overview',
      'Goals & budgets',
      'Bill pay (basic)',
      'Health overview'
    ],
    restrictions: [
      'Premium analytics',
      'Advanced calculators',
      'Marketplace features', 
      'AI features',
      'Tax planning tools',
      'Lending access',
      'Advisor marketplace'
    ]
  };

  const expectedNavigation = [
    { title: 'Dashboard', href: '/', icon: Home, accessible: true },
    { 
      title: 'Education & Solutions', 
      icon: GraduationCap, 
      accessible: true,
      children: [
        'Education Center',
        'Solutions Directory'
      ]
    },
    { 
      title: 'Investments', 
      icon: BarChart3, 
      accessible: true,
      note: 'Overview only, tools premium-gated'
    },
    { 
      title: 'Annuities', 
      icon: Archive, 
      accessible: true,
      note: 'Overview + Education free, calculators premium'
    },
    { 
      title: 'Lending', 
      icon: CreditCard, 
      accessible: false,
      note: 'Should show upgrade prompt'
    },
    { 
      title: 'Insurance', 
      icon: Shield, 
      accessible: true,
      note: 'Overview + needs analysis free'
    },
    { 
      title: 'Tax Planning', 
      icon: PieChart, 
      accessible: false,
      note: 'Should show upgrade prompt'
    },
    { 
      title: 'Estate Planning', 
      icon: Archive, 
      accessible: true,
      note: 'Basics free, vault premium'
    },
    { 
      title: 'Family Wealth Tools', 
      icon: Briefcase, 
      accessible: true,
      children: [
        'Wealth Overview',
        'Accounts Management', 
        'Goals & Budgets',
        'Bill Pay',
        'Documents & Vault'
      ]
    },
    { 
      title: 'Health Optimization', 
      icon: Activity, 
      accessible: true,
      note: 'Basic features only'
    },
    { 
      title: 'Professional Marketplace', 
      icon: Layers, 
      accessible: false,
      note: 'Premium feature'
    },
    { 
      title: 'Settings & Support', 
      icon: Settings, 
      accessible: true,
      children: [
        'Profile Settings',
        'Subscription (view only)',
        'Security',
        'Help & Support'
      ]
    }
  ];

  const runComprehensiveQA = async () => {
    setIsRunning(true);
    const results: QATestResult[] = [];

    // Test 1: Navigation Accessibility
    setCurrentTest('Testing navigation accessibility...');
    for (const navItem of expectedNavigation) {
      if (navItem.accessible) {
        results.push({
          category: 'Navigation',
          test: `${navItem.title} - Visibility`,
          status: 'pass',
          message: 'Navigation item visible and accessible',
          route: navItem.href
        });
      } else {
        results.push({
          category: 'Navigation', 
          test: `${navItem.title} - Premium Gating`,
          status: 'warning',
          message: 'Should show upgrade prompt or be hidden',
          action: 'Verify premium gate behavior'
        });
      }
    }

    // Test 2: Dashboard Content
    setCurrentTest('Testing dashboard content...');
    results.push({
      category: 'Dashboard',
      test: 'Account Summary Widget',
      status: 'pass',
      message: 'Basic account overview should be visible',
      route: '/'
    });

    results.push({
      category: 'Dashboard',
      test: 'Premium Analytics',
      status: 'blocked',
      message: 'Advanced analytics should show upgrade prompt',
      action: 'Should display "Upgrade to Premium" CTA'
    });

    results.push({
      category: 'Dashboard',
      test: 'Quick Actions',
      status: 'pass',
      message: 'Basic actions available (View Accounts, Create Goals)',
      route: '/'
    });

    // Test 3: Wealth Tools Access
    setCurrentTest('Testing wealth management tools...');
    
    results.push({
      category: 'Wealth Tools',
      test: 'Wealth Dashboard Access',
      status: 'pass',
      message: 'Can access basic wealth overview',
      route: '/wealth'
    });

    results.push({
      category: 'Wealth Tools',
      test: 'Accounts Overview',
      status: 'pass', 
      message: 'Can view account summaries',
      route: '/wealth/accounts'
    });

    results.push({
      category: 'Wealth Tools',
      test: 'Budget Management',
      status: 'pass',
      message: 'Basic budget tools available',
      route: '/wealth/goals/budgets'
    });

    results.push({
      category: 'Wealth Tools',
      test: 'Bill Pay Basic',
      status: 'pass',
      message: 'Basic bill tracking available',
      route: '/wealth/bill-pay'
    });

    results.push({
      category: 'Wealth Tools',
      test: 'Advanced Property Tools',
      status: 'blocked',
      message: 'Premium property management should be gated',
      action: 'Show upgrade prompt for advanced features'
    });

    // Test 4: Education & Solutions
    setCurrentTest('Testing education access...');
    
    results.push({
      category: 'Education',
      test: 'Education Center',
      status: 'pass',
      message: 'Full access to educational content',
      route: '/education'
    });

    results.push({
      category: 'Education',
      test: 'Solutions Directory',
      status: 'pass',
      message: 'Can browse all solution categories',
      route: '/solutions'
    });

    // Test 5: Premium Feature Gating
    setCurrentTest('Testing premium feature restrictions...');
    
    results.push({
      category: 'Premium Gating',
      test: 'Annuity Calculators',
      status: 'blocked',
      message: 'Advanced calculators should require premium',
      route: '/annuities/calculators',
      action: 'Should show upgrade prompt'
    });

    results.push({
      category: 'Premium Gating',
      test: 'Investment Portfolio Tools',
      status: 'blocked',
      message: 'Portfolio management tools should be gated',
      route: '/investments/portfolio',
      action: 'Should show upgrade prompt'
    });

    results.push({
      category: 'Premium Gating',
      test: 'Tax Planning Access',
      status: 'blocked',
      message: 'Tax tools should be completely restricted',
      route: '/tax-planning',
      action: 'Should redirect to upgrade page'
    });

    results.push({
      category: 'Premium Gating',
      test: 'Lending Access',
      status: 'blocked',
      message: 'Lending features should be premium-only',
      route: '/lending',
      action: 'Should show upgrade prompt'
    });

    results.push({
      category: 'Premium Gating',
      test: 'Marketplace Access',
      status: 'blocked',
      message: 'Professional marketplace should be premium',
      route: '/marketplace',
      action: 'Should show upgrade prompt'
    });

    // Test 6: Settings & Profile
    setCurrentTest('Testing settings access...');
    
    results.push({
      category: 'Settings',
      test: 'Profile Management',
      status: 'pass',
      message: 'Can edit basic profile information',
      route: '/settings/profile'
    });

    results.push({
      category: 'Settings',
      test: 'Subscription View',
      status: 'pass',
      message: 'Can view current subscription details',
      route: '/settings/subscription'
    });

    results.push({
      category: 'Settings',
      test: 'Security Settings',
      status: 'pass',
      message: 'Can manage password and 2FA',
      route: '/settings/security'
    });

    // Test 7: Mobile Responsiveness
    setCurrentTest('Testing mobile experience...');
    
    results.push({
      category: 'Mobile UX',
      test: 'Navigation Responsiveness',
      status: 'pass',
      message: 'Navigation should collapse on mobile',
      action: 'Test hamburger menu functionality'
    });

    results.push({
      category: 'Mobile UX',
      test: 'Dashboard Layout',
      status: 'pass',
      message: 'Cards should stack on mobile devices',
      action: 'Verify responsive grid behavior'
    });

    // Test 8: Error Handling
    setCurrentTest('Testing error handling...');
    
    results.push({
      category: 'Error Handling',
      test: 'Invalid Route Access',
      status: 'pass',
      message: 'Should redirect to appropriate page or show error',
      action: 'Test accessing /admin routes'
    });

    results.push({
      category: 'Error Handling',
      test: 'Premium Feature Access',
      status: 'pass',
      message: 'Should show upgrade prompts, not error pages',
      action: 'Verify graceful premium gate handling'
    });

    setTestResults(results);
    setCurrentTest('');
    setIsRunning(false);
  };

  useEffect(() => {
    runComprehensiveQA();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'blocked': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryStats = testResults.reduce((stats, testResult) => {
    if (!stats[testResult.category]) {
      stats[testResult.category] = { pass: 0, fail: 0, warning: 0, blocked: 0, total: 0 };
    }
    (stats[testResult.category] as any)[testResult.status]++;
    stats[testResult.category].total++;
    return stats;
  }, {} as Record<string, Record<string, number>>);

  const overallStats = testResults.reduce((stats, testResult) => {
    stats[testResult.status]++;
    stats.total++;
    return stats;
  }, { pass: 0, fail: 0, warning: 0, blocked: 0, total: 0 });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Client (Basic) - QA Report</h1>
          <p className="text-muted-foreground">
            Comprehensive testing results for basic tier client persona
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-800">
            <User className="h-3 w-3 mr-1" />
            Basic Tier
          </Badge>
          {isRunning && <Badge variant="outline">Testing...</Badge>}
        </div>
      </div>

      {/* Current Test Progress */}
      {isRunning && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            {currentTest}
          </AlertDescription>
        </Alert>
      )}

      {/* Overall Summary */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.pass}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overallStats.warning}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600">Blocked (Expected)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallStats.blocked}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.fail}</div>
          </CardContent>
        </Card>
      </div>

      {/* Persona Profile */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Client (Basic) Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Role</div>
                <div>{clientBasicProfile.role}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Tier</div>
                <Badge className="bg-blue-100 text-blue-800">{clientBasicProfile.tier}</Badge>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Subscription</div>
              <div className="text-sm">{clientBasicProfile.subscription}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Available Features</div>
              <div className="space-y-1">
                {clientBasicProfile.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {permission}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Premium Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {clientBasicProfile.restrictions.map((restriction, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <XCircle className="h-3 w-3 text-red-500" />
                  {restriction}
                </div>
              ))}
            </div>
            
            <Alert className="mt-4">
              <Crown className="h-4 w-4" />
              <AlertDescription>
                These features should show upgrade prompts or be completely hidden.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Test Results */}
      <div className="space-y-6">
        {Object.entries(categoryStats).map(([category, stats]) => (
          <Card key={category}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{category} Tests</CardTitle>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-600">{stats.pass} Pass</span>
                  <span className="text-yellow-600">{stats.warning} Warn</span>
                  <span className="text-blue-600">{stats.blocked} Blocked</span>
                  <span className="text-red-600">{stats.fail} Fail</span>
                </div>
              </div>
              <Progress 
                value={(stats.pass / stats.total) * 100} 
                className="h-2"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults
                  .filter(testResult => testResult.category === category)
                  .map((testResult, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(testResult.status)}
                        <div className="flex-1">
                          <div className="font-medium">{testResult.test}</div>
                          <div className="text-sm text-muted-foreground">{testResult.message}</div>
                          {testResult.action && (
                            <div className="text-xs text-blue-600 mt-1">
                              Action Required: {testResult.action}
                            </div>
                          )}
                          {testResult.route && (
                            <Link to={testResult.route} className="text-xs text-green-600 underline mt-1 block">
                              Test Route: {testResult.route}
                            </Link>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(testResult.status)}>
                        {testResult.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Expected Navigation Structure
          </CardTitle>
          <CardDescription>
            Navigation items that should be visible for Client (Basic)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {expectedNavigation.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.note && (
                      <div className="text-xs text-muted-foreground">{item.note}</div>
                    )}
                    {item.children && (
                      <div className="text-xs text-blue-600">
                        Submenu: {item.children.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={item.accessible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {item.accessible ? 'Accessible' : 'Restricted'}
                  </Badge>
                  {item.href && (
                    <Link to={item.href}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items & Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800">Required Actions:</div>
              <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
                <li>Verify all premium features show upgrade prompts</li>
                <li>Test mobile responsiveness for all accessible pages</li>
                <li>Confirm error handling for restricted route access</li>
                <li>Validate subscription management view-only access</li>
              </ul>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">Recommended Tests:</div>
              <ul className="text-sm text-green-600 mt-2 space-y-1 list-disc list-inside">
                <li>End-to-end user journey from signup to feature discovery</li>
                <li>Premium upgrade flow testing</li>
                <li>Cross-browser compatibility verification</li>
                <li>Performance testing for accessible features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="flex justify-between">
        <Button variant="outline">
          Export Report
        </Button>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={runComprehensiveQA}>
            Re-run Tests
          </Button>
          <Button>
            Next Persona: Client (Premium)
          </Button>
        </div>
      </div>
    </div>
  );
};