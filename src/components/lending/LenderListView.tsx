
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoanCategory, Lender } from "./types";

interface LenderListViewProps {
  selectedCategory: LoanCategory;
  lenders: Lender[];
  onLenderSelect: (lenderId: string) => void;
  onBack: () => void;
  categoryContent: React.ReactNode;
}

export const LenderListView: React.FC<LenderListViewProps> = ({
  selectedCategory,
  lenders,
  onLenderSelect,
  onBack,
  categoryContent,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
      </div>

      {categoryContent}
      
      {lenders.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4">Available Lenders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lenders.map((lender) => (
              <div
                key={lender.id}
                className="border border-border rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                onClick={() => onLenderSelect(lender.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  {lender.logo ? (
                    <img 
                      src={lender.logo} 
                      alt={lender.name} 
                      className="h-8 w-auto" 
                    />
                  ) : (
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                  )}
                  <h3 className="font-medium">{lender.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lender.description}</p>
                <div className="flex flex-wrap gap-2">
                  {lender.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs py-1 px-2 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
