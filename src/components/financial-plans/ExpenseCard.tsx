
import React from "react";
import { ExpenseData } from "./ExpensesSidePanel";

interface ExpenseCardProps {
  expense: ExpenseData;
  onClick: () => void;
}

export const ExpenseCard = ({ expense, onClick }: ExpenseCardProps) => {
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
