import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiagnostics } from '@/hooks/useDiagnostics';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export const DiagnosticsWizard = () => {
  const { 
    diagnosticResults, 
    applyDiagnosticFix, 
    fixInProgress, 
    refreshDiagnostics,
    isLoading
  } = useDiagnostics();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [criticalIssues, setCriticalIssues] = useState<any[]>([]);
  const [highPriorityIssues, setHighPriorityIssues] = useState<any[]>([]);
  const [mediumPriorityIssues, setMediumPriorityIssues] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  // Add state to track which issues are currently being fixed
  const [fixingIssueIds, setFixingIssueIds] = useState<Record<string, boolean>>({});

  // Find all issues from diagnostic results
  useEffect(() => {
    if (!diagnosticResults) return;

    const allTests = [
      ...(diagnosticResults.securityTests || []),
      ...(diagnosticResults.apiIntegrationTests || []),
      ...(diagnosticResults.performanceTests || []),
      ...(diagnosticResults.navigationTests || []),
      ...(diagnosticResults.formValidationTests || [])
    ];

    // Critical issues (security errors with critical severity)
    const critical = diagnosticResults.securityTests?.filter(
      (test: any) => test.status === "error" && test.severity === "critical"
    ) || [];

    // High priority (errors in API and other areas)
    const high = allTests.filter(
      (test: any) => 
        test.status === "error" && 
        (!test.severity || test.severity !== "critical")
    );

    // Medium priority (warnings)
    const medium = allTests.filter(
      (test: any) => test.status === "warning"
    );

    setCriticalIssues(critical);
    setHighPriorityIssues(high);
    setMediumPriorityIssues(medium);

    // Calculate progress
    const totalIssues = critical.length + high.length + medium.length;
    const fixedIssues = allTests.filter(test => test.status === "success").length;
    
    if (totalIssues > 0) {
      setProgress(Math.round((fixedIssues / (fixedIssues + totalIssues)) * 100));
    } else {
      setProgress(100);
      setIsComplete(true);
    }
  }, [diagnosticResults]);

  // Apply fix and move to next issue
  const handleApplyFix = async (issue: any) => {
    if (fixInProgress) return;
    
    const testId = `wizard-${issue.id || issue.name}`;
    
    // Mark this specific issue as fixing
    setFixingIssueIds(prev => ({...prev, [testId]: true}));
    
    try {
      // Fix: Pass only the testId to apply fix
      await applyDiagnosticFix(testId);
      toast.success(`Fixed: ${issue.name || issue.service}`);
      
      // Refresh diagnostics to update progress
      await refreshDiagnostics();
    } catch (error) {
      toast.error("Failed to apply fix");
      console.error("Fix application error:", error);
    } finally {
      // Clear the fixing state for this issue
      setFixingIssueIds(prev => ({...prev, [testId]: false}));
    }
  };

  // Check if a specific issue is being fixed
  const isFixingIssue = (issue: any) => {
    const testId = `wizard-${issue.id || issue.name}`;
    return fixingIssueIds[testId] || false;
  };

  // Create wizard steps based on issues
  const getWizardSteps = (): WizardStep[] => {
    const steps: WizardStep[] = [
      {
        id: "intro",
        title: "Diagnostics Wizard",
        description: "This wizard will guide you through fixing system issues in order of priority",
        component: (
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Wrench className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Welcome to the Diagnostics Wizard</h3>
              <p className="text-muted-foreground mt-2">
                This wizard will help you resolve system issues in order of priority:
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Critical Issues:</span> 
                  <span className="ml-2">{criticalIssues.length} issues</span>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                <FileWarning className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">High Priority:</span> 
                  <span className="ml-2">{highPriorityIssues.length} issues</span>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <Zap className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Medium Priority:</span> 
                  <span className="ml-2">{mediumPriorityIssues.length} issues</span>
                </div>
              </div>
            </div>
            
            {isComplete && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-md mt-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p className="font-medium text-green-700 dark:text-green-400">
                    All issues have been resolved! System looks healthy.
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      }
    ];

    // Add steps for critical issues
    criticalIssues.forEach((issue, index) => {
      steps.push({
        id: `critical-${index}`,
        title: `Critical Issue: ${issue.name}`,
        description: "Critical security issues must be fixed immediately",
        component: (
          <div className="py-4 space-y-4">
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
              <Shield className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div className="font-medium">Critical Security Issue</div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">{issue.name}</h3>
              <p className="text-muted-foreground">{issue.message}</p>
              
              <div className="bg-muted p-3 rounded-md text-sm mt-2">
                <pre className="whitespace-pre-wrap font-mono text-xs">{issue.details || "No additional details available"}</pre>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => handleApplyFix(issue)}
                disabled={isFixingIssue(issue)}
                className="gap-2"
              >
                <Wrench className="h-4 w-4" />
                {isFixingIssue(issue) ? "Fixing..." : "Fix Issue"}
              </Button>
            </div>
          </div>
        )
      });
    });

    // Add steps for high priority issues
    highPriorityIssues.forEach((issue, index) => {
      steps.push({
        id: `high-${index}`,
        title: `High Priority: ${issue.name || issue.service || "System Issue"}`,
        description: "These issues should be fixed soon",
        component: (
          <div className="py-4 space-y-4">
            <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
              <FileWarning className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
              <div className="font-medium">High Priority Issue</div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">{issue.name || issue.service || "System Issue"}</h3>
              <p className="text-muted-foreground">{issue.message}</p>
              
              {issue.details && (
                <div className="bg-muted p-3 rounded-md text-sm mt-2">
                  <pre className="whitespace-pre-wrap font-mono text-xs">{issue.details}</pre>
                </div>
              )}
              
              {issue.fixMessage && (
                <div className="p-3 border rounded-md mt-2">
                  <h4 className="text-sm font-medium mb-1">Fix Details:</h4>
                  <p className="text-sm">{issue.fixMessage}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => handleApplyFix(issue)}
                disabled={isFixingIssue(issue)}
                className="gap-2"
              >
                <Wrench className="h-4 w-4" />
                {isFixingIssue(issue) ? "Fixing..." : "Fix Issue"}
              </Button>
            </div>
          </div>
        )
      });
    });

    // Add medium priority issues
    mediumPriorityIssues.forEach((issue, index) => {
      steps.push({
        id: `medium-${index}`,
        title: `Medium Priority: ${issue.name || issue.service || "System Issue"}`,
        description: "These issues can be fixed after more critical ones",
        component: (
          <div className="py-4 space-y-4">
            <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <Zap className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
              <div className="font-medium">Medium Priority Issue</div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">{issue.name || issue.service || "System Issue"}</h3>
              <p className="text-muted-foreground">{issue.message}</p>
              
              {issue.details && (
                <div className="bg-muted p-3 rounded-md text-sm mt-2">
                  <pre className="whitespace-pre-wrap font-mono text-xs">{issue.details}</pre>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => handleApplyFix(issue)}
                disabled={isFixingIssue(issue)}
                className="gap-2"
              >
                <Wrench className="h-4 w-4" />
                {isFixingIssue(issue) ? "Fixing..." : "Fix Issue"}
              </Button>
            </div>
          </div>
        )
      });
    });

    // Add final summary step
    steps.push({
      id: "summary",
      title: "Resolution Summary",
      description: "Overview of issues fixed and current system status",
      component: (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Diagnostics Completed</h3>
            <p className="text-muted-foreground mt-2">
              Review the issues that have been fixed and any remaining items.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2">Resolution Summary</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Critical Issues:</span>
                  <span>{criticalIssues.length === 0 ? 
                    <span className="text-green-500">All Resolved</span> : 
                    <span className="text-red-500">{criticalIssues.length} Remaining</span>}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>High Priority Issues:</span>
                  <span>{highPriorityIssues.length === 0 ? 
                    <span className="text-green-500">All Resolved</span> : 
                    <span className="text-amber-500">{highPriorityIssues.length} Remaining</span>}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Medium Priority Issues:</span>
                  <span>{mediumPriorityIssues.length === 0 ? 
                    <span className="text-green-500">All Resolved</span> : 
                    <span className="text-yellow-500">{mediumPriorityIssues.length} Remaining</span>}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                {isComplete ? 
                  "All issues have been resolved! Your system is now healthy." : 
                  "Some issues still require attention. You can run the wizard again or address them manually."}
              </p>
              
              <div className="mt-4">
                <Button 
                  onClick={() => refreshDiagnostics()} 
                  variant="outline" 
                  className="w-full"
                >
                  Re-check System Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    });

    return steps;
  };

  const steps = getWizardSteps();
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{steps[currentStep].title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          steps[currentStep].component
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
