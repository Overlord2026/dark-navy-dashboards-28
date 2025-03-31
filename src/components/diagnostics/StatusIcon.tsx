
import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

export interface StatusIconProps {
  status: DiagnosticTestStatus;
  className?: string;
}

export const StatusIcon = ({ status, className = "" }: StatusIconProps) => {
  switch (status) {
    case "success":
      return <CheckCircle className={`text-emerald-500 ${className}`} />;
    case "warning":
      return <AlertTriangle className={`text-amber-500 ${className}`} />;
    case "error":
      return <XCircle className={`text-red-500 ${className}`} />;
    default:
      return null;
  }
};
