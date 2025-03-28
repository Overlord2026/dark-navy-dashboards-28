
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  onClick: () => void;
}

const StepCard = ({ number, title, description, onClick }: StepCardProps) => (
  <Card 
    className="w-full max-w-[200px] h-[200px] flex flex-col bg-[#1A1A2E] border-border/20 cursor-pointer 
    hover:bg-[#1A1A2E]/90 hover:border-primary hover:shadow-md hover:shadow-primary/10 transition-all duration-200"
    onClick={onClick}
  >
    <CardContent className="p-4 flex flex-col h-full">
      <span className="text-3xl font-bold text-primary/80 mb-2">{number}</span>
      <h3 className="text-[17px] font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export interface StepsOverviewProps {
  onStepSelect?: (stepNumber: number) => void;
}

export function StepsOverview({ onStepSelect }: StepsOverviewProps) {
  const isMobile = useIsMobile();
  const steps = [
    {
      number: 1,
      title: "Goals",
      description: "Add goals like retirement, vacations, and college savings for your kids."
    },
    {
      number: 2,
      title: "Assets",
      description: "Choose which accounts to add to your plan."
    },
    {
      number: 3,
      title: "Income",
      description: "Capture all the income you earn and expect to earn."
    },
    {
      number: 4,
      title: "Savings",
      description: "Track how much you plan to save each year."
    },
    {
      number: 5,
      title: "Expenses",
      description: "Plan for expenses before and during retirement."
    },
    {
      number: 6,
      title: "Insurance",
      description: "Add details about your current insurance coverage."
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-[20px] font-medium text-[#FFFFFF]">Overview of Steps</h2>
      
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'sm:grid-cols-2 gap-6'}`}>
        {steps.map((step) => (
          <StepCard 
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
            onClick={() => onStepSelect?.(step.number + 1)} // Adding +1 to align with the CreatePlanDialog steps (2-7)
          />
        ))}
      </div>
    </div>
  );
}
