
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { ManageFundingDialog } from "@/components/accounts/ManageFundingDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";

interface AccountDialogsManagerProps {
  showAccountTypeSelector: boolean;
  showAddAccountDialog: boolean;
  showPlaidDialog: boolean;
  showManageFundingDialog: boolean;
  selectedAccountType: string;
  fundingAccounts: Array<{ id: string; name: string; type: string; }>;
  onPlaidSuccess: (token: string) => void;
  onBackToAccounts: () => void;
  onPlaidSelected: () => void;
  onManualSelected: () => void;
  setShowAddAccountDialog: (show: boolean) => void;
  setShowPlaidDialog: (show: boolean) => void;
  setShowManageFundingDialog: (show: boolean) => void;
}

export function AccountDialogsManager({
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
  setShowManageFundingDialog
}: AccountDialogsManagerProps) {
  if (showAccountTypeSelector) {
    return (
      <AccountLinkTypeSelector 
        onSelectPlaid={onPlaidSelected}
        onSelectManual={onManualSelected}
        onBack={onBackToAccounts}
      />
    );
  }

  return (
    <>
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
          onSuccess={onPlaidSuccess}
        />
      )}

      {showManageFundingDialog && (
        <ManageFundingDialog
          isOpen={showManageFundingDialog}
          onClose={() => setShowManageFundingDialog(false)}
          accounts={fundingAccounts}
        />
      )}
    </>
  );
}
