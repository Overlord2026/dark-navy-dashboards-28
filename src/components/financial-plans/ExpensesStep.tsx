
import React, { useState } from "react";
import { ExpenseData, ExpensesSidePanel } from "./ExpensesSidePanel";
import { ExpenseSection } from "./ExpenseSection";
import { ExpenseTypeSelector } from "./ExpenseTypeSelector";

interface ExpensesStepProps {
  expenses: ExpenseData[];
  onExpenseUpdate: (expenses: ExpenseData[]) => void;
}

export const ExpensesStep = ({ expenses = [], onExpenseUpdate }: ExpensesStepProps) => {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseData | null>(null);
  const [isExpensePanelOpen, setIsExpensePanelOpen] = useState(false);

  // Filter expenses by type and period
  const getExpensesByTypeAndPeriod = (type: ExpenseData["type"], period: ExpenseData["period"]) => {
    return expenses.filter(e => e.type === type && e.period === period);
  };

  const handleAddExpense = (type: ExpenseData["type"], period: ExpenseData["period"]) => {
    const newExpense: ExpenseData = {
      id: `expense-${Date.now()}`,
      name: `${type} Expenses ${period}`,
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
    setIsExpensePanelOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Expenses</h2>
        <p className="text-muted-foreground">
          Expenses are split between before and during retirement, as they can change quite a bit.
        </p>
        <div className="flex justify-end">
          <ExpenseTypeSelector onSelect={handleAddExpense} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Before Retirement Expenses */}
        <div className="space-y-6">
          <ExpenseSection 
            type="Healthcare" 
            period="Before Retirement" 
            expenses={getExpensesByTypeAndPeriod("Healthcare", "Before Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
          <ExpenseSection 
            type="Transportation" 
            period="Before Retirement" 
            expenses={getExpensesByTypeAndPeriod("Transportation", "Before Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
          <ExpenseSection 
            type="Living" 
            period="Before Retirement" 
            expenses={getExpensesByTypeAndPeriod("Living", "Before Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
          <ExpenseSection 
            type="Housing" 
            period="Before Retirement" 
            expenses={getExpensesByTypeAndPeriod("Housing", "Before Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
        </div>
        
        {/* After Retirement Expenses */}
        <div className="space-y-6">
          <ExpenseSection 
            type="Healthcare" 
            period="After Retirement" 
            expenses={getExpensesByTypeAndPeriod("Healthcare", "After Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
          <ExpenseSection 
            type="Transportation" 
            period="After Retirement" 
            expenses={getExpensesByTypeAndPeriod("Transportation", "After Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
          <ExpenseSection 
            type="Living" 
            period="After Retirement" 
            expenses={getExpensesByTypeAndPeriod("Living", "After Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
          <ExpenseSection 
            type="Housing" 
            period="After Retirement" 
            expenses={getExpensesByTypeAndPeriod("Housing", "After Retirement")}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
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
