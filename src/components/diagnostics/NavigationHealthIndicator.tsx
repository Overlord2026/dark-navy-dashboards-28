
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { CircleCheck, CircleAlert, CircleX } from "lucide-react";
import { DiagnosticTestStatus } from "@/types/diagnostics";

interface NavigationHealthIndicatorProps {
  status: DiagnosticTestStatus;
  message?: string;
}

/**
 * NavigationHealthIndicator - A component that displays the health status of navigation routes
 * with tooltips for additional information
 */
export function NavigationHealthIndicator({ status, message = "" }: NavigationHealthIndicatorProps) {
  const getStatusIcon = () => {
    switch(status) {
      case "success":
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case "warning":
        return <CircleAlert className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <CircleX className="h-4 w-4 text-red-500" />;
      default:
        return <CircleAlert className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {getStatusIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message || `Navigation status: ${status}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
