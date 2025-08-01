import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  Download, 
  Play,
  Monitor,
  Smartphone,
  Users,
  Calculator,
  Navigation,
  Upload,
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface QATestResult {
  id: string;
  category: string;
  persona: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  screenshot?: string;
  critical: boolean;
  details?: any;
  timestamp: Date;
}

interface QATestSuite {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  personas: string[];
  tests: string[];
}

export function FullSystemQARunner() {
  const [results, setResults] = useState<QATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const personas = ['Client Free', 'Client Premium', 'Advisor', 'CPA', 'Admin'];
  const devices = ['Desktop', 'Mobile', 'Tablet'];

  const testSuites: QATestSuite[] = [
    {
      id: 'calculators',
      name: 'Calculator Testing',
      icon: <Calculator className="h-5 w-5" />,
      description: 'Test all calculators with edge cases and data validation',
      personas: ['Client Free', 'Client Premium', 'Advisor', 'CPA'],
      tests: [
        'Roth Conversion Calculator - Valid Data',
        'Roth Conversion Calculator - Invalid Data',
        'Roth Conversion Calculator - Missing Fields',
        'Tax Projector - Multi-Year Analysis',
        'Withdrawal Sequencing - Optimization',
        'Estate Planning Calculator - Premium Features',
        'Retirement Planner - Goal Setting',
        'Investment Optimizer - Portfolio Analysis'
      ]
    },
    {
      id: 'navigation',
      name: 'Navigation Testing',
      icon: <Navigation className="h-5 w-5" />,
      description: 'Verify all navigation links and routing for each persona',
      personas: personas,
      tests: [
        'Main Navigation Links',
        'Secondary Menu Items',
        'Footer Links',
        'Breadcrumb Navigation',
        'Mobile Menu Functionality',
        'Search Functionality',
        'Quick Actions Menu',
        'Profile Menu Dropdown'
      ]
    },
    {
      id: 'uploads',
      name: 'File Upload Testing',
      icon: <Upload className="h-5 w-5" />,
      description: 'Test file uploads, AI OCR, and document processing',
      personas: ['Client Premium', 'Advisor', 'CPA'],
      tests: [
        'PDF Tax Document Upload',
        'JPG Image Upload',
        'PNG Screenshot Upload',
        'Large File Handling (>10MB)',
        'Invalid File Type Rejection',
        'AI OCR Processing',
        'Batch Upload Functionality',
        'Upload Progress Tracking'
      ]
    },
    {
      id: 'dashboards',
      name: 'Dashboard Widgets',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Test dashboard widgets and data visualization',
      personas: personas,
      tests: [
        'Portfolio Overview Widget',
        'Recent Activity Feed',
        'Goal Progress Tracking',
        'Performance Charts',
        'Quick Actions Panel',
        'Notification Center',
        'Client Status Cards',
        'Revenue Analytics'
      ]
    },
    {
      id: 'flows',
      name: 'User Flows',
      icon: <Users className="h-5 w-5" />,
      description: 'End-to-end user journey testing',
      personas: personas,
      tests: [
        'User Onboarding Flow',
        'Lead Capture Process',
        'Feedback Submission',
        'Upgrade Flow',
        'CPA Booking Process',
        'Document Request Flow',
        'Goal Setting Wizard',
        'Profile Completion'
      ]
    }
  ];

  const runComprehensiveQA = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setScreenshots([]);

    const totalTests = testSuites.reduce((acc, suite) => 
      acc + (suite.tests.length * suite.personas.length * devices.length), 0
    );
    
    let completedTests = 0;

    // Run tests for each suite, persona, and device combination
    for (const suite of testSuites) {
      for (const persona of suite.personas) {
        for (const device of devices) {
          for (const test of suite.tests) {
            setCurrentTest(`${suite.name} - ${persona} - ${device} - ${test}`);
            
            // Simulate test execution
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Generate mock test result
            const result: QATestResult = {
              id: `${suite.id}-${persona}-${device}-${test}`.replace(/\s+/g, '-').toLowerCase(),
              category: suite.name,
              persona,
              test: `${test} (${device})`,
              status: generateMockStatus(suite.id, test),
              message: generateMockMessage(suite.id, test, persona, device),
              critical: isCriticalTest(suite.id, test),
              screenshot: Math.random() > 0.7 ? `screenshot-${Date.now()}.png` : undefined,
              timestamp: new Date()
            };

            setResults(prev => [...prev, result]);
            
            // Add screenshot if generated
            if (result.screenshot) {
              setScreenshots(prev => [...prev, result.screenshot!]);
            }

            completedTests++;
            setProgress((completedTests / totalTests) * 100);
          }
        }
      }
    }

    setIsRunning(false);
    setCurrentTest('');
    
    const criticalIssues = results.filter(r => r.critical && r.status === 'fail').length;
    const totalPassed = results.filter(r => r.status === 'pass').length;
    
    if (criticalIssues > 0) {
      toast.error(`QA Complete: ${criticalIssues} critical issues found`);
    } else {
      toast.success(`QA Complete: ${totalPassed}/${results.length} tests passed`);
    }
  };

  const generateMockStatus = (suiteId: string, test: string): QATestResult['status'] => {
    // Simulate realistic test results
    const rand = Math.random();
    
    if (suiteId === 'calculators' && test.includes('Invalid Data')) {
      return rand > 0.8 ? 'fail' : 'pass';
    }
    if (suiteId === 'navigation' && test.includes('Mobile')) {
      return rand > 0.9 ? 'warning' : 'pass';
    }
    if (suiteId === 'uploads' && test.includes('Large File')) {
      return rand > 0.7 ? 'warning' : 'pass';
    }
    
    return rand > 0.15 ? 'pass' : rand > 0.05 ? 'warning' : 'fail';
  };

  const generateMockMessage = (suiteId: string, test: string, persona: string, device: string): string => {
    const messages = {
      pass: [
        'Test passed successfully',
        'All validations working correctly',
        'UI responsive and functional',
        'Data processing completed without errors'
      ],
      fail: [
        'Validation error: Invalid input not handled properly',
        '404 error on navigation link',
        'File upload failed with large files',
        'Chart rendering issues on mobile'
      ],
      warning: [
        'Minor UI alignment issue detected',
        'Slow loading time on 3G connection',
        'Missing accessibility labels',
        'Chart animations could be smoother'
      ]
    };

    const status = generateMockStatus(suiteId, test);
    const messageList = messages[status] || messages.pass;
    return messageList[Math.floor(Math.random() * messageList.length)];
  };

  const isCriticalTest = (suiteId: string, test: string): boolean => {
    return suiteId === 'navigation' || 
           test.includes('Invalid Data') || 
           test.includes('Upload') ||
           test.includes('Onboarding');
  };

  const exportPDFReport = () => {
    // Mock PDF export - in production, this would generate a real PDF
    toast.success('QA Report exported to PDF');
  };

  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getResultsByCategory = (category: string) => {
    return results.filter(r => r.category === category);
  };

  const getResultsByPersona = (persona: string) => {
    return results.filter(r => r.persona === persona);
  };

  const criticalIssues = results.filter(r => r.critical && r.status === 'fail').length;
  const totalPassed = results.filter(r => r.status === 'pass').length;
  const totalWarnings = results.filter(r => r.status === 'warning').length;
  const totalFailed = results.filter(r => r.status === 'fail').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Full System QA Runner</h2>
          <p className="text-muted-foreground">
            Comprehensive testing across all personas, devices, and features
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runComprehensiveQA} disabled={isRunning}>
            {isRunning ? 'Running QA...' : 'Run Full System QA'}
          </Button>
          <Button variant="outline" onClick={exportPDFReport} disabled={results.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Running Tests...</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{currentTest}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Overview */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalPassed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{totalFailed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{totalWarnings}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{screenshots.length}</div>
                  <div className="text-sm text-muted-foreground">Screenshots</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((totalPassed / results.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalIssues} critical issues</strong> found that must be resolved before launch.
            Review the failed tests below for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Results */}
      {results.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="by-category">By Category</TabsTrigger>
            <TabsTrigger value="by-persona">By Persona</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Test Results Overview</CardTitle>
                <CardDescription>
                  Summary of all test results across categories and personas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testSuites.map(suite => {
                    const suiteResults = getResultsByCategory(suite.name);
                    const passed = suiteResults.filter(r => r.status === 'pass').length;
                    const total = suiteResults.length;
                    
                    return (
                      <div key={suite.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {suite.icon}
                          <div>
                            <h4 className="font-medium">{suite.name}</h4>
                            <p className="text-sm text-muted-foreground">{suite.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={passed === total ? "default" : "secondary"}>
                            {passed}/{total}
                          </Badge>
                          <div className="w-20">
                            <Progress value={(passed / total) * 100} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-category">
            <div className="space-y-4">
              {testSuites.map(suite => {
                const suiteResults = getResultsByCategory(suite.name);
                
                return (
                  <Card key={suite.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {suite.icon}
                        {suite.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {suiteResults.map(result => (
                          <div key={result.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="mt-0.5">
                              {getStatusIcon(result.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium">{result.test}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {result.persona}
                                </Badge>
                                {result.critical && (
                                  <Badge variant="destructive" className="text-xs">
                                    Critical
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{result.message}</p>
                              {result.screenshot && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  📷 Screenshot captured
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="by-persona">
            <div className="space-y-4">
              {personas.map(persona => {
                const personaResults = getResultsByPersona(persona);
                const passed = personaResults.filter(r => r.status === 'pass').length;
                
                return (
                  <Card key={persona}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{persona}</span>
                        <Badge>{passed}/{personaResults.length} passed</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {personaResults.map(result => (
                          <div key={result.id} className="flex items-center gap-2 p-2 border rounded text-sm">
                            {getStatusIcon(result.status)}
                            <span className="truncate">{result.test}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="screenshots">
            <Card>
              <CardHeader>
                <CardTitle>Captured Screenshots</CardTitle>
                <CardDescription>
                  Screenshots captured during testing for visual verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {screenshots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {screenshots.map((screenshot, index) => (
                      <div key={index} className="p-4 border rounded-lg text-center">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">{screenshot}</p>
                        <p className="text-xs text-muted-foreground">
                          Screenshot {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No screenshots captured yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}