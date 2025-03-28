
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalDetailsSidePanel, GoalFormData } from "./GoalDetailsSidePanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  description?: string; // Added for goal description
  isNew?: boolean; // Flag to indicate if this is a newly added goal that hasn't been saved yet
}

interface GoalsListProps {
  goals: Goal[];
  onGoalUpdate?: (updatedGoal: Goal) => void;
  onGoalDelete?: (goalId: string) => void;
}

export function GoalsList({ goals, onGoalUpdate, onGoalDelete }: GoalsListProps) {
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [detailsPanelTitle, setDetailsPanelTitle] = useState<string>("");
  const [localGoals, setLocalGoals] = useState<Goal[]>(goals);
  
  // Update local goals when props change
  if (JSON.stringify(goals) !== JSON.stringify(localGoals)) {
    setLocalGoals(goals);
  }
  
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

  const handleAddGoalClick = (goalType?: string) => {
    if (!goalType) {
      // Just a regular "Add Goal" click with no type
      setSelectedGoal(undefined);
      setDetailsPanelTitle("New Goal");
      setIsDetailsPanelOpen(true);
      return;
    }
    
    // Create a temporary new goal with the selected type
    const newGoal: Goal = {
      id: `temp-goal-${Date.now()}`,
      title: goalType,
      name: goalType,
      type: goalType,
      priority: goalType,
      isNew: true, // Mark this as a new unsaved goal
    };
    
    // Add the new goal to the local state
    setLocalGoals(prev => [...prev, newGoal]);
    
    // Open the side panel for editing the new goal
    setSelectedGoal(newGoal);
    setDetailsPanelTitle(`New ${goalType} Goal`);
    setIsDetailsPanelOpen(true);
  };

  const handleSaveGoal = (goalData: GoalFormData) => {
    if (selectedGoal) {
      // Update existing goal
      const updatedGoal: Goal = {
        ...selectedGoal,
        title: goalData.name,
        name: goalData.name, // Update both title and name for consistency
        owner: goalData.owner,
        dateOfBirth: goalData.dateOfBirth,
        targetRetirementAge: goalData.targetRetirementAge,
        planningHorizonAge: goalData.planningHorizonAge,
        priority: goalData.type,
        type: goalData.type, // Update both priority and type for consistency
        targetDate: goalData.targetDate,
        targetAmount: goalData.targetAmount,
        description: goalData.description,
        isNew: false, // No longer a new unsaved goal
      };
      
      // Update local state immediately
      setLocalGoals(prev => 
        prev.map(g => g.id === updatedGoal.id ? updatedGoal : g)
      );
      
      onGoalUpdate?.(updatedGoal);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalData.name,
        name: goalData.name, // Set both title and name for consistency
        owner: goalData.owner,
        dateOfBirth: goalData.dateOfBirth,
        targetRetirementAge: goalData.targetRetirementAge,
        planningHorizonAge: goalData.planningHorizonAge,
        priority: goalData.type,
        type: goalData.type, // Set both priority and type for consistency
        targetDate: goalData.targetDate,
        targetAmount: goalData.targetAmount,
        description: goalData.description,
      };
      
      // Update local state immediately
      setLocalGoals(prev => [...prev, newGoal]);
      
      onGoalUpdate?.(newGoal);
    }
  };

  const handleCancelGoal = () => {
    // If a goal was being edited and it was marked as new (never saved before),
    // remove it from the local goals
    if (selectedGoal?.isNew) {
      setLocalGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
    }
    
    // Close the panel
    setIsDetailsPanelOpen(false);
  };
  
  const goalTypes = [
    "Asset Purchase",
    "Cash Reserve",
    "Education",
    "Gift",
    "Home Improvement",
    "Home Purchase",
    "Investment Property",
    "Land",
    "Legacy",
    "Other",
    "Vacation",
    "Vacation Home",
    "Vehicle",
    "Wedding"
  ];

  // Separate retirement and other goals
  const retirementGoals = localGoals.filter(goal => 
    goal.targetRetirementAge !== undefined || 
    goal.type === "Retirement" || 
    goal.priority === "Retirement"
  );
  
  const otherGoals = localGoals.filter(goal => 
    goal.targetRetirementAge === undefined && 
    goal.type !== "Retirement" && 
    goal.priority !== "Retirement"
  );
  
  if (!localGoals || localGoals.length === 0) {
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
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Other Goals</h4>
          <Card className="bg-[#0F1C2E] border border-border/20 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Add other goals for education, cars, vacations, homes, and more.
            </p>
          </Card>
        </div>
        
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-[#1A1A2E] hover:bg-[#1A1A2E]/80"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Goal</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-[#1A1A2E] border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.3)] animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
            >
              {goalTypes.map((type) => (
                <DropdownMenuItem 
                  key={type} 
                  className="text-white hover:bg-[#2A2A3E] focus:bg-[#2A2A3E] cursor-pointer"
                  onClick={() => handleAddGoalClick(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <GoalDetailsSidePanel
          isOpen={isDetailsPanelOpen}
          onClose={() => setIsDetailsPanelOpen(false)}
          onCancel={handleCancelGoal}
          goal={selectedGoal}
          onSave={handleSaveGoal}
          title={detailsPanelTitle}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">{localGoals.length} Goals</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-[#1A1A2E] border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.3)] animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
          >
            {goalTypes.map((type) => (
              <DropdownMenuItem 
                key={type} 
                className="text-white hover:bg-[#2A2A3E] focus:bg-[#2A2A3E] cursor-pointer"
                onClick={() => handleAddGoalClick(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Retirement Goals Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Target Retirement Age</h4>
        {retirementGoals.length > 0 ? (
          retirementGoals.map((goal, index) => (
            <GoalCard 
              key={goal.id || `retirement-goal-${index}`} 
              goal={goal} 
              isExpanded={expandedGoals.includes(goal.id || `retirement-goal-${index}`)} 
              onToggle={() => toggleGoalExpansion(goal.id || `retirement-goal-${index}`)}
              onClick={() => handleGoalClick(goal)}
            />
          ))
        ) : (
          <RetirementAgeSection 
            title="Your Retirement Age" 
            onClick={() => handleRetirementAgeClick("Your Retirement Age")}
          />
        )}
      </div>
      
      {/* Other Goals Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Other Goals</h4>
        {otherGoals.length > 0 ? (
          otherGoals.map((goal, index) => (
            <GoalCard 
              key={goal.id || `other-goal-${index}`} 
              goal={goal} 
              isExpanded={expandedGoals.includes(goal.id || `other-goal-${index}`)} 
              onToggle={() => toggleGoalExpansion(goal.id || `other-goal-${index}`)}
              onClick={() => handleGoalClick(goal)}
            />
          ))
        ) : (
          <Card className="bg-[#0F1C2E] border border-border/20 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Add other goals for education, cars, vacations, homes, and more.
            </p>
          </Card>
        )}
      </div>
      
      <GoalDetailsSidePanel
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
        onCancel={handleCancelGoal}
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
      className="bg-[#0F1C2E] border border-border/20 p-4 cursor-pointer hover:bg-[#0F1C2E]/80 hover:border-primary/30 transition-all duration-200 mb-2"
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
          
          {goal.description && (
            <div className="flex flex-col text-sm mt-2">
              <span className="text-muted-foreground mb-1">Description:</span>
              <p className="text-sm">{goal.description}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
