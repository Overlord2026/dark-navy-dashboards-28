
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Recommendation } from "@/types/diagnostics";
import { RecommendationItem } from "./RecommendationItem";

export interface RecommendationsListProps {
  recommendations: Recommendation[] | string[];
  isLoading: boolean;
  onActionClick?: (recommendation: Recommendation) => void;
}

export const RecommendationsList = ({ 
  recommendations, 
  isLoading,
  onActionClick 
}: RecommendationsListProps) => {
  // Memoize the structured recommendations to avoid unnecessary calculations
  const structuredRecommendations = useMemo(() => {
    // Check if recommendations is an array of strings or Recommendation objects
    const hasStructuredRecommendations = recommendations.length > 0 && 
      typeof recommendations[0] !== 'string';

    // Convert simple string recommendations to structured format
    return hasStructuredRecommendations 
      ? recommendations as Recommendation[]
      : (recommendations as string[]).map((text, index) => ({
          id: `simple-rec-${index}`,
          text,
          priority: 'medium' as const,
          category: 'reliability' as const,
          actionable: false
        }));
  }, [recommendations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          System Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ) : structuredRecommendations.length > 0 ? (
          <ul className="space-y-4">
            {structuredRecommendations.map((recommendation, index) => (
              <RecommendationItem 
                key={recommendation.id || index}
                recommendation={recommendation}
                onRecommendationAction={onActionClick}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recommendations available at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
