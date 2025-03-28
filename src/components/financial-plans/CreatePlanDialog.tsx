import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepsOverview } from "./StepsOverview";
import { ExpensesStep } from "./ExpensesStep";
import { ExpenseData } from "./ExpensesSidePanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  priority: string;
}

interface PlanData {
  name: string;
  goals: Goal[];
  isDraft?: boolean;
  successRate?: number;
  expenses?: ExpenseData[];
}

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (planName: string, planData: any) => void;
  onSaveDraft: (draftData: any) => void;
  draftData?: any;
}

export function CreatePlanDialog({ 
  isOpen, 
  onClose, 
  onCreatePlan, 
  onSaveDraft,
  draftData = null
}: CreatePlanDialogProps) {
  const [currentStep, setCurrentStep] = useState(draftData?.step || 1);
  const [planName, setPlanName] = useState(draftData?.name || "");
  const [planData, setPlanData] = useState<PlanData>({
    name: draftData?.name || "",
    goals: draftData?.goals || [],
    isDraft: true,
    expenses: draftData?.expenses || [],
  });
  const [goals, setGoals] = useState<Goal[]>(draftData?.goals || []);

  const handleStepSelect = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCreatePlan = () => {
    if (planName.trim() === "") {
      toast.error("Plan name is required.");
      return;
    }
    
    onCreatePlan(planName, planData);
    onClose();
  };

  const handleSaveDraft = () => {
    const draftDataToSave = {
      ...planData,
      name: planName,
      currentStep: currentStep,
      draftId: draftData?.id
    };
    
    onSaveDraft(draftDataToSave);
    onClose();
  };

  const handleGoalUpdate = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    setPlanData(prev => ({ ...prev, goals: updatedGoals }));
  };

  const [expenses, setExpenses] = useState<ExpenseData[]>(draftData?.expenses || []);
  
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Plan Name</h2>
            <p className="text-muted-foreground">
              Give your financial plan a name to easily identify it.
            </p>
            <Input
              type="text"
              placeholder="My Financial Plan"
              value={planName}
              onChange={(e) => {
                setPlanName(e.target.value);
                setPlanData(prev => ({ ...prev, name: e.target.value }));
              }}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={handleNextStep}>Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Goals</h2>
            <p className="text-muted-foreground">
              Set your financial goals to create a personalized plan.
            </p>
            {/* Goal input fields and list will go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input id="goal-name" type="text" placeholder="Retirement" />
              </div>
              <div>
                <Label htmlFor="goal-priority">Priority</Label>
                <Select>
                  <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2333] border-blue-900/30">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>Previous</Button>
              <Button onClick={handleNextStep}>Next</Button>
            </div>
          </div>
        );
      case 6:
        return (
          <ExpensesStep 
            expenses={expenses} 
            onExpenseUpdate={(updatedExpenses) => {
              setExpenses(updatedExpenses);
              setPlanData(prev => ({
                ...prev,
                expenses: updatedExpenses
              }));
            }} 
          />
        );
      
      default:
        return <StepsOverview onStepSelect={handleStepSelect} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl min-h-[600px] bg-[#0a1022] border-blue-900/30">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>

        <div className="absolute bottom-6 left-6 right-6 flex justify-between">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevStep} className="border-gray-700 hover:bg-gray-800">
              Back
            </Button>
          )}
          {currentStep < 6 ? (
            currentStep !== 1 && <Button onClick={handleNextStep}>Next</Button>
          ) : (
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleSaveDraft} className="border-gray-700 hover:bg-gray-800">
                Save Draft
              </Button>
              <Button onClick={handleCreatePlan}>Continue</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
