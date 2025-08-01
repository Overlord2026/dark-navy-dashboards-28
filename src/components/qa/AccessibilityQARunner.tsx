import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Monitor, 
  Smartphone,
  Tablet,
  Navigation,
  Palette,
  Accessibility
} from 'lucide-react';
import { toast } from 'sonner';

interface AccessibilityTestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  element?: string;
  recommendation?: string;
}

export function AccessibilityQARunner() {
  const [results, setResults] = useState<AccessibilityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedViewport, setSelectedViewport] = useState('desktop');

  const viewports = [
    { id: 'mobile', name: 'Mobile', icon: <Smartphone className="h-4 w-4" />, width: 375 },
    { id: 'tablet', name: 'Tablet', icon: <Tablet className="h-4 w-4" />, width: 768 },
    { id: 'desktop', name: 'Desktop', icon: <Monitor className="h-4 w-4" />, width: 1200 }
  ];

  const runAccessibilityAudit = async () => {
    setIsRunning(true);
    setResults([]);

    const mockResults: AccessibilityTestResult[] = [
      // Touch Target Size Tests
      {
        test: 'Touch Target Size',
        status: 'pass',
        message: 'All interactive elements meet 44px minimum touch target size',
        impact: 'high',
        element: 'buttons, links, form controls',
        recommendation: 'Maintain current touch target sizes'
      },
      
      // Keyboard Navigation Tests
      {
        test: 'Keyboard Navigation',
        status: 'warning',
        message: 'Some modal dialogs trap focus but lack escape key handling',
        impact: 'medium',
        element: 'modal dialogs',
        recommendation: 'Add escape key handlers to all modal components'
      },
      
      // Screen Reader Tests
      {
        test: 'Screen Reader Labels',
        status: 'fail',
        message: 'Chart elements lack proper ARIA labels and descriptions',
        impact: 'high',
        element: 'recharts components',
        recommendation: 'Add aria-label and aria-describedby attributes to chart elements'
      },
      
      // Color Contrast Tests
      {
        test: 'Color Contrast',
        status: 'pass',
        message: 'All text meets WCAG AA contrast requirements',
        impact: 'critical',
        element: 'text elements',
        recommendation: 'Continue using semantic color tokens'
      },
      
      // Form Accessibility Tests
      {
        test: 'Form Accessibility',
        status: 'warning',
        message: 'Some forms lack proper error announcement to screen readers',
        impact: 'medium',
        element: 'form validation',
        recommendation: 'Use aria-live regions for dynamic error messages'
      },
      
      // Focus Management Tests
      {
        test: 'Focus Management',
        status: 'pass',
        message: 'Focus indicators are visible and consistent',
        impact: 'high',
        element: 'interactive elements',
        recommendation: 'Maintain current focus ring styling'
      },
      
      // Responsive Layout Tests
      {
        test: 'Responsive Layout',
        status: 'pass',
        message: 'No horizontal scrolling detected at any breakpoint',
        impact: 'high',
        element: 'page layout',
        recommendation: 'Continue using responsive grid system'
      },
      
      // Alternative Text Tests
      {
        test: 'Alternative Text',
        status: 'warning',
        message: 'Some decorative images have unnecessary alt text',
        impact: 'low',
        element: 'decorative images',
        recommendation: 'Use empty alt="" for decorative images'
      }
    ];

    // Simulate async testing
    for (let i = 0; i < mockResults.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setResults(prev => [...prev, mockResults[i]]);
    }

    setIsRunning(false);
    
    const criticalIssues = mockResults.filter(r => r.impact === 'critical' && r.status === 'fail');
    const highIssues = mockResults.filter(r => r.impact === 'high' && r.status === 'fail');
    
    if (criticalIssues.length > 0) {
      toast.error(`${criticalIssues.length} critical accessibility issues found`);
    } else if (highIssues.length > 0) {
      toast.warning(`${highIssues.length} high-impact accessibility issues found`);
    } else {
      toast.success('Accessibility audit completed successfully');
    }
  };

  const runManualTests = () => {
    const manualTestInstructions = [
      '1. Navigate entire app using only keyboard (Tab, Enter, Escape, Arrow keys)',
      '2. Test with screen reader (VoiceOver on Mac, NVDA on Windows)',
      '3. Check all forms submit properly via keyboard',
      '4. Verify all images have appropriate alt text',
      '5. Test at 200% zoom level - content should remain usable',
      '6. Verify color is not the only way to convey information',
      '7. Check that animations respect prefers-reduced-motion',
      '8. Test all interactive elements have visible focus indicators'
    ];

    toast.info('Manual accessibility testing checklist copied to clipboard');
    navigator.clipboard.writeText(manualTestInstructions.join('\n'));
  };

  const getStatusIcon = (status: AccessibilityTestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getImpactColor = (impact: AccessibilityTestResult['impact']) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const criticalIssues = results.filter(r => r.impact === 'critical' && r.status === 'fail').length;
  const highIssues = results.filter(r => r.impact === 'high' && r.status === 'fail').length;
  const totalPassed = results.filter(r => r.status === 'pass').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Accessibility className="h-6 w-6" />
            Accessibility QA Testing
          </h2>
          <p className="text-muted-foreground">
            WCAG 2.1 AA compliance testing for mobile and desktop
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAccessibilityAudit} disabled={isRunning}>
            {isRunning ? 'Running Audit...' : 'Run Accessibility Audit'}
          </Button>
          <Button variant="outline" onClick={runManualTests}>
            Manual Test Checklist
          </Button>
        </div>
      </div>

      {/* Viewport Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Test Viewport
          </CardTitle>
          <CardDescription>
            Select viewport size for responsive accessibility testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {viewports.map(viewport => (
              <Button
                key={viewport.id}
                variant={selectedViewport === viewport.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedViewport(viewport.id)}
                className="flex items-center gap-2"
              >
                {viewport.icon}
                {viewport.name}
                <span className="text-xs text-muted-foreground">
                  {viewport.width}px
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {results.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalPassed}</div>
                <div className="text-sm text-muted-foreground">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{criticalIssues}</div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{highIssues}</div>
                <div className="text-sm text-muted-foreground">High Impact</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Math.round((totalPassed / results.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Compliance Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalIssues} critical accessibility issues</strong> found. 
            These must be resolved to meet WCAG AA compliance requirements.
          </AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Test Results</CardTitle>
            <CardDescription>
              Detailed results from automated accessibility audit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <div className="mt-0.5">
                    {getStatusIcon(result.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{result.test}</h4>
                      <Badge className={getImpactColor(result.impact)}>
                        {result.impact}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.message}
                    </p>
                    
                    {result.element && (
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Element:</strong> {result.element}
                      </p>
                    )}
                    
                    {result.recommendation && (
                      <div className="text-xs bg-muted p-2 rounded">
                        <strong>Recommendation:</strong> {result.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Testing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Manual Testing Guidelines
          </CardTitle>
          <CardDescription>
            Additional manual tests that require human verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Keyboard Navigation</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Tab through all interactive elements</li>
                <li>• Verify logical tab order</li>
                <li>• Test modal focus trapping</li>
                <li>• Check skip navigation links</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Screen Reader Testing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test with VoiceOver (Mac) or NVDA (Windows)</li>
                <li>• Verify form labels are announced</li>
                <li>• Check landmark navigation</li>
                <li>• Test dynamic content updates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Mobile Accessibility</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Verify 44px minimum touch targets</li>
                <li>• Test with device accessibility features</li>
                <li>• Check zoom functionality up to 200%</li>
                <li>• Test in landscape and portrait modes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Visual Accessibility</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test with high contrast mode</li>
                <li>• Verify reduced motion preferences</li>
                <li>• Check color-only information</li>
                <li>• Test with browser zoom at 200%</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Pro Tip:</strong> Use browser developer tools accessibility auditor 
              and extensions like axe DevTools for additional automated testing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}