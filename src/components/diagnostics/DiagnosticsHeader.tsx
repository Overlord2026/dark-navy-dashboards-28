
import React from "react";
import { Button } from "@/components/ui/button";
import { StatusIcon, getOverallStatusColor } from "./StatusIcon";
import { RefreshCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type DiagnosticsHeaderProps = {
  isLoading: boolean;
  report: any;
  onRunDiagnostics: () => void;
};

export const DiagnosticsHeader = ({ 
  isLoading, 
  report, 
  onRunDiagnostics 
}: DiagnosticsHeaderProps) => {
  const timestamp = report?.timestamp ? new Date(report.timestamp) : null;
  const overallStatus = report?.overall || "success";
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div>
        <h1 className="text-2xl font-bold">System Diagnostics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {timestamp 
            ? `Last run ${formatDistanceToNow(timestamp, { addSuffix: true })}`
            : "Run diagnostics to check system health"
          }
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {report && (
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getOverallStatusColor(overallStatus)}`}>
            <div className="flex items-center gap-1.5">
              <StatusIcon status={overallStatus} size={14} />
              <span className="capitalize">{overallStatus}</span>
            </div>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={onRunDiagnostics}
          disabled={isLoading}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          {isLoading ? "Running..." : "Run Diagnostics"}
        </Button>
      </div>
    </div>
  );
};
