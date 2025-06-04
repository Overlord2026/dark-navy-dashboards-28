
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface Plan {
  id: string;
  name: string;
}

interface PlanManagementSectionProps {
  activePlan: Plan;
  onEditPlan: (planId: string) => void;
  onDuplicatePlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
}

export const PlanManagementSection = ({
  activePlan,
  onEditPlan,
  onDuplicatePlan,
  onDeletePlan
}: PlanManagementSectionProps) => {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-medium">{activePlan.name}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0F1C2E] border-white/10 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
            <DropdownMenuItem onClick={() => onEditPlan(activePlan.id)}>Edit plan</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicatePlan(activePlan.id)}>Duplicate plan</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              className="text-red-500"
              onClick={() => onDeletePlan(activePlan.id)}
            >
              Delete plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-sm text-muted-foreground">
        Updated: about 1 month ago
      </div>
    </div>
  );
};
