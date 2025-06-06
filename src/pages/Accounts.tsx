
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { AccountTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
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
        <AccountsHeader onAddAccount={handleAddAccount} />
        
        <div className="grid gap-6">
          {/* Funding Accounts Overview */}
          <FundingAccountsOverview 
            fundingAccounts={fundingAccounts}
            onManageFunding={handleManageFunding}
          />

          {/* Managed Accounts */}
          {accountsByType.managed.length > 0 ? (
            <AccountSection
              title="Managed Accounts"
              description="Accounts managed by your advisor"
              accounts={accountsByType.managed}
              type="managed"
            />
          ) : (
            <EmptyAccountSection
              title="Managed Accounts"
              description="Talk to your advisor about adding managed accounts"
              onAction={handleCompleteSetup}
              actionText="Complete Setup"
            />
          )}

          {/* Investment Accounts */}
          {accountsByType.investments.length > 0 ? (
            <AccountSection
              title="Investment Accounts"
              description="Your investment and brokerage accounts"
              accounts={accountsByType.investments}
              type="investment"
            />
          ) : (
            <EmptyAccountSection
              title="Investment Accounts"
              description="To track your investments, add a new account by clicking the + button above"
              onAction={handleAddAccount}
              actionText="Add Investment Account"
            />
          )}

          {/* Manual Accounts */}
          {accountsByType.manual.length > 0 ? (
            <AccountSection
              title="Manually-Tracked Accounts"
              description="Accounts you track manually"
              accounts={accountsByType.manual}
              type="manual"
            />
          ) : (
            <EmptyAccountSection
              title="Manually-Tracked Accounts"
              description="Add a manually-tracked account to keep tabs on accounts that can't be linked automatically"
              onAction={handleAddAccount}
              actionText="Add Manual Account"
            />
          )}

          {/* Loan Accounts */}
          {accountsByType.loans.length > 0 ? (
            <AccountSection
              title="Loans"
              description="Your loan and debt accounts"
              accounts={accountsByType.loans}
              type="loan"
            />
          ) : (
            <EmptyAccountSection
              title="Loans"
              description="To track your loans, add a new account by clicking the + button above"
              onAction={handleAddAccount}
              actionText="Add Loan Account"
            />
          )}

          {/* Banking Accounts */}
          {accountsByType.banking.length > 0 ? (
            <AccountSection
              title="Banking Accounts"
              description="Your checking, savings, and other banking accounts"
              accounts={accountsByType.banking}
              type="banking"
            />
          ) : (
            <EmptyAccountSection
              title="Banking Accounts"
              description="To track your banking accounts, add a new account by clicking the + button above"
              onAction={handleAddAccount}
              actionText="Add Banking Account"
            />
          )}
        </div>

        {/* Dialogs */}
        <AccountTypeSelector
          open={showAccountTypeSelector}
          onClose={handleBackToAccounts}
          onPlaidSelected={handlePlaidSelected}
          onManualSelected={handleManualSelected}
          onTypeSelected={handleAccountTypeSelected}
        />

        <AddAccountDialog
          open={showAddAccountDialog}
          onClose={() => setShowAddAccountDialog(false)}
          accountType={selectedAccountType}
          onBack={handleBackToAccounts}
        />

        <PlaidLinkDialog
          open={showPlaidDialog}
          onClose={() => setShowPlaidDialog(false)}
          onSuccess={handlePlaidSuccess}
          onBack={handleBackToAccounts}
        />

        <ManageFundingDialog
          open={showManageFundingDialog}
          onClose={() => setShowManageFundingDialog(false)}
          fundingAccounts={fundingAccounts}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
