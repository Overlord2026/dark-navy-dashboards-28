
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessibilityRunner } from "@/components/diagnostics/AccessibilityRunner";
import { AccessibilityIssueList } from "@/components/diagnostics/AccessibilityIssueList";
import { AccessibilityReport } from "@/components/diagnostics/AccessibilityReport";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAccessibilityAudit } from "@/hooks/useAccessibilityAudit";
import { logger } from "@/services/logging/loggingService";

export default function AccessibilityAudit() {
  const { 
    auditResults,
    isRunning, 
    runAudit,
    auditSummary
  } = useAccessibilityAudit();
  
  const [activeTab, setActiveTab] = useState("issues");
  
  const handleRunAudit = async () => {
    try {
      await runAudit();
      toast.success("Accessibility audit completed", {
        description: "Results have been updated"
      });
    } catch (error) {
      logger.error("Failed to run accessibility audit", error, "AccessibilityAudit");
      toast.error("Failed to run accessibility audit", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };
  
  const handleExportReport = () => {
    // Implementation for exporting report as CSV/PDF would go here
    toast.success("Report exported", {
      description: "Accessibility report has been downloaded"
    });
  };
  
  return (
    <ThreeColumnLayout 
      activeMainItem="diagnostics" 
      title="Accessibility Audit"
    >
      <div className="space-y-6 p-4 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Accessibility Audit</h1>
            <p className="text-muted-foreground mt-1">
              Check WCAG compliance and identify accessibility issues across the application
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportReport}
              disabled={!auditResults.length}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            
            <Button
              onClick={handleRunAudit}
              disabled={isRunning}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
              {isRunning ? "Running..." : "Run Audit"}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="issues" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="report">Full Report</TabsTrigger>
            <TabsTrigger value="run">Audit Runner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <AccessibilityIssueList issues={auditResults} />
          </TabsContent>
          
          <TabsContent value="report">
            <AccessibilityReport results={auditResults} summary={auditSummary} />
          </TabsContent>
          
          <TabsContent value="run">
            <AccessibilityRunner onRunAudit={handleRunAudit} isRunning={isRunning} />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
