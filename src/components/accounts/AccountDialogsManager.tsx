import { useState } from "react";
import { ManageFundingDialog } from "@/components/accounts/ManageFundingDialog";
import { FundingAccount } from "@/hooks/useAccountManagement";

interface AccountDialogsManagerProps {
  showAccountTypeSelector: boolean;
  showAddAccountDialog: boolean;
  showPlaidDialog: boolean;
  showManageFundingDialog: boolean;
  selectedAccountType: string;
  fundingAccounts: FundingAccount[];
  onPlaidSuccess: (linkToken: string) => void;
  onBackToAccounts: () => void;
  onPlaidSelected: () => void;
  onManualSelected: () => void;
  setShowAddAccountDialog: (show: boolean) => void;
  setShowPlaidDialog: (show: boolean) => void;
  setShowManageFundingDialog: (show: boolean) => void;
  onAddFundingAccount: (account: Omit<FundingAccount, "id">) => FundingAccount;
  onRemoveFundingAccount: (id: string) => boolean;
  onSetPrimaryFundingAccount: (id: string) => boolean;
}

export const AccountDialogsManager = ({
  showAccountTypeSelector,
  showAddAccountDialog,
  showPlaidDialog,
  showManageFundingDialog,
  selectedAccountType,
  fundingAccounts,
  onPlaidSuccess,
  onBackToAccounts,
  onPlaidSelected,
  onManualSelected,
  setShowAddAccountDialog,
  setShowPlaidDialog,
  setShowManageFundingDialog,
  onAddFundingAccount,
  onRemoveFundingAccount,
  onSetPrimaryFundingAccount
}: AccountDialogsManagerProps) => {
  // Add any additional state or logic specific to managing account dialogs if needed
  
  return (
    <>
      {/* Placeholder for account type selector dialog */}
      {/* Placeholder for add account dialog */}
      {/* Placeholder for Plaid connection dialog */}
      
      {/* Manage Funding Dialog */}
      <ManageFundingDialog
        isOpen={showManageFundingDialog}
        onClose={() => setShowManageFundingDialog(false)}
        accounts={fundingAccounts}
        onAddAccount={onAddFundingAccount}
        onRemoveAccount={onRemoveFundingAccount}
        onSetPrimary={onSetPrimaryFundingAccount}
      />
    </>
  );
};
