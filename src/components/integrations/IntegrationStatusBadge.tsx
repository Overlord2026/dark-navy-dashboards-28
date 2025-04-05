
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type IntegrationStatus = "connected" | "disconnected" | "error" | "pending";

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus;
  className?: string;
}

export function IntegrationStatusBadge({ status, className }: IntegrationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: CheckCircle,
          label: "Connected",
          className: "bg-green-100 text-green-700 border-green-200"
        };
      case "disconnected":
        return {
          icon: AlertCircle,
          label: "Disconnected",
          className: "bg-gray-100 text-gray-700 border-gray-200"
        };
      case "error":
        return {
          icon: AlertTriangle,
          label: "Error",
          className: "bg-red-100 text-red-700 border-red-200"
        };
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700 border-yellow-200"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center gap-1", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
