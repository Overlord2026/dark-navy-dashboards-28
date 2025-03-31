
import React from "react";
import { cn } from "@/lib/utils";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export const StatusBadge = ({ status }: { status: DiagnosticTestStatus }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "warning":
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case "error":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
      getBadgeStyles()
    )}>
      {getIcon()}
      <span>{status === "success" ? "Passed" : status === "warning" ? "Warning" : "Failed"}</span>
    </span>
  );
};

export const SeverityBadge = ({ severity }: { severity: string }) => {
  const getBadgeStyles = () => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium rounded-full",
      getBadgeStyles()
    )}>
      {severity}
    </span>
  );
};
