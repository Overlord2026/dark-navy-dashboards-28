
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Blocks } from "lucide-react";

interface ConnectedBadgeProps {
  className?: string;
}

export const ConnectedBadge: React.FC<ConnectedBadgeProps> = ({ className }) => {
  return (
    <Badge 
      className={`bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 ${className}`}
      variant="default"
    >
      <Blocks className="h-3 w-3" />
      <span>Connected</span>
    </Badge>
  );
};
