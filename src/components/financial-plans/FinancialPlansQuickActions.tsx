
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinancialPlansQuickActionsProps {
  onCreatePlan: () => void;
}

export const FinancialPlansQuickActions = ({ onCreatePlan }: FinancialPlansQuickActionsProps) => {
  const quickActions = [
    {
      title: "Set Goals",
      description: "Track your financial goals — anything from buying a home to saving for a wedding.",
      action: onCreatePlan
    },
    {
      title: "Track income and expenses into your plan",
      description: "Track your income, expenses, and make sure you're on track.",
      action: onCreatePlan
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quickActions.map((action, index) => (
        <Card key={index} className="border border-border/30 bg-card hover:shadow-md transition-all duration-200 cursor-pointer" onClick={action.action}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
