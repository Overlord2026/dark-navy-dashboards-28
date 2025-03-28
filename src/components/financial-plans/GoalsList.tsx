
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Goal {
  id?: string;
  title?: string;
  name?: string;  // For compatibility with different goal formats
  targetDate?: Date;
  targetAmount?: number;
  currentAmount?: number;
  type?: string;
  priority?: string;
}

interface GoalsListProps {
  goals: Goal[];
}

export function GoalsList({ goals }: GoalsListProps) {
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  
  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };
  
  if (!goals || goals.length === 0) {
    return (
      <div className="space-y-4">
        <RetirementAgeSection title="Your Retirement Age" />
        <RetirementAgeSection title="Spouse's Retirement Age" />
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
        />
      ))}
    </div>
  );
}

function RetirementAgeSection({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/20 py-3">
      <h4 className="text-sm">{title}</h4>
      <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function GoalCard({ goal, isExpanded, onToggle }: { 
  goal: Goal;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Handle different goal formats
  const goalTitle = goal.title || goal.name || "Unnamed Goal";
  const goalType = goal.type || goal.priority || "Goal";

  return (
    <Card className="bg-[#0F1C2E] border border-border/20 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{goalTitle}</h4>
          <p className="text-xs text-muted-foreground">{goalType}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
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
        </div>
      )}
    </Card>
  );
}
