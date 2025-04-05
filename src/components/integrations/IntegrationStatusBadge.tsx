
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type IntegrationStatus = "connected" | "pending" | "error" | "disconnected";

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus;
  className?: string;
}

export function IntegrationStatusBadge({ status, className }: IntegrationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Connected",
          variant: "success" as const,
          className: "bg-green-500 text-white"
        };
      case "pending":
        return {
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
          label: "Processing",
          variant: "secondary" as const,
          className: "bg-yellow-500 text-white"
        };
      case "error":
        return {
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
          label: "Error",
          variant: "destructive" as const,
          className: ""
        };
      case "disconnected":
        return {
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
          label: "Disconnected",
          variant: "outline" as const,
          className: "text-muted-foreground"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant={config.variant} 
      className={cn("flex items-center text-xs px-2 py-1", config.className, className)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
