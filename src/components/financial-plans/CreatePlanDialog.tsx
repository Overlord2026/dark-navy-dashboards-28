
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepsOverview } from "./StepsOverview";
import { ExpensesStep } from "./ExpensesStep";
import { ExpenseData } from "./ExpensesSidePanel";
import { PlanNameStep } from "./PlanNameStep";
import { GoalsStep } from "./GoalsStep";
import { AssetsStep } from "./AssetsStep";
import { IncomeStep } from "./IncomeStep";
import { SavingsStep } from "./SavingsStep";
import { InsuranceStep } from "./InsuranceStep";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  priority: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  isSelected?: boolean;
}

interface PlanData {
  name: string;
  goals: Goal[];
  isDraft?: boolean;
  successRate?: number;
  expenses?: ExpenseData[];
  accounts?: Account[];
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
    accounts: draftData?.accounts || [],
  });
  const [goals, setGoals] = useState<Goal[]>(draftData?.goals || []);
  const [accounts, setAccounts] = useState<Account[]>(draftData?.accounts || [
    { id: "1", name: "Checking Account", type: "Checking", balance: 5000, isSelected: false },
    { id: "2", name: "Savings Account", type: "Savings", balance: 25000, isSelected: false },
    { id: "3", name: "401(k)", type: "Retirement", balance: 120000, isSelected: false },
    { id: "4", name: "IRA", type: "Retirement", balance: 45000, isSelected: false },
    { id: "5", name: "Brokerage Account", type: "Investment", balance: 30000, isSelected: false },
  ]);
  const [expenses, setExpenses] = useState<ExpenseData[]>(draftData?.expenses || []);

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
      draftId: draftData?.id,
      accounts: accounts,
      expenses: expenses
    };
    
    onSaveDraft(draftDataToSave);
    onClose();
  };

  const handleGoalUpdate = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    setPlanData(prev => ({ ...prev, goals: updatedGoals }));
  };

  const handleAccountSelect = (accountId: string, isChecked: boolean) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId ? { ...account, isSelected: isChecked } : account
    );
    
    setAccounts(updatedAccounts);
    setPlanData(prev => ({ ...prev, accounts: updatedAccounts }));
  };
  
  const handleExpenseUpdate = (updatedExpenses: ExpenseData[]) => {
    setExpenses(updatedExpenses);
    setPlanData(prev => ({ ...prev, expenses: updatedExpenses }));
  };

  const handlePlanNameChange = (name: string) => {
    setPlanName(name);
    setPlanData(prev => ({ ...prev, name }));
  };
  
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlanNameStep 
            planName={planName} 
            onPlanNameChange={handlePlanNameChange} 
            onNextStep={handleNextStep} 
          />
        );
      case 2:
        return (
          <GoalsStep 
            goals={goals} 
            onGoalUpdate={handleGoalUpdate} 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep} 
          />
        );
      case 3:
        return (
          <AssetsStep 
            accounts={accounts} 
            onAccountSelect={handleAccountSelect} 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep} 
          />
        );
      case 4:
        return (
          <IncomeStep 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep} 
          />
        );
      case 5:
        return (
          <SavingsStep 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep} 
          />
        );
      case 6:
        return (
          <ExpensesStep 
            expenses={expenses} 
            onExpenseUpdate={handleExpenseUpdate} 
          />
        );
      case 7:
        return (
          <InsuranceStep 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep} 
          />
        );
      
      default:
        return <StepsOverview onStepSelect={handleStepSelect} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl min-h-[600px] bg-[#0a1022] border-blue-900/30">
        <DialogTitle className="sr-only">Create Financial Plan</DialogTitle>
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
          {currentStep < 7 ? (
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
