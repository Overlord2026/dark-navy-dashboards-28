
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickFix } from "@/hooks/useDiagnostics";

interface QuickFixDetailsProps {
  fix: QuickFix;
  getSeverityBadgeClass: (severity?: string) => string;
  handleApplyFix: (fixId: string) => Promise<void>;
  selectedFix: string | null;
}

export const QuickFixDetails = ({
  fix,
  getSeverityBadgeClass,
  handleApplyFix,
  selectedFix
}: QuickFixDetailsProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{fix.title}</DialogTitle>
        <DialogDescription>Issue details and recommended fix</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-2">
          <Badge className={`px-2 py-0.5 ${getSeverityBadgeClass(fix.severity)}`}>
            {fix.severity} priority
          </Badge>
          <Badge variant="outline">{fix.area}</Badge>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Description</h4>
          <p className="text-sm">{fix.description}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Impact</h4>
          <p className="text-sm">
            This issue may affect {fix.area.toLowerCase()} functionality and should be addressed immediately.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Recommended Action</h4>
          <p className="text-sm">
            Click "Apply Fix" to automatically resolve this issue.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => handleApplyFix(fix.id)}
          disabled={selectedFix === fix.id}
        >
          {selectedFix === fix.id ? "Applying..." : "Apply Fix"}
        </Button>
      </div>
    </DialogContent>
  );
};

// Helper function to get severity badge class
export const getSeverityBadgeClass = (severity?: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  }
};
