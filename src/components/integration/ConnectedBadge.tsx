
import React from "react";
import { Badge } from "@/components/ui/badge";

export const ConnectedBadge = () => {
  return (
    <Badge 
      variant="outline" 
      className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
    >
      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
      Connected
    </Badge>
  );
};
