
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ExpenseData, ExpensesSidePanel } from "./ExpensesSidePanel";

interface ExpenseCardProps {
  expense: ExpenseData;
  onClick: () => void;
}

const ExpenseCard = ({ expense, onClick }: ExpenseCardProps) => {
  return (
    <div
      className="relative w-full h-40 border border-blue-900/30 rounded-lg bg-[#0F1C2E] p-4 cursor-pointer hover:border-blue-500/50 transition-all"
      onClick={onClick}
    >
      <div className="absolute top-3 right-3 text-xs text-muted-foreground">
        {expense.owner}
      </div>
      <div className="mt-8 space-y-2">
        <h3 className="text-lg font-medium text-white">{expense.name || `${expense.type} Expenses ${expense.period}`}</h3>
        <p className="text-2xl font-semibold">${expense.amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

interface ExpensesStepProps {
  expenses: ExpenseData[];
  onExpenseUpdate: (expenses: ExpenseData[]) => void;
}

export const ExpensesStep = ({ expenses = [], onExpenseUpdate }: ExpensesStepProps) => {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseData | null>(null);
  const [isExpensePanelOpen, setIsExpensePanelOpen] = useState(false);

  const livingExpensesBefore = expenses.filter(
    (e) => e.type === "Living" && e.period === "Before Retirement"
  );
  
  const healthcareExpensesBefore = expenses.filter(
    (e) => e.type === "Healthcare" && e.period === "Before Retirement"
  );
  
  const livingExpensesAfter = expenses.filter(
    (e) => e.type === "Living" && e.period === "After Retirement"
  );
  
  const healthcareExpensesAfter = expenses.filter(
    (e) => e.type === "Healthcare" && e.period === "After Retirement"
  );

  const handleAddExpense = (type: ExpenseData["type"], period: ExpenseData["period"]) => {
    const newExpense: ExpenseData = {
      id: `expense-${Date.now()}`,
      name: "",
      type,
      period,
      amount: 0,
      owner: "Antonio Gomez",
    };
    setSelectedExpense(newExpense);
    setIsExpensePanelOpen(true);
  };

  const handleEditExpense = (expense: ExpenseData) => {
    setSelectedExpense(expense);
    setIsExpensePanelOpen(true);
  };

  const handleSaveExpense = (updatedExpense: ExpenseData) => {
    const expenseIndex = expenses.findIndex((e) => e.id === updatedExpense.id);
    let updatedExpenses: ExpenseData[];
    
    if (expenseIndex >= 0) {
      // Update existing expense
      updatedExpenses = [...expenses];
      updatedExpenses[expenseIndex] = updatedExpense;
    } else {
      // Add new expense
      updatedExpenses = [...expenses, updatedExpense];
    }
    
    onExpenseUpdate(updatedExpenses);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <p className="text-muted-foreground">
          Expenses are split between before and during retirement, as they can change quite a bit.
        </p>
        <div className="flex justify-end">
          <Button onClick={() => handleAddExpense("Living", "Before Retirement")}>
            Add Expense
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Living Expenses Before Retirement</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-6 h-6"
              onClick={() => handleAddExpense("Living", "Before Retirement")}
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
          
          {livingExpensesBefore.length > 0 ? (
            <div className="space-y-4">
              {livingExpensesBefore.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onClick={() => handleEditExpense(expense)}
                />
              ))}
            </div>
          ) : (
            <div className="h-40 border border-dashed border-blue-900/30 rounded-lg flex items-center justify-center p-4">
              <p className="text-muted-foreground text-center">
                Add living expenses before retirement like housing, food, and transportation.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Healthcare Expenses Before Retirement</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-6 h-6"
              onClick={() => handleAddExpense("Healthcare", "Before Retirement")}
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
          
          {healthcareExpensesBefore.length > 0 ? (
            <div className="space-y-4">
              {healthcareExpensesBefore.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onClick={() => handleEditExpense(expense)}
                />
              ))}
            </div>
          ) : (
            <div className="h-40 border border-dashed border-blue-900/30 rounded-lg flex items-center justify-center p-4">
              <p className="text-muted-foreground text-center">
                Add healthcare expenses before retirement like insurance premiums and out-of-pocket costs.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Living Expenses After Retirement</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-6 h-6"
              onClick={() => handleAddExpense("Living", "After Retirement")}
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
          
          {livingExpensesAfter.length > 0 ? (
            <div className="space-y-4">
              {livingExpensesAfter.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onClick={() => handleEditExpense(expense)}
                />
              ))}
            </div>
          ) : (
            <div className="h-40 border border-dashed border-blue-900/30 rounded-lg flex items-center justify-center p-4">
              <p className="text-muted-foreground text-center">
                Add living expenses after retirement like housing, food, and travel.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Healthcare Expenses After Retirement</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-6 h-6"
              onClick={() => handleAddExpense("Healthcare", "After Retirement")}
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
          
          {healthcareExpensesAfter.length > 0 ? (
            <div className="space-y-4">
              {healthcareExpensesAfter.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onClick={() => handleEditExpense(expense)}
                />
              ))}
            </div>
          ) : (
            <div className="h-40 border border-dashed border-blue-900/30 rounded-lg flex items-center justify-center p-4">
              <p className="text-muted-foreground text-center">
                Add healthcare expenses after retirement like Medicare premiums and long-term care.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <ExpensesSidePanel
        isOpen={isExpensePanelOpen}
        onClose={() => setIsExpensePanelOpen(false)}
        expense={selectedExpense}
        onSave={handleSaveExpense}
      />
    </div>
  );
};
