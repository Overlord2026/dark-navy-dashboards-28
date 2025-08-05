import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Download,
  Bug
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/use-responsive';
import { toast } from 'sonner';

interface PersonaDashboard {
  id: string;
  name: string;
  route: string;
  description: string;
  expectedFeatures: string[];
}

interface QATestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  screenshot?: string;
  persona: string;
  category: 'navigation' | 'responsive' | 'accessibility' | 'branding' | 'features' | 'loading';
}

const PERSONA_DASHBOARDS: PersonaDashboard[] = [
  {
    id: 'client',
    name: 'Client Dashboard',
    route: '/client-dashboard',
    description: 'Primary client portal with financial overview',
    expectedFeatures: ['Portfolio View', 'Documents', 'Reports', 'Settings']
  },
  {
    id: 'advisor',
    name: 'Advisor Dashboard',
    route: '/advisor-dashboard',
    description: 'Financial advisor management interface',
    expectedFeatures: ['Client Management', 'Analytics', 'Reports', 'Calendar']
  },
  {
    id: 'accountant',
    name: 'Accountant Dashboard',
    route: '/accountant-dashboard',
    description: 'Tax and accounting professional interface',
    expectedFeatures: ['Tax Planning', 'Client Files', 'Compliance', 'Reports']
  },
  {
    id: 'attorney',
    name: 'Attorney Dashboard',
    route: '/attorney-dashboard',
    description: 'Legal professional management interface',
    expectedFeatures: ['Legal Resources', 'Client Collaboration', 'Documents', 'Education']
  },
  {
    id: 'consultant',
    name: 'Consultant Dashboard',
    route: '/consultant-dashboard',
    description: 'Financial consultant management interface',
    expectedFeatures: ['Projects', 'Analytics', 'Resources', 'Client Portal']
  },
  {
    id: 'compliance',
    name: 'Compliance Officer Dashboard',
    route: '/compliance-dashboard',
    description: 'Compliance management and monitoring',
    expectedFeatures: ['Agent Management', 'CE Tracking', 'Alerts', 'Reports']
  },
  {
    id: 'admin',
    name: 'Admin Dashboard',
    route: '/admin-dashboard',
    description: 'System administration interface',
    expectedFeatures: ['User Management', 'System Settings', 'Analytics', 'Logs']
  }
];

export const PersonaDashboardQASuite: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<QATestResult[]>([]);
  const [testMode, setTestMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const navigate = useNavigate();
  const { isMobile, isTablet, screenWidth } = useResponsive();

  const addResult = (result: QATestResult) => {
    setResults(prev => [...prev, result]);
  };

  const runAccessibilityTests = async (persona: string): Promise<QATestResult[]> => {
    const results: QATestResult[] = [];
    
    // Check for touch targets
    const buttons = document.querySelectorAll('button, a, [role="button"]');
    let smallTargets = 0;
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTargets++;
      }
    });

    results.push({
      testName: 'Touch Target Size (WCAG 2.1 AA)',
      status: smallTargets === 0 ? 'pass' : 'warning',
      message: smallTargets === 0 ? 'All touch targets meet 44px minimum' : `${smallTargets} elements below 44px minimum`,
      persona,
      category: 'accessibility'
    });

    // Check for alt text on images
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        missingAlt++;
      }
    });

    results.push({
      testName: 'Image Alt Text',
      status: missingAlt === 0 ? 'pass' : 'fail',
      message: missingAlt === 0 ? 'All images have alt text' : `${missingAlt} images missing alt text`,
      persona,
      category: 'accessibility'
    });

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    let properHierarchy = true;
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] > headingLevels[i-1] + 1) {
        properHierarchy = false;
        break;
      }
    }

    results.push({
      testName: 'Heading Hierarchy',
      status: properHierarchy ? 'pass' : 'warning',
      message: properHierarchy ? 'Proper heading hierarchy maintained' : 'Heading hierarchy issues detected',
      persona,
      category: 'accessibility'
    });

    return results;
  };

  const runResponsiveTests = async (persona: string): Promise<QATestResult[]> => {
    const results: QATestResult[] = [];

    // Check viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    results.push({
      testName: 'Viewport Meta Tag',
      status: viewportMeta ? 'pass' : 'fail',
      message: viewportMeta ? 'Viewport meta tag present' : 'Missing viewport meta tag',
      persona,
      category: 'responsive'
    });

    // Check for horizontal scrolling
    const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
    results.push({
      testName: 'Horizontal Scrolling',
      status: !hasHorizontalScroll ? 'pass' : 'fail',
      message: !hasHorizontalScroll ? 'No horizontal overflow' : 'Horizontal scrolling detected',
      persona,
      category: 'responsive'
    });

    // Check mobile navigation
    if (isMobile) {
      const mobileNav = document.querySelector('[data-mobile-nav], .mobile-nav, .hamburger');
      results.push({
        testName: 'Mobile Navigation',
        status: mobileNav ? 'pass' : 'warning',
        message: mobileNav ? 'Mobile navigation detected' : 'Mobile navigation not found',
        persona,
        category: 'responsive'
      });
    }

    return results;
  };

  const runBrandingTests = async (persona: string): Promise<QATestResult[]> => {
    const results: QATestResult[] = [];

    // Check for logo
    const logo = document.querySelector('[data-logo], .logo, img[alt*="logo" i]');
    results.push({
      testName: 'Brand Logo',
      status: logo ? 'pass' : 'warning',
      message: logo ? 'Brand logo found' : 'Brand logo not detected',
      persona,
      category: 'branding'
    });

    // Check for consistent color scheme
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary');
    results.push({
      testName: 'Color Scheme',
      status: primaryColor ? 'pass' : 'warning',
      message: primaryColor ? 'CSS custom properties detected' : 'No custom color properties found',
      persona,
      category: 'branding'
    });

    return results;
  };

  const runNavigationTests = async (persona: string): Promise<QATestResult[]> => {
    const results: QATestResult[] = [];

    // Check for main navigation
    const mainNav = document.querySelector('nav, [role="navigation"]');
    results.push({
      testName: 'Main Navigation',
      status: mainNav ? 'pass' : 'fail',
      message: mainNav ? 'Main navigation found' : 'Main navigation missing',
      persona,
      category: 'navigation'
    });

    // Check for breadcrumbs
    const breadcrumbs = document.querySelector('[aria-label*="breadcrumb" i], .breadcrumb');
    results.push({
      testName: 'Breadcrumbs',
      status: breadcrumbs ? 'pass' : 'warning',
      message: breadcrumbs ? 'Breadcrumbs present' : 'No breadcrumbs found',
      persona,
      category: 'navigation'
    });

    // Check for active state indication
    const activeLinks = document.querySelectorAll('.active, [aria-current], [data-active="true"]');
    results.push({
      testName: 'Active State Indicators',
      status: activeLinks.length > 0 ? 'pass' : 'warning',
      message: activeLinks.length > 0 ? `${activeLinks.length} active states found` : 'No active state indicators',
      persona,
      category: 'navigation'
    });

    return results;
  };

  const runFeatureTests = async (persona: string, expectedFeatures: string[]): Promise<QATestResult[]> => {
    const results: QATestResult[] = [];

    // Check for expected feature buttons/links
    expectedFeatures.forEach(feature => {
      const featureElement = document.querySelector(`[data-feature="${feature.toLowerCase()}"], [aria-label*="${feature}" i]`);
      const textMatch = Array.from(document.querySelectorAll('button, a, [role="button"]'))
        .find(el => el.textContent?.toLowerCase().includes(feature.toLowerCase()));
      
      results.push({
        testName: `Feature: ${feature}`,
        status: featureElement || textMatch ? 'pass' : 'warning',
        message: featureElement || textMatch ? `${feature} feature accessible` : `${feature} feature not found`,
        persona,
        category: 'features'
      });
    });

    return results;
  };

  const runLoadingTests = async (persona: string): Promise<QATestResult[]> => {
    const results: QATestResult[] = [];

    // Check for loading indicators
    const loadingElements = document.querySelectorAll('.loading, .spinner, [data-loading="true"]');
    results.push({
      testName: 'Loading Indicators',
      status: 'pass',
      message: `${loadingElements.length} loading indicators found`,
      persona,
      category: 'loading'
    });

    // Check for error boundaries
    const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
    results.push({
      testName: 'Error Boundaries',
      status: errorBoundaries.length > 0 ? 'pass' : 'warning',
      message: errorBoundaries.length > 0 ? 'Error boundaries detected' : 'No error boundaries found',
      persona,
      category: 'loading'
    });

    return results;
  };

  const testPersonaDashboard = async (dashboard: PersonaDashboard) => {
    setCurrentPersona(dashboard.id);
    
    try {
      // Navigate to dashboard
      navigate(dashboard.route);
      
      // Wait for navigation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Run all test suites
      const [
        accessibilityResults,
        responsiveResults,
        brandingResults,
        navigationResults,
        featureResults,
        loadingResults
      ] = await Promise.all([
        runAccessibilityTests(dashboard.id),
        runResponsiveTests(dashboard.id),
        runBrandingTests(dashboard.id),
        runNavigationTests(dashboard.id),
        runFeatureTests(dashboard.id, dashboard.expectedFeatures),
        runLoadingTests(dashboard.id)
      ]);

      // Add all results
      [
        ...accessibilityResults,
        ...responsiveResults,
        ...brandingResults,
        ...navigationResults,
        ...featureResults,
        ...loadingResults
      ].forEach(addResult);

    } catch (error) {
      addResult({
        testName: 'Dashboard Load',
        status: 'fail',
        message: `Failed to load dashboard: ${error}`,
        persona: dashboard.id,
        category: 'loading'
      });
    }
  };

  const runFullTestSuite = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    for (let i = 0; i < PERSONA_DASHBOARDS.length; i++) {
      await testPersonaDashboard(PERSONA_DASHBOARDS[i]);
      setProgress(((i + 1) / PERSONA_DASHBOARDS.length) * 100);
    }

    setCurrentPersona(null);
    setIsRunning(false);
    toast.success('Persona dashboard testing completed!');
  };

  const getStatusColor = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return 'success';
      case 'fail': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4" />;
      case 'fail': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      testMode,
      screenWidth,
      totalTests: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      warnings: results.filter(r => r.status === 'warning').length,
      results: results
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persona-dashboard-qa-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resultsByCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, QATestResult[]>);

  const resultsByPersona = results.reduce((acc, result) => {
    if (!acc[result.persona]) acc[result.persona] = [];
    acc[result.persona].push(result);
    return acc;
  }, {} as Record<string, QATestResult[]>);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Persona Dashboard QA Suite
          </CardTitle>
          <CardDescription>
            Comprehensive testing of all persona dashboards for navigation, responsiveness, accessibility, and UX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runFullTestSuite}
              disabled={isRunning}
              className="min-w-[120px]"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setResults([])}
              variant="outline"
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <Button
              onClick={generateReport}
              variant="outline"
              disabled={results.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="outline" className="flex items-center gap-1">
                {isMobile ? <Smartphone className="h-3 w-3" /> : 
                 isTablet ? <Tablet className="h-3 w-3" /> : 
                 <Monitor className="h-3 w-3" />}
                {screenWidth}px
              </Badge>
            </div>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Testing: {currentPersona || 'Initializing...'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.status === 'pass').length}
                </div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {results.filter(r => r.status === 'fail').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {results.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {results.length > 0 && (
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="persona">By Persona</TabsTrigger>
          </TabsList>

          <TabsContent value="category" className="space-y-4">
            {Object.entries(resultsByCategory).map(([category, categoryResults]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    <Bug className="h-4 w-4" />
                    {category} Tests ({categoryResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded border">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="font-medium">{result.testName}</div>
                          <div className="text-sm text-muted-foreground">{result.message}</div>
                        </div>
                        <Badge variant={getStatusColor(result.status)} className="capitalize">
                          {result.persona}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="persona" className="space-y-4">
            {Object.entries(resultsByPersona).map(([persona, personaResults]) => (
              <Card key={persona}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    <Eye className="h-4 w-4" />
                    {persona} Dashboard ({personaResults.length} tests)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {personaResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded border">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="font-medium">{result.testName}</div>
                          <div className="text-sm text-muted-foreground">{result.message}</div>
                        </div>
                        <Badge variant={getStatusColor(result.status)} className="capitalize">
                          {result.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};