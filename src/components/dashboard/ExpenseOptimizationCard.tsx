
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, LightbulbIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBills } from "@/hooks/useBills";

export const ExpenseOptimizationCard = () => {
  const navigate = useNavigate();
  const { insights } = useBills();
  
  // Calculate total potential savings
  const totalSavings = insights.reduce((sum, insight) => sum + insight.potentialSavings, 0);

  // Group insights by type to show distribution
  const insightsByType = insights.reduce<Record<string, number>>((acc, insight) => {
    acc[insight.actionType] = (acc[insight.actionType] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Expense Optimization</CardTitle>
        <TrendingDownIcon className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <LightbulbIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Potential Savings Found</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {insights.length > 0 ? (
                  <>
                    We've identified opportunities to save up to 
                    <span className="font-semibold text-green-600 dark:text-green-400"> ${totalSavings.toFixed(2)}</span> annually
                  </>
                ) : (
                  "Add your bills to get personalized savings recommendations."
                )}
              </p>
            </div>
          </div>
          
          {insights.length > 0 && (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Top recommendations:</p>
                <ul className="text-sm space-y-1">
                  {insights
                    .sort((a, b) => b.potentialSavings - a.potentialSavings)
                    .slice(0, 2)
                    .map((insight, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="truncate pr-2">{insight.title}</span>
                        <span className="text-green-600 dark:text-green-400 whitespace-nowrap">
                          ${insight.potentialSavings.toFixed(2)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              {Object.keys(insightsByType).length > 0 && (
                <div className="pt-1 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Insight types:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(insightsByType).map(([type, count]) => (
                      <span 
                        key={type} 
                        className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
                      >
                        {type} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <Button 
            className="w-full text-sm flex items-center justify-center gap-1 mt-1"
            size="sm"
            onClick={() => navigate("/bills-management")}
          >
            {insights.length > 0 ? (
              <>
                View All ({insights.length}) Insights
                <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
              </>
            ) : (
              "Manage Your Bills"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
