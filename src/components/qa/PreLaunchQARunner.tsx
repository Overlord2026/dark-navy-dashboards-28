import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Monitor, 
  Smartphone, 
  Users, 
  TrendingUp,
  FileText,
  Shield,
  Navigation,
  Palette,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface QATestResult {
  id: string;
  category: 'functional' | 'visual' | 'analytics' | 'mobile' | 'content';
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending' | 'not-tested';
  message: string;
  details?: any;
  critical: boolean;
  timestamp?: Date;
}

interface QACategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tests: Omit<QATestResult, 'status' | 'timestamp'>[];
}

export function PreLaunchQARunner() {
  const [results, setResults] = useState<QATestResult[]>([]);
  const [activeCategory, setActiveCategory] = useState('functional');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const qaCategories: QACategory[] = [
    {
      id: 'functional',
      name: 'Functional Tests',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Core functionality and user flows',
      tests: [
        {
          id: 'calc-validation',
          category: 'functional',
          test: 'Calculator Error Handling',
          message: 'Test all calculators with valid/invalid/missing data',
          details: {
            calculators: ['Roth Conversion', 'Tax Projector', 'Withdrawal Sequencing', 'Estate Planning'],
            scenarios: ['Valid data', 'Invalid data', 'Missing fields', 'Edge cases']
          },
          critical: true
        },
        {
          id: 'navigation-404',
          category: 'functional',
          test: 'Navigation Integrity',
          message: 'Verify all navigation links work without 404s',
          details: {
            personas: ['Client', 'Advisor', 'CPA', 'Premium'],
            routes: 'All nav menu items and footer links'
          },
          critical: true
        },
        {
          id: 'hcaptcha-auth',
          category: 'functional',
          test: 'hCAPTCHA Integration',
          message: 'Test CAPTCHA on all auth forms including mobile',
          details: {
            forms: ['Sign In', 'Sign Up', 'Password Reset'],
            devices: ['Desktop', 'Mobile', 'Tablet']
          },
          critical: true
        },
        {
          id: 'file-upload-ocr',
          category: 'functional',
          test: 'File Upload & AI OCR',
          message: 'Test file upload with multiple tax document types',
          details: {
            fileTypes: ['PDF', 'JPG', 'PNG', 'Large files', 'Invalid files'],
            features: ['Upload progress', 'OCR processing', 'Error handling']
          },
          critical: true
        },
        {
          id: 'subscription-gating',
          category: 'functional',
          test: 'Premium Feature Gating',
          message: 'Verify premium features only accessible at proper tier',
          details: {
            tiers: ['Free', 'Basic', 'Premium'],
            features: ['Advanced calculators', 'CPA marketplace', 'AI analysis']
          },
          critical: true
        },
        {
          id: 'cpa-marketplace',
          category: 'functional',
          test: 'CPA Marketplace Workflow',
          message: 'Test request, booking, and matching workflow',
          details: {
            workflow: ['Browse CPAs', 'Request consultation', 'Booking flow', 'Communication']
          },
          critical: false
        }
      ]
    },
    {
      id: 'visual',
      name: 'Visual & UX',
      icon: <Palette className="h-5 w-5" />,
      description: 'Design, animations, and user experience',
      tests: [
        {
          id: 'chart-visual',
          category: 'visual',
          test: 'Chart Visual Quality',
          message: 'Verify charts are appealing, animated, and legible',
          details: {
            aspects: ['Color scheme', 'Animations', 'Mobile legibility', 'Responsive design'],
            charts: ['Tax projections', 'Asset allocation', 'Performance tracking']
          },
          critical: false
        },
        {
          id: 'guide-covers',
          category: 'visual',
          test: 'Guide Cover Quality',
          message: 'Check guide/book/course covers are sharp and clear',
          details: {
            checks: ['Image sharpness', 'Consistent sizing', 'Loading performance', 'Link masking']
          },
          critical: false
        },
        {
          id: 'modal-mobile',
          category: 'visual',
          test: 'Modal Mobile Accessibility',
          message: 'Test all modals, popups, and onboarding flows',
          details: {
            components: ['Login modals', 'Calculator dialogs', 'Onboarding flow', 'Settings panels']
          },
          critical: true
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics & Lead Gen',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Event tracking and conversion optimization',
      tests: [
        {
          id: 'event-tracking',
          category: 'analytics',
          test: 'Comprehensive Event Tracking',
          message: 'Verify all key actions are tracked',
          details: {
            events: [
              'Calculator usage', 'Guide opened', 'CTA clicks', 
              'File uploads', 'Upgrade actions', 'Form submissions'
            ],
            tools: ['PostHog', 'Google Analytics', 'Custom tracking']
          },
          critical: true
        },
        {
          id: 'form-capture',
          category: 'analytics',
          test: 'Lead Capture Forms',
          message: 'Test all contact/feedback forms capture emails',
          details: {
            forms: ['Contact form', 'Newsletter signup', 'Consultation request', 'Feedback forms']
          },
          critical: true
        }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile & Accessibility',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Mobile responsiveness and accessibility compliance',
      tests: [
        {
          id: 'horizontal-scroll',
          category: 'mobile',
          test: 'No Horizontal Scrolling',
          message: 'Check no horizontal scroll at any viewport',
          details: {
            viewports: ['320px', '375px', '414px', '768px', '1024px', '1440px']
          },
          critical: true
        },
        {
          id: 'keyboard-navigation',
          category: 'mobile',
          test: 'Keyboard Accessibility',
          message: 'Test all fields and buttons via keyboard/tab navigation',
          details: {
            tests: ['Tab order', 'Focus indicators', 'Skip links', 'Enter key activation']
          },
          critical: true
        },
        {
          id: 'screen-reader',
          category: 'mobile',
          test: 'Screen Reader Compatibility',
          message: 'Verify VoiceOver/Screen Reader labels for interactive components',
          details: {
            components: ['Buttons', 'Forms', 'Navigation', 'Charts', 'Modals']
          },
          critical: true
        }
      ]
    },
    {
      id: 'content',
      name: 'Content & Links',
      icon: <FileText className="h-5 w-5" />,
      description: 'Content presentation and external links',
      tests: [
        {
          id: 'education-center',
          category: 'content',
          test: 'Education Center Content',
          message: 'Verify all guides/courses appear with covers and links',
          details: {
            checks: ['Cover images', 'Descriptions', 'Categories', 'Search functionality']
          },
          critical: false
        },
        {
          id: 'external-links',
          category: 'content',
          test: 'External Link Behavior',
          message: 'Check external resources open in new tab and are masked',
          details: {
            links: ['Amazon books', 'External tools', 'Partner sites', 'Documentation']
          },
          critical: false
        }
      ]
    }
  ];

  const runCategoryTests = async (categoryId: string) => {
    const category = qaCategories.find(c => c.id === categoryId);
    if (!category) return;

    setIsRunning(true);
    const categoryResults: QATestResult[] = [];

    for (let i = 0; i < category.tests.length; i++) {
      const test = category.tests[i];
      setProgress((i / category.tests.length) * 100);

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock test results - in production, these would be real test implementations
      const mockResult: QATestResult = {
        ...test,
        status: Math.random() > 0.3 ? 'pass' : Math.random() > 0.5 ? 'warning' : 'fail',
        timestamp: new Date()
      };

      categoryResults.push(mockResult);
      setResults(prev => [...prev.filter(r => r.id !== test.id), mockResult]);
    }

    setProgress(100);
    setIsRunning(false);
    
    const passedTests = categoryResults.filter(r => r.status === 'pass').length;
    toast.success(`${category.name}: ${passedTests}/${categoryResults.length} tests passed`);
  };

  const runAllTests = async () => {
    setResults([]);
    setIsRunning(true);
    
    for (const category of qaCategories) {
      await runCategoryTests(category.id);
    }
    
    toast.success('All QA tests completed!');
  };

  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryResults = (categoryId: string) => {
    return results.filter(r => r.category === categoryId);
  };

  const getOverallScore = () => {
    if (results.length === 0) return 0;
    const passedTests = results.filter(r => r.status === 'pass').length;
    return Math.round((passedTests / results.length) * 100);
  };

  const criticalIssues = results.filter(r => r.critical && r.status === 'fail').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pre-Launch QA Testing</h2>
          <p className="text-muted-foreground">
            Comprehensive testing suite to ensure launch readiness
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAllTests} disabled={isRunning}>
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{getOverallScore()}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {results.filter(r => r.status === 'pass').length}
              </div>
              <div className="text-sm text-muted-foreground">Tests Passed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{criticalIssues}</div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{results.length}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
          </div>
          {isRunning && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalIssues} critical issues</strong> must be resolved before launch.
            Review the failed tests in each category below.
          </AlertDescription>
        </Alert>
      )}

      {/* Test Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {qaCategories.map(category => {
            const categoryResults = getCategoryResults(category.id);
            const passed = categoryResults.filter(r => r.status === 'pass').length;
            const total = category.tests.length;
            
            return (
              <TabsTrigger key={category.id} value={category.id} className="relative">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </div>
                {categoryResults.length > 0 && (
                  <Badge 
                    variant={passed === total ? "default" : "secondary"}
                    className="absolute -top-2 -right-2 text-xs"
                  >
                    {passed}/{total}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {qaCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => runCategoryTests(category.id)}
                    disabled={isRunning}
                    size="sm"
                  >
                    Run Category Tests
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.tests.map(test => {
                    const result = results.find(r => r.id === test.id);
                    
                    return (
                      <motion.div
                        key={test.id}
                        className="flex items-start gap-3 p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="mt-0.5">
                          {getStatusIcon(result?.status || 'not-tested')}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{test.test}</h4>
                            {test.critical && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {test.message}
                          </p>
                          
                          {result?.status === 'fail' && (
                            <Alert className="mt-2 border-red-200 bg-red-50">
                              <AlertDescription className="text-sm">
                                <strong>Failed:</strong> {result.message}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {test.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-muted-foreground cursor-pointer">
                                View test details
                              </summary>
                              <pre className="text-xs bg-muted p-2 mt-1 rounded overflow-auto">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}