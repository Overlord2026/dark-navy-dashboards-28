
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBankAccounts } from "@/context/BankAccountsContext";

// Types
export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  isSelected?: boolean;
  institution?: string;
}

export interface FundingAccount {
  id: string;
  name: string;
  type: string;
}

export function useAccountManagement() {
  const { toast } = useToast();
  const { addPlaidAccounts } = useBankAccounts();
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showAddAccountTypeDialog, setShowAddAccountTypeDialog] = useState(false);
  const [showPlaidDialog, setShowPlaidDialog] = useState(false);
  const [showManageFundingDialog, setShowManageFundingDialog] = useState(false);
  const [showAddDigitalAssetDialog, setShowAddDigitalAssetDialog] = useState(false);
  const [showAddOtherAssetDialog, setShowAddOtherAssetDialog] = useState(false);
  const [showAddPrivateEquityDialog, setShowAddPrivateEquityDialog] = useState(false);
  const [showAddPublicStockDialog, setShowAddPublicStockDialog] = useState(false);
  const [showAddRealEstateDialog, setShowAddRealEstateDialog] = useState(false);
  const [showAddInvestmentAccountDialog, setShowAddInvestmentAccountDialog] = useState(false);
  const [showAddRetirementPlanDialog, setShowAddRetirementPlanDialog] = useState(false);
  const [showAddBankAccountDialog, setShowAddBankAccountDialog] = useState(false);
  
  // Sample linked funding accounts - in a real app, this would come from an API
  const fundingAccounts = [
    { id: "fa1", name: "Chase Checking ****4582", type: "checking" },
    { id: "fa2", name: "Bank of America Savings ****7839", type: "savings" },
  ];

  const handleAddAccount = () => {
    setShowAddAccountTypeDialog(true);
  };

  const handleAccountTypeSelected = (type: string) => {
    setSelectedAccountType(type);
    console.log(`Account type selected: ${type}`);
    
    if (type === 'bank') {
      // Show the account link type selector for bank accounts
      setShowAddAccountTypeDialog(false);
      setShowAccountTypeSelector(true);
    } else if (type === 'digital-assets') {
      // Show the digital assets form
      setShowAddAccountTypeDialog(false);
      setShowAddDigitalAssetDialog(true);
    } else if (type === 'other-assets') {
      // Show the other assets form
      setShowAddAccountTypeDialog(false);
      setShowAddOtherAssetDialog(true);
    } else if (type === 'private-equity') {
      // Show the private equity form
      setShowAddAccountTypeDialog(false);
      setShowAddPrivateEquityDialog(true);
    } else if (type === 'public-stock') {
      setShowAddAccountTypeDialog(false);
      setShowAddPublicStockDialog(true);
    } else if (type === 'real-estate') {
      setShowAddAccountTypeDialog(false);
      setShowAddRealEstateDialog(true);
    } else if (type === 'investment') {
      setShowAddAccountTypeDialog(false);
      setShowAddInvestmentAccountDialog(true);
    } else if (type === 'retirement-plan') {
      setShowAddAccountTypeDialog(false);
      setShowAddRetirementPlanDialog(true);
    } else {
      // For other account types, show toast for now
      toast({
        title: "Account Type Selected",
        description: `You selected: ${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
      });
      setShowAddAccountTypeDialog(false);
    }
  };

  const handlePlaidSelected = () => {
    console.log("useAccountManagement: Plaid selected, opening Plaid dialog");
    setShowAccountTypeSelector(false);
    setShowPlaidDialog(true);
  };

  const handleManualSelected = () => {
    setShowAccountTypeSelector(false);
    setShowAddBankAccountDialog(true);
    setSelectedAccountType("manual");
  };

  const handlePlaidSuccess = async (publicToken: string) => {
    console.log("useAccountManagement: Plaid success callback triggered with token:", publicToken?.substring(0, 20) + '...');
    console.log("useAccountManagement: Starting account exchange process...");
    
    try {
      const success = await addPlaidAccounts(publicToken);
      console.log("useAccountManagement: addPlaidAccounts result:", success);
      
      if (success) {
        console.log("useAccountManagement: Successfully added Plaid accounts, closing dialogs");
        // Reset dialog states
        setShowPlaidDialog(false);
        setShowAccountTypeSelector(false);
        
        // Show success message
        toast({
          title: "Success!",
          description: "Your bank accounts have been successfully linked.",
        });
      } else {
        console.error("useAccountManagement: Failed to add Plaid accounts");
        toast({
          title: "Connection Failed",
          description: "Failed to link your accounts. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("useAccountManagement: Error in handlePlaidSuccess:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while linking your accounts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBackToAccounts = () => {
    setShowAccountTypeSelector(false);
    setShowAddAccountDialog(false);
    setShowPlaidDialog(false);
  };

  const handleBackToAccountTypes = () => {
    setShowAccountTypeSelector(false);
    setShowAddAccountDialog(false);
    setShowAddDigitalAssetDialog(false);
    setShowAddOtherAssetDialog(false);
    setShowAddPrivateEquityDialog(false);
    setShowAddPublicStockDialog(false);
    setShowAddRealEstateDialog(false);
    setShowAddInvestmentAccountDialog(false);
    setShowAddRetirementPlanDialog(false);
    setShowAddBankAccountDialog(false);
    setShowAddAccountTypeDialog(true);
  };

  const handleManageFunding = () => {
    setShowManageFundingDialog(true);
  };

  const handleCompleteSetup = () => {
    toast({
      title: "Setup Required",
      description: "Redirecting to complete your account setup process"
    });
    // In a real app, this would redirect to the setup flow
  };

  return {
    // State
    selectedAccountType,
    showAccountTypeSelector,
    showAddAccountDialog,
    showAddAccountTypeDialog,
    showPlaidDialog,
    showManageFundingDialog,
    showAddDigitalAssetDialog,
    showAddOtherAssetDialog,
    showAddPrivateEquityDialog,
    showAddPublicStockDialog,
    showAddRealEstateDialog,
    showAddInvestmentAccountDialog,
    showAddRetirementPlanDialog,
    showAddBankAccountDialog,
    fundingAccounts,
    
    // Actions
    handleAddAccount,
    handleAccountTypeSelected,
    handlePlaidSelected,
    handleManualSelected,
    handlePlaidSuccess,
    handleBackToAccounts,
    handleBackToAccountTypes,
    handleManageFunding,
    handleCompleteSetup,
    setShowAddAccountDialog,
    setShowAddAccountTypeDialog,
    setShowPlaidDialog,
    setShowManageFundingDialog,
    setShowAccountTypeSelector,
    setShowAddDigitalAssetDialog,
    setShowAddOtherAssetDialog,
    setShowAddPrivateEquityDialog,
    setShowAddPublicStockDialog,
    setShowAddRealEstateDialog,
    setShowAddInvestmentAccountDialog,
    setShowAddRetirementPlanDialog,
    setShowAddBankAccountDialog
  };
}
