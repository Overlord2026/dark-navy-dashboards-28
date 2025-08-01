import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download,
  User,
  Shield,
  Navigation,
  Smartphone,
  Lock
} from 'lucide-react';
import { usePersonaQATesting } from '@/hooks/usePersonaQATesting';

export function ComprehensivePersonaQARunner() {
  const {
    isRunning,
    currentTest,
    progress,
    results,
    runFullQASuite,
    generateReport,
    captureScreenshots
  } = usePersonaQATesting();

  const [selectedPersona, setSelectedPersona] = useState<string>('all');

  const personas = [
    { id: 'client_basic', label: 'Client Basic', icon: User },
    { id: 'client_premium', label: 'Client Premium', icon: User },
    { id: 'advisor', label: 'Financial Advisor', icon: Shield },
    { id: 'accountant', label: 'Accountant', icon: Shield },
    { id: 'attorney', label: 'Attorney', icon: Shield },
    { id: 'consultant', label: 'Consultant', icon: Shield },
    { id: 'admin', label: 'Administrator', icon: Shield },
    { id: 'system_administrator', label: 'System Admin', icon: Shield }
  ];

  const testCategories = [
    { id: 'auth', label: 'Authentication', icon: Lock },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'feature_gating', label: 'Feature Gating', icon: Shield },
    { id: 'mobile', label: 'Mobile Responsive', icon: Smartphone }
  ];

  const handleRunTests = async () => {
    await runFullQASuite(selectedPersona === 'all' ? undefined : selectedPersona);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500';
      case 'fail': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getSummaryStats = () => {
    if (!results) return { total: 0, passed: 0, failed: 0, warnings: 0 };
    
    const allTests = Object.values(results).flat();
    return {
      total: allTests.length,
      passed: allTests.filter(t => t.status === 'pass').length,
      failed: allTests.filter(t => t.status === 'fail').length,
      warnings: allTests.filter(t => t.status === 'warning').length
    };
  };

  const stats = getSummaryStats();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Comprehensive Persona QA Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Persona(s) to Test:</label>
            <select 
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isRunning}
            >
              <option value="all">All Personas</option>
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRunTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Tests...' : 'Run QA Suite'}
            </Button>
            
            {results && (
              <Button
                variant="outline"
                onClick={generateReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Testing Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            {currentTest && (
              <p className="text-sm text-muted-foreground">
                Currently testing: {currentTest}
              </p>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {results && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {results && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="personas">By Persona</TabsTrigger>
              <TabsTrigger value="categories">By Category</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4">
                {testCategories.map(category => {
                  const categoryTests = Object.values(results).flat().filter(t => t.category === category.id);
                  const passed = categoryTests.filter(t => t.status === 'pass').length;
                  const failed = categoryTests.filter(t => t.status === 'fail').length;
                  const warnings = categoryTests.filter(t => t.status === 'warning').length;
                  
                  return (
                    <Card key={category.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-green-600">
                              {passed} Pass
                            </Badge>
                            <Badge variant="outline" className="text-red-600">
                              {failed} Fail
                            </Badge>
                            <Badge variant="outline" className="text-yellow-600">
                              {warnings} Warning
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="personas" className="space-y-4">
              <div className="grid gap-4">
                {personas.map(persona => {
                  const personaTests = results[persona.id] || [];
                  const passed = personaTests.filter(t => t.status === 'pass').length;
                  const failed = personaTests.filter(t => t.status === 'fail').length;
                  const warnings = personaTests.filter(t => t.status === 'warning').length;
                  
                  return (
                    <Card key={persona.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <persona.icon className="h-4 w-4" />
                            {persona.label}
                          </div>
                          <Badge 
                            variant={failed > 0 ? "destructive" : warnings > 0 ? "secondary" : "default"}
                          >
                            {failed > 0 ? "Failed" : warnings > 0 ? "Warning" : "Passed"}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {personaTests.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="text-sm">{test.name}</span>
                              </div>
                              <Badge variant="outline">
                                {test.category}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid gap-4">
                {testCategories.map(category => {
                  const categoryTests = Object.values(results).flat().filter(t => t.category === category.id);
                  
                  return (
                    <Card key={category.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoryTests.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="text-sm">{test.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {test.persona}
                                </Badge>
                                {test.screenshot && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(test.screenshot, '_blank')}
                                  >
                                    View Screenshot
                                  </Button>
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
          </Tabs>
        )}

        {/* Instructions */}
        {!results && !isRunning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This comprehensive QA suite will test authentication flows, dashboard navigation, 
              sidebar links, feature gating, and mobile responsiveness for all user personas. 
              Select a specific persona or test all personas at once.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}