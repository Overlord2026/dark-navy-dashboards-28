
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <AccountsHeader 
          onAddAccount={handleAddAccount} 
          onManageFunding={handleManageFunding}
        />
        
        <div className="grid gap-6">
          {/* Funding Accounts Overview */}
          <FundingAccountsOverview 
            accounts={fundingAccounts}
            onManageFunding={handleManageFunding}
          />

          {/* Managed Accounts */}
          {accountsByType.managed.length > 0 ? (
            <AccountSection
              icon={<div className="w-6 h-6 bg-primary rounded" />}
              title="Managed Accounts"
              amount="$0.00"
            >
              <div className="p-4">
                <p className="text-muted-foreground">Accounts managed by your advisor</p>
              </div>
            </AccountSection>
          ) : (
            <EmptyAccountSection
              message="Talk to your advisor about adding managed accounts"
              buttonText="Complete Setup"
              onAddAccount={handleCompleteSetup}
            />
          )}

          {/* Investment Accounts */}
          {accountsByType.investments.length > 0 ? (
            <AccountSection
              icon={<div className="w-6 h-6 bg-primary rounded" />}
              title="Investment Accounts"
              amount="$0.00"
            >
              <div className="p-4">
                <p className="text-muted-foreground">Your investment and brokerage accounts</p>
              </div>
            </AccountSection>
          ) : (
            <EmptyAccountSection
              message="To track your investments, add a new account by clicking the + button above"
              buttonText="Add Investment Account"
              onAddAccount={handleAddAccount}
            />
          )}

          {/* Manual Accounts */}
          {accountsByType.manual.length > 0 ? (
            <AccountSection
              icon={<div className="w-6 h-6 bg-primary rounded" />}
              title="Manually-Tracked Accounts"
              amount="$0.00"
            >
              <div className="p-4">
                <p className="text-muted-foreground">Accounts you track manually</p>
              </div>
            </AccountSection>
          ) : (
            <EmptyAccountSection
              message="Add a manually-tracked account to keep tabs on accounts that can't be linked automatically"
              buttonText="Add Manual Account"
              onAddAccount={handleAddAccount}
            />
          )}

          {/* Loan Accounts */}
          {accountsByType.loans.length > 0 ? (
            <AccountSection
              icon={<div className="w-6 h-6 bg-primary rounded" />}
              title="Loans"
              amount="$0.00"
            >
              <div className="p-4">
                <p className="text-muted-foreground">Your loan and debt accounts</p>
              </div>
            </AccountSection>
          ) : (
            <EmptyAccountSection
              message="To track your loans, add a new account by clicking the + button above"
              buttonText="Add Loan Account"
              onAddAccount={handleAddAccount}
            />
          )}

          {/* Banking Accounts */}
          {accountsByType.banking.length > 0 ? (
            <AccountSection
              icon={<div className="w-6 h-6 bg-primary rounded" />}
              title="Banking Accounts"
              amount="$0.00"
            >
              <div className="p-4">
                <p className="text-muted-foreground">Your checking, savings, and other banking accounts</p>
              </div>
            </AccountSection>
          ) : (
            <EmptyAccountSection
              message="To track your banking accounts, add a new account by clicking the + button above"
              buttonText="Add Banking Account"
              onAddAccount={handleAddAccount}
            />
          )}
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
