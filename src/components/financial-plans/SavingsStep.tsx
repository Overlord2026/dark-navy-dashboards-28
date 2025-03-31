
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, PiggyBank } from "lucide-react";

interface SavingsAccount {
  id: string;
  name: string;
  contribution: number;
  frequency: "yearly" | "monthly" | "weekly";
  type: "retirement" | "investment" | "emergency" | "other";
}

interface SavingsStepProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const SavingsStep = ({ onNextStep, onPrevStep }: SavingsStepProps) => {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([
    { id: '1', name: '401(k)', contribution: 12000, frequency: 'yearly', type: 'retirement' },
    { id: '2', name: 'BFO Investment Account', contribution: 1000, frequency: 'monthly', type: 'investment' },
  ]);

  const addSavingsAccount = () => {
    const newAccount: SavingsAccount = {
      id: `account-${Date.now()}`,
      name: '',
      contribution: 0,
      frequency: 'monthly',
      type: 'investment'
    };
    setSavingsAccounts([...savingsAccounts, newAccount]);
  };

  const updateSavingsAccount = (id: string, field: keyof SavingsAccount, value: any) => {
    setSavingsAccounts(savingsAccounts.map(account => 
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const removeSavingsAccount = (id: string) => {
    setSavingsAccounts(savingsAccounts.filter(account => account.id !== id));
  };

  const calculateTotalYearlySavings = () => {
    return savingsAccounts.reduce((total, account) => {
      let yearlyAmount = account.contribution;
      if (account.frequency === 'monthly') yearlyAmount *= 12;
      if (account.frequency === 'weekly') yearlyAmount *= 52;
      return total + yearlyAmount;
    }, 0);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'retirement': return 'Retirement';
      case 'investment': return 'Investment';
      case 'emergency': return 'Emergency Fund';
      case 'other': return 'Other';
      default: return 'Other';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Savings</h2>
      <p className="text-muted-foreground">
        Track how much you plan to save each year.
      </p>
      
      <div className="space-y-4 mt-6">
        {savingsAccounts.map((account, index) => (
          <div key={account.id} className="p-4 border rounded-md bg-card">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <PiggyBank className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="font-medium">{account.name || `Savings Account ${index + 1}`}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSavingsAccount(account.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <Label htmlFor={`name-${account.id}`}>Account Name</Label>
                <Input
                  id={`name-${account.id}`}
                  value={account.name}
                  onChange={(e) => updateSavingsAccount(account.id, 'name', e.target.value)}
                  placeholder="e.g. 401(k), BFO Investment"
                />
              </div>
              
              <div>
                <Label htmlFor={`type-${account.id}`}>Account Type</Label>
                <Select
                  value={account.type}
                  onValueChange={(value) => updateSavingsAccount(account.id, 'type', value)}
                >
                  <SelectTrigger id={`type-${account.id}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`contribution-${account.id}`}>Contribution</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id={`contribution-${account.id}`}
                    type="number"
                    value={account.contribution}
                    onChange={(e) => updateSavingsAccount(account.id, 'contribution', parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`frequency-${account.id}`}>Frequency</Label>
                <Select
                  value={account.frequency}
                  onValueChange={(value) => updateSavingsAccount(account.id, 'frequency', value)}
                >
                  <SelectTrigger id={`frequency-${account.id}`}>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full" onClick={addSavingsAccount}>
          <Plus className="h-4 w-4 mr-2" />
          Add Savings Account
        </Button>
        
        <div className="p-4 border rounded-md bg-card mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Total Yearly Savings</h3>
            <p className="text-xl font-semibold">${calculateTotalYearlySavings().toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
