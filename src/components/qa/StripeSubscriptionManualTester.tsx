import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, CreditCard, Shield, Mail, Smartphone, FileText, Eye, Play } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TestStep {
  id: string;
  title: string;
  description: string;
  expectedResult: string;
  testData?: string;
  status: 'pending' | 'pass' | 'fail' | 'warning';
  actualResult?: string;
  screenshot?: string;
  notes?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
}

const STRIPE_TEST_CARDS = [
  { 
    number: '4242 4242 4242 4242', 
    description: 'Visa - Success', 
    type: 'success',
    expectedOutcome: 'Payment succeeds, subscription created'
  },
  { 
    number: '4000 0000 0000 0002', 
    description: 'Visa - Declined', 
    type: 'decline',
    expectedOutcome: 'Payment fails with generic decline'
  },
  { 
    number: '4000 0000 0000 9995', 
    description: 'Visa - Insufficient Funds', 
    type: 'decline',
    expectedOutcome: 'Payment fails with insufficient_funds error'
  },
  { 
    number: '4000 0000 0000 9987', 
    description: 'Visa - Lost Card', 
    type: 'decline',
    expectedOutcome: 'Payment fails with lost_card error'
  },
  { 
    number: '4000 0084 0000 1629', 
    description: 'Visa - 3D Secure Required', 
    type: 'auth',
    expectedOutcome: 'Triggers 3D Secure authentication flow'
  }
];

const createTestSuites = (): TestSuite[] => [
  {
    id: 'subscription-upgrade',
    name: 'Subscription Upgrade Flow',
    description: 'Test successful subscription upgrade with valid payment method',
    steps: [
      {
        id: 'navigate-pricing',
        title: 'Navigate to Pricing Page',
        description: 'Go to subscription/pricing page and verify plan options are displayed',
        expectedResult: 'All subscription tiers (Basic $19, Premium $49, Elite $99) are visible with feature lists',
        status: 'pending'
      },
      {
        id: 'select-premium-plan',
        title: 'Select Premium Plan',
        description: 'Click on Premium plan ($49/month) upgrade button',
        expectedResult: 'Confirmation modal appears asking to confirm upgrade',
        status: 'pending'
      },
      {
        id: 'confirm-upgrade',
        title: 'Confirm Upgrade',
        description: 'Click "Continue to Checkout" in confirmation modal',
        expectedResult: 'Redirected to Stripe Checkout page in new tab',
        status: 'pending'
      },
      {
        id: 'enter-payment-success',
        title: 'Enter Successful Payment Details',
        description: 'Fill out Stripe checkout form',
        expectedResult: 'Payment form accepts details and processes successfully',
        testData: '4242 4242 4242 4242, 12/25, 123, test@example.com',
        status: 'pending'
      },
      {
        id: 'verify-subscription-active',
        title: 'Verify Subscription Activation',
        description: 'Return to app and check subscription status',
        expectedResult: 'Dashboard shows Premium tier active, premium features unlocked',
        status: 'pending'
      },
      {
        id: 'test-premium-features',
        title: 'Test Premium Feature Access',
        description: 'Try to access a premium-gated feature',
        expectedResult: 'Premium features are accessible without upgrade prompts',
        status: 'pending'
      },
      {
        id: 'check-email-confirmation',
        title: 'Check Email Confirmation',
        description: 'Verify subscription confirmation email was sent',
        expectedResult: 'Email received with subscription details and receipt',
        status: 'pending'
      }
    ]
  },
  {
    id: 'payment-failure',
    name: 'Payment Failure Handling',
    description: 'Test payment failure scenarios and error handling',
    steps: [
      {
        id: 'attempt-upgrade-declined',
        title: 'Attempt Upgrade with Declined Card',
        description: 'Try to upgrade using declined test card',
        expectedResult: 'Payment fails gracefully with clear error message',
        testData: '4000 0000 0000 0002 (declined card)',
        status: 'pending'
      },
      {
        id: 'verify-no-subscription',
        title: 'Verify No Subscription Created',
        description: 'Check that failed payment did not create subscription',
        expectedResult: 'User remains on current tier, no charges applied',
        status: 'pending'
      },
      {
        id: 'retry-payment',
        title: 'Retry with Valid Card',
        description: 'Attempt upgrade again with successful test card',
        expectedResult: 'Payment succeeds after previous failure',
        testData: '4242 4242 4242 4242',
        status: 'pending'
      }
    ]
  },
  {
    id: 'subscription-management',
    name: 'Subscription Management',
    description: 'Test subscription changes via customer portal',
    steps: [
      {
        id: 'access-customer-portal',
        title: 'Access Customer Portal',
        description: 'Click "Manage Subscription" button from settings',
        expectedResult: 'Redirected to Stripe Customer Portal',
        status: 'pending'
      },
      {
        id: 'update-payment-method',
        title: 'Update Payment Method',
        description: 'Change payment method in customer portal',
        expectedResult: 'Payment method updated successfully',
        status: 'pending'
      },
      {
        id: 'downgrade-subscription',
        title: 'Downgrade Subscription',
        description: 'Change from Premium to Basic plan',
        expectedResult: 'Downgrade scheduled for next billing cycle',
        status: 'pending'
      },
      {
        id: 'verify-downgrade-access',
        title: 'Verify Feature Access During Downgrade',
        description: 'Check that premium features remain accessible until billing cycle end',
        expectedResult: 'Premium features still accessible, downgrade pending message shown',
        status: 'pending'
      },
      {
        id: 'cancel-subscription',
        title: 'Cancel Subscription',
        description: 'Cancel subscription via customer portal',
        expectedResult: 'Cancellation scheduled for end of billing period',
        status: 'pending'
      }
    ]
  },
  {
    id: 'mobile-testing',
    name: 'Mobile Subscription Flow',
    description: 'Test subscription flows on mobile devices',
    steps: [
      {
        id: 'mobile-pricing-display',
        title: 'Mobile Pricing Display',
        description: 'Check pricing page layout on mobile (viewport < 768px)',
        expectedResult: 'Plans stack vertically, all content readable, buttons accessible',
        status: 'pending'
      },
      {
        id: 'mobile-checkout-flow',
        title: 'Mobile Checkout Flow',
        description: 'Complete subscription upgrade on mobile',
        expectedResult: 'Stripe checkout renders properly, payment form usable on mobile',
        status: 'pending'
      },
      {
        id: 'mobile-touch-targets',
        title: 'Mobile Touch Targets',
        description: 'Verify all buttons meet 44px minimum touch target size',
        expectedResult: 'All subscription-related buttons are easily tappable',
        status: 'pending'
      }
    ]
  },
  {
    id: 'feature-gating',
    name: 'Feature Gating Validation',
    description: 'Test that premium features are properly gated',
    steps: [
      {
        id: 'test-basic-tier-limits',
        title: 'Test Basic Tier Limits',
        description: 'As basic user, try to access premium features',
        expectedResult: 'Upgrade prompts shown, premium features blocked',
        status: 'pending'
      },
      {
        id: 'test-premium-unlock',
        title: 'Test Premium Feature Unlock',
        description: 'After upgrading, verify premium features are accessible',
        expectedResult: 'Previously blocked features now accessible',
        status: 'pending'
      },
      {
        id: 'test-expired-subscription',
        title: 'Test Expired Subscription Handling',
        description: 'Simulate expired subscription and test feature access',
        expectedResult: 'Features revert to basic tier, graceful degradation',
        status: 'pending'
      }
    ]
  }
];

export const StripeSubscriptionManualTester: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>(createTestSuites());
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSuite, setSelectedSuite] = useState<string>('');

  const updateStepStatus = (suiteId: string, stepId: string, status: TestStep['status'], actualResult?: string, notes?: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            steps: suite.steps.map(step => 
              step.id === stepId 
                ? { ...step, status, actualResult, notes }
                : step
            )
          }
        : suite
    ));
  };

  const getStatusIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestStep['status']) => {
    const variants: Record<string, any> = {
      pass: 'default',
      fail: 'destructive', 
      warning: 'secondary',
      pending: 'outline'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      tester: 'Manual QA Tester',
      summary: {
        total_suites: testSuites.length,
        total_steps: testSuites.reduce((sum, suite) => sum + suite.steps.length, 0),
        passed_steps: testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'pass').length, 0),
        failed_steps: testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'fail').length, 0),
        warning_steps: testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'warning').length, 0)
      },
      test_suites: testSuites
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stripe-subscription-manual-test-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Test report downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe Subscription Manual Testing Suite
          </CardTitle>
          <CardDescription>
            Comprehensive manual testing guide for subscription upgrade, downgrade, and payment flows
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test-cards">Test Cards</TabsTrigger>
          <TabsTrigger value="test-suites">Test Suites</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
              <CardDescription>Follow these steps to manually test Stripe subscription flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Before You Start:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Ensure you have a test user account logged in</li>
                  <li>Verify STRIPE_SECRET_KEY is configured in Supabase secrets</li>
                  <li>Check that subscription pricing plans are properly set up</li>
                  <li>Have access to the test email account for confirmation emails</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Testing Environment:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Use Stripe test mode (all test cards are sandbox only)</li>
                  <li>Test on desktop and mobile browsers</li>
                  <li>Document any errors or unexpected behavior</li>
                  <li>Take screenshots of key steps and results</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Key Areas to Focus On:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">Payment Processing</span>
                    </div>
                    <p className="text-sm text-gray-600">Successful payments, declines, errors</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Feature Gating</span>
                    </div>
                    <p className="text-sm text-gray-600">Premium feature access control</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email Notifications</span>
                    </div>
                    <p className="text-sm text-gray-600">Subscription confirmations, receipts</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Mobile Experience</span>
                    </div>
                    <p className="text-sm text-gray-600">Touch targets, responsive design</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Test Card Numbers</CardTitle>
              <CardDescription>Use these test cards to simulate different payment scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {STRIPE_TEST_CARDS.map((card, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    card.type === 'success' ? 'border-green-200 bg-green-50' :
                    card.type === 'decline' ? 'border-red-200 bg-red-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-lg font-medium">{card.number}</div>
                      <Badge variant={card.type === 'success' ? 'default' : card.type === 'decline' ? 'destructive' : 'secondary'}>
                        {card.type}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{card.description}</div>
                    <div className="text-sm text-gray-600">{card.expectedOutcome}</div>
                  </div>
                ))}
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Additional Test Data:</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>Expiry:</strong> Any future date (e.g., 12/25)</li>
                    <li><strong>CVC:</strong> Any 3-digit number (e.g., 123)</li>
                    <li><strong>ZIP:</strong> Any 5-digit number (e.g., 12345)</li>
                    <li><strong>Email:</strong> Any valid email format</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-suites" className="space-y-4">
          {testSuites.map((suite) => (
            <Card key={suite.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{suite.name}</span>
                  <Badge variant="outline">
                    {suite.steps.filter(s => s.status === 'pass').length}/{suite.steps.length} passed
                  </Badge>
                </CardTitle>
                <CardDescription>{suite.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suite.steps.map((step) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(step.status)}
                          <h4 className="font-medium">{step.title}</h4>
                        </div>
                        {getStatusBadge(step.status)}
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Description:</span>
                          <p className="text-gray-600 mt-1">{step.description}</p>
                        </div>
                        
                        {step.testData && (
                          <div>
                            <span className="font-medium">Test Data:</span>
                            <p className="font-mono text-blue-600 mt-1">{step.testData}</p>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium">Expected Result:</span>
                          <p className="text-gray-600 mt-1">{step.expectedResult}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateStepStatus(suite.id, step.id, 'pass')}
                          >
                            Pass
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateStepStatus(suite.id, step.id, 'fail')}
                          >
                            Fail
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => updateStepStatus(suite.id, step.id, 'warning')}
                          >
                            Warning
                          </Button>
                        </div>

                        {step.status !== 'pending' && (
                          <div className="mt-3 space-y-2">
                            <Textarea
                              placeholder="Enter actual result and any notes..."
                              value={step.actualResult || ''}
                              onChange={(e) => updateStepStatus(suite.id, step.id, step.status, e.target.value, step.notes)}
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test Results Summary
                <Button onClick={generateReport} size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'pass').length, 0)}
                  </div>
                  <div className="text-sm text-green-700">Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'fail').length, 0)}
                  </div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'warning').length, 0)}
                  </div>
                  <div className="text-sm text-yellow-700">Warnings</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {testSuites.reduce((sum, suite) => sum + suite.steps.filter(s => s.status === 'pending').length, 0)}
                  </div>
                  <div className="text-sm text-gray-700">Pending</div>
                </div>
              </div>

              <div className="space-y-4">
                {testSuites.map((suite) => {
                  const failed = suite.steps.filter(s => s.status === 'fail');
                  const warnings = suite.steps.filter(s => s.status === 'warning');
                  
                  if (failed.length === 0 && warnings.length === 0) return null;
                  
                  return (
                    <div key={suite.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">{suite.name} - Issues Found</h4>
                      
                      {failed.map((step) => (
                        <div key={step.id} className="mb-3 p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-900">{step.title}</span>
                          </div>
                          {step.actualResult && (
                            <p className="text-sm text-red-700">{step.actualResult}</p>
                          )}
                        </div>
                      ))}
                      
                      {warnings.map((step) => (
                        <div key={step.id} className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-yellow-900">{step.title}</span>
                          </div>
                          {step.actualResult && (
                            <p className="text-sm text-yellow-700">{step.actualResult}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
                
                {testSuites.every(suite => 
                  suite.steps.filter(s => s.status === 'fail' || s.status === 'warning').length === 0
                ) && (
                  <div className="text-center p-8 bg-green-50 rounded-lg">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-green-900 mb-2">All Tests Passed!</h3>
                    <p className="text-green-700">No issues found in the subscription flow testing.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};