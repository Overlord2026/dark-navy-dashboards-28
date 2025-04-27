
import { CircleDollarSign, Briefcase, Building, Home, Landmark, Wallet, CreditCard } from "lucide-react";
import { AccountSection } from "@/components/accounts/AccountSection";
import { EmptyAccountSection } from "@/components/accounts/EmptyAccountSection";
import { EducationSavingsSection } from "@/components/accounts/EducationSavingsSection";
import { LoanSection } from "@/components/accounts/LoanSection";
import { useToast } from "@/hooks/use-toast";

interface AccountSectionsManagerProps {
  handleAccountTypeSelected: (type: string) => void;
  handleCompleteSetup: () => void;
}

export function AccountSectionsManager({ 
  handleAccountTypeSelected,
  handleCompleteSetup
}: AccountSectionsManagerProps) {
  return (
    <div className="space-y-4">
      <AccountSection 
        icon={<CircleDollarSign className="h-5 w-5 text-primary bg-black p-1 rounded-full" />}
        title="BFO Managed"
        amount="Unable to retrieve balance"
        initiallyOpen={true}
      >
        <div className="p-4 text-center text-muted-foreground">
          <p>Complete your account setup to view managed accounts.</p>
          <Button variant="outline" className="mt-2" onClick={handleCompleteSetup}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Complete Setup
          </Button>
        </div>
      </AccountSection>

      <EducationSavingsSection onAddAccount={handleAccountTypeSelected} />

      <AccountSection 
        icon={<Landmark className="h-5 w-5 text-yellow-500 bg-black p-1 rounded-full" />}
        title="401K/457/403B Plans"
        amount="$0.00"
        initiallyOpen={false}
      >
        <EmptyAccountSection 
          message="No retirement plans linked."
          buttonText="Add Retirement Plan"
          onAddAccount={() => handleAccountTypeSelected("retirement")}
        />
      </AccountSection>

      <AccountSection 
        icon={<Briefcase className="h-5 w-5 text-green-500 bg-black p-1 rounded-full" />}
        title="External Investment"
        amount="$0.00"
        initiallyOpen={false}
      >
        <EmptyAccountSection 
          message="No external investment accounts linked."
          buttonText="Add Investment Account"
          onAddAccount={() => handleAccountTypeSelected("investment")}
        />
      </AccountSection>

      <AccountSection 
        icon={<Wallet className="h-5 w-5 text-blue-400 bg-black p-1 rounded-full" />}
        title="External Manually-Tracked"
        amount="$0.00"
        initiallyOpen={false}
      >
        <EmptyAccountSection 
          message="No manually tracked accounts added."
          buttonText="Add Manual Account"
          onAddAccount={() => handleAccountTypeSelected("manual")}
        />
      </AccountSection>

      <LoanSection onAddAccount={handleAccountTypeSelected} />

      <AccountSection 
        icon={<Building className="h-5 w-5 text-red-500 bg-black p-1 rounded-full" />}
        title="External Banking"
        amount="$0.00"
        initiallyOpen={false}
      >
        <EmptyAccountSection 
          message="No banking accounts linked."
          buttonText="Add Bank Account"
          onAddAccount={() => handleAccountTypeSelected("banking")}
        />
      </AccountSection>

      <AccountSection 
        icon={<CreditCard className="h-5 w-5 text-cyan-500 bg-black p-1 rounded-full" />}
        title="External Credit Cards"
        amount="$0.00"
        initiallyOpen={false}
      >
        <EmptyAccountSection 
          message="No credit card accounts linked."
          buttonText="Add Credit Card"
          onAddAccount={() => handleAccountTypeSelected("credit")}
        />
      </AccountSection>
    </div>
  );
}
