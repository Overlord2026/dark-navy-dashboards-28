
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
      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
        <PlusCircle className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Add {type.toLowerCase()} expenses
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
    setIsExpensePanelOpen(false);
  };

  // Expanded list of expense types
  const expenseTypes = [
    { value: "Living", label: "Living Expenses" },
    { value: "Housing", label: "Housing" },
    { value: "Transportation", label: "Transportation" },
    { value: "Food", label: "Food & Groceries" },
    { value: "Utilities", label: "Utilities" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Insurance", label: "Insurance" },
    { value: "Debt", label: "Debt Payments" },
    { value: "Education", label: "Education" },
    { value: "Childcare", label: "Childcare" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Travel", label: "Travel" },
    { value: "Gifts", label: "Gifts & Donations" },
    { value: "Taxes and fees", label: "Taxes & Fees" },
    { value: "Alimony", label: "Alimony & Child Support" },
    { value: "Retirement", label: "Retirement Savings" },
    { value: "Business", label: "Business Expenses" },
    { value: "Other", label: "Other Expenses" },
  ];

  // Adding buttons for each expense category
  const renderExpenseSection = (type: string, period: string) => {
    const sectionExpenses = getExpensesByTypeAndPeriod(type as ExpenseData["type"], period as ExpenseData["period"]);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">{type} Expenses {period}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-8 h-8 bg-[#0F1C2E] border border-gray-700/20"
            onClick={() => handleAddExpense(type as ExpenseData["type"], period as ExpenseData["period"])}
          >
            <PlusCircle className="w-5 h-5 text-blue-500" />
          </Button>
        </div>
        
        {sectionExpenses.length > 0 ? (
          <div className="space-y-4">
            {sectionExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onClick={() => handleEditExpense(expense)}
              />
            ))}
          </div>
        ) : (
          <EmptyExpenseCard 
            type={type.toLowerCase()} 
            period={period.toLowerCase()} 
            onClick={() => handleAddExpense(type as ExpenseData["type"], period as ExpenseData["period"])} 
          />
        )}
      </div>
    );
  };

  // Group expense types for better organization
  const groupedExpenseTypes = {
    "Essential Living": ["Living", "Housing", "Food", "Utilities", "Transportation"],
    "Healthcare & Insurance": ["Healthcare", "Insurance"],
    "Financial Obligations": ["Debt", "Taxes and fees", "Alimony", "Retirement"],
    "Family & Education": ["Education", "Childcare", "Gifts"],
    "Lifestyle": ["Entertainment", "Travel"],
    "Other": ["Business", "Other"]
  };

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
              <Button className="bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0">
                Add Expense
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-[#0A1022] border-blue-900/30 max-h-[350px] overflow-y-auto">
              <div className="py-2">
                {Object.entries(groupedExpenseTypes).map(([group, types]) => (
                  <div key={group}>
                    <div className="px-4 py-1 text-xs uppercase tracking-wider text-gray-400 border-b border-blue-900/30">
                      {group}
                    </div>
                    {types.map(type => {
                      const expenseType = expenseTypes.find(e => e.value === type);
                      return expenseType && (
                        <button
                          key={expenseType.value}
                          className="w-full px-4 py-2 text-left hover:bg-blue-900/20 transition-colors flex items-center"
                          onClick={() => handleAddExpense(expenseType.value as ExpenseData["type"], "Before Retirement")}
                        >
                          {expenseType.label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Before Retirement Expenses */}
        <div className="space-y-6">
          {renderExpenseSection("Healthcare", "Before Retirement")}
          {renderExpenseSection("Transportation", "Before Retirement")}
          {renderExpenseSection("Living", "Before Retirement")}
          {renderExpenseSection("Housing", "Before Retirement")}
        </div>
        
        {/* After Retirement Expenses */}
        <div className="space-y-6">
          {renderExpenseSection("Healthcare", "After Retirement")}
          {renderExpenseSection("Transportation", "After Retirement")}
          {renderExpenseSection("Living", "After Retirement")}
          {renderExpenseSection("Housing", "After Retirement")}
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
