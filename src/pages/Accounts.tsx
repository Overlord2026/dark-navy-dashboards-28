
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { ManageFundingDialog } from "@/components/accounts/ManageFundingDialog";
import { AccountsHeader } from "@/components/accounts/AccountsHeader";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { AccountSection } from "@/components/accounts/AccountSection";
import { EmptyAccountSection } from "@/components/accounts/EmptyAccountSection";
import { useNetWorth } from "@/context/NetWorthContext";
import { PlusCircle, Wallet, TrendingUp, CreditCard, Building, Banknote, Shield } from "lucide-react";

const Accounts = () => {
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

  const { accounts = [] } = useNetWorth();

  // Group accounts by type
  const accountsByType = {
    managed: accounts.filter(acc => acc.type === 'managed') || [],
    investments: accounts.filter(acc => acc.type === 'investment') || [],
    manual: accounts.filter(acc => acc.type === 'manual') || [],
    loans: accounts.filter(acc => acc.type === 'loan') || [],
    banking: accounts.filter(acc => acc.type === 'banking') || [],
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Accounts"
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Funding Accounts Overview */}
          {fundingAccounts.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <Wallet className="mr-2 h-5 w-5 text-primary" />
                    Funding Accounts
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Transfers
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleManageFunding} className="text-xs">
                      Edit Accounts
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {fundingAccounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {account.type === 'checking' ? 
                          <Banknote className="h-4 w-4 text-primary" /> : 
                          <Wallet className="h-4 w-4 text-primary" />
                        }
                      </div>
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleManageFunding}>
                      Edit
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Account Sections Grid */}
          <div className="grid gap-6">
            {/* Managed Accounts */}
            {accountsByType.managed.length > 0 ? (
              <AccountSection
                icon={<Shield className="w-6 h-6 text-primary" />}
                title="Managed Accounts"
                amount="$0.00"
                initiallyOpen={true}
              >
                <div className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">Accounts managed by your advisor</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Account cards would go here */}
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">No managed accounts yet</p>
                    </div>
                  </div>
                </div>
              </AccountSection>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-primary" />
                    Managed Accounts
                  </CardTitle>
                  <CardDescription>Accounts managed by your advisor</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyAccountSection
                    message="Talk to your advisor about adding managed accounts"
                    buttonText="Complete Setup"
                    onAddAccount={handleCompleteSetup}
                  />
                </CardContent>
              </Card>
            )}

            {/* Investment Accounts */}
            {accountsByType.investments.length > 0 ? (
              <AccountSection
                icon={<TrendingUp className="w-6 h-6 text-primary" />}
                title="Investment Accounts"
                amount="$0.00"
              >
                <div className="p-6">
                  <p className="text-muted-foreground">Your investment and brokerage accounts</p>
                </div>
              </AccountSection>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    Investment Accounts
                  </CardTitle>
                  <CardDescription>Your investment and brokerage accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyAccountSection
                    message="To track your investments, add a new account by clicking the + button above"
                    buttonText="Add Investment Account"
                    onAddAccount={handleAddAccount}
                  />
                </CardContent>
              </Card>
            )}

            {/* Manual Accounts */}
            {accountsByType.manual.length > 0 ? (
              <AccountSection
                icon={<CreditCard className="w-6 h-6 text-primary" />}
                title="Manually-Tracked Accounts"
                amount="$0.00"
              >
                <div className="p-6">
                  <p className="text-muted-foreground">Accounts you track manually</p>
                </div>
              </AccountSection>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    Manually-Tracked Accounts
                  </CardTitle>
                  <CardDescription>Accounts you track manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyAccountSection
                    message="Add a manually-tracked account to keep tabs on accounts that can't be linked automatically"
                    buttonText="Add Manual Account"
                    onAddAccount={handleAddAccount}
                  />
                </CardContent>
              </Card>
            )}

            {/* Loan Accounts */}
            {accountsByType.loans.length > 0 ? (
              <AccountSection
                icon={<Building className="w-6 h-6 text-primary" />}
                title="Loans"
                amount="$0.00"
              >
                <div className="p-6">
                  <p className="text-muted-foreground">Your loan and debt accounts</p>
                </div>
              </AccountSection>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    Loans
                  </CardTitle>
                  <CardDescription>Your loan and debt accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyAccountSection
                    message="To track your loans, add a new account by clicking the + button above"
                    buttonText="Add Loan Account"
                    onAddAccount={handleAddAccount}
                  />
                </CardContent>
              </Card>
            )}

            {/* Banking Accounts */}
            {accountsByType.banking.length > 0 ? (
              <AccountSection
                icon={<Banknote className="w-6 h-6 text-primary" />}
                title="Banking Accounts"
                amount="$0.00"
              >
                <div className="p-6">
                  <p className="text-muted-foreground">Your checking, savings, and other banking accounts</p>
                </div>
              </AccountSection>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Banknote className="mr-2 h-5 w-5 text-primary" />
                    Banking Accounts
                  </CardTitle>
                  <CardDescription>Your checking, savings, and other banking accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyAccountSection
                    message="To track your banking accounts, add a new account by clicking the + button above"
                    buttonText="Add Banking Account"
                    onAddAccount={handleAddAccount}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <AccountLinkTypeSelector
          onSelectPlaid={handlePlaidSelected}
          onSelectManual={handleManualSelected}
          onBack={handleBackToAccounts}
        />

        <AddAccountDialog
          isOpen={showAddAccountDialog}
          onClose={() => setShowAddAccountDialog(false)}
          onAddAccount={(accountData) => console.log('Account added:', accountData)}
          accountType={selectedAccountType}
          sectionType="manual"
        />

        <PlaidLinkDialog
          isOpen={showPlaidDialog}
          onClose={() => setShowPlaidDialog(false)}
          onSuccess={handlePlaidSuccess}
        />

        <ManageFundingDialog
          isOpen={showManageFundingDialog}
          onClose={() => setShowManageFundingDialog(false)}
          accounts={fundingAccounts}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
