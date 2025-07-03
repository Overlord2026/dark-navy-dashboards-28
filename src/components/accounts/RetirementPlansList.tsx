import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRetirementPlans } from '@/hooks/useRetirementPlans';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const RetirementPlansList = () => {
  const { plans, deletePlan, saving } = useRetirementPlans();
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPlanType = (type: string) => {
    switch (type) {
      case '401k':
        return '401(k)';
      case '403b':
        return '403(b)';
      case '457b':
        return '457(b)';
      default:
        return type;
    }
  };

  const formatSource = (source: string) => {
    switch (source) {
      case 'pre_tax':
        return 'Pre-tax';
      case 'roth':
        return 'Roth';
      case 'match':
        return 'Match';
      default:
        return source;
    }
  };

  if (plans.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No retirement plans added yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <div 
          key={plan.id} 
          className={cn(
            "flex items-center justify-between p-3 border border-border rounded-lg bg-card",
            isMobile ? "flex-col space-y-2" : "flex-row"
          )}
        >
          <div className={cn(isMobile ? "w-full text-center" : "flex-1")}>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-card-foreground">
                {formatPlanType(plan.plan_type)} - {plan.provider}
              </h4>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {formatSource(plan.source)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Balance: {formatCurrency(plan.balance)}
              {plan.contribution_amount && (
                <span className="ml-2">
                  • Contribution: {formatCurrency(plan.contribution_amount)}
                </span>
              )}
            </p>
            {plan.vesting_schedule && (
              <p className="text-xs text-muted-foreground mt-1">
                Vesting: {plan.vesting_schedule}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deletePlan(plan.id)}
            disabled={saving}
            className={cn(
              "text-destructive hover:text-destructive",
              isMobile ? "w-full" : "ml-2"
            )}
          >
            <Trash2 className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};