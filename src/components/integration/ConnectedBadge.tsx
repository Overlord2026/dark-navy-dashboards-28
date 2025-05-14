
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectedBadgeProps {
  className?: string;
}

export const ConnectedBadge: React.FC<ConnectedBadgeProps> = ({ className }) => {
  return (
    <Badge variant="outline" className={cn("bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-2 py-0.5", className)}>
      <CheckCircle className="w-3 h-3" />
      <span>Connected</span>
    </Badge>
  );
};
