
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
  Wallet,
  ArrowLeft,
  Landmark,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AccountSection } from "@/components/accounts/AccountSection";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { useToast } from "@/hooks/use-toast";
import { ManageFundingDialog } from "@/components/accounts/ManageFundingDialog";
import { Link } from "react-router-dom";

const Accounts = () => {
  const { toast } = useToast();
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [showPlaidDialog, setShowPlaidDialog] = useState(false);
  const [showManageFundingDialog, setShowManageFundingDialog] = useState(false);
  
  // Sample linked funding accounts - in a real app, this would come from an API
  const fundingAccounts = [
    { id: "fa1", name: "Chase Checking ****4582", type: "checking" },
    { id: "fa2", name: "Bank of America Savings ****7839", type: "savings" },
  ];

  const handleAddAccount = () => {
    setShowAccountTypeSelector(true);
  };

  const handleAccountTypeSelected = (type: string) => {
    setSelectedAccountType(type);
    setShowAddAccountDialog(true);
  };

  const handlePlaidSelected = () => {
    setShowAccountTypeSelector(false);
    setShowPlaidDialog(true);
  };

  const handleManualSelected = () => {
    setShowAccountTypeSelector(false);
    setShowAddAccountDialog(true);
    setSelectedAccountType("manual");
  };

  const handlePlaidSuccess = (linkToken: string) => {
    console.log("Plaid link successful with token:", linkToken);
    toast({
      title: "Account Linked",
      description: "Your accounts have been successfully linked via Plaid"
    });
  };

  const handleBackToAccounts = () => {
    setShowAccountTypeSelector(false);
    setShowAddAccountDialog(false);
    setShowPlaidDialog(false);
  };

  const handleManageFunding = () => {
    setShowManageFundingDialog(true);
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Accounts</h1>
            <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
          </div>
          <div className="space-x-3">
            <Button onClick={handleManageFunding} variant="outline">
              <Wallet className="mr-2 h-4 w-4" />
              Manage Funding
            </Button>
            <Button onClick={handleAddAccount}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Funding Accounts Quick View */}
        {fundingAccounts.length > 0 && (
          <div className="p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Funding Accounts
              </h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/cash-management?tab=funding">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Transfers
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleManageFunding}>
                  Edit Accounts
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {fundingAccounts.map(account => (
                <div key={account.id} className="flex justify-between items-center p-2 border rounded bg-card">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-primary/10 rounded-full mr-3">
                      {account.type === 'checking' ? 
                        <Banknote className="h-4 w-4 text-primary" /> : 
                        <Wallet className="h-4 w-4 text-primary" />
                      }
                    </div>
                    <span>{account.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleManageFunding()}>
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <AccountSection 
            icon={<CircleDollarSign className="h-5 w-5 text-primary bg-black p-1 rounded-full" />}
            title="BFO Managed"
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
            icon={<Landmark className="h-5 w-5 text-yellow-500 bg-black p-1 rounded-full" />}
            title="401K/457/403B Plans"
            amount="$0.00"
            initiallyOpen={false}
          >
            <div className="p-4 text-center text-muted-foreground">
              <p>No retirement plans linked.</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAccountTypeSelected("retirement")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Retirement Plan
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
