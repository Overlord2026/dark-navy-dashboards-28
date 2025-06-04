
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Copy, Trash2 } from "lucide-react";

interface PlanManagementSectionProps {
  activePlan: any;
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
  if (!activePlan) {
    return null;
  }

  return (
    <div className="bg-card border border-border/30 rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">{activePlan.name}</h2>
            {activePlan.isDraft && (
              <Badge variant="secondary" className="text-xs">Draft</Badge>
            )}
            {activePlan.isActive && (
              <Badge variant="default" className="text-xs">Active</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(activePlan.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditPlan(activePlan.id)}
            className="flex-1 lg:flex-none"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicatePlan(activePlan.id)}
            className="flex-1 lg:flex-none"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeletePlan(activePlan.id)}
            className="flex-1 lg:flex-none text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
