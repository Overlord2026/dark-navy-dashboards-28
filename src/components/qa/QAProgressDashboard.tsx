import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity, Clock } from 'lucide-react';

interface QAProgressDashboardProps {
  complianceQA: any;
  onboardingQA: any;
  activeTest: string | null;
}

export function QAProgressDashboard({ 
  complianceQA, 
  onboardingQA, 
  activeTest 
}: QAProgressDashboardProps) {
  const getSystemStatus = (results: any) => {
    if (!results) return { status: 'pending', tests: 0, passed: 0, failed: 0 };
    
    const allTests = Object.values(results).flat() as any[];
    const passed = allTests.filter(t => t.status === 'pass').length;
    const failed = allTests.filter(t => t.status === 'fail').length;
    
    let status = 'pending';
    if (allTests.length > 0) {
      const passRate = (passed / allTests.length) * 100;
      if (passRate >= 90) status = 'excellent';
      else if (passRate >= 75) status = 'good';
      else if (passRate >= 60) status = 'warning';
      else status = 'critical';
    }
    
    return { status, tests: allTests.length, passed, failed };
  };

  const complianceStatus = getSystemStatus(complianceQA.results);
  const onboardingStatus = getSystemStatus(onboardingQA.results);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">Good</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Needs Work</Badge>;
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-700 border-red-500/20">Critical</Badge>;
      default:
        return <Badge variant="secondary">Not Tested</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Compliance System Status */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Compliance System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusBadge(complianceStatus.status)}
          </div>
          
          {complianceQA.isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Testing...</span>
                <span>{complianceQA.progress}%</span>
              </div>
              <Progress value={complianceQA.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {complianceQA.currentTest}
              </p>
            </div>
          )}
          
          {complianceStatus.tests > 0 && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 border rounded">
                <div className={`text-lg font-bold ${getStatusColor(complianceStatus.status)}`}>
                  {complianceStatus.passed}
                </div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="p-2 border rounded">
                <div className="text-lg font-bold text-red-600">
                  {complianceStatus.failed}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onboarding System Status */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Onboarding System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusBadge(onboardingStatus.status)}
          </div>
          
          {onboardingQA.isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Testing...</span>
                <span>{onboardingQA.progress}%</span>
              </div>
              <Progress value={onboardingQA.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {onboardingQA.currentTest}
              </p>
            </div>
          )}
          
          {onboardingStatus.tests > 0 && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 border rounded">
                <div className={`text-lg font-bold ${getStatusColor(onboardingStatus.status)}`}>
                  {onboardingStatus.passed}
                </div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="p-2 border rounded">
                <div className="text-lg font-bold text-red-600">
                  {onboardingStatus.failed}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Status */}
      <Card className="border-2 border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Overall Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {complianceStatus.tests + onboardingStatus.tests > 0 
                ? Math.round(((complianceStatus.passed + onboardingStatus.passed) / 
                   (complianceStatus.tests + onboardingStatus.tests)) * 100)
                : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Pass Rate</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Tests</span>
              <span>{complianceStatus.tests + onboardingStatus.tests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Passed</span>
              <span className="text-green-600">{complianceStatus.passed + onboardingStatus.passed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Failed</span>
              <span className="text-red-600">{complianceStatus.failed + onboardingStatus.failed}</span>
            </div>
          </div>

          {activeTest && (
            <div className="flex items-center gap-2 p-2 bg-primary/5 rounded border border-primary/20">
              <Clock className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm text-primary font-medium">
                {activeTest === 'full' ? 'Running Full Suite' : `Testing ${activeTest}`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}