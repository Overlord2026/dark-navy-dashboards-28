
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";

export function ConnectedBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className="bg-green-600 hover:bg-green-700 transition-colors">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This project is connected to the Family Office Marketplace ecosystem</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
