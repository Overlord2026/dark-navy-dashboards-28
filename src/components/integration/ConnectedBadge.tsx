
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
    <Badge className={className} variant="outline">
      <Blocks className="w-3 h-3 mr-1" />
      Connected
    </Badge>
  );
};
