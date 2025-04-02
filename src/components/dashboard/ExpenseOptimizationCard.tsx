
import React from "react";
import { ArrowRight, TrendingDown, Lightbulb } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";

export const ExpenseOptimizationCard = () => {
  const { isFeatureAvailable } = useSubscription();
  const hasFullAccess = isFeatureAvailable("expense-optimization");

  return (
    <DashboardCard 
      title="Expense Optimization" 
      icon={<TrendingDown className="h-5 w-5" />}
    >
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <Lightbulb className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Subscription Services</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              You could save approximately $142/month by optimizing your subscription services.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-green-500/20 p-2 rounded-full">
            <Lightbulb className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Utility Expenses</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Energy-efficient changes could reduce your utility bills by up to 20%.
            </p>
          </div>
        </div>
        
        {!hasFullAccess && (
          <div className="bg-muted/50 p-3 rounded-md mt-2">
            <p className="text-sm text-muted-foreground">
              Upgrade for detailed expense optimization recommendations.
            </p>
          </div>
        )}
      </div>
      
      <Button 
        variant="link" 
        size="sm" 
        className="mt-2 p-0 h-auto text-accent"
      >
        View all recommendations
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </DashboardCard>
  );
};
