
import React from "react";
import { Progress } from "@/components/ui/progress";

export interface DeductionItemProps {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export const DeductionItem = ({ category, amount, percentage, color }: DeductionItemProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{category}</span>
        <span className="text-sm font-medium">{formatCurrency(amount)}</span>
      </div>
      <div className="flex items-center">
        <Progress value={percentage} className={`h-2 ${color}/20`} indicatorClassName={color} />
        <span className="ml-2 text-xs">{percentage}%</span>
      </div>
    </div>
  );
};
