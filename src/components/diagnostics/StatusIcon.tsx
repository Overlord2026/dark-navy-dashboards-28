
import React from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

interface StatusIconProps {
  status: DiagnosticTestStatus;
  className?: string;
  size?: number;
}

export function StatusIcon({ status, className, size = 16 }: StatusIconProps) {
  const iconProps = {
    className: cn(className),
    size
  };

  switch (status) {
    case "success":
      return <CheckCircle {...iconProps} className={cn("text-green-500", className)} />;
    case "warning":
      return <AlertCircle {...iconProps} className={cn("text-amber-500", className)} />;
    case "error":
      return <XCircle {...iconProps} className={cn("text-red-500", className)} />;
    default:
      return <CheckCircle {...iconProps} className={cn("text-green-500", className)} />;
  }
}

// Get the CSS class for status color
export function getStatusColor(status: DiagnosticTestStatus): string {
  switch (status) {
    case "success":
      return "border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10";
    case "warning":
      return "border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10";
    case "error":
      return "border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10";
    default:
      return "border-gray-100 dark:border-gray-800";
  }
}

// Get the overall status color for the entire system
export function getOverallStatusColor(status: DiagnosticTestStatus): string {
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
}
