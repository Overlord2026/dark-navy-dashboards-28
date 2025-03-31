
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface LoanCategoryProps {
  category: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
  };
  onSelect: () => void;
}

export const LoanCategoryCard: React.FC<LoanCategoryProps> = ({ category, onSelect }) => {
  const { title, description, icon: Icon } = category;
  
  return (
    <Card 
      className="p-6 h-full flex flex-col hover:shadow-md transition-all cursor-pointer" 
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-medium mb-3">{title} <ArrowRight className="inline-block h-5 w-5 ml-1" /></h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="mt-auto">
        <Icon className="h-10 w-10 text-muted-foreground opacity-50" />
      </div>
    </Card>
  );
};
