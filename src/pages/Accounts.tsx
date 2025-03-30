
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  ChevronUp, 
  ChevronDown, 
  CircleDollarSign, 
  Briefcase, 
  ExternalLink, 
  PlusCircle,
  CreditCard,
  Banknote,
  Building,
  Home,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AccountSection } from "@/components/accounts/AccountSection";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";

const Accounts = () => {
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  
  const handleAddAccount = () => {
    setShowAddAccountDialog(true);
  };

  const handleAccountTypeSelected = (type: string) => {
    setSelectedAccountType(type);
    setShowAddAccountDialog(true);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Accounts"
    >
      <div className="min-h-screen animate-fade-in space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Accounts</h1>
            <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
          </div>
          <Button onClick={handleAddAccount}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="space-y-4">
          <AccountSection 
            icon={<CircleDollarSign className="h-5 w-5 text-primary bg-black p-1 rounded-full" />}
            title="Farther Managed"
            amount="Unable to retrieve balance"
            initiallyOpen={true}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>Complete your account setup to view managed accounts.</p>
              <Button variant="outline" className="mt-2">
                <ExternalLink className="mr-2 h-4 w-4" />
                Complete Setup
              </Button>
            </div>
          </AccountSection>

          <AccountSection 
            icon={<Briefcase className="h-5 w-5 text-green-500 bg-black p-1 rounded-full" />}
            title="External Investment"
            amount="$0.00"
            initiallyOpen={false}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>No external investment accounts linked.</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAccountTypeSelected("investment")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Investment Account
              </Button>
            </div>
          </AccountSection>

          <AccountSection 
            icon={<Wallet className="h-5 w-5 text-blue-400 bg-black p-1 rounded-full" />}
            title="External Manually-Tracked"
            amount="$0.00"
            initiallyOpen={false}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>No manually tracked accounts added.</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAccountTypeSelected("manual")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Manual Account
              </Button>
            </div>
          </AccountSection>

          <AccountSection 
            icon={<CreditCard className="h-5 w-5 text-purple-500 bg-black p-1 rounded-full" />}
            title="External Loans"
            amount="$0.00"
            initiallyOpen={false}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>No loan accounts linked.</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAccountTypeSelected("loan")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </div>
          </AccountSection>

          <AccountSection 
            icon={<Building className="h-5 w-5 text-red-500 bg-black p-1 rounded-full" />}
            title="External Banking"
            amount="$0.00"
            initiallyOpen={false}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>No banking accounts linked.</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAccountTypeSelected("banking")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Bank Account
              </Button>
            </div>
          </AccountSection>

          <AccountSection 
            icon={<CreditCard className="h-5 w-5 text-cyan-500 bg-black p-1 rounded-full" />}
            title="External Credit Cards"
            amount="$0.00"
            initiallyOpen={false}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>No credit card accounts linked.</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAccountTypeSelected("credit")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Credit Card
              </Button>
            </div>
          </AccountSection>
        </div>

        {showAddAccountDialog && (
          <AddAccountDialog 
            isOpen={showAddAccountDialog}
            onClose={() => setShowAddAccountDialog(false)}
            onAddAccount={() => {
              setShowAddAccountDialog(false);
            }}
            accountType={selectedAccountType || "Account"}
            sectionType={selectedAccountType || "General"}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
