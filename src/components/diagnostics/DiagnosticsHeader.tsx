
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getOverallStatusColor } from "./StatusIcon";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { QuickFix } from "@/hooks/useDiagnostics";

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
  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">System Status</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {timestamp ? `Last check: ${new Date(timestamp).toLocaleString()}` : 'No diagnostics run yet'}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      {quickFixes.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Recommended Actions</h3>
            <span className="text-sm text-muted-foreground">{quickFixes.length} issue{quickFixes.length > 1 ? 's' : ''} found</span>
          </div>
          <ul className="space-y-1 text-sm">
            {quickFixes.slice(0, 3).map((fix) => (
              <li key={fix.id} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${fix.severity === 'high' ? 'bg-destructive' : fix.severity === 'medium' ? 'bg-warning' : 'bg-blue-500'}`}></span>
                <span>{fix.name}</span>
              </li>
            ))}
            {quickFixes.length > 3 && (
              <li className="text-sm text-muted-foreground">+{quickFixes.length - 3} more issues...</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
