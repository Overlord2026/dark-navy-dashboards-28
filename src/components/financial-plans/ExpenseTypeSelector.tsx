
import React from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ExpenseType {
  value: string;
  label: string;
}

// Group expense types for better organization
const groupedExpenseTypes = {
  "Essential Living": ["Living", "Housing", "Food", "Utilities", "Transportation"],
  "Healthcare & Insurance": ["Healthcare", "Insurance"],
  "Financial Obligations": ["Debt", "Taxes and fees", "Alimony", "Retirement"],
  "Family & Education": ["Education", "Childcare", "Gifts"],
  "Lifestyle": ["Entertainment", "Travel"],
  "Other": ["Business", "Other"]
};

// Expanded list of expense types
const expenseTypes: ExpenseType[] = [
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

interface ExpenseTypeSelectorProps {
  onSelect: (type: string, period: string) => void;
  period?: string;
}

export const ExpenseTypeSelector = ({ onSelect, period = "Before Retirement" }: ExpenseTypeSelectorProps) => {
  return (
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
                    onClick={() => onSelect(expenseType.value, period)}
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
  );
};
