
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, CheckCircle } from "lucide-react";
import { QuickFix } from "@/hooks/useDiagnostics";
import { QuickFixItem } from "./QuickFixItem";

interface QuickFixesListProps {
  quickFixes: QuickFix[];
  selectedFix: string | null;
  handleApplyFix: (fixId: string) => Promise<void>;
  setIsWizardOpen: (open: boolean) => void;
}

export const QuickFixesList = ({ 
  quickFixes, 
  selectedFix, 
  handleApplyFix,
  setIsWizardOpen
}: QuickFixesListProps) => {
  // Get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case 'medium':
        return <Zap className="h-4 w-4 text-yellow-500 mr-2" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500 mr-2" />;
    }
  };

  // Group fixes by severity for better organization
  const groupedFixes = (() => {
    const high = quickFixes.filter(fix => fix.severity === 'high');
    const medium = quickFixes.filter(fix => fix.severity === 'medium');
    const low = quickFixes.filter(fix => fix.severity === 'low');
    const other = quickFixes.filter(fix => !['high', 'medium', 'low'].includes(fix.severity));
    
    return { high, medium, low, other };
  })();

  return (
    <div className="space-y-4">
      {/* High severity fixes */}
      {groupedFixes.high.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500 mr-1.5" />
            Critical Issues
          </h4>
          {groupedFixes.high.slice(0, 2).map((fix) => (
            <QuickFixItem
              key={fix.id}
              fix={fix}
              severityIcon={getSeverityIcon(fix.severity)}
              getSeverityColor={getSeverityColor}
              selectedFix={selectedFix}
              handleApplyFix={handleApplyFix}
            />
          ))}
        </div>
      )}
      
      {/* Medium severity fixes */}
      {groupedFixes.medium.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center">
            <Zap className="h-3.5 w-3.5 text-yellow-500 mr-1.5" />
            Important Issues
          </h4>
          {groupedFixes.medium.slice(0, 1).map((fix) => (
            <QuickFixItem
              key={fix.id}
              fix={fix}
              severityIcon={getSeverityIcon(fix.severity)}
              getSeverityColor={getSeverityColor}
              selectedFix={selectedFix}
              handleApplyFix={handleApplyFix}
            />
          ))}
        </div>
      )}
      
      {/* Low severity fixes */}
      {(groupedFixes.low.length > 0 || groupedFixes.other.length > 0) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center">
            <CheckCircle className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
            Other Issues
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[...groupedFixes.low, ...groupedFixes.other].slice(0, 2).map((fix) => (
              <QuickFixItem
                key={fix.id}
                fix={fix}
                severityIcon={getSeverityIcon(fix.severity)}
                getSeverityColor={getSeverityColor}
                selectedFix={selectedFix}
                handleApplyFix={handleApplyFix}
                showDetailDialog={false}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}
      
      {quickFixes.length > 4 && (
        <div className="text-center pt-2">
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setIsWizardOpen(true)}
            className="text-sm"
          >
            View all {quickFixes.length} issues in repair wizard
          </Button>
        </div>
      )}
    </div>
  );
};
