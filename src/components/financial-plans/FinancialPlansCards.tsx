
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Calendar } from "lucide-react";

export const FinancialPlansCards = () => {
  const cards = [
    {
      title: "Total Goals",
      value: "8",
      description: "Active financial goals",
      icon: Target,
      trend: "+2 this month"
    },
    {
      title: "Target Amount",
      value: "$2.5M",
      description: "Combined goal targets",
      icon: DollarSign,
      trend: "+$150K this quarter"
    },
    {
      title: "Progress Rate",
      value: "67%",
      description: "Average completion",
      icon: TrendingUp,
      trend: "+5% this month"
    },
    {
      title: "Timeline",
      value: "15 years",
      description: "Average goal timeline",
      icon: Calendar,
      trend: "On track"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border border-border/30 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
            <p className="text-xs text-green-600 mt-2">
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
