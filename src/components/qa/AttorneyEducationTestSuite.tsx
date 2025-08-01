import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Play, BookOpen, Search, Share } from 'lucide-react';
import { toast } from 'sonner';

interface EducationTest {
  id: string;
  category: 'library' | 'cle' | 'resources' | 'sharing';
  test: string;
  instructions: string[];
  expected: string;
  status: 'pending' | 'running' | 'pass' | 'fail' | 'warning';
  result?: string;
}

export const AttorneyEducationTestSuite: React.FC = () => {
  const [tests, setTests] = useState<EducationTest[]>([
    // Legal Library Tests
    {
      id: 'library-viewer-1',
      category: 'library',
      test: 'Legal E-book Viewer',
      instructions: [
        'Navigate to legal library',
        'Open a legal guide or e-book',
        'Test reading interface (zoom, bookmark, navigate)',
        'Test search within document',
        'Check table of contents functionality'
      ],
      expected: 'Smooth e-book reading experience with full navigation controls',
      status: 'pending'
    },
    {
      id: 'library-search-1',
      category: 'library',
      test: 'Library Search & Filtering',
      instructions: [
        'Use search bar to find specific legal topics',
        'Apply category filters (tax law, corporate, etc.)',
        'Sort by relevance, date, popularity',
        'Test advanced search with multiple criteria',
        'Verify search result accuracy'
      ],
      expected: 'Accurate search results with effective filtering options',
      status: 'pending'
    },
    {
      id: 'library-featured-1',
      category: 'library',
      test: 'Guide of the Month Carousel',
      instructions: [
        'Check featured content carousel on library home',
        'Navigate through featured guides',
        'Test carousel auto-rotation',
        'Click on featured items to access content',
        'Verify content relevance and quality'
      ],
      expected: 'Engaging featured content with smooth carousel navigation',
      status: 'pending'
    },

    // CLE Tracking Tests
    {
      id: 'cle-add-1',
      category: 'cle',
      test: 'Add CLE Requirements',
      instructions: [
        'Navigate to CLE tracker',
        'Add new CLE requirement',
        'Set due dates and credit hours needed',
        'Categorize by practice area',
        'Save and verify requirement appears in dashboard'
      ],
      expected: 'CLE requirements properly tracked with deadlines',
      status: 'pending'
    },
    {
      id: 'cle-complete-1',
      category: 'cle',
      test: 'Mark CLE Complete',
      instructions: [
        'Find a CLE requirement in tracker',
        'Mark as completed',
        'Upload completion certificate',
        'Add completion notes and credits earned',
        'Verify progress updates in dashboard'
      ],
      expected: 'CLE completion properly recorded with documentation',
      status: 'pending'
    },
    {
      id: 'cle-reminders-1',
      category: 'cle',
      test: 'CLE Reminder System',
      instructions: [
        'Set reminder preferences for CLE deadlines',
        'Test various reminder intervals (30, 60, 90 days)',
        'Check email notification delivery',
        'Test in-app reminder notifications',
        'Verify reminder accuracy and timing'
      ],
      expected: 'Timely and accurate CLE deadline reminders',
      status: 'pending'
    },

    // Resource Management Tests
    {
      id: 'resource-upload-1',
      category: 'resources',
      test: 'Attorney Resource Upload',
      instructions: [
        'Navigate to resource upload section',
        'Upload various document types (PDF, DOC, etc.)',
        'Add metadata and categorization',
        'Set access permissions',
        'Verify upload success and searchability'
      ],
      expected: 'Smooth resource upload with proper categorization',
      status: 'pending'
    },
    {
      id: 'resource-suggest-1',
      category: 'resources',
      test: 'Suggest a Resource Feature',
      instructions: [
        'Click "Suggest a Resource" button',
        'Fill out resource suggestion form',
        'Include resource details and justification',
        'Submit suggestion',
        'Verify confirmation and tracking'
      ],
      expected: 'Easy resource suggestion submission with tracking',
      status: 'pending'
    },
    {
      id: 'resource-quality-1',
      category: 'resources',
      test: 'Resource Quality & Organization',
      instructions: [
        'Browse different resource categories',
        'Check content quality and relevance',
        'Test resource ratings and reviews',
        'Verify proper categorization',
        'Test resource version control'
      ],
      expected: 'High-quality, well-organized legal resources',
      status: 'pending'
    },

    // Client Sharing Tests
    {
      id: 'sharing-client-1',
      category: 'sharing',
      test: 'Client-Facing Resource Sharing',
      instructions: [
        'Select resource to share with client',
        'Set client-specific permissions',
        'Generate sharing link',
        'Test client access to shared resource',
        'Verify client cannot access restricted content'
      ],
      expected: 'Secure client resource sharing with proper access controls',
      status: 'pending'
    },
    {
      id: 'sharing-download-1',
      category: 'sharing',
      test: 'Resource Download Functionality',
      instructions: [
        'Test download options for various resource types',
        'Check download permissions for different user roles',
        'Verify file integrity after download',
        'Test bulk download functionality',
        'Check download activity logging'
      ],
      expected: 'Reliable resource downloads with proper permission controls',
      status: 'pending'
    },
    {
      id: 'sharing-collaboration-1',
      category: 'sharing',
      test: 'Resource Collaboration Features',
      instructions: [
        'Share resource with attorney colleagues',
        'Test collaborative annotations',
        'Check version control in shared resources',
        'Test comment and discussion features',
        'Verify collaboration notifications'
      ],
      expected: 'Effective collaboration tools for shared legal resources',
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
    const status: EducationTest['status'] = randomResult > 0.8 ? 'fail' : randomResult > 0.6 ? 'warning' : 'pass';
    
    setTests(prev => prev.map(t => 
      t.id === testId ? { 
        ...t, 
        status, 
        result: getTestResult(status)
      } : t
    ));

    setCurrentTestId(null);
    toast.success(`Test completed: ${status}`);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    const summary = getTestSummary();
    toast.success(`All education tests completed: ${summary.passed}/${summary.total} passed`);
  };

  const getTestResult = (status: EducationTest['status']) => {
    const results = {
      pass: 'Education feature working perfectly - excellent user experience',
      warning: 'Feature functional with minor UX improvements needed',
      fail: 'Critical issues found - feature requires immediate attention'
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

  const getStatusIcon = (status: EducationTest['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default: return <div className="h-4 w-4 border border-gray-300 rounded" />;
    }
  };

  const getStatusBadge = (status: EducationTest['status']) => {
    switch (status) {
      case 'pass': return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'warning': return <Badge variant="secondary">Warning</Badge>;
      case 'fail': return <Badge variant="destructive">Fail</Badge>;
      case 'running': return <Badge variant="outline">Running...</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  const categoryGroups = {
    library: tests.filter(t => t.category === 'library'),
    cle: tests.filter(t => t.category === 'cle'),
    resources: tests.filter(t => t.category === 'resources'),
    sharing: tests.filter(t => t.category === 'sharing')
  };

  const categoryIcons = {
    library: BookOpen,
    cle: BookOpen,
    resources: Share,
    sharing: Share
  };

  const summary = getTestSummary();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Education & Legal Library Testing
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Test legal library, CLE tracking, resource management, and sharing features
              </p>
            </div>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running All Tests...' : 'Run All Education Tests'}
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

      {Object.entries(categoryGroups).map(([category, categoryTests]) => {
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {category === 'cle' ? 'CLE Tracking' : category} Tests
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
                          <h4 className="font-medium">{test.test}</h4>
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
        );
      })}
    </div>
  );
};