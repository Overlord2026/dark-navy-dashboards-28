
import { Button } from "@/components/ui/button";
import { RefreshCw, InfoIcon } from "lucide-react";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { QuickFix, useDiagnostics } from "@/hooks/useDiagnostics";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DiagnosticsWizard } from "./DiagnosticsWizard";
import { StatusCards } from "./StatusCards";
import { QuickFixesList } from "./QuickFixesList";
import { HealthySystemCard } from "./HealthySystemCard";
import { QuickFixDetails, getSeverityBadgeClass } from "./QuickFixDetails";

interface DiagnosticsHeaderProps {
  isLoading: boolean;
  timestamp: string | null;
  status: DiagnosticTestStatus;
  quickFixes: QuickFix[];
}

export const DiagnosticsHeader = ({ 
  isLoading, 
  timestamp, 
  status, 
  quickFixes 
}: DiagnosticsHeaderProps) => {
  const { applyQuickFix, quickFixLoading, refreshDiagnostics } = useDiagnostics();
  const [rerunning, setRerunning] = useState(false);
  const [showFixHistory, setShowFixHistory] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedFix, setSelectedFix] = useState<string | null>(null);

  // Handle re-running diagnostics
  const handleRerunDiagnostics = async () => {
    setRerunning(true);
    try {
      await refreshDiagnostics();
      toast.success("Diagnostics check completed", {
        description: "System status has been updated"
      });
    } catch (error) {
      toast.error("Failed to run diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setRerunning(false);
    }
  };

  // Handle applying a quick fix
  const handleApplyFix = async (fixId: string) => {
    setSelectedFix(fixId);
    try {
      const result = await applyQuickFix(fixId);
      if (result) {
        const fixTitle = quickFixes.find(f => f.id === fixId)?.title || "issue";
        toast.success(`Fixed: ${fixTitle}`, {
          description: "The issue has been resolved successfully"
        });
      } else {
        toast.error("Failed to apply fix", {
          description: "Please try again or contact support"
        });
      }
    } catch (error) {
      toast.error("Error applying fix", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setSelectedFix(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Cards */}
          <StatusCards
            status={status}
            timestamp={timestamp}
            isLoading={isLoading}
            rerunning={rerunning}
            isWizardOpen={isWizardOpen}
            setIsWizardOpen={setIsWizardOpen}
            showFixHistory={showFixHistory}
            setShowFixHistory={setShowFixHistory}
            handleRerunDiagnostics={handleRerunDiagnostics}
          />
          
          {/* Quick Fixes */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Recommended Actions</h3>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">{quickFixes.length} issue{quickFixes.length > 1 ? 's' : ''} found</span>
                {isLoading && <RefreshCw className="ml-2 h-3 w-3 animate-spin" />}
              </div>
            </div>
            
            {quickFixes.length > 0 ? (
              <QuickFixesList
                quickFixes={quickFixes}
                selectedFix={selectedFix}
                handleApplyFix={handleApplyFix}
                setIsWizardOpen={setIsWizardOpen}
              />
            ) : (
              <HealthySystemCard handleRerunDiagnostics={handleRerunDiagnostics} />
            )}
          </div>
        </div>
      </CardContent>

      {/* Repair Wizard Dialog */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>System Repair Wizard</DialogTitle>
            <DialogDescription>
              Follow these steps to fix system issues in order of priority
            </DialogDescription>
          </DialogHeader>
          <DiagnosticsWizard />
        </DialogContent>
      </Dialog>

      {/* Reuse QuickFixDetails component in the original location */}
      {quickFixes.map(fix => (
        <Dialog key={fix.id}>
          <DialogContent>
            <QuickFixDetails
              fix={fix}
              getSeverityBadgeClass={getSeverityBadgeClass}
              handleApplyFix={handleApplyFix}
              selectedFix={selectedFix}
            />
          </DialogContent>
        </Dialog>
      ))}
    </Card>
  );
};
