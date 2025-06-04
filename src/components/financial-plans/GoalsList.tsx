
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/hooks/useFinancialPlansState";
import { GoalDetailsSidePanel } from "./GoalDetailsSidePanel";
import { Target, Plus } from "lucide-react";

interface GoalsListProps {
  goals: Goal[];
  onGoalUpdate: (goal: Goal) => void;
  compact?: boolean;
}

export const GoalsList = ({ goals, onGoalUpdate, compact = false }: GoalsListProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsPanelOpen(true);
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
    onGoalUpdate(updatedGoal);
    setIsPanelOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (goals.length === 0) {
    return (
      <div className={`text-center py-${compact ? '4' : '8'}`}>
        <Target className={`h-${compact ? '8' : '12'} w-${compact ? '8' : '12'} text-muted-foreground mx-auto mb-4`} />
        <h3 className={`text-${compact ? 'sm' : 'lg'} font-medium text-foreground mb-2`}>No Goals Yet</h3>
        <p className={`text-${compact ? 'xs' : 'sm'} text-muted-foreground mb-4`}>
          Start by adding your first financial goal to track your progress.
        </p>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          onClick={() => {
            // This would open a create goal dialog
            console.log("Create goal clicked");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.slice(0, compact ? 3 : goals.length).map((goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        
        return (
          <div
            key={goal.id}
            className="p-4 border border-border/30 rounded-lg hover:border-accent/30 transition-colors cursor-pointer bg-background"
            onClick={() => handleGoalClick(goal)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-foreground truncate ${compact ? 'text-sm' : 'text-base'}`}>
                    {goal.title}
                  </h4>
                  <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                    Target: ${goal.targetAmount.toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-xs`}>
                  {goal.priority}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                    ${goal.currentAmount.toLocaleString()} saved
                  </span>
                  <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              {!compact && (
                <p className="text-xs text-muted-foreground">
                  Target Date: {goal.targetDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {compact && goals.length > 3 && (
        <Button variant="ghost" size="sm" className="w-full">
          View All Goals ({goals.length})
        </Button>
      )}

      <GoalDetailsSidePanel
        goal={selectedGoal}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSave={handleGoalUpdate}
      />
    </div>
  );
};
