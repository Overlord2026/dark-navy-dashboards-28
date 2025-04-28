
import React from "react";
import { Button } from "@/components/ui/button";
import { InfoIcon, ArrowRight, RefreshCw } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { QuickFix } from "@/hooks/useDiagnostics";

interface QuickFixItemProps {
  fix: QuickFix;
  severityIcon: JSX.Element;
  getSeverityColor: (severity: string) => string;
  selectedFix: string | null;
  handleApplyFix: (fixId: string) => Promise<void>;
  showDetailDialog?: boolean;
  variant?: "full" | "compact";
}

export const QuickFixItem = ({ 
  fix, 
  severityIcon, 
  getSeverityColor, 
  selectedFix, 
  handleApplyFix,
  showDetailDialog = true,
  variant = "full"
}: QuickFixItemProps) => {
  const isCompact = variant === "compact";
  
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg ${
        fix.severity === 'high' 
          ? "border border-red-200 dark:border-red-800/60 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20" 
          : fix.severity === 'medium'
          ? "border border-yellow-200 dark:border-yellow-800/60 bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          : "border hover:bg-muted/30"
      } transition-colors`}
    >
      <div className="flex items-center">
        {severityIcon}
        <div>
          <span className="text-sm font-medium">{fix.title}</span>
          {!isCompact && (
            <div className="flex items-center mt-0.5">
              <span className={`w-2 h-2 rounded-full ${getSeverityColor(fix.severity)}`}></span>
              <span className="text-xs text-muted-foreground ml-1.5">{fix.area} | {fix.severity} priority</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showDetailDialog && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 h-7">
                <InfoIcon className="h-3 w-3" />
                <span className="hidden sm:inline">Details</span>
              </Button>
            </DialogTrigger>
          </Dialog>
        )}
        
        <Button 
          size="sm" 
          onClick={() => handleApplyFix(fix.id)}
          disabled={selectedFix === fix.id}
          className="gap-1"
          variant={fix.severity === 'high' ? "default" : "secondary"}
        >
          {selectedFix === fix.id ? (
            <>
              <RefreshCw className="h-3 w-3 animate-spin" />
              Fixing...
            </>
          ) : (
            <>
              {!isCompact && "Apply Fix"}
              {isCompact ? "Fix" : <ArrowRight className="h-3 w-3" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
