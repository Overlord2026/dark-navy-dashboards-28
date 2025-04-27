
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AccountsHeader } from "@/components/accounts/AccountsHeader";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { AccountSectionsManager } from "@/components/accounts/AccountSectionsManager";
import { AccountDialogsManager } from "@/components/accounts/AccountDialogsManager";
import { useAccountManagement } from "@/hooks/useAccountManagement";

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

        <FundingAccountsOverview 
          accounts={fundingAccounts}
          onManageFunding={handleManageFunding}
        />

        <AccountDialogsManager 
          showAccountTypeSelector={showAccountTypeSelector}
          showAddAccountDialog={showAddAccountDialog}
          showPlaidDialog={showPlaidDialog}
          showManageFundingDialog={showManageFundingDialog}
          selectedAccountType={selectedAccountType}
          fundingAccounts={fundingAccounts}
          onPlaidSuccess={handlePlaidSuccess}
          onBackToAccounts={handleBackToAccounts}
          onPlaidSelected={handlePlaidSelected}
          onManualSelected={handleManualSelected}
          setShowAddAccountDialog={setShowAddAccountDialog}
          setShowPlaidDialog={setShowPlaidDialog}
          setShowManageFundingDialog={setShowManageFundingDialog}
        />

        {!showAccountTypeSelector && (
          <AccountSectionsManager 
            handleAccountTypeSelected={handleAccountTypeSelected}
            handleCompleteSetup={handleCompleteSetup}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
