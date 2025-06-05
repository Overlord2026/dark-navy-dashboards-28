
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, DollarSign } from "lucide-react";

export const FinancialPlansCards = () => {
  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Set Financial Goals</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Define and track your financial objectives — from retirement planning to major purchases.
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Track Income & Expenses</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Monitor your income streams, expenses, and savings to ensure you're on track.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
