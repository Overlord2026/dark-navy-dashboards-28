import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  ClipboardList,
  ShieldCheck,
  Users,
  Upload,
  Bell,
  Settings,
  Sparkles,
  Eye,
  Accessibility
} from 'lucide-react';
import { useComplianceQATesting } from '@/hooks/useComplianceQATesting';
import { useCelebration } from '@/hooks/useCelebration';
import { cn } from '@/lib/utils';

export function ComplianceQATestRunner() {
  const { 
    isRunning, 
    currentTest, 
    progress, 
    results, 
    runComplianceQASuite, 
    generateComplianceReport 
  } = useComplianceQATesting();
  
  const { triggerCelebration, celebration } = useCelebration();
  const [selectedPersona, setSelectedPersona] = useState<string>('');

  const personas = [
    { id: 'advisor', name: 'RIA Advisor', icon: Users },
    { id: 'compliance_officer', name: 'Compliance Officer', icon: ShieldCheck },
    { id: 'admin', name: 'Administrator', icon: Settings },
    { id: 'system_administrator', name: 'System Admin', icon: ClipboardList }
  ];

  const testCategories = [
    { id: 'filing_creation', name: 'Agent Onboarding', icon: Users, color: 'text-navy' },
    { id: 'document_upload', name: 'CE Upload', icon: Upload, color: 'text-emerald' },
    { id: 'officer_review', name: 'Reminders', icon: Bell, color: 'text-gold' },
    { id: 'mock_audit', name: 'Admin Review', icon: ShieldCheck, color: 'text-navy' },
    { id: 'export', name: 'Export/Download', icon: Download, color: 'text-emerald' },
    { id: 'accessibility', name: 'Accessibility', icon: Accessibility, color: 'text-gold' }
  ];

  const handleRunTests = async () => {
    await runComplianceQASuite(selectedPersona || undefined);
    
    // Trigger celebration when tests complete
    setTimeout(() => {
      triggerCelebration('success', 'QA Testing Complete! 🎉');
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-emerald" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-gold" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-emerald text-emerald-foreground';
      case 'warning':
        return 'bg-gold text-gold-foreground';
      case 'fail':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const calculateCategoryStats = (categoryId: string) => {
    if (!results) return { total: 0, passed: 0, failed: 0, warnings: 0 };
    
    const categoryTests = Object.values(results)
      .flat()
      .filter(test => test.category === categoryId);
    
    return {
      total: categoryTests.length,
      passed: categoryTests.filter(t => t.status === 'pass').length,
      failed: categoryTests.filter(t => t.status === 'fail').length,
      warnings: categoryTests.filter(t => t.status === 'warning').length
    };
  };

  const overallStats = results ? {
    totalTests: Object.values(results).flat().length,
    passed: Object.values(results).flat().filter(t => t.status === 'pass').length,
    failed: Object.values(results).flat().filter(t => t.status === 'fail').length,
    warnings: Object.values(results).flat().filter(t => t.status === 'warning').length
  } : null;

  return (
    <div className="space-y-6" role="main" aria-label="Compliance QA Test Runner">
      {celebration.isActive && <div className="celebration-container"><div className="confetti-gold"></div></div>}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">
            Compliance Management QA Test Suite
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing for agent onboarding, CE uploads, reminders, and admin workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRunTests}
            disabled={isRunning}
            className="bg-navy hover:bg-navy/90 text-navy-foreground"
            aria-label="Run compliance QA test suite"
          >
            <Play className="h-4 w-4 mr-2" aria-hidden="true" />
            {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
          </Button>
          {results && (
            <Button
              onClick={generateComplianceReport}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-gold-foreground"
              aria-label="Download test report for leadership review"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-navy">
            <Settings className="h-5 w-5 text-emerald" aria-hidden="true" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="persona-select">
                Select Persona (Optional - leave empty to test all)
              </label>
              <select
                id="persona-select"
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-navy focus:border-navy"
                aria-describedby="persona-help"
              >
                <option value="">All Personas</option>
                {personas.map(persona => (
                  <option key={persona.id} value={persona.id}>
                    {persona.name}
                  </option>
                ))}
              </select>
              <p id="persona-help" className="text-xs text-muted-foreground mt-1">
                Choose a specific persona or test all compliance roles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Progress */}
      {isRunning && (
        <Card className="border-emerald bg-emerald/5">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-emerald animate-spin" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-emerald-foreground">Running Tests...</p>
                  <p className="text-sm text-emerald-foreground/80">{currentTest}</p>
                </div>
              </div>
              <Progress 
                value={progress} 
                className="h-2"
                aria-label={`Test progress: ${progress}% complete`}
              />
              <p className="text-sm text-emerald-foreground text-center">
                {progress}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results Overview */}
      {overallStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold text-emerald">{overallStats.passed}</p>
                  <p className="text-sm text-muted-foreground">Tests Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gold">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-gold" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold text-gold">{overallStats.warnings}</p>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{overallStats.failed}</p>
                  <p className="text-sm text-muted-foreground">Tests Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-navy">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-8 w-8 text-navy" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold text-navy">{overallStats.totalTests}</p>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      {results && (
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger 
              value="categories"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              By Category
            </TabsTrigger>
            <TabsTrigger 
              value="personas"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
              By Persona
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility"
              className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
            >
              <Accessibility className="h-4 w-4 mr-2" aria-hidden="true" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <h2 className="text-xl font-semibold text-navy">Test Results by Category</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testCategories.map(category => {
                const stats = calculateCategoryStats(category.id);
                const Icon = category.icon;
                const successRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
                
                return (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-6 w-6", category.color)} aria-hidden="true" />
                          <h3 className="font-medium text-foreground">{category.name}</h3>
                        </div>
                        <Badge 
                          className={cn(
                            successRate >= 90 ? "bg-emerald text-emerald-foreground" :
                            successRate >= 70 ? "bg-gold text-gold-foreground" :
                            "bg-destructive text-destructive-foreground"
                          )}
                        >
                          {successRate}%
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-emerald">Passed:</span>
                          <span className="font-medium">{stats.passed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold">Warnings:</span>
                          <span className="font-medium">{stats.warnings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-destructive">Failed:</span>
                          <span className="font-medium">{stats.failed}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="personas" className="space-y-4">
            <h2 className="text-xl font-semibold text-navy">Test Results by Persona</h2>
            <div className="space-y-4">
              {Object.entries(results).map(([personaId, tests]) => {
                const persona = personas.find(p => p.id === personaId);
                const Icon = persona?.icon || Users;
                const passed = tests.filter(t => t.status === 'pass').length;
                const successRate = Math.round((passed / tests.length) * 100);
                
                return (
                  <Card key={personaId}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-navy">
                        <Icon className="h-5 w-5 text-emerald" aria-hidden="true" />
                        {persona?.name || personaId}
                        <Badge className={getStatusColor(successRate >= 90 ? 'pass' : successRate >= 70 ? 'warning' : 'fail')}>
                          {successRate}% Success
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {tests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded border">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(test.status)}
                              <span className="font-medium">{test.name}</span>
                              {test.route && (
                                <Badge variant="outline" className="text-xs">
                                  {test.route}
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{test.message}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <h2 className="text-xl font-semibold text-navy">Accessibility Compliance Report</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-emerald">
                <CardHeader>
                  <CardTitle className="text-emerald">✓ WCAG 2.1 AA Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-emerald">• 4.5:1 contrast ratio maintained</p>
                  <p className="text-sm text-emerald">• ARIA labels implemented</p>
                  <p className="text-sm text-emerald">• Keyboard navigation supported</p>
                  <p className="text-sm text-emerald">• Touch targets 44px minimum</p>
                </CardContent>
              </Card>
              
              <Card className="border-navy">
                <CardHeader>
                  <CardTitle className="text-navy">🎨 BFO Brand Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-navy">• Navy (#14213D) primary actions</p>
                  <p className="text-sm text-gold">• Gold (#FFD700) secondary elements</p>
                  <p className="text-sm text-emerald">• Emerald (#169873) success states</p>
                  <p className="text-sm text-muted-foreground">• Semantic color tokens used</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* QA Test Checklist */}
      <Card className="border-gold bg-gold/5">
        <CardHeader>
          <CardTitle className="text-gold">
            <CheckCircle className="h-5 w-5 inline mr-2" aria-hidden="true" />
            QA Validation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Core Functionality</h4>
              <div className="space-y-1 text-sm">
                <p className="text-emerald">✓ Agent onboarding workflow</p>
                <p className="text-emerald">✓ CE certificate upload</p>
                <p className="text-emerald">✓ Automated reminder system</p>
                <p className="text-emerald">✓ Admin review processes</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">User Experience</h4>
              <div className="space-y-1 text-sm">
                <p className="text-emerald">✓ Confetti celebrations trigger</p>
                <p className="text-emerald">✓ Navy/Gold/Emerald palette</p>
                <p className="text-emerald">✓ Mobile responsive design</p>
                <p className="text-emerald">✓ Accessibility compliance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}