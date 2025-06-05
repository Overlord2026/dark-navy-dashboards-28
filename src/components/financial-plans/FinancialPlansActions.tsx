
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CheckCircle, FileIcon, PlusIcon } from "lucide-react";
import { FinancialPlan } from "@/types/financial-plan";

interface FinancialPlansActionsProps {
  activePlan: FinancialPlan;
  plans: FinancialPlan[];
  onCreatePlan: () => void;
  onSelectPlan: (planId: string) => void;
}

export const FinancialPlansActions = ({ 
  activePlan, 
  plans, 
  onCreatePlan, 
  onSelectPlan 
}: FinancialPlansActionsProps) => {
  // Filter out archived plans and map to the expected format
  const activePlans = plans.filter(plan => plan.status === 'Active');
  const draftPlans = plans.filter(plan => plan.status === 'Draft');

  return (
    <div className="flex justify-between items-center">
      <div className="relative inline-block">
        <Button 
          className="bg-white text-black hover:bg-gray-100 border border-gray-300"
          onClick={onCreatePlan}
        >
          Create Plan
        </Button>
      </div>
      
      <div className="relative inline-block">
        <Select
          value={activePlan.id}
          onValueChange={onSelectPlan}
        >
          <SelectTrigger className="w-[210px] bg-transparent">
            <SelectValue placeholder={activePlan.name}>{activePlan.name}</SelectValue>
          </SelectTrigger>
          <SelectContent 
            className="bg-[#0F1C2E] border-white/10 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
          >
            {activePlans.length > 0 && (
              <SelectGroup>
                <SelectLabel className="py-2 px-4 text-sm font-medium border-b border-white/10">Active Plans</SelectLabel>
                {activePlans.map(plan => (
                  <SelectItem 
                    key={plan.id} 
                    value={plan.id} 
                    className="flex items-center gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {plan.isActive && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <span>{plan.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}

            {draftPlans.length > 0 && (
              <SelectGroup>
                <SelectLabel className="py-2 px-4 text-sm font-medium border-b border-white/10 mt-2">Drafts</SelectLabel>
                {draftPlans.map(plan => (
                  <SelectItem 
                    key={plan.id} 
                    value={plan.id} 
                    className="flex items-center gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4 text-blue-400" />
                      <span>{plan.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        (Step {plan.draftData?.step || plan.step || 1})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            
            <DropdownMenuSeparator className="my-1 bg-white/10" />
            <SelectItem 
              value="new-plan" 
              className="flex items-center gap-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                <span>New plan</span>
              </div>
            </SelectItem>
            <SelectItem 
              value="manage-plans"
              className="flex items-center gap-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>Manage plans</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
