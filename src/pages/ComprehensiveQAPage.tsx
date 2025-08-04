import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Play,
  FileText,
  Shield,
  Users,
  Smartphone,
  Database
} from 'lucide-react';
import { useComplianceQA } from '@/hooks/useComplianceQA';
import { useMassOnboardingQA } from '@/hooks/useMassOnboardingQA';
import { QATestResults } from '@/components/qa/QATestResults';
import { QAProgressDashboard } from '@/components/qa/QAProgressDashboard';

export default function ComprehensiveQAPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const complianceQA = useComplianceQA();
  const onboardingQA = useMassOnboardingQA();

  const testSuites = [
    {
      id: 'compliance',
      name: 'Compliance Management System',
      icon: Shield,
      description: 'Test all compliance dashboard features, permissions, and workflows',
      hook: complianceQA
    },
    {
      id: 'onboarding',
      name: 'Mass Onboarding & Migration',
      icon: Users,
      description: 'Test advisor onboarding, book migration, and training workflows',
      hook: onboardingQA
    }
  ];

  const runFullQASuite = async () => {
    setActiveTest('full');
    await Promise.all([
      complianceQA.runTests(),
      onboardingQA.runTests()
    ]);
    setActiveTest(null);
  };

  const generateComprehensiveReport = () => {
    const timestamp = new Date().toISOString();
    const complianceResults = complianceQA.results || {};
    const onboardingResults = onboardingQA.results || {};
    
    const allResults = { ...complianceResults, ...onboardingResults };
    const allTests = Object.values(allResults).flat();
    
    const summary = {
      timestamp,
      totalTests: allTests.length,
      passed: allTests.filter(t => t.status === 'pass').length,
      failed: allTests.filter(t => t.status === 'fail').length,
      warnings: allTests.filter(t => t.status === 'warning').length,
      passRate: allTests.length > 0 ? (allTests.filter(t => t.status === 'pass').length / allTests.length) * 100 : 0
    };

    const reportData = {
      summary,
      complianceSystem: {
        testCount: Object.values(complianceResults).flat().length,
        results: complianceResults
      },
      onboardingSystem: {
        testCount: Object.values(onboardingResults).flat().length,
        results: onboardingResults
      },
      recommendations: generateRecommendations(allTests)
    };

    // Download report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bfo-qa-comprehensive-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateRecommendations = (tests: any[]) => {
    const failedTests = tests.filter(t => t.status === 'fail');
    const recommendations = [];

    if (failedTests.some(t => t.category === 'auth')) {
      recommendations.push('Review authentication flows and role-based access controls');
    }
    if (failedTests.some(t => t.category === 'navigation')) {
      recommendations.push('Fix navigation issues and ensure proper routing');
    }
    if (failedTests.some(t => t.category === 'mobile')) {
      recommendations.push('Improve mobile responsiveness and touch interactions');
    }
    if (failedTests.some(t => t.category === 'compliance')) {
      recommendations.push('Address compliance workflow and document handling issues');
    }
    if (failedTests.some(t => t.category === 'onboarding')) {
      recommendations.push('Fix onboarding wizard and data migration processes');
    }

    return recommendations;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <TestTube className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">
            BFO Comprehensive QA Testing
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Validate Compliance Management & Mass Onboarding systems before go-live
        </p>
      </motion.div>

      {/* Quick Actions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button 
            onClick={runFullQASuite}
            disabled={activeTest === 'full'}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {activeTest === 'full' ? 'Running Full Suite...' : 'Run Full QA Suite'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={generateComprehensiveReport}
            disabled={!complianceQA.results && !onboardingQA.results}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download QA Report
          </Button>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <QAProgressDashboard 
        complianceQA={complianceQA}
        onboardingQA={onboardingQA}
        activeTest={activeTest}
      />

      <Tabs defaultValue="suites" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="devices">Device Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="suites">
          <div className="grid gap-6 md:grid-cols-2">
            {testSuites.map((suite) => {
              const Icon = suite.icon;
              const isRunning = activeTest === suite.id || suite.hook.isRunning;
              const hasResults = suite.hook.results !== null;
              
              return (
                <Card key={suite.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {suite.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {suite.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {hasResults && (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 border rounded">
                          <div className="text-lg font-bold text-green-600">
                            {Object.values(suite.hook.results || {}).flat().filter(t => t.status === 'pass').length}
                          </div>
                          <div className="text-xs text-muted-foreground">Passed</div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="text-lg font-bold text-yellow-600">
                            {Object.values(suite.hook.results || {}).flat().filter(t => t.status === 'warning').length}
                          </div>
                          <div className="text-xs text-muted-foreground">Warnings</div>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="text-lg font-bold text-red-600">
                            {Object.values(suite.hook.results || {}).flat().filter(t => t.status === 'fail').length}
                          </div>
                          <div className="text-xs text-muted-foreground">Failed</div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => {
                        setActiveTest(suite.id);
                        suite.hook.runTests().finally(() => setActiveTest(null));
                      }}
                      disabled={isRunning}
                      className="w-full"
                    >
                      {isRunning ? 'Running Tests...' : `Test ${suite.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <QATestResults 
            complianceResults={complianceQA.results}
            onboardingResults={onboardingQA.results}
          />
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device & Responsiveness Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Test critical workflows across different devices and screen sizes.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Mobile (320-768px)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Touch interactions</li>
                    <li>• File uploads</li>
                    <li>• Navigation menus</li>
                    <li>• Form submissions</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Tablet (768-1024px)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Dashboard layouts</li>
                    <li>• Modal interactions</li>
                    <li>• Data tables</li>
                    <li>• Chart displays</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Desktop (1024px+)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Multi-column layouts</li>
                    <li>• Hover interactions</li>
                    <li>• Keyboard navigation</li>
                    <li>• Complex workflows</li>
                  </ul>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Run Cross-Device Tests
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}