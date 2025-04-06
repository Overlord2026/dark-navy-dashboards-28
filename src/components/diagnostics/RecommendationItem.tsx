import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Recommendation } from '@/types/diagnostics';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react";

interface RecommendationItemProps {
  recommendation: Recommendation;
  onRecommendationAction?: (recommendation: Recommendation) => void;
  expanded?: boolean;
  toggleExpand?: () => void;
  compact?: boolean;
}

export function RecommendationItem({ 
  recommendation, 
  onRecommendationAction,
  expanded,
  toggleExpand,
  compact = false
}: RecommendationItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return <ShieldAlert className="h-4 w-4" />;
      case 'performance':
        return <Zap className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const getActionButtonLabel = () => {
    if (!recommendation.action) return "Apply";
    
    if (typeof recommendation.action === 'string') {
      return recommendation.action;
    } else if (typeof recommendation.action === 'object' && recommendation.action.label) {
      return recommendation.action.label;
    }
    
    return "Apply";
  };

  return (
    <Card className="w-full">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`border ${getPriorityColor(recommendation.priority)}`}>
              {getCategoryIcon(recommendation.category)}
              {recommendation.priority}
            </Badge>
            <h3 className="font-semibold">{recommendation.text}</h3>
          </div>
          {!compact && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpand}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        {expanded && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Effort: {recommendation.effort || 'Medium'} | Impact: {recommendation.impact || 'Moderate'}
              </div>
              {recommendation.actionable && onRecommendationAction && (
                <Button 
                  size="sm"
                  onClick={() => onRecommendationAction(recommendation)}
                >
                  {getActionButtonLabel()}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
