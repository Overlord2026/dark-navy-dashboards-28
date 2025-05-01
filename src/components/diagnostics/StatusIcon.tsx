
import { AlertTriangle, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

interface StatusIconProps {
  status: DiagnosticTestStatus;
  className?: string;
  size?: number;
}

export const StatusIcon = ({ status, className = "", size = 5 }: StatusIconProps) => {
  switch (status) {
    case "success":
      return <CheckCircle className={`h-${size} w-${size} text-green-500 ${className}`} />;
    case "warning":
      return <AlertTriangle className={`h-${size} w-${size} text-yellow-500 ${className}`} />;
    case "error":
      return <XCircle className={`h-${size} w-${size} text-red-500 ${className}`} />;
    default:
      return <HelpCircle className={`h-${size} w-${size} text-gray-500 ${className}`} />;
  }
};

export const getStatusColor = (status: DiagnosticTestStatus): string => {
  switch (status) {
    case "success":
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    case "warning":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    case "error":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    default:
      return "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700";
  }
};

export const getOverallStatusColor = (status: DiagnosticTestStatus): string => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};
