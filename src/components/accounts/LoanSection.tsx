
import { AccountSection } from "@/components/accounts/AccountSection";
import { EmptyAccountSection } from "@/components/accounts/EmptyAccountSection";
import { LoanTypeDropdown } from "@/components/accounts/LoanTypeDropdown";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LoanSectionProps {
  onAddAccount: (type: string) => void;
}

export function LoanSection({ onAddAccount }: LoanSectionProps) {
  const { toast } = useToast();
  const [loanType, setLoanType] = useState("mortgage");

  const handleLoanTypeChange = (value: string) => {
    setLoanType(value);
    toast({
      title: "Loan Type Selected",
      description: `You've selected a ${value} loan type`
    });
  };

  return (
    <AccountSection 
      icon={<CreditCard className="h-5 w-5 text-purple-500 bg-black p-1 rounded-full" />}
      title="External Loans"
      amount="$0.00"
      initiallyOpen={false}
    >
      <div className="p-4 text-center text-muted-foreground space-y-4">
        <p>No loan accounts linked.</p>
        
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium mb-2">Loan Type</label>
          <LoanTypeDropdown 
            value={loanType} 
            onValueChange={handleLoanTypeChange} 
          />
        </div>
        
        <EmptyAccountSection 
          message="" 
          buttonText="Add Loan"
          onAddAccount={() => onAddAccount("loan")} 
        />
      </div>
    </AccountSection>
  );
}
