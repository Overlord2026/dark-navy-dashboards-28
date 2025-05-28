
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const FinancialPlansCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-[#0D1426] border border-border/30">
        <CardContent className="p-6">
          <h3 className="text-md font-medium mb-2">Set Goals</h3>
          <p className="text-sm text-muted-foreground">
            Track your financial goals — anything from buying a home to saving for a wedding.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-[#0D1426] border border-border/30">
        <CardContent className="p-6">
          <h3 className="text-md font-medium mb-2">Track income and expenses into retirement</h3>
          <p className="text-sm text-muted-foreground">
            Track your income, expenses, and savings to see if you're on track.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
