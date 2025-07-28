import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  Smartphone, 
  Zap, 
  Shield,
  Navigation,
  Download,
  Upload,
  Eye,
  RefreshCw
} from 'lucide-react';

interface QAItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  testSteps: string[];
  expectedResult: string;
  actualResult?: string;
  status: 'pending' | 'pass' | 'fail' | 'blocked';
  assignee?: string;
  notes?: string;
}

export function UATQAChecklist() {
  const [checklist, setChecklist] = useState<QAItem[]>([
    // Navigation & Routes
    {
      id: 'nav-001',
      title: 'Client Dashboard Navigation',
      description: 'Verify all client dashboard routes and navigation work correctly',
      priority: 'critical',
      category: 'navigation',
      testSteps: [
        'Login as client user',
        'Navigate to /client-dashboard',
        'Test all sidebar navigation items',
        'Verify breadcrumb navigation',
        'Test back/forward browser navigation'
      ],
      expectedResult: 'All navigation links work, correct pages load, no 404 errors',
      status: 'pending'
    },
    {
      id: 'nav-002', 
      title: 'Advisor Dashboard Navigation',
      description: 'Verify advisor dashboard routes and permissions',
      priority: 'critical',
      category: 'navigation',
      testSteps: [
        'Login as advisor user',
        'Navigate to /advisor-dashboard',
        'Test advisor-specific navigation items',
        'Verify client management sections',
        'Test role-based menu visibility'
      ],
      expectedResult: 'Advisor dashboard loads with correct permissions and menu items',
      status: 'pending'
    },
    {
      id: 'nav-003',
      title: 'Admin/Professional Dashboards',
      description: 'Test all admin and professional role dashboards',
      priority: 'high',
      category: 'navigation',
      testSteps: [
        'Login as admin user',
        'Test /admin-dashboard route',
        'Login as accountant, consultant, attorney',
        'Test respective dashboard routes',
        'Verify role-specific functionality'
      ],
      expectedResult: 'Each role dashboard loads with appropriate features and restrictions',
      status: 'pending'
    },

    // Role-Based Access Controls
    {
      id: 'rbac-001',
      title: 'Subscription Tier Feature Access',
      description: 'Verify premium/elite features are properly gated',
      priority: 'critical',
      category: 'access-control',
      testSteps: [
        'Login with Basic subscription',
        'Attempt to access premium features',
        'Verify upgrade prompts display',
        'Login with Premium subscription',
        'Verify premium features accessible',
        'Test elite feature restrictions'
      ],
      expectedResult: 'Features correctly gated by subscription tier with clear upgrade CTAs',
      status: 'pending'
    },
    {
      id: 'rbac-002',
      title: 'Role-Based Dashboard Access',
      description: 'Test that users only see appropriate dashboard content',
      priority: 'critical',
      category: 'access-control', 
      testSteps: [
        'Login as each user role (client, advisor, admin, etc.)',
        'Verify dashboard content matches role',
        'Test unauthorized route access returns 403/redirect',
        'Verify role switching functionality',
        'Test admin override capabilities'
      ],
      expectedResult: 'Users only access authorized content, proper error handling for unauthorized access',
      status: 'pending'
    },

    // Stripe Payment System
    {
      id: 'stripe-001',
      title: 'Subscription Signup Flow',
      description: 'Test complete subscription purchase process',
      priority: 'critical',
      category: 'payments',
      testSteps: [
        'Access subscription plans page',
        'Click "Upgrade to Premium" button',
        'Complete Stripe Checkout with test card',
        'Verify webhook processes subscription_created',
        'Confirm account upgraded immediately',
        'Test feature access post-upgrade'
      ],
      expectedResult: 'Subscription activates immediately, features unlock, user receives confirmation',
      status: 'pending'
    },
    {
      id: 'stripe-002',
      title: 'Subscription Upgrade/Downgrade',
      description: 'Test subscription tier changes',
      priority: 'high',
      category: 'payments',
      testSteps: [
        'Login with Premium subscription',
        'Upgrade to Elite tier',
        'Verify prorated billing in Stripe',
        'Test immediate feature access',
        'Downgrade back to Premium',
        'Verify downgrade takes effect at period end'
      ],
      expectedResult: 'Upgrades immediate, downgrades at period end, proper prorated billing',
      status: 'pending'
    },
    {
      id: 'stripe-003',
      title: 'Subscription Cancellation',
      description: 'Test subscription cancellation and reactivation',
      priority: 'high',
      category: 'payments',
      testSteps: [
        'Access Customer Portal via "Manage Subscription"',
        'Cancel subscription in Stripe Portal',
        'Verify cancellation webhook processed',
        'Confirm access continues until period end',
        'Test reactivation before period end',
        'Verify grace period behavior'
      ],
      expectedResult: 'Cancellation processed correctly, access maintained until expiry, reactivation works',
      status: 'pending'
    },
    {
      id: 'stripe-004',
      title: 'Payment Failure Handling',
      description: 'Test failed payment and retry scenarios',
      priority: 'medium',
      category: 'payments',
      testSteps: [
        'Use Stripe test card that fails (4000000000000002)',
        'Verify payment_failed webhook processed',
        'Confirm user notified of failure',
        'Test dunning management emails',
        'Verify account suspension after final failure'
      ],
      expectedResult: 'Failed payments handled gracefully with clear user communication',
      status: 'pending'
    },

    // Document Management
    {
      id: 'docs-001',
      title: 'Document Upload Functionality',
      description: 'Test document upload across all modules',
      priority: 'high',
      category: 'documents',
      testSteps: [
        'Test upload in Estate Planning module',
        'Test upload in Healthcare module',
        'Upload various file types (PDF, DOCX, images)',
        'Test file size limits and validation',
        'Verify files stored in correct Supabase buckets',
        'Test upload progress indicators'
      ],
      expectedResult: 'All file uploads work correctly with proper validation and error handling',
      status: 'pending'
    },
    {
      id: 'docs-002',
      title: 'Document Download & Preview',
      description: 'Test document access and preview functionality',
      priority: 'high',
      category: 'documents',
      testSteps: [
        'Test download of various document types',
        'Verify PDF preview in browser',
        'Test image preview functionality',
        'Verify access permissions (users can only download their documents)',
        'Test download on mobile devices',
        'Test document search and filtering'
      ],
      expectedResult: 'Documents download correctly, previews work, proper access controls enforced',
      status: 'pending'
    },
    {
      id: 'docs-003',
      title: 'Document Security & Permissions',
      description: 'Verify document access is properly secured',
      priority: 'critical',
      category: 'documents',
      testSteps: [
        'Attempt to access another user\'s document URLs directly',
        'Test advisor access to client documents (if permitted)',
        'Verify document encryption at rest',
        'Test document sharing functionality',
        'Verify audit logging of document access'
      ],
      expectedResult: 'Documents properly secured, unauthorized access blocked, audit trails maintained',
      status: 'pending'
    },

    // Settings & Account Management
    {
      id: 'settings-001',
      title: 'Account Settings Management',
      description: 'Test user account settings and preferences',
      priority: 'medium',
      category: 'settings',
      testSteps: [
        'Access account settings page',
        'Update profile information',
        'Change email address (verify confirmation)',
        'Update password',
        'Test notification preferences',
        'Verify settings persistence across sessions'
      ],
      expectedResult: 'All settings update correctly and persist across sessions',
      status: 'pending'
    },
    {
      id: 'settings-002',
      title: 'Multi-Factor Authentication',
      description: 'Test MFA setup and usage',
      priority: 'high',
      category: 'settings',
      testSteps: [
        'Enable MFA in account settings',
        'Test QR code generation for authenticator app',
        'Verify MFA prompt on next login',
        'Test backup codes generation and usage',
        'Test MFA disable functionality',
        'Verify MFA required for sensitive operations'
      ],
      expectedResult: 'MFA setup works correctly, enhances security for sensitive operations',
      status: 'pending'
    },

    // Legal & Help Documentation
    {
      id: 'legal-001',
      title: 'Legal Pages Accessibility',
      description: 'Verify all legal documentation is accessible and current',
      priority: 'high',
      category: 'legal-help',
      testSteps: [
        'Access /legal/privacy-policy',
        'Access /legal/terms-of-service',
        'Access /legal/data-processing',
        'Access /legal/cookie-policy',
        'Verify links from footer and main navigation',
        'Check content is up-to-date and legally compliant'
      ],
      expectedResult: 'All legal pages load correctly with current, compliant content',
      status: 'pending'
    },
    {
      id: 'legal-002',
      title: 'Help Documentation System',
      description: 'Test help and support documentation',
      priority: 'medium',
      category: 'legal-help',
      testSteps: [
        'Access /help/getting-started',
        'Access /help/videos',
        'Access /help/api',
        'Access /help/webinars', 
        'Test search functionality in help docs',
        'Verify contact support forms work'
      ],
      expectedResult: 'Help system fully functional with searchable, helpful content',
      status: 'pending'
    },

    // Mobile Responsiveness
    {
      id: 'mobile-001',
      title: 'Mobile Dashboard Functionality',
      description: 'Test core functionality on mobile devices',
      priority: 'high',
      category: 'mobile',
      testSteps: [
        'Test login flow on mobile (iOS/Android)',
        'Navigate all dashboard sections on mobile',
        'Test navigation menu (hamburger menu)',
        'Verify charts and tables display correctly',
        'Test touch interactions and gestures',
        'Test landscape/portrait orientation changes'
      ],
      expectedResult: 'All core functionality works smoothly on mobile devices',
      status: 'pending'
    },
    {
      id: 'mobile-002',
      title: 'Mobile Performance',
      description: 'Verify mobile performance and load times',
      priority: 'medium',
      category: 'mobile',
      testSteps: [
        'Test page load speeds on 3G/4G',
        'Verify image optimization on mobile',
        'Test offline functionality (if applicable)',
        'Measure Time to Interactive (TTI)',
        'Test on various mobile devices and screen sizes',
        'Verify touch target sizes meet accessibility standards'
      ],
      expectedResult: 'Fast load times, smooth interactions, good accessibility on mobile',
      status: 'pending'
    },

    // Performance Testing
    {
      id: 'perf-001',
      title: 'Page Load Performance',
      description: 'Lighthouse performance audit and Core Web Vitals',
      priority: 'high',
      category: 'performance',
      testSteps: [
        'Run Lighthouse audit on key pages',
        'Measure Largest Contentful Paint (LCP)',
        'Measure First Input Delay (FID)',
        'Measure Cumulative Layout Shift (CLS)',
        'Test with slow 3G network simulation',
        'Verify performance scores >90 for critical pages'
      ],
      expectedResult: 'All core pages achieve Lighthouse scores >90, good Core Web Vitals',
      status: 'pending'
    },
    {
      id: 'perf-002',
      title: 'Database Query Performance',
      description: 'Test database query performance under load',
      priority: 'medium',
      category: 'performance',
      testSteps: [
        'Monitor dashboard page query times',
        'Test with large datasets (if available)',
        'Verify pagination works efficiently',
        'Test concurrent user scenarios',
        'Monitor Supabase performance metrics',
        'Verify query optimization and indexing'
      ],
      expectedResult: 'Database queries execute quickly even with larger datasets',
      status: 'pending'
    },

    // Error Monitoring
    {
      id: 'error-001',
      title: 'Error Boundary Testing',
      description: 'Test error handling and recovery',
      priority: 'high',
      category: 'error-monitoring',
      testSteps: [
        'Trigger component errors intentionally',
        'Verify GlobalErrorBoundary catches errors',
        'Test error reporting and logging',
        'Verify user-friendly error messages',
        'Test error recovery mechanisms',
        'Verify error IDs are generated and copyable'
      ],
      expectedResult: 'Errors caught gracefully, users see helpful messages, errors logged properly',
      status: 'pending'
    },
    {
      id: 'error-002',
      title: 'Network Error Handling',
      description: 'Test API and network error scenarios',
      priority: 'medium',
      category: 'error-monitoring',
      testSteps: [
        'Test offline scenarios',
        'Simulate API timeouts',
        'Test invalid API responses',
        'Verify retry mechanisms work',
        'Test fallback content display',
        'Verify error toasts and notifications'
      ],
      expectedResult: 'Network errors handled gracefully with appropriate user feedback',
      status: 'pending'
    }
  ]);

  const updateItemStatus = (id: string, status: QAItem['status'], actualResult?: string, notes?: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status, actualResult, notes }
        : item
    ));
  };

  const getStatusIcon = (status: QAItem['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'blocked': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: QAItem['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Navigation className="h-4 w-4" />;
      case 'access-control': return <Shield className="h-4 w-4" />;
      case 'payments': return <CreditCard className="h-4 w-4" />;
      case 'documents': return <FileText className="h-4 w-4" />;
      case 'settings': return <Settings className="h-4 w-4" />;
      case 'legal-help': return <FileText className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'error-monitoring': return <AlertCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStats = () => {
    const total = checklist.length;
    const passed = checklist.filter(item => item.status === 'pass').length;
    const failed = checklist.filter(item => item.status === 'fail').length;
    const blocked = checklist.filter(item => item.status === 'blocked').length;
    const pending = checklist.filter(item => item.status === 'pending').length;
    
    return { total, passed, failed, blocked, pending };
  };

  const stats = getStats();
  const completionRate = Math.round((stats.passed / stats.total) * 100);

  const categories = [...new Set(checklist.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">UAT/QA Testing Checklist</h1>
        <p className="text-muted-foreground">
          Comprehensive pre-launch testing checklist for all platform features
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Testing Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-green-600 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Tests</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.blocked}</div>
              <div className="text-sm text-yellow-700">Blocked</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <div className="text-sm text-gray-700">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Categories */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              <div className="flex items-center gap-1">
                {getCategoryIcon(category)}
                <span className="hidden sm:inline">
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {getCategoryIcon(category)}
              {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Testing
            </h2>
            
            {checklist
              .filter(item => item.category === category)
              .map(item => (
                <Card key={item.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Test Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {item.testSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Expected Result:</h4>
                      <p className="text-sm text-muted-foreground">{item.expectedResult}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={item.status === 'pass' ? 'default' : 'outline'}
                        onClick={() => updateItemStatus(item.id, 'pass')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pass
                      </Button>
                      <Button 
                        size="sm" 
                        variant={item.status === 'fail' ? 'destructive' : 'outline'}
                        onClick={() => updateItemStatus(item.id, 'fail')}
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Fail
                      </Button>
                      <Button 
                        size="sm" 
                        variant={item.status === 'blocked' ? 'secondary' : 'outline'}
                        onClick={() => updateItemStatus(item.id, 'blocked')}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Blocked
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateItemStatus(item.id, 'pending')}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Launch Readiness */}
      <Card className={`border-2 ${completionRate >= 95 ? 'border-green-500 bg-green-50' : 
                                   completionRate >= 80 ? 'border-yellow-500 bg-yellow-50' : 
                                   'border-red-500 bg-red-50'}`}>
        <CardContent className="pt-6 text-center">
          <h3 className="text-xl font-bold mb-2">
            {completionRate >= 95 ? '🎉 Ready for Launch!' :
             completionRate >= 80 ? '⚠️ Almost Ready' :
             '🚨 Not Ready for Launch'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {completionRate >= 95 ? 
              'All critical tests passed. Platform ready for production deployment.' :
             completionRate >= 80 ?
              'Most tests passed. Review and fix remaining issues before launch.' :
              'Multiple critical issues detected. Significant work needed before launch.'}
          </p>
          <Badge className={completionRate >= 95 ? 'bg-green-600' : 
                           completionRate >= 80 ? 'bg-yellow-600' : 'bg-red-600'}>
            {completionRate}% Complete
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}