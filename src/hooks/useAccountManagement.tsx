
import { useState, useEffect } from "react";
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
  isPrimary?: boolean;
}

const STORAGE_KEY = "fundingAccounts";

export function useAccountManagement() {
  const { toast } = useToast();
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showPlaidDialog, setShowPlaidDialog] = useState(false);
  const [showManageFundingDialog, setShowManageFundingDialog] = useState(false);
  
  // Funding accounts state management
  const [fundingAccounts, setFundingAccounts] = useState<FundingAccount[]>([]);

  // Load funding accounts from storage on component mount
  useEffect(() => {
    const storedAccounts = localStorage.getItem(STORAGE_KEY);
    if (storedAccounts) {
      try {
        setFundingAccounts(JSON.parse(storedAccounts));
      } catch (e) {
        console.error("Failed to parse stored funding accounts:", e);
      }
    } else {
      // Default accounts if none are stored
      const defaultAccounts = [
        { id: "fa1", name: "Chase Checking ****4582", type: "checking", isPrimary: true },
        { id: "fa2", name: "Bank of America Savings ****7839", type: "savings", isPrimary: false },
      ];
      setFundingAccounts(defaultAccounts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
    }
  }, []);

  // Save accounts to local storage when they change
  useEffect(() => {
    if (fundingAccounts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fundingAccounts));
    }
  }, [fundingAccounts]);

  // Add a new funding account
  const addFundingAccount = (account: Omit<FundingAccount, "id">) => {
    const newAccount = {
      ...account,
      id: `fa${Date.now()}`, // Generate a unique ID
      isPrimary: fundingAccounts.length === 0 // Make first account primary by default
    };
    
    setFundingAccounts(prev => [...prev, newAccount]);
    
    toast({
      title: "Account Added",
      description: `${account.name} has been added as a funding source`
    });
    
    return newAccount;
  };

  // Remove a funding account
  const removeFundingAccount = (id: string) => {
    const accountToRemove = fundingAccounts.find(acc => acc.id === id);
    if (!accountToRemove) return false;
    
    const wasPrimary = accountToRemove.isPrimary;
    
    setFundingAccounts(prev => {
      const filtered = prev.filter(acc => acc.id !== id);
      
      // If we removed the primary account, set a new primary
      if (wasPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true;
      }
      
      return filtered;
    });
    
    toast({
      title: "Account Removed",
      description: `${accountToRemove.name} has been removed from your funding sources`
    });
    
    return true;
  };

  // Set an account as primary
  const setPrimaryFundingAccount = (id: string) => {
    const exists = fundingAccounts.some(acc => acc.id === id);
    if (!exists) return false;
    
    setFundingAccounts(prev => 
      prev.map(acc => ({
        ...acc,
        isPrimary: acc.id === id
      }))
    );
    
    const account = fundingAccounts.find(acc => acc.id === id);
    toast({
      title: "Primary Account Set",
      description: `${account?.name} is now your primary funding source`
    });
    
    return true;
  };

  const handleAddAccount = () => {
    setShowAccountTypeSelector(true);
  };

  const handleAccountTypeSelected = (type: string) => {
    setSelectedAccountType(type);
    if (type === "education") {
      toast({
        title: "Education Savings Account",
        description: "Choose from 529 Plans, ESA, UGMA/UTMA, or Prepaid Tuition accounts",
        duration: 5000,
      });
    }
    setShowAddAccountDialog(true);
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
    showPlaidDialog,
    showManageFundingDialog,
    fundingAccounts,
    
    // Funding account actions
    addFundingAccount,
    removeFundingAccount,
    setPrimaryFundingAccount,
    
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
    setShowPlaidDialog,
    setShowManageFundingDialog
  };
}
