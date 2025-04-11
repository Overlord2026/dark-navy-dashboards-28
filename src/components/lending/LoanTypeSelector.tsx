
import { LoanType } from "./types";
import { LoanItemCard } from "./ui/LoanItemCard";

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
        {loanTypes.map((loanType) => (
          <LoanItemCard
            key={loanType.id}
            id={loanType.id}
            title={loanType.name}
            description={loanType.description}
            icon={loanType.icon}
            onClick={() => onSelect(loanType.id)}
          />
        ))}
      </div>
    </div>
  );
}
