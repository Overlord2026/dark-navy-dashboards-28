
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface Recommendation {
  text: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface RecommendationsListProps {
  recommendations: Recommendation[] | string[];
  isLoading: boolean;
}

export const RecommendationsList = ({ recommendations, isLoading }: RecommendationsListProps) => {
  // Check if recommendations is an array of strings or Recommendation objects
  const hasStructuredRecommendations = recommendations.length > 0 && 
    typeof recommendations[0] !== 'string';

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Critical</span>;
      case 'high':
        return <span className="ml-2 text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">High</span>;
      case 'medium':
        return <span className="ml-2 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Medium</span>;
      case 'low':
        return <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Low</span>;
      default:
        return null;
    }
  };

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
        ) : recommendations.length > 0 ? (
          <ul className="space-y-3">
            {hasStructuredRecommendations ? 
              (recommendations as Recommendation[]).map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted">
                  <span className="text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm">{recommendation.text}</span>
                      {getPriorityBadge(recommendation.priority)}
                    </div>
                  </div>
                </li>
              )) : 
              (recommendations as string[]).map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted">
                  <span className="text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))
            }
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
