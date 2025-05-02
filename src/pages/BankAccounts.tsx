
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BankAccountForm } from "@/components/accounts/BankAccountForm";
import { AccountSuggestionsPanel } from "@/components/accounts/AccountSuggestionsPanel";
import { BankAccount } from "@/types/accounts";
import { notifyAdvisor } from "@/services/advisorNotifier";
import { toast } from "sonner";

const BankAccounts: React.FC = () => {
  const [isNotifying, setIsNotifying] = useState(false);
  
  const handleNotifyAdvisor = async (accounts: BankAccount[]): Promise<void> => {
    setIsNotifying(true);
    
    try {
      // Format account data for the notification
      const payload = {
        accounts: accounts.map(account => ({
          name: account.name,
          institution: account.institution,
          accountType: account.accountType,
          accountNumber: account.accountNumber ? `xxxx-xxxx-${account.accountNumber.slice(-4)}` : 'xxxx',
          balance: account.balance
        })),
        timestamp: new Date().toISOString()
      };
      
      // Use the shared service to notify the advisor
      await notifyAdvisor('account_interest', payload);
      
      toast.success("Advisor notified successfully", {
        description: "Your advisor has been notified about your accounts"
      });
    } catch (error) {
      console.error("Error notifying advisor:", error);
      toast.error("Failed to notify advisor", {
        description: "Please try again later"
      });
    } finally {
      setIsNotifying(false);
    }
  };
  
  return (
    <ThreeColumnLayout title="My Accounts">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-white">My Accounts</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-6">
              <h2 className="text-xl font-medium mb-4 text-white">Account Details</h2>
              <p className="text-gray-400 mb-6">
                Enter your financial accounts below. This information will be securely stored
                and used to help your advisor create a comprehensive financial plan.
              </p>
              
              <BankAccountForm onNotify={handleNotifyAdvisor} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AccountSuggestionsPanel />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default BankAccounts;
