
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBills } from "@/hooks/useBills";

export const ExpenseOptimizationCard = () => {
  const navigate = useNavigate();
  const { insights } = useBills();
  
  // Calculate total potential savings
  const totalSavings = insights.reduce((sum, insight) => sum + insight.potentialSavings, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Expense Optimization</CardTitle>
        <TrendingDownIcon className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <LightbulbIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Potential Savings Found</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We've identified opportunities to save up to 
                <span className="font-semibold text-green-600 dark:text-green-400"> ${totalSavings.toFixed(2)}</span> annually
              </p>
            </div>
          </div>
          
          {insights.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Top recommendations:</p>
              <ul className="text-sm space-y-1">
                {insights.slice(0, 2).map((insight, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{insight.title}</span>
                    <span className="text-green-600 dark:text-green-400">
                      ${insight.potentialSavings.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add your bills to get personalized savings recommendations.
            </p>
          )}

          <Button 
            className="w-full text-sm"
            size="sm"
            onClick={() => navigate("/bills-management")}
          >
            View All {insights.length > 0 ? `(${insights.length})` : ''} Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
