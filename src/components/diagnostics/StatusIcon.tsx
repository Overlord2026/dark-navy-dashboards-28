
import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

export interface StatusIconProps {
  status: DiagnosticTestStatus;
  className?: string;
  size?: number;
}

export const StatusIcon = ({ status, className = "", size = 16 }: StatusIconProps) => {
  switch (status) {
    case "success":
      return <CheckCircle className={`text-emerald-500 ${className}`} size={size} />;
    case "warning":
      return <AlertTriangle className={`text-amber-500 ${className}`} size={size} />;
    case "error":
      return <XCircle className={`text-red-500 ${className}`} size={size} />;
    default:
      return null;
  }
};

// Helper functions for diagnostic components
export const getStatusColor = (status: DiagnosticTestStatus): string => {
  switch (status) {
    case "success":
      return "text-emerald-500";
    case "warning":
      return "text-amber-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-400";
  }
};

export const getOverallStatusColor = (status: DiagnosticTestStatus): string => {
  switch (status) {
    case "success":
      return "bg-emerald-500 text-white";
    case "warning":
      return "bg-amber-500 text-white";
    case "error":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};
