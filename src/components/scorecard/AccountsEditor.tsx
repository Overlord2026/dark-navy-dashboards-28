import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { Account, TaxType } from '@/lib/scorecard/types';

interface AccountsEditorProps {
  accounts: Account[];
  onChange: (accounts: Account[]) => void;
}

const TAX_TYPE_OPTIONS: { value: TaxType; label: string; qualified: boolean }[] = [
  { value: 'taxable', label: 'Taxable (Brokerage)', qualified: false },
  { value: 'trad', label: 'Traditional 401k/IRA', qualified: true },
  { value: 'roth', label: 'Roth 401k/IRA', qualified: true },
  { value: 'hsa', label: 'Health Savings Account', qualified: true },
  { value: 'annuity_qualified', label: 'Qualified Annuity', qualified: true },
  { value: 'annuity_nonqualified', label: 'Non-Qualified Annuity', qualified: false },
];

export function AccountsEditor({ accounts, onChange }: AccountsEditorProps) {
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);

  const addAccount = () => {
    const newAccount: Account = {
      name: `Account ${accounts.length + 1}`,
      taxType: 'taxable',
      balance: 0,
      annualContrib: 0,
      expectedReturn: 0.07,
      qualified: false
    };
    onChange([...accounts, newAccount]);
    setExpandedAccount(accounts.length);
  };

  const updateAccount = (index: number, updates: Partial<Account>) => {
    const newAccounts = [...accounts];
    const taxTypeOption = TAX_TYPE_OPTIONS.find(opt => opt.value === updates.taxType);
    
    newAccounts[index] = {
      ...newAccounts[index],
      ...updates,
      qualified: taxTypeOption ? taxTypeOption.qualified : newAccounts[index].qualified
    };
    onChange(newAccounts);
  };

  const removeAccount = (index: number) => {
    const newAccounts = accounts.filter((_, i) => i !== index);
    onChange(newAccounts);
    if (expandedAccount === index) {
      setExpandedAccount(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Retirement Accounts</h3>
        <Button onClick={addAccount} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No accounts added yet. Click "Add Account" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Total Balance: <span className="font-semibold text-foreground">{formatCurrency(totalBalance)}</span>
          </div>
          
          <div className="space-y-3">
            {accounts.map((account, index) => (
              <Card key={index} className="transition-colors hover:bg-muted/50">
                <CardHeader 
                  className="pb-3 cursor-pointer"
                  onClick={() => setExpandedAccount(expandedAccount === index ? null : index)}
                >
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>{account.name}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {TAX_TYPE_OPTIONS.find(opt => opt.value === account.taxType)?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal">{formatCurrency(account.balance)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAccount(index);
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {expandedAccount === index && (
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`name-${index}`}>Account Name</Label>
                        <Input
                          id={`name-${index}`}
                          value={account.name}
                          onChange={(e) => updateAccount(index, { name: e.target.value })}
                          placeholder="e.g., 401k, IRA, Brokerage"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`tax-type-${index}`}>Tax Type</Label>
                        <Select
                          value={account.taxType}
                          onValueChange={(value: TaxType) => updateAccount(index, { taxType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TAX_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`balance-${index}`}>Current Balance</Label>
                        <Input
                          id={`balance-${index}`}
                          type="number"
                          value={account.balance}
                          onChange={(e) => updateAccount(index, { balance: Number(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`contrib-${index}`}>Annual Contribution</Label>
                        <Input
                          id={`contrib-${index}`}
                          type="number"
                          value={account.annualContrib}
                          onChange={(e) => updateAccount(index, { annualContrib: Number(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`return-${index}`}>Expected Annual Return (%)</Label>
                      <Input
                        id={`return-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="0.15"
                        value={(account.expectedReturn * 100).toFixed(2)}
                        onChange={(e) => updateAccount(index, { expectedReturn: (Number(e.target.value) || 7) / 100 })}
                        placeholder="7.00"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}