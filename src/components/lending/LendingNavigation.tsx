
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanCategory } from "@/data/lending/loanCategories";

interface LendingNavigationProps {
  activeTab: string;
  selectedCategory: string | null;
  loanCategories: LoanCategory[];
  onBack: () => void;
}

export const LendingNavigation: React.FC<LendingNavigationProps> = ({
  activeTab,
  selectedCategory,
  loanCategories,
  onBack
}) => {
  return (
    <div className="flex items-center mb-6">
      {activeTab === "lenders" && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      )}
      <div>
        <h1 className="text-2xl font-semibold mb-1">
          {activeTab === "categories" 
            ? "" 
            : loanCategories.find(cat => cat.id === selectedCategory)?.title}
        </h1>
        {activeTab === "lenders" && selectedCategory && (
          <p className="text-muted-foreground">
            {loanCategories.find(cat => cat.id === selectedCategory)?.description}
          </p>
        )}
      </div>
    </div>
  );
};
