import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Shield,
  Users,
  CreditCard,
  Monitor,
  Bug,
  Rocket,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface QACategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  score: number;
  total: number;
  blockers: string[];
  warnings: string[];
  details: QATest[];
}

interface QATest {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface LaunchRecommendation {
  decision: 'go' | 'no-go' | 'conditional';
  confidence: number;
  reasoning: string[];
  blockers: string[];
  conditions: string[];
  timeline: string;
}

export const GoNoGoQAReport: React.FC = () => {
  const [categories, setCategories] = useState<QACategory[]>([]);
  const [recommendation, setRecommendation] = useState<LaunchRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock data - In real implementation, this would fetch from actual test results
  const initializeTestData = () => {
    const testCategories: QACategory[] = [
      {
        id: 'api-integrations',
        name: 'API Integrations',
        icon: <Shield className="h-5 w-5" />,
        status: 'pass',
        score: 9,
        total: 10,
        blockers: [],
        warnings: ['Plaid sandbox rate limiting detected'],
        details: [
          { name: 'Plaid Sandbox Connection', status: 'pass', message: 'All endpoints responding', priority: 'high', category: 'api' },
          { name: 'Stripe Payment Processing', status: 'pass', message: 'Test payments successful', priority: 'high', category: 'api' },
          { name: 'Resend Email Service', status: 'pass', message: 'Email delivery confirmed', priority: 'high', category: 'api' },
          { name: 'Supabase Database', status: 'pass', message: 'All queries executing', priority: 'high', category: 'api' },
          { name: 'Edge Functions', status: 'pass', message: 'All functions deployed', priority: 'medium', category: 'api' },
          { name: 'File Upload Storage', status: 'pass', message: 'Storage buckets configured', priority: 'medium', category: 'api' },
          { name: 'Authentication Flow', status: 'pass', message: 'Login/logout working', priority: 'high', category: 'api' },
          { name: 'Password Reset', status: 'pass', message: 'Email reset flow working', priority: 'medium', category: 'api' },
          { name: 'Rate Limiting', status: 'warning', message: 'Some limits reached in testing', priority: 'low', category: 'api' },
          { name: 'Error Handling', status: 'pass', message: 'Graceful error responses', priority: 'medium', category: 'api' }
        ]
      },
      {
        id: 'onboarding-flows',
        name: 'Onboarding Flows',
        icon: <Users className="h-5 w-5" />,
        status: 'warning',
        score: 6,
        total: 8,
        blockers: [],
        warnings: ['Attorney onboarding incomplete', 'Mobile UX issues on small screens'],
        details: [
          { name: 'Client Onboarding', status: 'pass', message: 'Complete flow tested', priority: 'high', category: 'onboarding' },
          { name: 'Advisor Onboarding', status: 'pass', message: 'All steps working', priority: 'high', category: 'onboarding' },
          { name: 'Accountant Onboarding', status: 'pass', message: 'Professional setup complete', priority: 'medium', category: 'onboarding' },
          { name: 'Attorney Onboarding', status: 'warning', message: 'Legal resource setup incomplete', priority: 'medium', category: 'onboarding' },
          { name: 'Consultant Onboarding', status: 'pass', message: 'Business setup working', priority: 'medium', category: 'onboarding' },
          { name: 'Insurance Agent Setup', status: 'pass', message: 'Compliance tracking active', priority: 'medium', category: 'onboarding' },
          { name: 'Admin Setup', status: 'pass', message: 'System admin access granted', priority: 'low', category: 'onboarding' },
          { name: 'Mobile Onboarding UX', status: 'warning', message: 'Touch targets need adjustment', priority: 'high', category: 'onboarding' }
        ]
      },
      {
        id: 'payment-subscription',
        name: 'Payment & Subscription',
        icon: <CreditCard className="h-5 w-5" />,
        status: 'pass',
        score: 8,
        total: 8,
        blockers: [],
        warnings: [],
        details: [
          { name: 'Subscription Creation', status: 'pass', message: 'All tiers working', priority: 'high', category: 'payment' },
          { name: 'Payment Processing', status: 'pass', message: 'Stripe integration stable', priority: 'high', category: 'payment' },
          { name: 'Upgrade/Downgrade', status: 'pass', message: 'Tier changes working', priority: 'high', category: 'payment' },
          { name: 'Cancellation Flow', status: 'pass', message: 'Clean cancellation process', priority: 'medium', category: 'payment' },
          { name: 'Failed Payment Handling', status: 'pass', message: 'Retry logic working', priority: 'medium', category: 'payment' },
          { name: 'Refund Processing', status: 'pass', message: 'Manual refunds tested', priority: 'low', category: 'payment' },
          { name: 'Tax Calculation', status: 'pass', message: 'Stripe Tax enabled', priority: 'medium', category: 'payment' },
          { name: 'Invoice Generation', status: 'pass', message: 'Automated billing working', priority: 'medium', category: 'payment' }
        ]
      },
      {
        id: 'ui-ux-accessibility',
        name: 'UI/UX & Accessibility',
        icon: <Monitor className="h-5 w-5" />,
        status: 'warning',
        score: 7,
        total: 10,
        blockers: [],
        warnings: ['Touch targets below 44px on mobile', 'Color contrast issues in dark mode', 'Missing alt text on some images'],
        details: [
          { name: 'Desktop Responsiveness', status: 'pass', message: 'All breakpoints working', priority: 'high', category: 'ui' },
          { name: 'Mobile Responsiveness', status: 'warning', message: 'Some touch targets too small', priority: 'high', category: 'ui' },
          { name: 'Touch Target Size (44px+)', status: 'warning', message: '12 elements below minimum', priority: 'high', category: 'ui' },
          { name: 'Color Contrast (WCAG AA)', status: 'warning', message: 'Dark mode contrast issues', priority: 'medium', category: 'ui' },
          { name: 'Keyboard Navigation', status: 'pass', message: 'Tab order logical', priority: 'medium', category: 'ui' },
          { name: 'Screen Reader Support', status: 'pass', message: 'ARIA labels present', priority: 'medium', category: 'ui' },
          { name: 'Image Alt Text', status: 'warning', message: '5 images missing alt text', priority: 'medium', category: 'ui' },
          { name: 'Form Validation', status: 'pass', message: 'Clear error messages', priority: 'high', category: 'ui' },
          { name: 'Loading States', status: 'pass', message: 'Consistent loading indicators', priority: 'medium', category: 'ui' },
          { name: 'Error Boundaries', status: 'pass', message: 'Graceful error handling', priority: 'medium', category: 'ui' }
        ]
      }
    ];

    setCategories(testCategories);
    calculateRecommendation(testCategories);
    setLastUpdated(new Date());
  };

  const calculateRecommendation = (cats: QACategory[]) => {
    const totalBlockers = cats.reduce((sum, cat) => sum + cat.blockers.length, 0);
    const totalWarnings = cats.reduce((sum, cat) => sum + cat.warnings.length, 0);
    const overallScore = cats.reduce((sum, cat) => sum + (cat.score / cat.total), 0) / cats.length;
    const criticalFailures = cats.filter(cat => cat.status === 'fail' && ['api-integrations', 'payment-subscription'].includes(cat.id));

    let decision: LaunchRecommendation['decision'] = 'go';
    let confidence = Math.round(overallScore * 100);
    let reasoning: string[] = [];
    let blockers: string[] = [];
    let conditions: string[] = [];
    let timeline = 'Ready for immediate launch';

    // Determine decision
    if (totalBlockers > 0 || criticalFailures.length > 0) {
      decision = 'no-go';
      confidence = Math.min(confidence, 40);
      timeline = '1-2 weeks additional development needed';
      reasoning.push('Critical blockers identified in core functionality');
    } else if (totalWarnings > 5 || overallScore < 0.8) {
      decision = 'conditional';
      confidence = Math.min(confidence, 75);
      timeline = 'Launch possible with monitoring and quick fixes';
      reasoning.push('Multiple warnings present but no critical blockers');
    } else {
      reasoning.push('All critical systems operational');
      reasoning.push('Minor issues present but not launch-blocking');
    }

    // Gather blockers and conditions
    cats.forEach(cat => {
      blockers.push(...cat.blockers);
      if (cat.warnings.length > 0) {
        conditions.push(`Monitor ${cat.name.toLowerCase()}: ${cat.warnings.length} warnings`);
      }
    });

    if (decision === 'conditional') {
      conditions.push('Implement hotfix deployment capability');
      conditions.push('Monitor user feedback closely first 48 hours');
    }

    setRecommendation({
      decision,
      confidence,
      reasoning,
      blockers,
      conditions,
      timeline
    });
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    initializeTestData();
    setIsLoading(false);
    toast.success('QA report refreshed successfully');
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCategories: categories.length,
        passingCategories: categories.filter(c => c.status === 'pass').length,
        warningCategories: categories.filter(c => c.status === 'warning').length,
        failingCategories: categories.filter(c => c.status === 'fail').length,
        overallScore: categories.reduce((sum, cat) => sum + (cat.score / cat.total), 0) / categories.length
      },
      categories,
      recommendation,
      lastUpdated
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `go-no-go-qa-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    initializeTestData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4" />;
      case 'fail': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'go': return <Rocket className="h-6 w-6 text-green-600" />;
      case 'no-go': return <XCircle className="h-6 w-6 text-red-600" />;
      case 'conditional': return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default: return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'go': return 'bg-green-50 border-green-200';
      case 'no-go': return 'bg-red-50 border-red-200';
      case 'conditional': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Go/No-Go QA Summary Report</CardTitle>
              <CardDescription>
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshData} disabled={isLoading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={generateReport} disabled={!recommendation}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recommendation && (
            <div className={`p-6 rounded-lg border-2 ${getDecisionColor(recommendation.decision)}`}>
              <div className="flex items-center gap-4 mb-4">
                {getDecisionIcon(recommendation.decision)}
                <div>
                  <h3 className="text-xl font-bold capitalize">
                    {recommendation.decision === 'no-go' ? 'No-Go' : recommendation.decision} Decision
                  </h3>
                  <p className="text-sm opacity-75">Confidence: {recommendation.confidence}%</p>
                </div>
                <div className="ml-auto">
                  <Progress value={recommendation.confidence} className="w-32" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Reasoning</h4>
                  <ul className="text-sm space-y-1">
                    {recommendation.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm">{recommendation.timeline}</p>
                  
                  {recommendation.blockers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-red-600">Blockers</h4>
                      <ul className="text-sm space-y-1">
                        {recommendation.blockers.map((blocker, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="h-3 w-3 text-red-600 mt-1" />
                            {blocker}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {recommendation.conditions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-yellow-600">Conditions</h4>
                      <ul className="text-sm space-y-1">
                        {recommendation.conditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {category.icon}
                <CardTitle className="text-sm">{category.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(category.status)}
                <span className={`text-sm font-medium ${getStatusColor(category.status)}`}>
                  {category.score}/{category.total} PASS
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={(category.score / category.total) * 100} className="mb-2" />
              <div className="space-y-1">
                {category.blockers.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Bug className="h-3 w-3" />
                    {category.blockers.length} blockers
                  </div>
                )}
                {category.warnings.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <AlertTriangle className="h-3 w-3" />
                    {category.warnings.length} warnings
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="blockers">Blockers</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Test Coverage Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center">
                      <span className="text-sm">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(cat.score / cat.total) * 100} className="w-20" />
                        <span className="text-sm font-mono">{cat.score}/{cat.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">High Priority Issues</span>
                    <Badge variant="destructive">
                      {categories.reduce((sum, cat) => 
                        sum + cat.details.filter(d => d.priority === 'high' && d.status !== 'pass').length, 0
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Priority Issues</span>
                    <Badge variant="secondary">
                      {categories.reduce((sum, cat) => 
                        sum + cat.details.filter(d => d.priority === 'medium' && d.status !== 'pass').length, 0
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Priority Issues</span>
                    <Badge variant="outline">
                      {categories.reduce((sum, cat) => 
                        sum + cat.details.filter(d => d.priority === 'low' && d.status !== 'pass').length, 0
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockers" className="space-y-4">
          {categories.filter(cat => cat.blockers.length > 0).map(category => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  {category.name} - Critical Blockers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.blockers.map((blocker, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm">{blocker}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          {categories.every(cat => cat.blockers.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-600">No Critical Blockers</h3>
                <p className="text-sm text-muted-foreground">All critical functionality is working as expected.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          {categories.filter(cat => cat.warnings.length > 0).map(category => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  {category.name} - Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {categories.map(category => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name} - Detailed Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.details.map((test, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded border">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{test.name}</div>
                        <div className="text-xs text-muted-foreground">{test.message}</div>
                      </div>
                      <Badge variant={test.priority === 'high' ? 'destructive' : test.priority === 'medium' ? 'secondary' : 'outline'}>
                        {test.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>
                Priority actions to address before launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">High Priority (Pre-Launch)</h4>
                  <ul className="space-y-2 ml-4">
                    <li className="text-sm">• Fix mobile touch target sizes (44px minimum)</li>
                    <li className="text-sm">• Complete attorney onboarding flow</li>
                    <li className="text-sm">• Add missing image alt text</li>
                    <li className="text-sm">• Resolve dark mode color contrast issues</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-yellow-600">Medium Priority (Post-Launch)</h4>
                  <ul className="space-y-2 ml-4">
                    <li className="text-sm">• Optimize Plaid API rate limiting</li>
                    <li className="text-sm">• Enhance mobile UX for small screens</li>
                    <li className="text-sm">• Add more loading state indicators</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Monitoring (Ongoing)</h4>
                  <ul className="space-y-2 ml-4">
                    <li className="text-sm">• Set up error tracking and alerting</li>
                    <li className="text-sm">• Monitor API response times</li>
                    <li className="text-sm">• Track user onboarding completion rates</li>
                    <li className="text-sm">• Monitor payment success rates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};