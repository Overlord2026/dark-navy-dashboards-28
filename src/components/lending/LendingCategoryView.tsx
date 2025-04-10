
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { LoanCategory } from "./types";
import { LoanCategoryCard } from "./LoanCategoryCard";

interface LendingCategoryViewProps {
  categories: LoanCategory[];
  onCategorySelect: (categoryId: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const LendingCategoryView: React.FC<LendingCategoryViewProps> = ({
  categories,
  onCategorySelect,
  onBack,
  showBackButton = false,
}) => {
  return (
    <div className="animate-fade-in">
      {showBackButton && onBack && (
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <LoanCategoryCard 
            key={category.id}
            category={category}
            onSelect={() => onCategorySelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
};
