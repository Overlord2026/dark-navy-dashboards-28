
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getOverallStatusColor } from "./StatusIcon";

interface DiagnosticsHeaderProps {
  isLoading: boolean;
  report: any | null;
  onRunDiagnostics: () => void;
}

export const DiagnosticsHeader = ({ isLoading, report, onRunDiagnostics }: DiagnosticsHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Health Check</h1>
        <p className="text-muted-foreground mt-1">
          Diagnostics to ensure optimal system performance
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {report && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(report.overall)}`}>
              System Status: {report.overall.charAt(0).toUpperCase() + report.overall.slice(1)}
            </span>
          )}
        </div>
        <Button 
          onClick={onRunDiagnostics} 
          disabled={isLoading} 
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Running Diagnostics..." : "Run Diagnostics"}
        </Button>
      </div>
    </>
  );
};
