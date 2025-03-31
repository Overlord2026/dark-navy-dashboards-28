
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
