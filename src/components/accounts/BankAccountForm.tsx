
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { BankAccount } from "@/types/accounts";

interface BankAccountFormProps {
  onNotify: (accounts: BankAccount[]) => Promise<void>;
}

export const BankAccountForm: React.FC<BankAccountFormProps> = ({ onNotify }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: uuidv4(),
      name: "",
      institution: "",
      accountType: "Checking",
      accountNumber: "",
      balance: 0
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccountChange = (index: number, field: keyof BankAccount, value: string | number) => {
    const updatedAccounts = [...accounts];
    
    if (field === 'balance') {
      updatedAccounts[index][field] = typeof value === 'string' ? parseFloat(value) : value;
    } else if (field === 'accountType') {
      updatedAccounts[index][field] = value as BankAccount['accountType'];
    } else {
      updatedAccounts[index][field] = value as string;
    }
    
    setAccounts(updatedAccounts);
  };

  const addAccount = () => {
    setAccounts([
      ...accounts,
      {
        id: uuidv4(),
        name: "",
        institution: "",
        accountType: "Checking",
        accountNumber: "",
        balance: 0
      }
    ]);
  };

  const removeAccount = (index: number) => {
    if (accounts.length > 1) {
      const updatedAccounts = [...accounts];
      updatedAccounts.splice(index, 1);
      setAccounts(updatedAccounts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!accounts.every(account => account.name && account.institution)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onNotify(accounts);
      // Form submission successful, but we don't reset the form to allow users to see what they submitted
    } catch (error) {
      console.error("Error notifying advisor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {accounts.map((account, index) => (
        <div 
          key={account.id} 
          className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-4"
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Account #{index + 1}</h3>
            {accounts.length > 1 && (
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => removeAccount(index)}
                className="text-red-400 hover:text-red-300 border-red-500"
              >
                Remove
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Account Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={account.name}
                onChange={(e) => handleAccountChange(index, "name", e.target.value)}
                placeholder="e.g., Primary Checking"
                required
                className="bg-[#172A47] border-[#2A3E5C] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Institution <span className="text-red-500">*</span>
              </label>
              <Input
                value={account.institution}
                onChange={(e) => handleAccountChange(index, "institution", e.target.value)}
                placeholder="e.g., Chase Bank"
                required
                className="bg-[#172A47] border-[#2A3E5C] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Account Type
              </label>
              <Select
                value={account.accountType}
                onValueChange={(value) => handleAccountChange(index, "accountType", value)}
              >
                <SelectTrigger className="bg-[#172A47] border-[#2A3E5C] text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Checking">Checking</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Brokerage">Brokerage</SelectItem>
                  <SelectItem value="401k">401(k)</SelectItem>
                  <SelectItem value="IRA">IRA</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Account Number
              </label>
              <Input
                value={account.accountNumber}
                onChange={(e) => handleAccountChange(index, "accountNumber", e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                type="password"
                className="bg-[#172A47] border-[#2A3E5C] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Current Balance
              </label>
              <Input
                value={account.balance}
                onChange={(e) => handleAccountChange(index, "balance", e.target.value)}
                type="number"
                placeholder="0.00"
                className="bg-[#172A47] border-[#2A3E5C] text-white"
              />
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex space-x-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={addAccount}
          className="border-[#4C6385] text-[#4C6385] hover:bg-[#172A47] hover:text-white"
        >
          Add Another Account
        </Button>
        
        <Button 
          type="submit"
          variant="advisor"
          disabled={isSubmitting}
          className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white font-medium"
        >
          {isSubmitting ? "Notifying Advisor..." : "Notify My Advisor"}
        </Button>
      </div>
    </form>
  );
};
