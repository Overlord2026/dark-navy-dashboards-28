import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useTransfers } from '@/context/TransfersContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TransferFormProps {
  onSuccess?: () => void;
}

export function TransferForm({ onSuccess }: TransferFormProps) {
  const { accounts } = useBankAccounts();
  const { createTransfer, createACHTransfer, processing } = useTransfers();
  
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transferType, setTransferType] = useState<'internal' | 'ach'>('internal');

  // Filter accounts for selection
  const availableFromAccounts = accounts.filter(acc => acc.id !== toAccount);
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccount);

  const selectedFromAccount = accounts.find(acc => acc.id === fromAccount);
  const selectedToAccount = accounts.find(acc => acc.id === toAccount);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fromAccount) {
      newErrors.fromAccount = 'Please select a source account';
    }

    if (!toAccount) {
      newErrors.toAccount = 'Please select a destination account';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (transferType === 'ach' && parseFloat(amount) < 0.50) {
      newErrors.amount = 'Minimum amount for ACH transfers is $0.50';
    }

    if (selectedFromAccount && parseFloat(amount) > selectedFromAccount.balance) {
      newErrors.amount = `Insufficient funds. Available: $${selectedFromAccount.balance.toFixed(2)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transferData = {
      from_account_id: fromAccount,
      to_account_id: toAccount,
      amount: parseFloat(amount),
      description: description || undefined
    };

    const success = transferType === 'ach' 
      ? await createACHTransfer(transferData)
      : await createTransfer(transferData);

    if (success) {
      // Reset form
      setFromAccount('');
      setToAccount('');
      setAmount('');
      setDescription('');
      setErrors({});
      onSuccess?.();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (accounts.length < 2) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2 text-center">Need More Accounts</CardTitle>
          <CardDescription className="text-center">
            You need at least 2 linked accounts to make transfers between them.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Transfer</CardTitle>
        <CardDescription>
          Transfer funds between your linked accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={transferType} onValueChange={(value) => setTransferType(value as 'internal' | 'ach')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal Transfer</TabsTrigger>
            <TabsTrigger value="ach">ACH Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="internal" className="mt-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Internal Transfer</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Instant transfers between your accounts within the platform. No fees applied.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="ach" className="mt-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">ACH Bank Transfer</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Real bank-to-bank transfers using ACH. Takes 1-3 business days. Minimum $0.50.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="from-account">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger id="from-account">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {availableFromAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">{account.account_type}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.fromAccount && (
              <p className="text-sm text-destructive">{errors.fromAccount}</p>
            )}
            {selectedFromAccount && (
              <p className="text-sm text-muted-foreground">
                Available balance: {formatCurrency(selectedFromAccount.balance)}
              </p>
            )}
          </div>

          {/* Transfer Direction Indicator */}
          {fromAccount && toAccount && (
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {/* To Account */}
          <div className="space-y-2">
            <Label htmlFor="to-account">To Account</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger id="to-account">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {availableToAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">{account.account_type}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.toAccount && (
              <p className="text-sm text-destructive">{errors.toAccount}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this transfer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Transfer Summary */}
          {fromAccount && toAccount && amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium">Transfer Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span>{selectedFromAccount?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>{selectedToAccount?.name}</span>
                </div>
                 <div className="flex justify-between font-medium">
                   <span>Amount:</span>
                   <span>{formatCurrency(parseFloat(amount))}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Type:</span>
                   <span>{transferType === 'ach' ? 'ACH Transfer (1-3 days)' : 'Internal (Instant)'}</span>
                 </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={processing || !fromAccount || !toAccount || !amount}
          >
            {processing 
              ? (transferType === 'ach' ? 'Initiating ACH Transfer...' : 'Processing Transfer...') 
              : (transferType === 'ach' ? 'Start ACH Transfer' : 'Transfer Funds')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}