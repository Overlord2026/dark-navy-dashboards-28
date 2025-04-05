
import React from "react";
import { DeductionItem } from "./DeductionItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeductionsListProps {
  deductions: Array<{
    id: string;
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  totalDeductions: number;
}

export const DeductionsList = ({ deductions, totalDeductions }: DeductionsListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Tax Deductions</CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Deductions</p>
            <p className="font-medium">{formatCurrency(totalDeductions)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {deductions.map((deduction) => (
          <DeductionItem
            key={deduction.id}
            category={deduction.category}
            amount={deduction.amount}
            percentage={deduction.percentage}
            color={deduction.color}
          />
        ))}
      </CardContent>
    </Card>
  );
};
