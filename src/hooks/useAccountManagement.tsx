
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showAddAccountTypeDialog, setShowAddAccountTypeDialog] = useState(false);
  const [showPlaidDialog, setShowPlaidDialog] = useState(false);
  const [showManageFundingDialog, setShowManageFundingDialog] = useState(false);
  
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
    setShowAddAccountTypeDialog(false);
    
    // If Bank Account is selected, show the account type selector
    if (type === 'bank') {
      setShowAccountTypeSelector(true);
    } else {
      console.log(`Account type selected: ${type}`);
      toast({
        title: "Account Type Selected",
        description: `You selected: ${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
      });
      // Here you could navigate to a specific form or open another dialog based on the type
    }
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
    fundingAccounts,
    
    // Actions
    handleAddAccount,
    handleAccountTypeSelected,
    handlePlaidSelected,
    handleManualSelected,
    handlePlaidSuccess,
    handleBackToAccounts,
    handleManageFunding,
    handleCompleteSetup,
    setShowAddAccountDialog,
    setShowAddAccountTypeDialog,
    setShowPlaidDialog,
    setShowManageFundingDialog,
    setShowAccountTypeSelector
  };
}
