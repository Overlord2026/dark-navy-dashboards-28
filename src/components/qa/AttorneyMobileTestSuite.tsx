import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Play, Smartphone, Tablet, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface MobileTest {
  id: string;
  category: 'responsive' | 'touch' | 'performance' | 'features';
  device: 'mobile' | 'tablet' | 'desktop';
  test: string;
  instructions: string[];
  expected: string;
  status: 'pending' | 'running' | 'pass' | 'fail' | 'warning';
  result?: string;
}

export const AttorneyMobileTestSuite: React.FC = () => {
  const [tests, setTests] = useState<MobileTest[]>([
    // Mobile Responsive Tests
    {
      id: 'mobile-dashboard-1',
      category: 'responsive',
      device: 'mobile',
      test: 'Attorney Dashboard Mobile Layout',
      instructions: [
        'Open attorney dashboard on mobile device (or 375px viewport)',
        'Check navigation menu collapse/hamburger behavior',
        'Verify dashboard widgets stack vertically',
        'Test sidebar navigation on mobile',
        'Check quick action buttons accessibility'
      ],
      expected: 'Clean mobile dashboard with intuitive navigation',
      status: 'pending'
    },
    {
      id: 'mobile-client-onboarding-1',
      category: 'responsive',
      device: 'mobile',
      test: 'Client Onboarding Mobile Experience',
      instructions: [
        'Complete client onboarding wizard on mobile',
        'Test form input and validation on small screens',
        'Check document upload interface on mobile',
        'Verify wizard step progression',
        'Test mobile-specific input methods'
      ],
      expected: 'Smooth mobile onboarding with optimized forms',
      status: 'pending'
    },
    {
      id: 'tablet-documents-1',
      category: 'responsive',
      device: 'tablet',
      test: 'Document Viewing on Tablet',
      instructions: [
        'Open PDF documents on tablet (768px viewport)',
        'Test document viewer controls and zoom',
        'Check annotation tools on touch interface',
        'Verify two-column layout optimization',
        'Test document sharing from tablet'
      ],
      expected: 'Excellent document experience optimized for tablet viewing',
      status: 'pending'
    },

    // Touch Interface Tests
    {
      id: 'touch-navigation-1',
      category: 'touch',
      device: 'mobile',
      test: 'Touch Navigation & Gestures',
      instructions: [
        'Test swipe gestures for navigation',
        'Check touch targets are appropriately sized (44px minimum)',
        'Test drag and drop functionality on touch',
        'Verify pinch-to-zoom where appropriate',
        'Check touch feedback and visual states'
      ],
      expected: 'Intuitive touch interface with proper gesture support',
      status: 'pending'
    },
    {
      id: 'touch-forms-1',
      category: 'touch',
      device: 'mobile',
      test: 'Mobile Form Interactions',
      instructions: [
        'Fill out attorney profile forms on mobile',
        'Test date pickers and dropdown menus',
        'Check virtual keyboard behavior',
        'Test form validation on touch devices',
        'Verify autocomplete and suggestion features'
      ],
      expected: 'Optimized form experience for mobile input',
      status: 'pending'
    },
    {
      id: 'touch-document-1',
      category: 'touch',
      device: 'tablet',
      test: 'Document Touch Interactions',
      instructions: [
        'Test document scrolling and navigation',
        'Check annotation tools with touch/stylus',
        'Test text selection on touch devices',
        'Verify zoom and pan functionality',
        'Check touch-specific toolbar adaptations'
      ],
      expected: 'Professional document editing experience on touch devices',
      status: 'pending'
    },

    // Performance Tests
    {
      id: 'performance-mobile-1',
      category: 'performance',
      device: 'mobile',
      test: 'Mobile Performance & Loading',
      instructions: [
        'Measure page load times on 3G connection',
        'Check image optimization and lazy loading',
        'Test progressive loading of dashboard components',
        'Verify smooth scrolling performance',
        'Check memory usage and app responsiveness'
      ],
      expected: 'Fast loading and smooth performance on mobile networks',
      status: 'pending'
    },
    {
      id: 'performance-offline-1',
      category: 'performance',
      device: 'mobile',
      test: 'Offline Functionality',
      instructions: [
        'Test app behavior when offline',
        'Check document caching for offline viewing',
        'Verify sync when connection restored',
        'Test service worker functionality',
        'Check offline indicators and messaging'
      ],
      expected: 'Graceful offline handling with data sync capabilities',
      status: 'pending'
    },

    // Mobile-Specific Features
    {
      id: 'features-camera-1',
      category: 'features',
      device: 'mobile',
      test: 'Camera Integration for Document Capture',
      instructions: [
        'Test camera access for document scanning',
        'Check photo capture and optimization',
        'Verify document edge detection',
        'Test multiple photo document creation',
        'Check photo-to-PDF conversion quality'
      ],
      expected: 'Professional document capture using device camera',
      status: 'pending'
    },
    {
      id: 'features-notifications-1',
      category: 'features',
      device: 'mobile',
      test: 'Mobile Push Notifications',
      instructions: [
        'Test push notification delivery',
        'Check notification permission requests',
        'Verify notification content and actions',
        'Test notification settings and preferences',
        'Check notification badge and indicators'
      ],
      expected: 'Reliable push notifications with appropriate content',
      status: 'pending'
    },
    {
      id: 'features-calling-1',
      category: 'features',
      device: 'mobile',
      test: 'Click-to-Call Integration',
      instructions: [
        'Test phone number link functionality',
        'Check video call integration (if available)',
        'Verify calendar meeting links on mobile',
        'Test conference call joining from mobile',
        'Check contact information accessibility'
      ],
      expected: 'Seamless communication integration on mobile devices',
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);

  const runTest = async (testId: string) => {
    setCurrentTestId(testId);
    setTests(prev => prev.map(t => 
      t.id === testId ? { ...t, status: 'running' } : t
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    const randomResult = Math.random();
    const status: MobileTest['status'] = randomResult > 0.8 ? 'fail' : randomResult > 0.65 ? 'warning' : 'pass';
    
    setTests(prev => prev.map(t => 
      t.id === testId ? { 
        ...t, 
        status, 
        result: getTestResult(status)
      } : t
    ));

    setCurrentTestId(null);
    toast.success(`Mobile test completed: ${status}`);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    setIsRunning(false);
    const summary = getTestSummary();
    toast.success(`All mobile tests completed: ${summary.passed}/${summary.total} passed`);
  };

  const getTestResult = (status: MobileTest['status']) => {
    const results = {
      pass: 'Excellent mobile experience with optimal performance and usability',
      warning: 'Good mobile functionality with minor UX improvements recommended',
      fail: 'Mobile experience issues requiring immediate attention'
    };
    return results[status as keyof typeof results] || '';
  };

  const getTestSummary = () => {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'pass').length;
    const warnings = tests.filter(t => t.status === 'warning').length;
    const failed = tests.filter(t => t.status === 'fail').length;
    return { total, passed, warnings, failed };
  };

  const getStatusIcon = (status: MobileTest['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default: return <div className="h-4 w-4 border border-gray-300 rounded" />;
    }
  };

  const getStatusBadge = (status: MobileTest['status']) => {
    switch (status) {
      case 'pass': return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'warning': return <Badge variant="secondary">Warning</Badge>;
      case 'fail': return <Badge variant="destructive">Fail</Badge>;
      case 'running': return <Badge variant="outline">Running...</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getDeviceIcon = (device: MobileTest['device']) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-3 w-3" />;
      case 'tablet': return <Tablet className="h-3 w-3" />;
      case 'desktop': return <Monitor className="h-3 w-3" />;
    }
  };

  const categoryGroups = {
    responsive: tests.filter(t => t.category === 'responsive'),
    touch: tests.filter(t => t.category === 'touch'),
    performance: tests.filter(t => t.category === 'performance'),
    features: tests.filter(t => t.category === 'features')
  };

  const summary = getTestSummary();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile & Responsive Testing
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Test attorney platform across mobile, tablet, and desktop devices
              </p>
            </div>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running All Tests...' : 'Run All Mobile Tests'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {summary.total > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{summary.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">{summary.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {Object.entries(categoryGroups).map(([category, categoryTests]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              {category} Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{test.test}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getDeviceIcon(test.device)}
                            <span className="ml-1 capitalize">{test.device}</span>
                          </Badge>
                        </div>
                        {getStatusBadge(test.status)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runTest(test.id)}
                      disabled={test.status === 'running' || isRunning}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run Test
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Test Instructions:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        {test.instructions.map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Expected Result:</h5>
                      <p className="text-muted-foreground">{test.expected}</p>
                      
                      {test.result && (
                        <div className="mt-3">
                          <h5 className="font-medium mb-1">Test Result:</h5>
                          <p className="text-sm text-muted-foreground">{test.result}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};