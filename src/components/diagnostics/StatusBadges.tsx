
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

interface StatusBadgesProps {
  total: number;
  success: number;
  warnings: number;
  errors: number;
  status: DiagnosticTestStatus | string;
}

export function StatusBadges({ total, success, warnings, errors, status }: StatusBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="bg-muted/50">
        Total: {total}
      </Badge>
      <Badge 
        variant="outline" 
        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      >
        Success: {success}
      </Badge>
      {warnings > 0 && (
        <Badge 
          variant="outline" 
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
        >
          Warnings: {warnings}
        </Badge>
      )}
      {errors > 0 && (
        <Badge 
          variant="outline" 
          className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        >
          Errors: {errors}
        </Badge>
      )}
      <Badge 
        variant="outline" 
        className={`
          ${status === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : ""}
          ${status === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : ""}
          ${status === "error" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : ""}
        `}
      >
        Status: {status}
      </Badge>
    </div>
  );
}
