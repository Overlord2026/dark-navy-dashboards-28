import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Database,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { useComplianceQA } from '@/hooks/useComplianceQA';
import { useMassOnboardingQA } from '@/hooks/useMassOnboardingQA';
import { usePersonaQATesting } from '@/hooks/usePersonaQATesting';

export default function QAExecutionPage() {
  const [executionPhase, setExecutionPhase] = useState<'setup' | 'running' | 'complete'>('setup');
  const [currentSuite, setCurrentSuite] = useState<string>('');
  const [overallProgress, setOverallProgress] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const complianceQA = useComplianceQA();
  const onboardingQA = useMassOnboardingQA();
  const personaQA = usePersonaQATesting();

  const [criticalIssues, setCriticalIssues] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (executionPhase === 'running') {
      const totalSuites = 3;
      let completedSuites = 0;
      
      if (!complianceQA.isRunning && complianceQA.results) completedSuites++;
      if (!onboardingQA.isRunning && onboardingQA.results) completedSuites++;
      if (!personaQA.isRunning && personaQA.results) completedSuites++;
      
      setOverallProgress((completedSuites / totalSuites) * 100);
      
      if (completedSuites === totalSuites) {
        setExecutionPhase('complete');
        setEndTime(new Date());
        analyzeResults();
      }
    }
  }, [
    complianceQA.isRunning, 
    complianceQA.results,
    onboardingQA.isRunning, 
    onboardingQA.results,
    personaQA.isRunning,
    personaQA.results,
    executionPhase
  ]);

  const executeFullQASuite = async () => {
    setExecutionPhase('running');
    setStartTime(new Date());
    setCriticalIssues([]);
    setRecommendations([]);

    // Run all QA suites simultaneously
    try {
      setCurrentSuite('Initializing test suites...');
      
      // Start compliance QA
      setCurrentSuite('Compliance Management System');
      complianceQA.runTests();
      
      // Start onboarding QA  
      setCurrentSuite('Mass Onboarding & Migration');
      onboardingQA.runTests();
      
      // Start persona QA
      setCurrentSuite('Role-Based Access Control');
      personaQA.runFullQASuite();
      
    } catch (error) {
      console.error('QA execution error:', error);
    }
  };

  const analyzeResults = () => {
    const issues: any[] = [];
    const recs: string[] = [];

    // Analyze compliance results
    if (complianceQA.results) {
      const complianceTests = Object.values(complianceQA.results).flat();
      const failedCompliance = complianceTests.filter((t: any) => t.status === 'fail');
      
      failedCompliance.forEach((test: any) => {
        if (test.category === 'auth' || test.name.includes('Permission')) {
          issues.push({
            severity: 'critical',
            system: 'Compliance',
            issue: test.name,
            message: test.message,
            recommendation: 'Fix role-based access controls before launch'
          });
        }
      });

      if (failedCompliance.length > 0) {
        recs.push('Review compliance workflow failures and ensure regulatory requirements are met');
      }
    }

    // Analyze onboarding results
    if (onboardingQA.results) {
      const onboardingTests = Object.values(onboardingQA.results).flat();
      const failedOnboarding = onboardingTests.filter((t: any) => t.status === 'fail');
      
      failedOnboarding.forEach((test: any) => {
        if (test.name.includes('File Upload') || test.name.includes('Data')) {
          issues.push({
            severity: 'high',
            system: 'Onboarding',
            issue: test.name,
            message: test.message,
            recommendation: 'Fix file handling and data validation before processing client data'
          });
        }
      });

      if (failedOnboarding.length > 0) {
        recs.push('Address onboarding workflow issues to prevent client migration failures');
      }
    }

    // Analyze persona results
    if (personaQA.results) {
      const personaTests = Object.values(personaQA.results).flat();
      const failedPersona = personaTests.filter((t: any) => t.status === 'fail');
      
      failedPersona.forEach((test: any) => {
        if (test.category === 'auth') {
          issues.push({
            severity: 'critical',
            system: 'Access Control',
            issue: test.name,
            message: test.message,
            recommendation: 'Security vulnerability - fix immediately'
          });
        }
      });

      if (failedPersona.length > 0) {
        recs.push('Critical: Fix role-based access control vulnerabilities');
      }
    }

    setCriticalIssues(issues);
    setRecommendations(recs);
  };

  const generateExecutiveReport = () => {
    const executionTime = startTime && endTime 
      ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

    const allTests = [
      ...(complianceQA.results ? Object.values(complianceQA.results).flat() : []),
      ...(onboardingQA.results ? Object.values(onboardingQA.results).flat() : []),
      ...(personaQA.results ? Object.values(personaQA.results).flat() : [])
    ];

    const summary = {
      executionDate: new Date().toISOString(),
      executionTime: `${executionTime} seconds`,
      totalTests: allTests.length,
      passed: allTests.filter((t: any) => t.status === 'pass').length,
      failed: allTests.filter((t: any) => t.status === 'fail').length,
      warnings: allTests.filter((t: any) => t.status === 'warning').length,
      passRate: allTests.length > 0 ? Math.round((allTests.filter((t: any) => t.status === 'pass').length / allTests.length) * 100) : 0,
      criticalIssues: criticalIssues.length,
      goLiveRecommendation: getGoLiveRecommendation()
    };

    const reportData = {
      executiveSummary: summary,
      criticalIssues,
      recommendations,
      detailedResults: {
        complianceManagement: {
          system: 'Compliance Management',
          testCount: complianceQA.results ? Object.values(complianceQA.results).flat().length : 0,
          results: complianceQA.results,
          status: getSystemStatus(complianceQA.results)
        },
        massOnboarding: {
          system: 'Mass Onboarding & Migration',
          testCount: onboardingQA.results ? Object.values(onboardingQA.results).flat().length : 0,
          results: onboardingQA.results,
          status: getSystemStatus(onboardingQA.results)
        },
        roleBasedAccess: {
          system: 'Role-Based Access Control',
          testCount: personaQA.results ? Object.values(personaQA.results).flat().length : 0,
          results: personaQA.results,
          status: getSystemStatus(personaQA.results)
        }
      },
      nextSteps: getNextSteps()
    };

    // Download executive report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BFO-QA-Executive-Report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSystemStatus = (results: any) => {
    if (!results) return 'not_tested';
    
    const tests = Object.values(results).flat() as any[];
    const failedTests = tests.filter(t => t.status === 'fail');
    const criticalFailures = failedTests.filter(t => t.category === 'auth' || t.name.includes('Security'));
    
    if (criticalFailures.length > 0) return 'critical';
    if (failedTests.length > tests.length * 0.2) return 'needs_work';
    if (failedTests.length > 0) return 'minor_issues';
    return 'ready';
  };

  const getGoLiveRecommendation = () => {
    const criticalCount = criticalIssues.filter(i => i.severity === 'critical').length;
    const highCount = criticalIssues.filter(i => i.severity === 'high').length;
    
    if (criticalCount > 0) return 'DO NOT GO LIVE - Critical security issues detected';
    if (highCount > 3) return 'DELAYED GO LIVE - Resolve high-priority issues first';
    if (criticalIssues.length > 0) return 'CONDITIONAL GO LIVE - Monitor closely';
    return 'GO LIVE APPROVED - All systems operational';
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (criticalIssues.length > 0) {
      steps.push('1. Address all critical and high-priority issues');
      steps.push('2. Re-run QA tests to verify fixes');
    }
    
    steps.push('3. Schedule final security review');
    steps.push('4. Prepare rollback plan');
    steps.push('5. Configure production monitoring');
    steps.push('6. Train support team on new features');
    
    return steps;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">
            QA Execution Center
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Comprehensive testing of Compliance & Onboarding systems
        </p>
      </motion.div>

      {/* Execution Status */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Execution Status
            </div>
            {executionPhase === 'complete' && (
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                Complete
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {executionPhase === 'setup' && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Ready to execute comprehensive QA testing</p>
              <Button 
                onClick={executeFullQASuite}
                className="flex items-center gap-2"
                size="lg"
              >
                <Play className="h-5 w-5" />
                Execute Full QA Suite
              </Button>
            </div>
          )}

          {executionPhase === 'running' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium text-sm">Compliance</span>
                  </div>
                  {complianceQA.isRunning ? (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Clock className="h-3 w-3 animate-spin" />
                      Testing...
                    </div>
                  ) : complianceQA.results ? (
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium text-sm">Onboarding</span>
                  </div>
                  {onboardingQA.isRunning ? (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Clock className="h-3 w-3 animate-spin" />
                      Testing...
                    </div>
                  ) : onboardingQA.results ? (
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium text-sm">Access Control</span>
                  </div>
                  {personaQA.isRunning ? (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Clock className="h-3 w-3 animate-spin" />
                      Testing...
                    </div>
                  ) : personaQA.results ? (
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              </div>

              {currentSuite && (
                <Alert>
                  <TestTube className="h-4 w-4" />
                  <AlertDescription>
                    Currently testing: {currentSuite}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {executionPhase === 'complete' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4 text-center">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {[
                      ...(complianceQA.results ? Object.values(complianceQA.results).flat() : []),
                      ...(onboardingQA.results ? Object.values(onboardingQA.results).flat() : []),
                      ...(personaQA.results ? Object.values(personaQA.results).flat() : [])
                    ].length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {[
                      ...(complianceQA.results ? Object.values(complianceQA.results).flat() : []),
                      ...(onboardingQA.results ? Object.values(onboardingQA.results).flat() : []),
                      ...(personaQA.results ? Object.values(personaQA.results).flat() : [])
                    ].filter((t: any) => t.status === 'pass').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {[
                      ...(complianceQA.results ? Object.values(complianceQA.results).flat() : []),
                      ...(onboardingQA.results ? Object.values(onboardingQA.results).flat() : []),
                      ...(personaQA.results ? Object.values(personaQA.results).flat() : [])
                    ].filter((t: any) => t.status === 'fail').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {criticalIssues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Issues</div>
                </div>
              </div>

              <Button 
                onClick={generateExecutiveReport}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                Download Executive QA Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Critical Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalIssues.map((issue, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{issue.issue}</div>
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm mb-2">{issue.message}</div>
                <div className="text-xs font-medium">
                  Recommendation: {issue.recommendation}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Go-Live Recommendation */}
      {executionPhase === 'complete' && (
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Go-Live Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg text-center font-medium ${
              getGoLiveRecommendation().includes('DO NOT') 
                ? 'bg-red-50 text-red-700 border border-red-200'
                : getGoLiveRecommendation().includes('DELAYED')
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : getGoLiveRecommendation().includes('CONDITIONAL')
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {getGoLiveRecommendation()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}