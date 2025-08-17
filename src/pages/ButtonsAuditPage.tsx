import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  MousePointer, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Accessibility, 
  Zap,
  TestTube,
  RefreshCw,
  Monitor,
  Keyboard,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ButtonState {
  component: string;
  location: string;
  hasLoadingState: boolean;
  hasDisabledState: boolean;
  hasErrorState: boolean;
  hasSuccessState: boolean;
  hasHoverState: boolean;
  hasFocusState: boolean;
  accessibility: {
    hasAriaLabel: boolean;
    hasAriaDescribedBy: boolean;
    hasFocusIndicator: boolean;
    keyboardAccessible: boolean;
  };
  interaction: {
    clickHandler: boolean;
    preventDoubleClick: boolean;
    loadingTimeout: boolean;
    errorHandling: boolean;
  };
  testing: {
    hasTestId: boolean;
    hasUnitTests: boolean;
    hasIntegrationTests: boolean;
    hasE2ETests: boolean;
  };
}

interface InteractionIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'accessibility' | 'usability' | 'performance' | 'testing';
  component: string;
  description: string;
  recommendation: string;
  code_example?: string;
}

interface ButtonAuditData {
  buttonStates: ButtonState[];
  formStates: any[];
  issues: InteractionIssue[];
  stats: {
    buttons: {
      total: number;
      withLoadingStates: number;
      withDisabledStates: number;
      withErrorStates: number;
      accessibilityScore: number;
      testCoverage: number;
    };
    forms: {
      total: number;
      withValidation: number;
      withLoadingStates: number;
      withErrorDisplay: number;
      accessibilityScore: number;
      testCoverage: number;
    };
    issues: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  recommendations: string[];
}

export default function ButtonsAuditPage() {
  const [auditData, setAuditData] = useState<ButtonAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: functionError } = await supabase.functions.invoke('buttons-audit');
      
      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch audit data');
      }
      
      setAuditData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accessibility': return <Accessibility className="h-4 w-4" />;
      case 'usability': return <MousePointer className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'testing': return <TestTube className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Running button and form audit...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <XCircle className="h-5 w-5 mr-2" />
              Error Loading Audit Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchAuditData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!auditData) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <MousePointer className="h-8 w-8 mr-3 text-primary" />
              Buttons & Forms Audit
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive audit of loading states, accessibility, and interaction quality
            </p>
          </div>
          <Button onClick={fetchAuditData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Audit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditData.stats.issues.total}</div>
            <p className="text-xs text-muted-foreground">Found across all components</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{auditData.stats.issues.critical}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Button Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditData.stats.buttons.accessibilityScore.toFixed(0)}%</div>
            <Progress value={auditData.stats.buttons.accessibilityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Form Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditData.stats.forms.accessibilityScore.toFixed(0)}%</div>
            <Progress value={auditData.stats.forms.accessibilityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((auditData.stats.buttons.testCoverage + auditData.stats.forms.testCoverage) / 2).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Average test coverage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Issue Severity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Severity Distribution</CardTitle>
              <CardDescription>Breakdown of interaction issues by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg border-red-200 bg-red-50">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{auditData.stats.issues.critical}</div>
                  <div className="text-sm font-medium">Critical</div>
                </div>
                <div className="text-center p-4 border rounded-lg border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{auditData.stats.issues.high}</div>
                  <div className="text-sm font-medium">High</div>
                </div>
                <div className="text-center p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{auditData.stats.issues.medium}</div>
                  <div className="text-sm font-medium">Medium</div>
                </div>
                <div className="text-center p-4 border rounded-lg border-blue-200 bg-blue-50">
                  <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{auditData.stats.issues.low}</div>
                  <div className="text-sm font-medium">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="h-5 w-5 mr-2 text-primary" />
                  Button Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Buttons</span>
                  <span className="font-medium">{auditData.stats.buttons.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Loading States</span>
                  <span className="font-medium">{auditData.stats.buttons.withLoadingStates}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Disabled States</span>
                  <span className="font-medium">{auditData.stats.buttons.withDisabledStates}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Error States</span>
                  <span className="font-medium">{auditData.stats.buttons.withErrorStates}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Accessibility Score</span>
                    <span className="font-medium">{auditData.stats.buttons.accessibilityScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={auditData.stats.buttons.accessibilityScore} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Keyboard className="h-5 w-5 mr-2 text-primary" />
                  Form Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Forms</span>
                  <span className="font-medium">{auditData.stats.forms.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Validation</span>
                  <span className="font-medium">{auditData.stats.forms.withValidation}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Loading States</span>
                  <span className="font-medium">{auditData.stats.forms.withLoadingStates}</span>
                </div>
                <div className="flex justify-between">
                  <span>With Error Display</span>
                  <span className="font-medium">{auditData.stats.forms.withErrorDisplay}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Accessibility Score</span>
                    <span className="font-medium">{auditData.stats.forms.accessibilityScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={auditData.stats.forms.accessibilityScore} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="space-y-4">
            {auditData.issues.map((issue, index) => (
              <Card key={index} className={getSeverityColor(issue.severity)}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(issue.severity)}
                      {getCategoryIcon(issue.category)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{issue.component}</h3>
                        <div className="flex space-x-2">
                          <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="bg-background/50 p-3 rounded border">
                        <p className="text-sm font-medium">Recommendation:</p>
                        <p className="text-sm">{issue.recommendation}</p>
                      </div>
                      {issue.code_example && (
                        <Accordion type="single" collapsible>
                          <AccordionItem value="code">
                            <AccordionTrigger className="text-sm">
                              View Code Example
                            </AccordionTrigger>
                            <AccordionContent>
                              <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                                <code>{issue.code_example}</code>
                              </pre>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6">
            {auditData.buttonStates.map((button, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{button.component}</span>
                    <div className="flex space-x-2">
                      {button.hasLoadingState && <Badge variant="default">Loading</Badge>}
                      {button.hasDisabledState && <Badge variant="secondary">Disabled</Badge>}
                      {button.hasErrorState && <Badge variant="destructive">Error</Badge>}
                    </div>
                  </CardTitle>
                  <CardDescription>{button.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Accessibility */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Accessibility className="h-4 w-4 mr-2" />
                        Accessibility
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">ARIA Label</span>
                          {button.accessibility.hasAriaLabel ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Focus Indicator</span>
                          {button.accessibility.hasFocusIndicator ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Keyboard Access</span>
                          {button.accessibility.keyboardAccessible ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interaction */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <MousePointer className="h-4 w-4 mr-2" />
                        Interaction
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Click Handler</span>
                          {button.interaction.clickHandler ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Double Click Prevention</span>
                          {button.interaction.preventDoubleClick ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Error Handling</span>
                          {button.interaction.errorHandling ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Testing */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <TestTube className="h-4 w-4 mr-2" />
                        Testing
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Test ID</span>
                          {button.testing.hasTestId ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Unit Tests</span>
                          {button.testing.hasUnitTests ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">E2E Tests</span>
                          {button.testing.hasE2ETests ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Interaction Quality Recommendations
              </CardTitle>
              <CardDescription>Priority improvements for button and form interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}