
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-4">
        Select the type of loan you're interested in applying for.
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {loanTypes.map((loanType) => {
          const Icon = loanType.icon;
          return (
            <Button
              key={loanType.id}
              variant="outline"
              className="flex items-start justify-between h-auto p-4 hover:bg-accent"
              onClick={() => onSelect(loanType.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
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
