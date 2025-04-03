
import React from "react";
import { Recommendation } from "@/types/diagnostics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, AlertCircle, ExternalLink } from "lucide-react";

interface RecommendationItemProps {
  recommendation: Recommendation;
  index: number;
  onActionClick?: (recommendation: Recommendation) => void;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({
  recommendation,
  index,
  onActionClick
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive" className="ml-2">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="ml-2 bg-red-600">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-800 border-blue-200">Low</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'performance':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Performance</Badge>;
      case 'security':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Security</Badge>;
      case 'accessibility':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Accessibility</Badge>;
      case 'reliability':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Reliability</Badge>;
      case 'usability':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Usability</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const getEffortBadge = (effort?: string) => {
    if (!effort) return null;
    
    switch (effort) {
      case 'easy':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Quick Fix</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Moderate Effort</Badge>;
      case 'hard':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Major Effort</Badge>;
      default:
        return null;
    }
  };

  return (
    <li 
      className="p-3 rounded-md border hover:bg-muted/50 transition-colors"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <span className="text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-sm font-medium">{recommendation.text}</span>
                {getPriorityBadge(recommendation.priority)}
              </div>
              
              {recommendation.impact && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Impact: {recommendation.impact}
                </p>
              )}
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {recommendation.category && getCategoryBadge(recommendation.category)}
                {recommendation.effort && getEffortBadge(recommendation.effort)}
              </div>
            </div>
          </div>
          
          {recommendation.actionable && onActionClick && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 h-8"
                    onClick={() => onActionClick(recommendation)}
                  >
                    {recommendation.action?.label || 'Apply Fix'}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Apply this recommendation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </li>
  );
};
