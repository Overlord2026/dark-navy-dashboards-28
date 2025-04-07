
import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface DiagnosticsSummaryCardsProps {
  overallStatus: string;
  totalRoutes: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
}

export function DiagnosticsSummaryCards({
  overallStatus,
  totalRoutes,
  successCount,
  warningCount,
  errorCount
}: DiagnosticsSummaryCardsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className={`p-4 rounded-lg border ${overallStatus === "success" ? "border-success/50 bg-success/10" : overallStatus === "warning" ? "border-warning/50 bg-warning/10" : "border-destructive/50 bg-destructive/10"}`}>
        <div className="text-center">
          <div className="text-sm font-medium mb-2">Overall Status</div>
          <div className="flex justify-center">
            {getStatusIcon(overallStatus)}
          </div>
          <div className="mt-1 font-semibold capitalize">{overallStatus}</div>
        </div>
      </div>
      
      <div className="p-4 rounded-lg border">
        <div className="text-center">
          <div className="text-sm font-medium mb-2">Total Routes</div>
          <div className="text-2xl font-bold">{totalRoutes}</div>
        </div>
      </div>
      
      <div className="p-4 rounded-lg border">
        <div className="text-center">
          <div className="text-sm font-medium mb-2">Status Breakdown</div>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-success"></div>
              {successCount}
            </span>
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-warning"></div>
              {warningCount}
            </span>
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-destructive"></div>
              {errorCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
