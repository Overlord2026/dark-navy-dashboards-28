import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalDetailsSidePanel, GoalFormData } from "./GoalDetailsSidePanel";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Goal {
  id?: string;
  title?: string;
  name?: string;
  targetDate?: Date;
  targetAmount?: number;
  currentAmount?: number;
  type?: string;
  priority?: string;
  owner?: string;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  dateOfBirth?: Date;
  description?: string;
  isNew?: boolean;
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  studentName?: string;
  startYear?: number;
  endYear?: number;
  tuitionEstimate?: number;
  destination?: string;
  estimatedCost?: number;
  amountDesired?: number;
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
    const goalTitle = goal.title || goal.name || "";
    setDetailsPanelTitle(goalTitle);
    setIsDetailsPanelOpen(true);
  };

  const handleRetirementAgeClick = (title: string) => {
    setSelectedGoal(undefined);
    setDetailsPanelTitle(title);
    setIsDetailsPanelOpen(true);
  };

  const handleAddGoalClick = (goalType?: string) => {
    if (!goalType) {
      setSelectedGoal(undefined);
      setDetailsPanelTitle("New Goal");
      setIsDetailsPanelOpen(true);
      return;
    }
    
    const newGoal: Goal = {
      id: `temp-goal-${Date.now()}`,
      title: goalType,
      name: goalType,
      type: goalType,
      priority: goalType,
      isNew: true,
    };
    
    setLocalGoals(prev => [...prev, newGoal]);
    
    setSelectedGoal(newGoal);
    setDetailsPanelTitle(`New ${goalType}`);
    setIsDetailsPanelOpen(true);
  };

  const handleTitleUpdate = (name: string, owner: string) => {
    if (name && owner) {
      const ownerPossessive = owner.endsWith('s') ? `${owner}'` : `${owner}'s`;
      setDetailsPanelTitle(`${ownerPossessive} ${name}`);
    } else if (name) {
      setDetailsPanelTitle(name);
    }
  };

  const handleSaveGoal = (goalData: GoalFormData) => {
    if (selectedGoal) {
      const updatedGoal: Goal = {
        ...selectedGoal,
        title: goalData.name,
        name: goalData.name,
        owner: goalData.owner,
        dateOfBirth: goalData.dateOfBirth,
        targetRetirementAge: goalData.targetRetirementAge,
        planningHorizonAge: goalData.planningHorizonAge,
        priority: goalData.type,
        type: goalData.type,
        targetDate: goalData.targetDate,
        targetAmount: goalData.targetAmount,
        description: goalData.description,
        isNew: false,
        purchasePrice: goalData.purchasePrice,
        financingMethod: goalData.financingMethod,
        annualAppreciation: goalData.annualAppreciation,
        studentName: goalData.studentName,
        startYear: goalData.startYear,
        endYear: goalData.endYear,
        tuitionEstimate: goalData.tuitionEstimate,
        destination: goalData.destination,
        estimatedCost: goalData.estimatedCost,
        amountDesired: goalData.amountDesired,
      };
      
      setLocalGoals(prev => 
        prev.map(g => g.id === updatedGoal.id ? updatedGoal : g)
      );
      
      onGoalUpdate?.(updatedGoal);
    } else {
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalData.name,
        name: goalData.name,
        owner: goalData.owner,
        dateOfBirth: goalData.dateOfBirth,
        targetRetirementAge: goalData.targetRetirementAge,
        planningHorizonAge: goalData.planningHorizonAge,
        priority: goalData.type,
        type: goalData.type,
        targetDate: goalData.targetDate,
        targetAmount: goalData.targetAmount,
        description: goalData.description,
        purchasePrice: goalData.purchasePrice,
        financingMethod: goalData.financingMethod,
        annualAppreciation: goalData.annualAppreciation,
        studentName: goalData.studentName,
        startYear: goalData.startYear,
        endYear: goalData.endYear,
        tuitionEstimate: goalData.tuitionEstimate,
        destination: goalData.destination,
        estimatedCost: goalData.estimatedCost,
        amountDesired: goalData.amountDesired,
      };
      
      setLocalGoals(prev => [...prev, newGoal]);
      
      onGoalUpdate?.(newGoal);
    }
  };

  const handleCancelGoal = () => {
    if (selectedGoal?.isNew) {
      setLocalGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
    }
    
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
          onTitleUpdate={handleTitleUpdate}
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
        onTitleUpdate={handleTitleUpdate}
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
  const goalTitle = goal.title || goal.name || "Unnamed Goal";
  const goalType = goal.type || goal.priority || "Goal";

  return (
    <Card 
      className="bg-[#0F1C2E] border border-border/20 p-4 cursor-pointer hover:bg-[#0F1C2E]/80 hover:border-primary/30 transition-all duration-200 mb-2 animate-in fade-in-80 duration-200"
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
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2 pt-2 border-t border-border/20">
          {(goal.type === "Asset Purchase" || goal.type === "Home Purchase" || goal.type === "Vehicle") && (
            <>
              {goal.purchasePrice !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(goal.purchasePrice)}
                  </span>
                </div>
              )}
              
              {goal.financingMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Financing:</span>
                  <span>{goal.financingMethod}</span>
                </div>
              )}
              
              {(goal.type === "Asset Purchase" || goal.type === "Home Purchase") && 
                goal.annualAppreciation && goal.annualAppreciation !== "None" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Appreciation:</span>
                  <span>{goal.annualAppreciation}</span>
                </div>
              )}
            </>
          )}
          
          {goal.type === "Education" && (
            <>
              {goal.studentName && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Student:</span>
                  <span>{goal.studentName}</span>
                </div>
              )}
              
              {goal.tuitionEstimate !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tuition Estimate:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(goal.tuitionEstimate)}
                  </span>
                </div>
              )}
              
              {goal.startYear && goal.endYear && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Years:</span>
                  <span>{goal.startYear} - {goal.endYear}</span>
                </div>
              )}
            </>
          )}
          
          {goal.type === "Vacation" && (
            <>
              {goal.destination && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destination:</span>
                  <span>{goal.destination}</span>
                </div>
              )}
              
              {goal.estimatedCost !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(goal.estimatedCost)}
                  </span>
                </div>
              )}
            </>
          )}
          
          {goal.type === "Cash Reserve" && goal.amountDesired !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Desired:</span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(goal.amountDesired)}
              </span>
            </div>
          )}
          
          {goal.targetDate && !["Education"].includes(goal.type || "") && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Date:</span>
              <span>{format(goal.targetDate, 'MMM yyyy')}</span>
            </div>
          )}
          
          {goal.targetAmount !== undefined && 
            !["Asset Purchase", "Home Purchase", "Vehicle", "Vacation", "Education", "Cash Reserve"].includes(goal.type || "") && (
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
          
          {goal.currentAmount !== undefined && 
            (goal.targetAmount || goal.purchasePrice || goal.estimatedCost || goal.tuitionEstimate || goal.amountDesired) && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>
                  {Math.round((goal.currentAmount / 
                    (goal.targetAmount || goal.purchasePrice || goal.estimatedCost || 
                     goal.tuitionEstimate || goal.amountDesired || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div 
                  className="bg-[#33C3F0] h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, (goal.currentAmount / 
                      (goal.targetAmount || goal.purchasePrice || goal.estimatedCost || 
                       goal.tuitionEstimate || goal.amountDesired || 1)) * 100)}%` 
                  }}
                ></div>
              </div>
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
