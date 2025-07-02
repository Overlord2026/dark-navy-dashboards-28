
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Shield, TrendingUp, CreditCard, Building, Banknote, Wallet, Coins } from "lucide-react";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { CollapsibleCard } from "@/components/accounts/CollapsibleCard";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AddAccountTypeDialog } from "@/components/accounts/AddAccountTypeDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { AddDigitalAssetDialog } from "@/components/accounts/AddDigitalAssetDialog";

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
    setShowAddDigitalAssetDialog
  } = useAccountManagement();
  const isMobile = useIsMobile();

  const handleAddAccountType = (type: string) => {
    console.log(`Add ${type} clicked`);
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

          {/* Loans */}
          <CollapsibleCard
            icon={<Building className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Loans"
            amount="$0.00"
            description="No loan accounts linked."
          >
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block font-medium mb-2",
                  isMobile ? "text-sm" : "text-sm"
                )}>Loan Type</label>
                <Select defaultValue="mortgage">
                  <SelectTrigger className={cn(
                    isMobile ? "w-full text-sm" : "w-full sm:w-48"
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleAddAccountType('Loan')} 
                variant="outline" 
                className={cn(
                  isMobile ? "w-full text-sm" : "w-full sm:w-auto"
                )}
              >
                <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                Add Loan
              </Button>
            </div>
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
            amount="$0.00"
            description="No digital assets added."
          >
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
          </CollapsibleCard>
        </div>
      </div>

      {/* Add Account Type Dialog */}
      <AddAccountTypeDialog 
        open={showAddAccountTypeDialog}
        onOpenChange={setShowAddAccountTypeDialog}
        onAccountTypeSelect={handleAccountTypeSelected}
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
    </ThreeColumnLayout>
  );
};

export default Accounts;
