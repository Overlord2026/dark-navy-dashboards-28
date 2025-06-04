
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FinancialPlansQuickActionsProps {
  onCreatePlan: () => void;
}

export const FinancialPlansQuickActions = ({ onCreatePlan }: FinancialPlansQuickActionsProps) => {
  const quickActions = [
    {
      title: "Set Goals",
      description: "Track your financial goals — anything from buying a home to saving for a wedding.",
    },
    {
      title: "Track income and expenses into your plan",
      description: "Track your income, expenses, and make sure you're on track.",
    }
  ];

  return (
    <div className="flex justify-end">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {quickActions.map((action, index) => (
          <Card key={index} className="border border-border/30 bg-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
