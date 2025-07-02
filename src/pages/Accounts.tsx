import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Shield, TrendingUp, CreditCard, Building, Banknote, Wallet, Coins, AlertTriangle } from "lucide-react";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { CollapsibleCard } from "@/components/accounts/CollapsibleCard";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { useDigitalAssets } from "@/hooks/useDigitalAssets";
import { useSupabaseLiabilities } from "@/hooks/useSupabaseLiabilities";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AddAccountTypeDialog } from "@/components/accounts/AddAccountTypeDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { AddDigitalAssetDialog } from "@/components/accounts/AddDigitalAssetDialog";
import { DigitalAssetsTable } from "@/components/accounts/DigitalAssetsTable";
import { AddLiabilityDialog } from "@/components/liabilities/AddLiabilityDialog";
import { LiabilitiesList } from "@/components/liabilities/LiabilitiesList";
import { AddOtherAssetDialog } from "@/components/assets/AddOtherAssetDialog";

const Accounts = () => {
  const { 
    fundingAccounts, 
    handleManageFunding, 
    handleCompleteSetup,
    handleAddAccount,
    handleAccountTypeSelected,
    handlePlaidSelected,
    handleManualSelected,
    handleBackToAccountTypes,
    showAddAccountTypeDialog,
    showAccountTypeSelector,
    showAddDigitalAssetDialog,
    setShowAddAccountTypeDialog,
    setShowAccountTypeSelector,
    setShowAddDigitalAssetDialog,
    setShowAddOtherAssetDialog,
    setShowAddOtherAssetDialog: setShowAddOtherAssetDialogProp
  } = useAccountManagement();
  
  const { getFormattedTotalValue, loading: digitalAssetsLoading } = useDigitalAssets();
  const { getTotalLiabilities, refreshLiabilities } = useSupabaseLiabilities();
  const isMobile = useIsMobile();

  // Add state for liability dialog
  const [showAddLiabilityDialog, setShowAddLiabilityDialog] = React.useState(false);

  // Add state for other asset dialog
  const [showAddOtherAssetDialog, setShowAddOtherAssetDialog] = React.useState(false);

  const handleAddAccountType = (type: string) => {
    if (type === 'liability' || type === 'Liability') {
      setShowAddAccountTypeDialog(false); // Close the account type dialog first
      setShowAddLiabilityDialog(true);
    } else {
      console.log(`Add ${type} clicked`);
    }
  };

  // Update the handleAccountTypeSelected to handle liability and other assets properly
  const handleAccountTypeSelectedWithLiability = (type: string) => {
    if (type === 'liability') {
      setShowAddAccountTypeDialog(false);
      setShowAddLiabilityDialog(true);
    } else if (type === 'other-assets') {
      setShowAddAccountTypeDialog(false);
      setShowAddOtherAssetDialog(true);
    } else {
      handleAccountTypeSelected(type);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Account Overview"
    >
      <div className={cn(
        "container mx-auto max-w-7xl space-y-6",
        isMobile ? "px-3 py-4" : "px-4 py-6"
      )}>
        {/* Header Section */}
        <div className={cn(
          "flex gap-4 pb-6 border-b border-border",
          isMobile ? "flex-col items-start" : "flex-col sm:flex-row sm:items-center sm:justify-between"
        )}>
          <div className="space-y-2">
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-sm" : "text-base"
            )}>Manage all your financial accounts in one place</p>
          </div>
          <div className={cn(
            "flex gap-3",
            isMobile ? "w-full flex-col" : "flex-row"
          )}>
            <Button 
              onClick={handleManageFunding} 
              variant="outline"
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <Wallet className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Manage Funding
            </Button>
            <Button 
              onClick={handleAddAccount}
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Account
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          {/* Funding Accounts Section */}
          <FundingAccountsOverview 
            accounts={fundingAccounts} 
            onManageFunding={handleManageFunding} 
          />

          {/* BFO Managed */}
          <CollapsibleCard
            icon={<Shield className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="BFO Managed"
            amount="$0.00"
            description="Complete your account setup to view managed accounts."
          >
            <Button 
              onClick={handleCompleteSetup} 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              Complete Setup
            </Button>
          </CollapsibleCard>

          {/* 401K/457/403B Plans */}
          <CollapsibleCard
            icon={<TrendingUp className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="401K/457/403B Plans"
            amount="$0.00"
            description="Track and manage your retirement accounts"
          >
            <RetirementAccountTracker />
          </CollapsibleCard>

          {/* Investment */}
          <CollapsibleCard
            icon={<TrendingUp className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Investment"
            amount="$0.00"
            description="No investment accounts linked."
          >
            <Button 
              onClick={() => handleAddAccountType('Investment Account')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Investment Account
            </Button>
          </CollapsibleCard>

          {/* Manually-Tracked */}
          <CollapsibleCard
            icon={<CreditCard className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Manually-Tracked"
            amount="$0.00"
            description="No manually tracked accounts added."
          >
            <Button 
              onClick={() => handleAddAccountType('Manual Account')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Manual Account
            </Button>
          </CollapsibleCard>

          {/* Banking */}
          <CollapsibleCard
            icon={<Banknote className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Banking"
            amount="$0.00"
            description="No banking accounts linked."
          >
            <Button 
              onClick={() => handleAddAccountType('Bank Account')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Bank Account
            </Button>
          </CollapsibleCard>

          {/* Credit Cards */}
          <CollapsibleCard
            icon={<CreditCard className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Credit Cards"
            amount="$0.00"
            description="No credit card accounts linked."
          >
            <Button 
              onClick={() => handleAddAccountType('Credit Card')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Credit Card
            </Button>
          </CollapsibleCard>

          {/* Digital Assets */}
          <CollapsibleCard
            icon={<Coins className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Digital Assets"
            amount={digitalAssetsLoading ? "Loading..." : getFormattedTotalValue()}
            description="Track your cryptocurrency and digital asset holdings."
          >
            <div className="space-y-4">
              <DigitalAssetsTable />
              <Button 
                onClick={() => handleAccountTypeSelected('digital-assets')} 
                variant="outline" 
                className={cn(
                  isMobile ? "w-full text-sm" : "w-full sm:w-auto"
                )}
              >
                <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                Add Digital Asset
              </Button>
            </div>
          </CollapsibleCard>

          {/* Liability */}
          <CollapsibleCard
            icon={<AlertTriangle className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Liability"
            amount={formatCurrency(getTotalLiabilities())}
            description="Track your debts and liabilities."
          >
            <div className="space-y-4">
              <LiabilitiesList />
              <Button 
                onClick={() => handleAddAccountType('Liability')} 
                variant="outline" 
                className={cn(
                  isMobile ? "w-full text-sm" : "w-full sm:w-auto"
                )}
              >
                <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                Add Liability
              </Button>
            </div>
          </CollapsibleCard>
        </div>
      </div>

      {/* Add Account Type Dialog */}
      <AddAccountTypeDialog 
        open={showAddAccountTypeDialog}
        onOpenChange={setShowAddAccountTypeDialog}
        onAccountTypeSelect={handleAccountTypeSelectedWithLiability}
      />

      {/* Account Link Type Selector Dialog */}
      {showAccountTypeSelector && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={cn(
            "bg-background rounded-lg shadow-lg w-full p-6",
            isMobile ? "max-w-sm mx-4" : "max-w-md"
          )}>
            <AccountLinkTypeSelector
              onSelectPlaid={handlePlaidSelected}
              onSelectManual={handleManualSelected}
              onBack={handleBackToAccountTypes}
            />
          </div>
        </div>
      )}

      {/* Add Digital Asset Dialog */}
      <AddDigitalAssetDialog
        open={showAddDigitalAssetDialog}
        onOpenChange={setShowAddDigitalAssetDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Liability Dialog */}
      <AddLiabilityDialog
        open={showAddLiabilityDialog}
        onOpenChange={setShowAddLiabilityDialog}
        onLiabilityAdded={refreshLiabilities}
      />

      {/* Add Other Asset Dialog */}
      <AddOtherAssetDialog
        open={showAddOtherAssetDialog}
        onOpenChange={setShowAddOtherAssetDialog}
      />
    </ThreeColumnLayout>
  );
};

export default Accounts;
