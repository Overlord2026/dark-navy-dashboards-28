
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => (
  <Card className="w-full max-w-[200px] h-[200px] flex flex-col bg-[#1A1A2E] border-border/20">
    <CardContent className="p-4 flex flex-col h-full">
      <span className="text-3xl font-bold text-primary/80 mb-2">{number}</span>
      <h3 className="text-[17px] font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function StepsOverview() {
  const steps = [
    {
      number: 1,
      title: "Basics",
      description: "Start with plan name and basic details about your retirement goals."
    },
    {
      number: 2,
      title: "Goals",
      description: "Add financial goals like retirement, vacations, and college savings for your kids."
    },
    {
      number: 3,
      title: "Income",
      description: "Enter your income sources and expected changes over time."
    },
    {
      number: 4,
      title: "Expenses",
      description: "Log your regular expenses and anticipated future costs."
    },
    {
      number: 5,
      title: "Projections",
      description: "Set market return expectations and risk tolerance for your investments."
    },
    {
      number: 6,
      title: "Review",
      description: "Analyze your plan, check its success probability, and make adjustments as needed."
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-[20px] font-medium text-[#FFFFFF]">Overview of Steps</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {steps.map((step) => (
          <StepCard 
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </div>
  );
}
