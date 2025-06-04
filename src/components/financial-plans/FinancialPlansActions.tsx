
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings } from "lucide-react";

interface FinancialPlansActionsProps {
  activePlan: any;
  plans: any[];
  onCreatePlan: () => void;
  onSelectPlan: (planId: string) => void;
}

export const FinancialPlansActions = ({ 
  activePlan, 
  plans, 
  onCreatePlan, 
  onSelectPlan 
}: FinancialPlansActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="w-full sm:w-auto sm:min-w-[300px]">
        <Select 
          value={activePlan?.id || ""} 
          onValueChange={onSelectPlan}
        >
          <SelectTrigger className="w-full bg-background border-border">
            <SelectValue placeholder="Select a financial plan" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id} className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{plan.name}</span>
                  {plan.isDraft && (
                    <span className="ml-2 text-xs text-muted-foreground">(Draft)</span>
                  )}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="new-plan" className="cursor-pointer border-t mt-1 pt-1">
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </div>
            </SelectItem>
            <SelectItem value="manage-plans" className="cursor-pointer">
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Manage Plans
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={onCreatePlan}
        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Plan
      </Button>
    </div>
  );
};
