import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, Edit, Trash2 } from "lucide-react";
import { GoalDetailsSidePanel, GoalFormData } from "./GoalDetailsSidePanel";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface Goal {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  priority?: string;
  targetDate?: Date;
  targetAmount?: number;
  currentAmount?: number;
  owner?: string;
  description?: string;
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  studentName?: string;
  startYear?: number;
  endYear?: number;
  tuitionEstimate?: number;
  destination?: string;
  estimatedCost?: number;
  amountDesired?: number;
  repeats?: string;
  annualInflationType?: string;
  annualInflationRate?: number;
  isNew?: boolean;
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
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [detailsPanelTitle, setDetailsPanelTitle] = useState<string>("");
  const [localGoals, setLocalGoals] = useState<Goal[]>(goals);
  const [newGoalId, setNewGoalId] = useState<string | null>(null);
  
  // Update local goals when props change
  if (JSON.stringify(goals) !== JSON.stringify(localGoals)) {
    setLocalGoals(goals);
  }
  
  useEffect(() => {
    if (newGoalId) {
      const timer = setTimeout(() => {
        setNewGoalId(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [newGoalId]);
  
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
    
    let panelTitle = goalTitle;
    if (goal.owner) {
      const ownerPossessive = goal.owner.endsWith('s') ? `${goal.owner}'` : `${goal.owner}'s`;
      panelTitle = `${ownerPossessive} ${goalTitle}`;
    }
    
    setDetailsPanelTitle(panelTitle);
    setIsDetailsPanelOpen(true);
  };

  const handleRetirementAgeClick = (title: string) => {
    setSelectedGoal(undefined);
    setDetailsPanelTitle(title);
    setIsDetailsPanelOpen(true);
  };

  const handleAddGoalClick = () => {
    setSelectedGoal(undefined);
    setDetailsPanelTitle("Add New Goal");
    setIsAddGoalDialogOpen(true);
  };

  const handleTitleUpdate = (name: string, owner: string) => {
    if (name && owner) {
      const ownerPossessive = owner.endsWith('s') ? `${owner}'` : `${owner}'s`;
      setDetailsPanelTitle(`${ownerPossessive} ${name}`);
    } else if (name) {
      setDetailsPanelTitle(name);
    }
  };

  // Independent goal saving - no plan dependency
  const handleSaveGoal = async (goalData: GoalFormData) => {
    try {
      if (selectedGoal) {
        // Update existing goal
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
          repeats: goalData.repeats,
          annualInflationType: goalData.annualInflationType,
          annualInflationRate: goalData.annualInflationRate,
        };
        
        setLocalGoals(prev => 
          prev.map(g => g.id === updatedGoal.id ? updatedGoal : g)
        );
        
        setNewGoalId(updatedGoal.id);
        onGoalUpdate?.(updatedGoal);
        toast.success("Goal updated successfully!");
      } else {
        // Create new goal - completely independent of plans
        const newGoalId = `goal-${Date.now()}`;
        const newGoal: Goal = {
          id: newGoalId,
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
          repeats: goalData.repeats,
          annualInflationType: goalData.annualInflationType,
          annualInflationRate: goalData.annualInflationRate,
        };
        
        setLocalGoals(prev => [...prev, newGoal]);
        setNewGoalId(newGoalId);
        onGoalUpdate?.(newGoal);
        toast.success("Goal created successfully!");
      }
      
      setIsDetailsPanelOpen(false);
      setIsAddGoalDialogOpen(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error("Failed to save goal. Please try again.");
    }
  };

  const handleCancelGoal = () => {
    if (selectedGoal?.isNew) {
      setLocalGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
    }
    
    setIsDetailsPanelOpen(false);
    setIsAddGoalDialogOpen(false);
  };

  const handleEditGoal = (goal: Goal, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedGoal(goal);
    const goalTitle = goal.title || goal.name || "";
    
    let panelTitle = goalTitle;
    if (goal.owner) {
      const ownerPossessive = goal.owner.endsWith('s') ? `${goal.owner}'` : `${goal.owner}'s`;
      panelTitle = `${ownerPossessive} ${goalTitle}`;
    }
    
    setDetailsPanelTitle(panelTitle);
    setIsDetailsPanelOpen(true);
  };

  const handleDeleteGoal = async (goalId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      setLocalGoals(prev => prev.filter(g => g.id !== goalId));
      onGoalDelete?.(goalId);
      toast.success("Goal deleted successfully!");
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error("Failed to delete goal. Please try again.");
    }
  };

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
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Goals</h2>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleAddGoalClick}
        >
          Add Goal
        </Button>
      </div>
      
      <p className="text-gray-400 text-sm -mt-4">
        Add your goals including retirement age and big purchases like homes, education, and vacations.
      </p>
      
      <div>
        <h3 className="text-md font-medium mb-4">Target Retirement Age</h3>
        {retirementGoals.length > 0 ? (
          retirementGoals.map((goal, index) => (
            <RetirementAgeCard 
              key={goal.id || `retirement-goal-${index}`}
              goal={goal}
              onClick={() => handleGoalClick(goal)}
              onEdit={(e) => handleEditGoal(goal, e)}
              onDelete={(e) => handleDeleteGoal(goal.id, e)}
              isNew={goal.id === newGoalId}
            />
          ))
        ) : (
          <Card 
            className="bg-[#0D1426] border border-blue-900 p-6 cursor-pointer hover:border-blue-600 transition-all mb-4"
            onClick={() => handleRetirementAgeClick("Target Retirement Age")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">70</div>
                <div className="text-sm text-gray-400">years old</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">2033</div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm font-medium">Antonio's Retirement Age</div>
              <div className="text-sm text-gray-400">Antonio Gomez</div>
            </div>
          </Card>
        )}
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-4">Other Goals</h3>
        {otherGoals.length > 0 ? (
          <div className="space-y-4">
            {otherGoals.map((goal, index) => (
              <GoalCard 
                key={goal.id || `other-goal-${index}`} 
                goal={goal} 
                isExpanded={expandedGoals.includes(goal.id || `other-goal-${index}`)} 
                onToggle={() => toggleGoalExpansion(goal.id || `other-goal-${index}`)}
                onClick={() => handleGoalClick(goal)}
                onEdit={(e) => handleEditGoal(goal, e)}
                onDelete={(e) => handleDeleteGoal(goal.id, e)}
                isNew={goal.id === newGoalId}
              />
            ))}
          </div>
        ) : (
          <Card 
            className="bg-[#0D1426] border border-blue-900 p-6 text-center hover:border-blue-600 transition-all cursor-pointer"
            onClick={handleAddGoalClick}
          >
            <p className="text-gray-400">
              Add other goals for education, cars, vacations, homes, and more.
            </p>
          </Card>
        )}
      </div>
      
      {/* Edit Goal Sidebar */}
      <GoalDetailsSidePanel
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
        onCancel={handleCancelGoal}
        goal={selectedGoal}
        onSave={handleSaveGoal}
        title={detailsPanelTitle}
        onTitleUpdate={handleTitleUpdate}
      />

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{detailsPanelTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <GoalDetailsSidePanel
              isOpen={true}
              onClose={() => setIsAddGoalDialogOpen(false)}
              onCancel={handleCancelGoal}
              goal={undefined}
              onSave={handleSaveGoal}
              title=""
              onTitleUpdate={handleTitleUpdate}
              isDialog={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RetirementAgeCard({ goal, onClick, onEdit, onDelete, isNew = false }: { 
  goal: Goal;
  onClick: () => void;
  onEdit: (event: React.MouseEvent) => void;
  onDelete: (event: React.MouseEvent) => void;
  isNew?: boolean;
}) {
  const age = goal.targetRetirementAge || 70;
  const year = goal.targetDate ? format(goal.targetDate, 'yyyy') : '2033';
  const owner = goal.owner || 'Antonio Gomez';
  const shortName = owner.split(' ')[0];
  
  return (
    <Card 
      className={`bg-[#0D1426] border border-blue-900 p-6 cursor-pointer hover:border-blue-600 transition-all relative ${
        isNew ? 'animate-in slide-in-from-bottom-5 fade-in-100 duration-500' : 'animate-in fade-in-80 duration-200'
      }`}
      onClick={onClick}
    >
      {/* Action Buttons - Always Visible */}
      <div className="absolute top-3 right-3 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 hover:bg-red-600/20 text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{age}</div>
          <div className="text-sm text-gray-400">years old</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{year}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm font-medium">{shortName}'s Retirement Age</div>
        <div className="text-sm text-gray-400">{owner}</div>
      </div>
    </Card>
  );
}

function GoalCard({ goal, isExpanded, onToggle, onClick, onEdit, onDelete, isNew = false }: { 
  goal: Goal;
  isExpanded: boolean;
  onToggle: () => void;
  onClick: () => void;
  onEdit: (event: React.MouseEvent) => void;
  onDelete: (event: React.MouseEvent) => void;
  isNew?: boolean;
}) {
  const goalTitle = goal.title || goal.name || "Unnamed Goal";
  const goalType = goal.type || goal.priority || "Goal";
  const inflationText = renderInflationText(goal);

  return (
    <Card 
      className={`bg-[#0D1426] border border-blue-900 p-4 cursor-pointer hover:border-blue-600 transition-all relative ${
        isNew ? 'animate-in slide-in-from-bottom-5 fade-in-100 duration-500' : 'animate-in fade-in-80 duration-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium">
            {goalTitle} {inflationText && <span className="text-xs text-gray-400 ml-1">{inflationText}</span>}
          </h4>
          <p className="text-xs text-gray-400">{goalType}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Action Buttons - Always Visible */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 hover:bg-red-600/20 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2 pt-2 border-t border-blue-900/50">
          {(goal.type === "Asset Purchase" || goal.type === "Home Purchase" || goal.type === "Vehicle") && (
            <>
              {goal.purchasePrice !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Purchase Price:</span>
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
                  <span className="text-gray-400">Financing:</span>
                  <span>{goal.financingMethod}</span>
                </div>
              )}
              
              {(goal.type === "Asset Purchase" || goal.type === "Home Purchase") && 
                goal.annualAppreciation && goal.annualAppreciation !== "None" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Annual Appreciation:</span>
                  <span>{goal.annualAppreciation}</span>
                </div>
              )}
            </>
          )}
          
          {goal.type === "Education" && (
            <>
              {goal.studentName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Student:</span>
                  <span>{goal.studentName}</span>
                </div>
              )}
              
              {goal.tuitionEstimate !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tuition Estimate:</span>
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
                  <span className="text-gray-400">Years:</span>
                  <span>{goal.startYear} - {goal.endYear}</span>
                </div>
              )}
            </>
          )}
          
          {goal.type === "Vacation" && (
            <>
              {goal.destination && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Destination:</span>
                  <span>{goal.destination}</span>
                </div>
              )}
              
              {goal.estimatedCost !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Cost:</span>
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
          
          {goal.type === "Cash Reserve" && (
            <>
              {goal.amountDesired !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Target Amount:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(goal.amountDesired)}
                  </span>
                </div>
              )}
              
              {goal.annualAppreciation && goal.annualAppreciation !== "None" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Annual Appreciation:</span>
                  <span>{goal.annualAppreciation}</span>
                </div>
              )}
              
              {goal.repeats && goal.repeats !== "None" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Repeats:</span>
                  <span>{goal.repeats}</span>
                </div>
              )}
            </>
          )}
          
          {goal.targetDate && !["Education"].includes(goal.type || "") && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Date:</span>
              <span>{format(goal.targetDate, 'MMM yyyy')}</span>
            </div>
          )}
          
          {goal.targetAmount !== undefined && 
            !["Asset Purchase", "Home Purchase", "Vehicle", "Vacation", "Education", "Cash Reserve"].includes(goal.type || "") && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Amount:</span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(goal.targetAmount)}
              </span>
            </div>
          )}
          
          {goal.targetRetirementAge && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Retirement Age:</span>
              <span>{goal.targetRetirementAge}</span>
            </div>
          )}
          
          {goal.planningHorizonAge && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Planning Horizon:</span>
              <span>{goal.planningHorizonAge} years</span>
            </div>
          )}
          
          {goal.description && (
            <div className="flex flex-col text-sm mt-2">
              <span className="text-gray-400 mb-1">Description:</span>
              <p className="text-sm">{goal.description}</p>
            </div>
          )}
          
          {goal.annualInflationType && goal.annualInflationType !== "None" && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Annual Inflation:</span>
              <span>
                {goal.annualInflationType === "General" ? "2% (General)" : 
                 goal.annualInflationType === "Custom" ? `${goal.annualInflationRate}% (Custom)` : 
                 "0%"}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function renderInflationText(goal: Goal) {
  if (!goal.annualInflationType || goal.annualInflationType === "None") {
    return null;
  }
  
  if (goal.annualInflationType === "General") {
    return "(Annual Inflation: 2%)";
  }
  
  if (goal.annualInflationType === "Custom" && goal.annualInflationRate !== undefined) {
    return `(Annual Inflation: ${goal.annualInflationRate}% Custom)`;
  }
  
  return null;
}
