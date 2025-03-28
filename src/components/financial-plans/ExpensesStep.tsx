
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ExpenseData, ExpensesSidePanel } from "./ExpensesSidePanel";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpenseCardProps {
  expense: ExpenseData;
  onClick: () => void;
}

const ExpenseCard = ({ expense, onClick }: ExpenseCardProps) => {
  return (
    <div
      className="relative w-full h-36 border border-blue-900/30 rounded-lg bg-[#0F1C2E] p-4 cursor-pointer hover:border-blue-500/50 transition-all"
      onClick={onClick}
    >
      <div className="absolute top-3 right-3 text-xs text-muted-foreground">
        {expense.owner}
      </div>
      <div className="mt-8 space-y-2">
        <h3 className="text-lg font-medium text-white">{expense.name || `${expense.type} Expenses ${expense.period}`}</h3>
        <p className="text-xl font-semibold">${expense.amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

const EmptyExpenseCard = ({ type, period, onClick }: { type: string; period: string; onClick: () => void }) => (
  <div
    className="h-36 border border-dashed border-blue-900/30 rounded-lg flex items-center justify-center p-4 cursor-pointer hover:border-blue-500/30 transition-all"
    onClick={onClick}
  >
    <div className="flex flex-col items-center gap-2">
      <PlusCircle className="h-6 w-6 text-blue-500" />
      <p className="text-muted-foreground text-center text-sm">
        Add {type} expenses
      </p>
    </div>
  </div>
);

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

  const livingExpensesBefore = getExpensesByTypeAndPeriod("Living", "Before Retirement");
  const healthcareExpensesBefore = getExpensesByTypeAndPeriod("Healthcare", "Before Retirement");
  const livingExpensesAfter = getExpensesByTypeAndPeriod("Living", "After Retirement");
  const healthcareExpensesAfter = getExpensesByTypeAndPeriod("Healthcare", "After Retirement");

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
  };

  const expenseTypes = [
    { value: "Living", label: "Living" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Debt", label: "Debt" },
    { value: "Taxes and fees", label: "Taxes and fees" },
    { value: "Alimony", label: "Alimony" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Expenses</h2>
        <p className="text-muted-foreground">
          Expenses are split between before and during retirement, as they can change quite a bit.
        </p>
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                Add Expense
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="py-2">
                {expenseTypes.map((type) => (
                  <button
                    key={type.value}
                    className="w-full px-4 py-2 text-left hover:bg-blue-900/20 transition-colors"
                    onClick={() => handleAddExpense(type.value as ExpenseData["type"], "Before Retirement")}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Living Expenses Before Retirement</h3>
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
            <EmptyExpenseCard 
              type="living" 
              period="before retirement" 
              onClick={() => handleAddExpense("Living", "Before Retirement")} 
            />
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Healthcare Expenses Before Retirement</h3>
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
            <EmptyExpenseCard 
              type="healthcare" 
              period="before retirement" 
              onClick={() => handleAddExpense("Healthcare", "Before Retirement")} 
            />
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Living Expenses After Retirement</h3>
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
            <EmptyExpenseCard 
              type="living" 
              period="after retirement" 
              onClick={() => handleAddExpense("Living", "After Retirement")} 
            />
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Healthcare Expenses After Retirement</h3>
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
            <EmptyExpenseCard 
              type="healthcare" 
              period="after retirement" 
              onClick={() => handleAddExpense("Healthcare", "After Retirement")} 
            />
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
