
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  CircleDollarSign, 
  Briefcase, 
  ExternalLink, 
  CreditCard,
  Building,
  Home,
  Landmark,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AccountSection } from "@/components/accounts/AccountSection";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { ManageFundingDialog } from "@/components/accounts/ManageFundingDialog";
import { useToast } from "@/hooks/use-toast";
import { EmptyAccountSection } from "@/components/accounts/EmptyAccountSection";
import { AccountsHeader } from "@/components/accounts/AccountsHeader";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { LoanSection } from "@/components/accounts/LoanSection";
import { useAccountManagement } from "@/hooks/useAccountManagement";

const Accounts = () => {
  const { toast } = useToast();
  const [loanType, setLoanType] = useState("mortgage");
  
  // Use the custom hook for account management
  const {
    selectedAccountType,
    showAccountTypeSelector,
    showAddAccountDialog,
    showPlaidDialog,
    showManageFundingDialog,
    fundingAccounts,
    handleAddAccount,
    handleAccountTypeSelected,
    handlePlaidSelected,
    handleManualSelected,
    handlePlaidSuccess,
    handleBackToAccounts,
    handleManageFunding,
    handleCompleteSetup,
    setShowAddAccountDialog,
    setShowPlaidDialog,
    setShowManageFundingDialog
  } = useAccountManagement();

  if (showAccountTypeSelector) {
    return (
      <ThreeColumnLayout
        activeMainItem="accounts"
        title="Add Account"
      >
        <AccountLinkTypeSelector 
          onSelectPlaid={handlePlaidSelected}
          onSelectManual={handleManualSelected}
          onBack={handleBackToAccounts}
        />
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Accounts"
    >
      <div className="min-h-screen animate-fade-in space-y-6 p-4">
        <AccountsHeader 
          onAddAccount={handleAddAccount} 
          onManageFunding={handleManageFunding} 
        />

        {/* Funding Accounts Quick View */}
        <FundingAccountsOverview 
          accounts={fundingAccounts}
          onManageFunding={handleManageFunding}
        />

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

        {showAddAccountDialog && (
          <AddAccountDialog 
            isOpen={showAddAccountDialog}
            onClose={() => setShowAddAccountDialog(false)}
            onAddAccount={() => {
              setShowAddAccountDialog(false);
              toast({
                title: "Account Added",
                description: "Your account has been successfully added"
              });
            }}
            accountType={selectedAccountType || "Account"}
            sectionType={selectedAccountType || "General"}
          />
        )}

        {showPlaidDialog && (
          <PlaidLinkDialog
            isOpen={showPlaidDialog}
            onClose={() => setShowPlaidDialog(false)}
            onSuccess={handlePlaidSuccess}
          />
        )}

        {showManageFundingDialog && (
          <ManageFundingDialog
            isOpen={showManageFundingDialog}
            onClose={() => setShowManageFundingDialog(false)}
            accounts={fundingAccounts}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
