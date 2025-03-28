
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalDetailsSidePanel, GoalFormData } from "./GoalDetailsSidePanel";

export interface Goal {
  id?: string;
  title?: string;
  name?: string;  // For compatibility with different goal formats
  targetDate?: Date;
  targetAmount?: number;
  currentAmount?: number;
  type?: string;
  priority?: string;
  owner?: string;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  dateOfBirth?: Date;
}

interface GoalsListProps {
  goals: Goal[];
  onGoalUpdate?: (updatedGoal: Goal) => void;
}

export function GoalsList({ goals, onGoalUpdate }: GoalsListProps) {
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [detailsPanelTitle, setDetailsPanelTitle] = useState<string>("");
  
  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };
  
  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setDetailsPanelTitle(goal.title ? `${goal.title}` : "Retirement Age");
    setIsDetailsPanelOpen(true);
  };

  const handleRetirementAgeClick = (title: string) => {
    setSelectedGoal(undefined);
    setDetailsPanelTitle(`${title}`);
    setIsDetailsPanelOpen(true);
  };

  const handleSaveGoal = (goalData: GoalFormData) => {
    if (selectedGoal) {
      // Update existing goal
      const updatedGoal: Goal = {
        ...selectedGoal,
        title: goalData.name,
        owner: goalData.owner,
        dateOfBirth: goalData.dateOfBirth,
        targetRetirementAge: goalData.targetRetirementAge,
        planningHorizonAge: goalData.planningHorizonAge,
        priority: goalData.type,
      };
      onGoalUpdate?.(updatedGoal);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalData.name,
        owner: goalData.owner,
        dateOfBirth: goalData.dateOfBirth,
        targetRetirementAge: goalData.targetRetirementAge,
        planningHorizonAge: goalData.planningHorizonAge,
        priority: goalData.type,
      };
      onGoalUpdate?.(newGoal);
    }
  };
  
  if (!goals || goals.length === 0) {
    return (
      <div className="space-y-4">
        <RetirementAgeSection 
          title="Your Retirement Age" 
          onClick={() => handleRetirementAgeClick("Your Retirement Age")}
        />
        <RetirementAgeSection 
          title="Spouse's Retirement Age" 
          onClick={() => handleRetirementAgeClick("Spouse's Retirement Age")}
        />
        <GoalDetailsSidePanel
          isOpen={isDetailsPanelOpen}
          onClose={() => setIsDetailsPanelOpen(false)}
          goal={selectedGoal}
          onSave={handleSaveGoal}
          title={detailsPanelTitle}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {goals.map((goal, index) => (
        <GoalCard 
          key={goal.id || `goal-${index}`} 
          goal={goal} 
          isExpanded={expandedGoals.includes(goal.id || `goal-${index}`)} 
          onToggle={() => toggleGoalExpansion(goal.id || `goal-${index}`)}
          onClick={() => handleGoalClick(goal)}
        />
      ))}
      <GoalDetailsSidePanel
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
        goal={selectedGoal}
        onSave={handleSaveGoal}
        title={detailsPanelTitle}
      />
    </div>
  );
}

function RetirementAgeSection({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <div 
      className="flex items-center justify-between border-b border-border/20 py-3 cursor-pointer hover:bg-[#1A1A2E]/80 transition-colors px-2 rounded-md"
      onClick={onClick}
    >
      <h4 className="text-sm">{title}</h4>
      <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function GoalCard({ goal, isExpanded, onToggle, onClick }: { 
  goal: Goal;
  isExpanded: boolean;
  onToggle: () => void;
  onClick: () => void;
}) {
  // Handle different goal formats
  const goalTitle = goal.title || goal.name || "Unnamed Goal";
  const goalType = goal.type || goal.priority || "Goal";

  return (
    <Card 
      className="bg-[#0F1C2E] border border-border/20 p-4 cursor-pointer hover:bg-[#0F1C2E]/80 hover:border-primary/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{goalTitle}</h4>
          <p className="text-xs text-muted-foreground">{goalType}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick
            onToggle();
          }}
        >
          {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2 pt-2 border-t border-border/20">
          {goal.targetDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Date:</span>
              <span>{goal.targetDate.toLocaleDateString()}</span>
            </div>
          )}
          
          {goal.targetAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Amount:</span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(goal.targetAmount)}
              </span>
            </div>
          )}
          
          {goal.currentAmount !== undefined && goal.targetAmount && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div 
                  className="bg-[#33C3F0] h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {goal.priority && !goal.type && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Priority:</span>
              <span>{goal.priority}</span>
            </div>
          )}

          {goal.targetRetirementAge && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Retirement Age:</span>
              <span>{goal.targetRetirementAge}</span>
            </div>
          )}

          {goal.planningHorizonAge && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Planning Horizon:</span>
              <span>{goal.planningHorizonAge} years</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
