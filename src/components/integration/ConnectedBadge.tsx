
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Blocks } from "lucide-react";

interface ConnectedBadgeProps {
  className?: string;
}

export const ConnectedBadge: React.FC<ConnectedBadgeProps> = ({
  className
}) => {
  return (
    <Badge variant="outline" className={`flex items-center gap-1 bg-green-500/10 text-green-600 border-green-200/20 px-2 py-1 ${className}`}>
      <Blocks className="h-3 w-3" />
      <span className="text-xs font-medium">Connected</span>
    </Badge>
  );
};
