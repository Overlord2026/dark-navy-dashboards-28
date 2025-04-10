
import { Button } from "@/components/ui/button";
import { LucideIcon } from "./types";
import { useState } from "react";

interface LoanType {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

interface LoanTypeSelectorProps {
  loanTypes: LoanType[];
  onSelect: (loanType: string) => void;
}

export function LoanTypeSelector({ loanTypes, onSelect }: LoanTypeSelectorProps) {
  const [hoveredLoanType, setHoveredLoanType] = useState<string | null>(null);
  
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-4">
        Select the type of loan you're interested in applying for.
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {loanTypes.map((loanType) => {
          const Icon = loanType.icon;
          const isHovered = hoveredLoanType === loanType.id;
          
          return (
            <Button
              key={loanType.id}
              variant="outline"
              className={`flex items-start justify-between h-auto p-4 transition-all duration-200 ${isHovered ? 'bg-accent shadow-sm' : 'hover:bg-accent/50'}`}
              onClick={() => onSelect(loanType.id)}
              onMouseEnter={() => setHoveredLoanType(loanType.id)}
              onMouseLeave={() => setHoveredLoanType(null)}
              onFocus={() => setHoveredLoanType(loanType.id)}
              onBlur={() => setHoveredLoanType(null)}
              aria-label={`Select ${loanType.name} loan type`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${isHovered ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{loanType.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{loanType.description}</p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
