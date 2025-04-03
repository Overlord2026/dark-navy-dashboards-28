
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useNetWorth } from "@/context/NetWorthContext";
import { DollarSign, Landmark, Briefcase, CreditCard, Building } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileAccounts() {
  const { accounts = [] } = useNetWorth();
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  
  const handleAddAccount = () => {
    setIsAddingAccount(true);
  };

  // Group accounts by type
  const accountsByType = {
    managed: accounts.filter(acc => acc.type === 'managed') || [],
    investments: accounts.filter(acc => acc.type === 'investment') || [],
    manual: accounts.filter(acc => acc.type === 'manual') || [],
    loans: accounts.filter(acc => acc.type === 'loan') || [],
    banking: accounts.filter(acc => acc.type === 'banking') || [],
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'managed':
        return <Briefcase className="h-6 w-6 text-blue-400" />;
      case 'investment':
        return <DollarSign className="h-6 w-6 text-green-400" />;
      case 'manual':
        return <Landmark className="h-6 w-6 text-yellow-400" />;
      case 'loan':
        return <CreditCard className="h-6 w-6 text-red-400" />;
      case 'banking':
        return <Building className="h-6 w-6 text-purple-400" />;
      default:
        return <DollarSign className="h-6 w-6 text-gray-400" />;
    }
  };
  
  const renderAccountSection = (
    type: string, 
    title: string, 
    accounts: any[],
    emptyMessage: string
  ) => {
    const totalValue = accounts.reduce((sum, acc) => sum + (acc.value || 0), 0);
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(totalValue);
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          {getIconForType(type)}
          <h2 className="text-lg font-semibold ml-2">{title}</h2>
          <div className="ml-auto text-lg font-bold">{formattedValue}</div>
        </div>
        
        {accounts.length > 0 ? (
          accounts.map((account, index) => (
            <div 
              key={index} 
              className="p-4 my-2 rounded-lg bg-[#2A2A45]"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{account.name}</div>
                <div>${(account.value || 0).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 my-2 rounded-lg bg-[#2A2A45] text-gray-400">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <MobileLayout 
      title="Accounts" 
      showAddButton={true}
      onAddButtonClick={handleAddAccount}
    >
      <div className="p-4">
        {renderAccountSection(
          'managed', 
          'Managed Accounts', 
          accountsByType.managed,
          'Talk to your advisor about adding managed accounts'
        )}
        
        {renderAccountSection(
          'investments', 
          'Investments', 
          accountsByType.investments,
          'To track your investments, add a new account by tapping + on the top right of the screen.'
        )}
        
        {renderAccountSection(
          'manual', 
          'Manually-Tracked', 
          accountsByType.manual,
          'Add a manually-tracked account using the (+) button on the top right'
        )}
        
        {renderAccountSection(
          'loans', 
          'Loans', 
          accountsByType.loans,
          'To track your loans, add a new account by tapping + on the top right of the screen.'
        )}
        
        {renderAccountSection(
          'banking', 
          'Banking', 
          accountsByType.banking,
          'To track your banking accounts, add a new account by tapping + on the top right of the screen.'
        )}
      </div>
    </MobileLayout>
  );
}
