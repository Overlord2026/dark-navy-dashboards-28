
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface RecommendationsListProps {
  recommendations: string[];
  timestamp: string;
}

export const RecommendationsList = ({ recommendations, timestamp }: RecommendationsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 text-xs">
                {index + 1}
              </div>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Last updated: {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
      </CardFooter>
    </Card>
  );
};
