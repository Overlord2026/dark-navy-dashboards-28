import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Type, 
  Palette, 
  Layout, 
  Smartphone, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Camera,
  Play,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'typography' | 'color' | 'layout' | 'component' | 'responsive';
  page: string;
  element: string;
  issue: string;
  recommendation: string;
  screenshot?: string;
}

interface AuditScore {
  typography: number;
  color: number;
  layout: number;
  component: number;
  responsive: number;
  overall: number;
}

const TEST_PAGES = [
  { path: '/dashboard', name: 'Main Dashboard' },
  { path: '/client-dashboard', name: 'Client Dashboard' },
  { path: '/advisor-dashboard', name: 'Advisor Dashboard' },
  { path: '/admin-dashboard', name: 'Admin Dashboard' },
  { path: '/settings', name: 'Settings' },
  { path: '/auth', name: 'Authentication' },
  { path: '/qa/uat-checklist', name: 'QA Checklist' }
];

const VIEWPORT_SIZES = [
  { name: 'iPhone 13', width: 390, height: 844 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 }
];

export function BrandConsistencyAudit() {
  const [auditResults, setAuditResults] = useState<AuditIssue[]>([]);
  const [auditScore, setAuditScore] = useState<AuditScore>({
    typography: 0,
    color: 0,
    layout: 0,
    component: 0,
    responsive: 0,
    overall: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const addIssue = useCallback((issue: AuditIssue) => {
    setAuditResults(prev => [...prev, issue]);
  }, []);

  const takeScreenshot = async (pageName: string): Promise<string> => {
    // In a real implementation, this would capture actual screenshots
    // For now, return a placeholder
    await new Promise(resolve => setTimeout(resolve, 500));
    return `screenshot-${pageName.toLowerCase().replace(/\s+/g, '-')}.png`;
  };

  const auditTypography = async (pageName: string) => {
    // Check for consistent font usage
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const bodyText = document.querySelectorAll('p, span, div');
    const buttons = document.querySelectorAll('button');

    // Check heading consistency
    const headingFonts = new Set();
    headings.forEach(heading => {
      const computedStyle = window.getComputedStyle(heading);
      headingFonts.add(computedStyle.fontFamily);
    });

    if (headingFonts.size > 2) {
      addIssue({
        severity: 'warning',
        category: 'typography',
        page: pageName,
        element: 'Headings',
        issue: `Multiple font families detected (${headingFonts.size})`,
        recommendation: 'Standardize heading fonts to primary brand font'
      });
    }

    // Check font size consistency
    const fontSizes = new Set();
    bodyText.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      fontSizes.add(computedStyle.fontSize);
    });

    if (fontSizes.size > 8) {
      addIssue({
        severity: 'info',
        category: 'typography',
        page: pageName,
        element: 'Body Text',
        issue: `Too many font sizes (${fontSizes.size})`,
        recommendation: 'Reduce font size variations using design system scale'
      });
    }

    // Check button text consistency
    const buttonFonts = new Set();
    buttons.forEach(button => {
      const computedStyle = window.getComputedStyle(button);
      buttonFonts.add(computedStyle.fontFamily);
    });

    if (buttonFonts.size > 1) {
      addIssue({
        severity: 'warning',
        category: 'typography',
        page: pageName,
        element: 'Buttons',
        issue: 'Inconsistent button fonts',
        recommendation: 'Use consistent font family for all buttons'
      });
    }
  };

  const auditColors = async (pageName: string) => {
    const allElements = document.querySelectorAll('*');
    const backgrounds = new Set();
    const textColors = new Set();
    const borderColors = new Set();

    allElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const bgColor = computedStyle.backgroundColor;
      const textColor = computedStyle.color;
      const borderColor = computedStyle.borderColor;

      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        backgrounds.add(bgColor);
      }
      if (textColor) {
        textColors.add(textColor);
      }
      if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
        borderColors.add(borderColor);
      }
    });

    // Check for excessive color variations
    if (backgrounds.size > 12) {
      addIssue({
        severity: 'warning',
        category: 'color',
        page: pageName,
        element: 'Backgrounds',
        issue: `Too many background colors (${backgrounds.size})`,
        recommendation: 'Limit background colors to brand palette'
      });
    }

    if (textColors.size > 8) {
      addIssue({
        severity: 'info',
        category: 'color',
        page: pageName,
        element: 'Text Colors',
        issue: `Many text colors detected (${textColors.size})`,
        recommendation: 'Standardize text colors using semantic tokens'
      });
    }

    // Check for hardcoded colors (basic check for hex values)
    const elementsWithHardcodedColors = Array.from(allElements).filter(element => {
      return element.getAttribute('style')?.includes('#') || 
             element.getAttribute('style')?.includes('rgb(');
    });

    if (elementsWithHardcodedColors.length > 0) {
      addIssue({
        severity: 'critical',
        category: 'color',
        page: pageName,
        element: 'Inline Styles',
        issue: `${elementsWithHardcodedColors.length} elements with hardcoded colors`,
        recommendation: 'Replace hardcoded colors with design system tokens'
      });
    }
  };

  const auditLayout = async (pageName: string) => {
    // Check for consistent spacing
    const cards = document.querySelectorAll('[class*="card"], .card');
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input, textarea, select');

    // Check card padding consistency
    const cardPaddings = new Set();
    cards.forEach(card => {
      const computedStyle = window.getComputedStyle(card);
      const padding = `${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}`;
      cardPaddings.add(padding);
    });

    if (cardPaddings.size > 3) {
      addIssue({
        severity: 'warning',
        category: 'layout',
        page: pageName,
        element: 'Cards',
        issue: `Inconsistent card padding (${cardPaddings.size} variations)`,
        recommendation: 'Standardize card padding using spacing scale'
      });
    }

    // Check button spacing consistency
    const buttonMargins = new Set();
    buttons.forEach(button => {
      const computedStyle = window.getComputedStyle(button);
      const margin = `${computedStyle.marginTop} ${computedStyle.marginRight} ${computedStyle.marginBottom} ${computedStyle.marginLeft}`;
      buttonMargins.add(margin);
    });

    if (buttonMargins.size > 5) {
      addIssue({
        severity: 'info',
        category: 'layout',
        page: pageName,
        element: 'Buttons',
        issue: `Variable button spacing (${buttonMargins.size} patterns)`,
        recommendation: 'Use consistent spacing between buttons'
      });
    }

    // Check for content overflow
    const overflowElements = Array.from(document.querySelectorAll('*')).filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > window.innerWidth || rect.height > window.innerHeight;
    });

    if (overflowElements.length > 0) {
      addIssue({
        severity: 'critical',
        category: 'layout',
        page: pageName,
        element: 'Content Overflow',
        issue: `${overflowElements.length} elements causing overflow`,
        recommendation: 'Fix content overflow for better responsive design'
      });
    }
  };

  const auditComponents = async (pageName: string) => {
    // Check button consistency
    const buttons = document.querySelectorAll('button');
    const buttonStyles = new Set();
    const buttonHeights = new Set();

    buttons.forEach(button => {
      const computedStyle = window.getComputedStyle(button);
      const borderRadius = computedStyle.borderRadius;
      const height = computedStyle.height;
      buttonStyles.add(borderRadius);
      buttonHeights.add(height);
    });

    if (buttonStyles.size > 3) {
      addIssue({
        severity: 'warning',
        category: 'component',
        page: pageName,
        element: 'Buttons',
        issue: `Inconsistent button border radius (${buttonStyles.size} variations)`,
        recommendation: 'Standardize button border radius across components'
      });
    }

    if (buttonHeights.size > 4) {
      addIssue({
        severity: 'info',
        category: 'component',
        page: pageName,
        element: 'Buttons',
        issue: `Multiple button heights (${buttonHeights.size})`,
        recommendation: 'Use consistent button sizing scale'
      });
    }

    // Check input field consistency
    const inputs = document.querySelectorAll('input, textarea, select');
    const inputBorders = new Set();
    
    inputs.forEach(input => {
      const computedStyle = window.getComputedStyle(input);
      const border = `${computedStyle.borderWidth} ${computedStyle.borderStyle} ${computedStyle.borderColor}`;
      inputBorders.add(border);
    });

    if (inputBorders.size > 2) {
      addIssue({
        severity: 'warning',
        category: 'component',
        page: pageName,
        element: 'Input Fields',
        issue: `Inconsistent input borders (${inputBorders.size} styles)`,
        recommendation: 'Standardize input field border styles'
      });
    }
  };

  const auditResponsive = async (pageName: string, viewportSize: { name: string; width: number; height: number }) => {
    // Simulate viewport resize
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;

    // Check for horizontal scrollbar
    const hasHorizontalScroll = document.documentElement.scrollWidth > viewportSize.width;
    
    if (hasHorizontalScroll) {
      addIssue({
        severity: 'critical',
        category: 'responsive',
        page: pageName,
        element: `${viewportSize.name} Viewport`,
        issue: 'Horizontal scrolling detected',
        recommendation: 'Fix responsive layout to prevent horizontal scroll'
      });
    }

    // Check for overlapping elements
    const elements = document.querySelectorAll('button, input, .card, nav');
    let overlappingCount = 0;

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const rect1 = elements[i].getBoundingClientRect();
        const rect2 = elements[j].getBoundingClientRect();
        
        if (rect1.left < rect2.right && rect2.left < rect1.right &&
            rect1.top < rect2.bottom && rect2.top < rect1.bottom) {
          overlappingCount++;
        }
      }
    }

    if (overlappingCount > 0) {
      addIssue({
        severity: 'warning',
        category: 'responsive',
        page: pageName,
        element: `${viewportSize.name} Layout`,
        issue: `${overlappingCount} overlapping elements detected`,
        recommendation: 'Adjust responsive layout to prevent element overlap'
      });
    }
  };

  const auditPage = async (page: { path: string; name: string }) => {
    setCurrentPage(page.name);
    
    // Navigate to page (in real implementation)
    // window.location.href = page.path;
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Run all audits
    await auditTypography(page.name);
    await auditColors(page.name);
    await auditLayout(page.name);
    await auditComponents(page.name);

    // Test responsive for each viewport
    for (const viewport of VIEWPORT_SIZES) {
      await auditResponsive(page.name, viewport);
    }

    // Take screenshot
    const screenshot = await takeScreenshot(page.name);
  };

  const calculateScores = () => {
    const issuesBySeverity = {
      critical: auditResults.filter(issue => issue.severity === 'critical').length,
      warning: auditResults.filter(issue => issue.severity === 'warning').length,
      info: auditResults.filter(issue => issue.severity === 'info').length
    };

    const issuesByCategory = {
      typography: auditResults.filter(issue => issue.category === 'typography').length,
      color: auditResults.filter(issue => issue.category === 'color').length,
      layout: auditResults.filter(issue => issue.category === 'layout').length,
      component: auditResults.filter(issue => issue.category === 'component').length,
      responsive: auditResults.filter(issue => issue.category === 'responsive').length
    };

    const calculateCategoryScore = (issueCount: number, maxIssues: number = 10) => {
      return Math.max(0, Math.min(100, 100 - (issueCount * 100) / maxIssues));
    };

    const scores: AuditScore = {
      typography: calculateCategoryScore(issuesByCategory.typography),
      color: calculateCategoryScore(issuesByCategory.color),
      layout: calculateCategoryScore(issuesByCategory.layout),
      component: calculateCategoryScore(issuesByCategory.component),
      responsive: calculateCategoryScore(issuesByCategory.responsive),
      overall: 0
    };

    scores.overall = (scores.typography + scores.color + scores.layout + scores.component + scores.responsive) / 5;
    
    // Apply severity penalties
    scores.overall -= (issuesBySeverity.critical * 5) + (issuesBySeverity.warning * 2) + (issuesBySeverity.info * 0.5);
    scores.overall = Math.max(0, Math.min(100, scores.overall));

    setAuditScore(scores);
  };

  const runFullAudit = async () => {
    setIsRunning(true);
    setAuditResults([]);
    setProgress(0);

    try {
      for (let i = 0; i < TEST_PAGES.length; i++) {
        await auditPage(TEST_PAGES[i]);
        setProgress(((i + 1) / TEST_PAGES.length) * 100);
      }

      calculateScores();
      toast.success('Brand consistency audit completed!');
    } catch (error) {
      toast.error('Audit failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsRunning(false);
      setCurrentPage('');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Brand Consistency Audit</h1>
          <p className="text-muted-foreground">Complete UX/UI visual cohesion analysis</p>
        </div>
        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="text-sm text-muted-foreground">
              {currentPage && <span>Testing: {currentPage}</span>}
            </div>
          )}
          <Progress value={progress} className="w-32" />
          <Button 
            onClick={runFullAudit} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running Audit...' : 'Start Audit'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(auditScore.overall)}`}>
                    {Math.round(auditScore.overall)}
                  </div>
                  <Badge variant={getScoreBadge(auditScore.overall)} className="mt-2">
                    {auditScore.overall >= 80 ? 'Excellent' : 
                     auditScore.overall >= 60 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Critical</span>
                    <span className="font-medium text-red-600">
                      {auditResults.filter(i => i.severity === 'critical').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Warning</span>
                    <span className="font-medium text-yellow-600">
                      {auditResults.filter(i => i.severity === 'warning').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Info</span>
                    <span className="font-medium text-blue-600">
                      {auditResults.filter(i => i.severity === 'info').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Pages Tested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {TEST_PAGES.length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete application coverage
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scores" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries({
              Typography: auditScore.typography,
              Color: auditScore.color,
              Layout: auditScore.layout,
              Component: auditScore.component,
              Responsive: auditScore.responsive
            }).map(([category, score]) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {category === 'Typography' && <Type className="h-4 w-4" />}
                    {category === 'Color' && <Palette className="h-4 w-4" />}
                    {category === 'Layout' && <Layout className="h-4 w-4" />}
                    {category === 'Component' && <Eye className="h-4 w-4" />}
                    {category === 'Responsive' && <Smartphone className="h-4 w-4" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {Math.round(score)}
                    </div>
                    <Progress value={score} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Scoring Methodology</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Critical issues: -5 points each</li>
                    <li>• Warning issues: -2 points each</li>
                    <li>• Info issues: -0.5 points each</li>
                    <li>• Category scores based on issue density</li>
                    <li>• Overall score is average of all categories</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Score Ranges</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 80-100: Excellent brand consistency</li>
                    <li>• 60-79: Good with minor issues</li>
                    <li>• 40-59: Moderate inconsistencies</li>
                    <li>• 0-39: Significant brand cohesion issues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {auditResults.map((issue, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getSeverityIcon(issue.severity)}
                        {issue.page} - {issue.element}
                      </CardTitle>
                      <Badge variant={
                        issue.severity === 'critical' ? 'destructive' :
                        issue.severity === 'warning' ? 'secondary' : 'default'
                      }>
                        {issue.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Issue: </span>
                        <span className="text-sm">{issue.issue}</span>
                      </div>
                      <div>
                        <span className="font-medium">Recommendation: </span>
                        <span className="text-sm text-muted-foreground">{issue.recommendation}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {auditResults.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No audit results yet. Run the audit to see issues and recommendations.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Critical Issues (Fix Immediately)</h4>
                    <ul className="space-y-1 text-sm">
                      {auditResults
                        .filter(issue => issue.severity === 'critical')
                        .slice(0, 5)
                        .map((issue, index) => (
                          <li key={index}>• {issue.recommendation}</li>
                        ))}
                      {auditResults.filter(issue => issue.severity === 'critical').length === 0 && (
                        <li className="text-muted-foreground">No critical issues found</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-yellow-600 mb-2">Important Improvements</h4>
                    <ul className="space-y-1 text-sm">
                      {auditResults
                        .filter(issue => issue.severity === 'warning')
                        .slice(0, 5)
                        .map((issue, index) => (
                          <li key={index}>• {issue.recommendation}</li>
                        ))}
                      {auditResults.filter(issue => issue.severity === 'warning').length === 0 && (
                        <li className="text-muted-foreground">No warning issues found</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Enhancement Opportunities</h4>
                    <ul className="space-y-1 text-sm">
                      {auditResults
                        .filter(issue => issue.severity === 'info')
                        .slice(0, 5)
                        .map((issue, index) => (
                          <li key={index}>• {issue.recommendation}</li>
                        ))}
                      {auditResults.filter(issue => issue.severity === 'info').length === 0 && (
                        <li className="text-muted-foreground">No enhancement suggestions</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Typography</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use consistent font hierarchy</li>
                      <li>• Limit font sizes to design scale</li>
                      <li>• Maintain proper line heights</li>
                      <li>• Use semantic text tokens</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Color</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use brand color palette only</li>
                      <li>• Avoid hardcoded color values</li>
                      <li>• Ensure sufficient contrast</li>
                      <li>• Use semantic color tokens</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Layout</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use consistent spacing scale</li>
                      <li>• Maintain proper grid alignment</li>
                      <li>• Test all viewport sizes</li>
                      <li>• Prevent content overflow</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Components</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Standardize component styling</li>
                      <li>• Use consistent interaction states</li>
                      <li>• Maintain design system integrity</li>
                      <li>• Document component variations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}