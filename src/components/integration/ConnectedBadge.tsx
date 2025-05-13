
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const ConnectedBadge: React.FC = () => {
  return (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-2 py-0.5">
      <CheckCircle className="w-3 h-3" />
      <span>Connected</span>
    </Badge>
  );
};
