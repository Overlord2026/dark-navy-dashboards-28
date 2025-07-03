import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useInvestmentAccounts, InvestmentAccountData } from '@/hooks/useInvestmentAccounts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AddInvestmentAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export const AddInvestmentAccountDialog = ({ 
  open, 
  onOpenChange, 
  onBack 
}: AddInvestmentAccountDialogProps) => {
  const { addAccount, saving } = useInvestmentAccounts();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<InvestmentAccountData>({
    name: '',
    account_type: 'brokerage',
    balance: 0,
  });

  const accountTypeOptions = [
    { value: 'brokerage', label: 'Brokerage' },
    { value: 'ira', label: 'IRA' },
    { value: 'roth_ira', label: 'Roth IRA' },
    { value: '529', label: '529' },
    { value: 'mutual_fund', label: 'Mutual Fund' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    const success = await addAccount(formData);
    if (success) {
      setFormData({
        name: '',
        account_type: 'brokerage',
        balance: 0,
      });
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px]", isMobile && "mx-4")}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>Add Investment Account</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Fidelity 401(k)"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_type">Account Type</Label>
            <Select
              value={formData.account_type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, account_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accountTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div className={cn("flex gap-2", isMobile ? "flex-col" : "flex-row justify-end")}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className={cn(isMobile && "w-full")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !formData.name.trim()}
              className={cn(isMobile && "w-full")}
            >
              {saving ? 'Adding...' : 'Add Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};