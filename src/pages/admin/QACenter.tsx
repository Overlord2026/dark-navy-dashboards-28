import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Users, 
  Activity,
  Shield,
  Smartphone,
  Zap,
  TestTube2,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data - In production, this would come from actual QA results
const qaMetrics = {
  totalTests: 247,
  passed: 231,
  failed: 8,
  warnings: 8,
  coverage: 93.5,
  lastRun: '2024-01-15T10:30:00Z'
};

const personaTests = [
  {
    id: 'client-family',
    name: 'Client/Family',
    status: 'passed',
    tests: 34,
    passed: 32,
    failed: 1,
    warnings: 1,
    lastRun: '2024-01-15T10:15:00Z',
    criticalPath: ['Authentication', 'Dashboard', 'SWAG Roadmap', 'Document Vault']
  },
  {
    id: 'advisor',
    name: 'Financial Advisor',
    status: 'passed',
    tests: 42,
    passed: 40,
    failed: 1,
    warnings: 1,
    lastRun: '2024-01-15T10:20:00Z',
    criticalPath: ['CRM Dashboard', 'Client Management', 'Pipeline', 'Reports']
  },
  {
    id: 'accountant',
    name: 'CPA/Accountant',
    status: 'passed',
    tests: 38,
    passed: 36,
    failed: 2,
    warnings: 0,
    lastRun: '2024-01-15T10:25:00Z',
    criticalPath: ['Tax Planning', 'Entity Management', 'Compliance', 'Client Portal']
  },
  {
    id: 'attorney-estate',
    name: 'Estate Attorney',
    status: 'warning',
    tests: 31,
    passed: 28,
    failed: 1,
    warnings: 2,
    lastRun: '2024-01-15T10:10:00Z',
    criticalPath: ['Document Management', 'Estate Planning', 'Client Communication']
  },
  {
    id: 'attorney-litigation',
    name: 'Litigation Attorney',
    status: 'warning',
    tests: 29,
    passed: 26,
    failed: 1,
    warnings: 2,
    lastRun: '2024-01-15T10:12:00Z',
    criticalPath: ['Case Management', 'Asset Discovery', 'Document Vault']
  },
  {
    id: 'insurance',
    name: 'Insurance Professional',
    status: 'passed',
    tests: 33,
    passed: 31,
    failed: 1,
    warnings: 1,
    lastRun: '2024-01-15T10:18:00Z',
    criticalPath: ['Policy Management', 'Client Risk Assessment', 'Compliance']
  },
  {
    id: 'realtor',
    name: 'Realtor/Property Manager',
    status: 'failed',
    tests: 26,
    passed: 23,
    failed: 2,
    warnings: 1,
    lastRun: '2024-01-15T10:05:00Z',
    criticalPath: ['Property Management', 'Client Portal', 'Market Analysis']
  },
  {
    id: 'healthcare',
    name: 'Healthcare Consultant',
    status: 'passed',
    tests: 24,
    passed: 23,
    failed: 0,
    warnings: 1,
    lastRun: '2024-01-15T10:08:00Z',
    criticalPath: ['Health Records', 'Provider Network', 'Care Coordination']
  }
];

const technicalAreas = [
  {
    category: 'Security',
    icon: Shield,
    status: 'passed',
    tests: 28,
    issues: [],
    lastCheck: '2024-01-15T09:45:00Z'
  },
  {
    category: 'Performance',
    icon: Zap,
    status: 'warning',
    tests: 15,
    issues: ['Mobile load times on 3G', 'Large dataset rendering'],
    lastCheck: '2024-01-15T09:50:00Z'
  },
  {
    category: 'Accessibility',
    icon: Users,
    status: 'warning',
    tests: 22,
    issues: ['Color contrast in dark mode', 'Missing ARIA labels on charts'],
    lastCheck: '2024-01-15T09:55:00Z'
  },
  {
    category: 'Mobile',
    icon: Smartphone,
    status: 'passed',
    tests: 31,
    issues: [],
    lastCheck: '2024-01-15T10:00:00Z'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'passed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    passed: 'default',
    warning: 'secondary',
    failed: 'destructive'
  } as const;
  
  return (
    <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

// Mock navigation data (in production, this would be imported from the sitemap)
const navigationData = {
  totalRoutes: 127,
  publicRoutes: 23,
  authRoutes: 8,
  appRoutes: 64,
  adminRoutes: 12,
  personaRoutes: 48,
  brokenLinks: 3,
  orphanedPages: 1
};

export default function QACenter() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const navigateToPage = (path: string) => {
    // In a real app, this would navigate to the specified page
    window.open(path, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QA Testing Center</h1>
        <p className="text-muted-foreground">
          Comprehensive testing dashboard for all platform features and personas
        </p>
      </div>

      {/* QA Status Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TestTube2 className="h-4 w-4 mr-2" />
              Total Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qaMetrics.totalTests}</div>
            <p className="text-xs text-muted-foreground">Last run: {formatTime(qaMetrics.lastRun)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{qaMetrics.passed}</div>
            <p className="text-xs text-muted-foreground">{((qaMetrics.passed / qaMetrics.totalTests) * 100).toFixed(1)}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-yellow-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{qaMetrics.warnings}</div>
            <p className="text-xs text-muted-foreground">Non-critical issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-red-600">
              <XCircle className="h-4 w-4 mr-2" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{qaMetrics.failed}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personas">Persona Testing</TabsTrigger>
          <TabsTrigger value="technical">Technical Areas</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Map</TabsTrigger>
          <TabsTrigger value="scripts">Test Scripts</TabsTrigger>
        </TabsList>

        <TabsContent value="personas">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Persona List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Persona Test Results</CardTitle>
                  <CardDescription>
                    Testing status for each user persona and their critical workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personaTests.map((persona) => (
                      <div 
                        key={persona.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedPersona === persona.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedPersona(persona.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(persona.status)}
                            <h3 className="font-semibold">{persona.name}</h3>
                          </div>
                          {getStatusBadge(persona.status)}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-medium">{persona.tests}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Passed: </span>
                            <span className="font-medium text-green-600">{persona.passed}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Issues: </span>
                            <span className="font-medium text-red-600">{persona.failed + persona.warnings}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          Last run: {formatTime(persona.lastRun)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Persona Details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedPersona 
                      ? personaTests.find(p => p.id === selectedPersona)?.name || 'Persona Details'
                      : 'Select a Persona'
                    }
                  </CardTitle>
                  <CardDescription>
                    {selectedPersona 
                      ? 'Critical path testing results and quick actions'
                      : 'Click on a persona to see detailed testing information'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedPersona ? (
                    <div className="space-y-4">
                      {(() => {
                        const persona = personaTests.find(p => p.id === selectedPersona);
                        if (!persona) return null;
                        
                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Passed:</span>
                                  <span className="font-medium text-green-600">{persona.passed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Failed:</span>
                                  <span className="font-medium text-red-600">{persona.failed}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Warnings:</span>
                                  <span className="font-medium text-yellow-600">{persona.warnings}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Success Rate:</span>
                                  <span className="font-medium">{((persona.passed / persona.tests) * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h4 className="font-semibold mb-3">Critical Path</h4>
                              <div className="space-y-2">
                                {persona.criticalPath.map((path, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <span className="text-sm">{path}</span>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => navigateToPage(`/persona-tests/${persona.id}`)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Test Script
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => navigateToPage(`/${persona.id}`)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Dashboard
                              </Button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a persona from the list to view detailed testing information</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <div className="grid md:grid-cols-2 gap-6">
            {technicalAreas.map((area) => {
              const IconComponent = area.icon;
              return (
                <Card key={area.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IconComponent className="h-5 w-5 mr-2" />
                      {area.category}
                      <div className="ml-auto">
                        {getStatusBadge(area.status)}
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {area.tests} tests completed • Last check: {formatTime(area.lastCheck)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {area.issues.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Outstanding Issues:</h4>
                        {area.issues.map((issue, index) => (
                          <Alert key={index}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              {issue}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">All tests passing</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Navigation Site Map
              </CardTitle>
              <CardDescription>
                Complete overview of all routes and navigation paths in the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{navigationData.totalRoutes}</div>
                  <div className="text-sm text-muted-foreground">Total Routes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{navigationData.totalRoutes - navigationData.brokenLinks - navigationData.orphanedPages}</div>
                  <div className="text-sm text-muted-foreground">Working Routes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{navigationData.brokenLinks + navigationData.orphanedPages}</div>
                  <div className="text-sm text-muted-foreground">Issues Found</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">Route Categories</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Public Routes:</span>
                      <span className="font-medium">{navigationData.publicRoutes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auth Routes:</span>
                      <span className="font-medium">{navigationData.authRoutes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>App Routes:</span>
                      <span className="font-medium">{navigationData.appRoutes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin Routes:</span>
                      <span className="font-medium">{navigationData.adminRoutes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Persona Routes:</span>
                      <span className="font-medium">{navigationData.personaRoutes}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Issues Detected</h4>
                  {navigationData.brokenLinks > 0 && (
                    <Alert className="mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {navigationData.brokenLinks} broken links found
                      </AlertDescription>
                    </Alert>
                  )}
                  {navigationData.orphanedPages > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {navigationData.orphanedPages} orphaned pages detected
                      </AlertDescription>
                    </Alert>
                  )}
                  {navigationData.brokenLinks === 0 && navigationData.orphanedPages === 0 && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">No navigation issues detected</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Complete Site Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle>QA Test Scripts</CardTitle>
              <CardDescription>
                Step-by-step testing scripts for manual QA validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personaTests.map((persona) => (
                  <Card key={persona.id} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {persona.name}
                        {getStatusBadge(persona.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          {persona.tests} test cases • {persona.criticalPath.length} critical paths
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigateToPage(`/docs/qa/persona-tests/${persona.id}.md`)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Test Script
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigateToPage(`/${persona.id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Master QA Checklist
                  </Button>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Analytics Test Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}