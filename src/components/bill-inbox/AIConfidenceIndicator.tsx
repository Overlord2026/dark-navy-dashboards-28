
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export type ConfidenceLevel = "low" | "medium" | "high";

interface AIConfidenceIndicatorProps {
  level: ConfidenceLevel;
  score: number; // 0-100
  className?: string;
}

export function AIConfidenceIndicator({ level, score, className }: AIConfidenceIndicatorProps) {
  const getColorClass = () => {
    switch (level) {
      case "low": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-green-500";
    }
  };

  const getMessage = () => {
    switch (level) {
      case "low": return "Low AI confidence. Please verify this field.";
      case "medium": return "Medium AI confidence. We suggest reviewing this field.";
      case "high": return "High AI confidence. This field is likely correct.";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full flex items-center gap-2">
              <Progress 
                value={score} 
                className="h-2"
                indicatorClassName={getColorClass()}
              />
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMessage()}</p>
            <p className="text-xs">Confidence score: {score}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
