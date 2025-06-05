
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, DollarSign } from "lucide-react";

export const FinancialPlansCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Set Financial Goals</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Define and track your financial objectives — from retirement planning to major purchases like homes and vacations.
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Track Income & Expenses</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Monitor your income streams, expenses, and savings to ensure you're on track for retirement and beyond.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
