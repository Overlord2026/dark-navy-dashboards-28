
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ExpenseData } from "./ExpensesSidePanel";
import { ExpenseCard } from "./ExpenseCard";
import { EmptyExpenseCard } from "./EmptyExpenseCard";

interface ExpenseSectionProps {
  type: string;
  period: string;
  expenses: ExpenseData[];
  onAddExpense: (type: ExpenseData["type"], period: ExpenseData["period"]) => void;
  onEditExpense: (expense: ExpenseData) => void;
}

export const ExpenseSection = ({ 
  type, 
  period, 
  expenses, 
  onAddExpense, 
  onEditExpense 
}: ExpenseSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{type} Expenses {period}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-8 h-8 bg-[#0F1C2E] border border-gray-700/20"
          onClick={() => onAddExpense(type as ExpenseData["type"], period as ExpenseData["period"])}
        >
          <PlusCircle className="w-5 h-5 text-blue-500" />
        </Button>
      </div>
      
      {expenses.length > 0 ? (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onClick={() => onEditExpense(expense)}
            />
          ))}
        </div>
      ) : (
        <EmptyExpenseCard 
          type={type.toLowerCase()} 
          period={period.toLowerCase()} 
          onClick={() => onAddExpense(type as ExpenseData["type"], period as ExpenseData["period"])} 
        />
      )}
    </div>
  );
};
