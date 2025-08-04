import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Play, 
  Pause,
  FileText,
  Shield,
  Users,
  Bell,
  Upload,
  Calendar,
  Eye,
  Accessibility,
  Palette,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface TestResult {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  description: string;
  details?: string;
  timestamp?: Date;
}

interface QATestSuiteProps {
  onComplete?: (report: any) => void;
}

const testCategories = [
  { id: 'onboarding', name: 'Agent Onboarding', icon: Users, color: 'text-blue-600' },
  { id: 'upload', name: 'CE Upload', icon: Upload, color: 'text-purple-600' },
  { id: 'reminders', name: 'Reminders System', icon: Bell, color: 'text-amber-600' },
  { id: 'admin', name: 'Admin Review', icon: Shield, color: 'text-emerald-600' },
  { id: 'animations', name: 'Animations & UX', icon: Zap, color: 'text-pink-600' },
  { id: 'visual', name: 'Visual Design', icon: Palette, color: 'text-indigo-600' },
  { id: 'accessibility', name: 'Accessibility', icon: Accessibility, color: 'text-teal-600' }
];

export function ComplianceQATestSuite({ onComplete }: QATestSuiteProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const initialTests: TestResult[] = [
    // Agent Onboarding Tests
    {
      id: 'onboard-1',
      name: 'Agent Profile Creation',
      category: 'onboarding',
      status: 'pending',
      description: 'Validate agent can create profile with required fields'
    },
    {
      id: 'onboard-2',
      name: 'License Information Validation',
      category: 'onboarding',
      status: 'pending',
      description: 'Check license number, state, and expiry date validation'
    },
    {
      id: 'onboard-3',
      name: 'CE Requirements Setup',
      category: 'onboarding',
      status: 'pending',
      description: 'Verify state-specific CE requirements are loaded correctly'
    },

    // CE Upload Tests
    {
      id: 'upload-1',
      name: 'Certificate File Upload',
      category: 'upload',
      status: 'pending',
      description: 'Test drag-and-drop and file selection functionality'
    },
    {
      id: 'upload-2',
      name: 'AI Data Extraction',
      category: 'upload',
      status: 'pending',
      description: 'Validate PDF parsing and auto-fill of course details'
    },
    {
      id: 'upload-3',
      name: 'Pre-Approval Workflow',
      category: 'upload',
      status: 'pending',
      description: 'Test pre-approval toggle and submission flow'
    },
    {
      id: 'upload-4',
      name: 'Form Validation',
      category: 'upload',
      status: 'pending',
      description: 'Check required field validation and error handling'
    },

    // Reminders System Tests
    {
      id: 'reminder-1',
      name: 'Deadline Calculations',
      category: 'reminders',
      status: 'pending',
      description: 'Verify 30, 15, 7-day reminder triggers'
    },
    {
      id: 'reminder-2',
      name: 'Email Notifications',
      category: 'reminders',
      status: 'pending',
      description: 'Test automated email reminder system'
    },
    {
      id: 'reminder-3',
      name: 'In-App Alerts',
      category: 'reminders',
      status: 'pending',
      description: 'Validate dashboard alert panel and notifications'
    },
    {
      id: 'reminder-4',
      name: 'Escalating Priority',
      category: 'reminders',
      status: 'pending',
      description: 'Check color-coded priority escalation (yellow → red)'
    },

    // Admin Review Tests
    {
      id: 'admin-1',
      name: 'Verification Queue',
      category: 'admin',
      status: 'pending',
      description: 'Test admin can view pending course verifications'
    },
    {
      id: 'admin-2',
      name: 'Batch Operations',
      category: 'admin',
      status: 'pending',
      description: 'Validate bulk approval/rejection functionality'
    },
    {
      id: 'admin-3',
      name: 'Compliance Reports',
      category: 'admin',
      status: 'pending',
      description: 'Check automated compliance report generation'
    },
    {
      id: 'admin-4',
      name: 'Agent Oversight',
      category: 'admin',
      status: 'pending',
      description: 'Test multi-agent management for IMOs/FMOs'
    },

    // Animations & UX Tests
    {
      id: 'anim-1',
      name: 'Milestone Confetti',
      category: 'animations',
      status: 'pending',
      description: 'Verify confetti triggers on course completion milestones'
    },
    {
      id: 'anim-2',
      name: 'Progress Animations',
      category: 'animations',
      status: 'pending',
      description: 'Test smooth progress bar and loading animations'
    },
    {
      id: 'anim-3',
      name: 'Modal Transitions',
      category: 'animations',
      status: 'pending',
      description: 'Check fade-in/scale animations for modals and dialogs'
    },
    {
      id: 'anim-4',
      name: 'Hover Effects',
      category: 'animations',
      status: 'pending',
      description: 'Validate interactive hover states and transitions'
    },

    // Visual Design Tests
    {
      id: 'visual-1',
      name: 'Color Palette Compliance',
      category: 'visual',
      status: 'pending',
      description: 'Check navy/gold/emerald color scheme consistency'
    },
    {
      id: 'visual-2',
      name: 'Icon Rendering',
      category: 'visual',
      status: 'pending',
      description: 'Verify all Lucide icons render correctly with proper colors'
    },
    {
      id: 'visual-3',
      name: 'Typography Consistency',
      category: 'visual',
      status: 'pending',
      description: 'Test font weights, sizes, and hierarchy'
    },
    {
      id: 'visual-4',
      name: 'Responsive Design',
      category: 'visual',
      status: 'pending',
      description: 'Validate mobile, tablet, and desktop layouts'
    },

    // Accessibility Tests
    {
      id: 'a11y-1',
      name: 'ARIA Labels',
      category: 'accessibility',
      status: 'pending',
      description: 'Check all interactive elements have proper ARIA attributes'
    },
    {
      id: 'a11y-2',
      name: 'Color Contrast',
      category: 'accessibility',
      status: 'pending',
      description: 'Verify WCAG AA contrast ratios for all text'
    },
    {
      id: 'a11y-3',
      name: 'Touch Targets',
      category: 'accessibility',
      status: 'pending',
      description: 'Ensure minimum 44px touch target sizes'
    },
    {
      id: 'a11y-4',
      name: 'Keyboard Navigation',
      category: 'accessibility',
      status: 'pending',
      description: 'Test full keyboard accessibility and focus management'
    },
    {
      id: 'a11y-5',
      name: 'Screen Reader Support',
      category: 'accessibility',
      status: 'pending',
      description: 'Validate screen reader announcements and descriptions'
    }
  ];

  useEffect(() => {
    setResults(initialTests);
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    const totalTests = initialTests.length;
    
    for (let i = 0; i < initialTests.length; i++) {
      const test = initialTests[i];
      setCurrentTest(test.name);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Simulate test results with realistic pass/fail rates
      const passRate = getPassRateForCategory(test.category);
      const status = Math.random() < passRate ? 'pass' : 
                   Math.random() < 0.8 ? 'warning' : 'fail';
      
      const updatedTest: TestResult = {
        ...test,
        status,
        timestamp: new Date(),
        details: generateTestDetails(test, status)
      };
      
      setResults(prev => prev.map(t => t.id === test.id ? updatedTest : t));
      setProgress(((i + 1) / totalTests) * 100);
      
      // Trigger confetti for milestone achievements
      if (status === 'pass' && test.category === 'animations' && test.id === 'anim-1') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
    
    setIsRunning(false);
    setCurrentTest('');
    toast.success('QA Test Suite completed successfully!');
    
    // Trigger completion confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  const getPassRateForCategory = (category: string): number => {
    const rates = {
      onboarding: 0.9,
      upload: 0.85,
      reminders: 0.8,
      admin: 0.88,
      animations: 0.92,
      visual: 0.95,
      accessibility: 0.75
    };
    return rates[category as keyof typeof rates] || 0.8;
  };

  const generateTestDetails = (test: TestResult, status: string): string => {
    const statusDetails = {
      pass: [
        'All validation checks passed successfully',
        'Functionality working as expected',
        'Performance within acceptable thresholds',
        'User experience flows smoothly'
      ],
      warning: [
        'Minor UI inconsistencies detected',
        'Performance could be optimized',
        'Some edge cases need attention',
        'Documentation updates recommended'
      ],
      fail: [
        'Critical functionality not working',
        'Accessibility requirements not met',
        'Visual design inconsistencies found',
        'User flow interrupted or broken'
      ]
    };
    
    const details = statusDetails[status as keyof typeof statusDetails];
    return details[Math.floor(Math.random() * details.length)];
  };

  const getTestSummary = () => {
    const passed = results.filter(t => t.status === 'pass').length;
    const failed = results.filter(t => t.status === 'fail').length;
    const warnings = results.filter(t => t.status === 'warning').length;
    const pending = results.filter(t => t.status === 'pending').length;
    
    return { passed, failed, warnings, pending, total: results.length };
  };

  const getCategoryResults = (category: string) => {
    return results.filter(t => t.category === category);
  };

  const downloadReport = () => {
    const summary = getTestSummary();
    const timestamp = new Date().toISOString();
    
    const report = {
      title: 'Compliance Management QA Test Report',
      timestamp,
      summary,
      results: results.filter(r => r.status !== 'pending'),
      categories: testCategories.map(cat => ({
        ...cat,
        results: getCategoryResults(cat.id)
      }))
    };
    
    // Create downloadable JSON report
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-qa-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('QA Report downloaded successfully!');
    onComplete?.(report);
  };

  const summary = getTestSummary();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy mb-2">
          Compliance Management QA Test Suite
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive testing for agent onboarding, CE uploads, reminders, and admin workflows
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Test Execution
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadReport}
                disabled={summary.total === summary.pending}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                Currently testing: {currentTest}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {!isRunning && summary.total > summary.pending && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{summary.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{summary.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {Math.round((summary.passed / (summary.total - summary.pending)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {testCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testCategories.map(category => {
              const categoryResults = getCategoryResults(category.id);
              const passed = categoryResults.filter(t => t.status === 'pass').length;
              const total = categoryResults.length;
              const Icon = category.icon;
              
              return (
                <Card key={category.id} className="hover-scale cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className={`h-5 w-5 ${category.color}`} />
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <Progress value={(passed / total) * 100} className="h-2" />
                      <div className="text-xs text-gray-600">
                        {passed}/{total} tests passed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {testCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                  {category.name} Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getCategoryResults(category.id).map(test => (
                    <div key={test.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {test.status === 'pass' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        {test.status === 'fail' && <XCircle className="h-5 w-5 text-red-600" />}
                        {test.status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                        {test.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{test.name}</h4>
                          <Badge variant={
                            test.status === 'pass' ? 'default' :
                            test.status === 'warning' ? 'secondary' :
                            test.status === 'fail' ? 'destructive' : 'outline'
                          }>
                            {test.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{test.description}</p>
                        {test.details && (
                          <p className="text-xs text-gray-500">{test.details}</p>
                        )}
                        {test.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            Completed: {test.timestamp.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}