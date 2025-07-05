import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp } from 'lucide-react';
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
      <DialogContent className={cn("sm:max-w-[550px] p-0 overflow-hidden bg-card border border-border/50 shadow-2xl", isMobile && "mx-4")}>
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative px-8 py-5 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                      Add Investment Account
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track your investment and brokerage accounts
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium text-foreground">Account Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Fidelity Brokerage, Charles Schwab IRA"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="account_type" className="text-base font-medium text-foreground">Account Type</Label>
                <Select
                  value={formData.account_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, account_type: value }))}
                >
                  <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
                    <SelectValue placeholder="Select account type" />
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

              <div className="space-y-3">
                <Label htmlFor="balance" className="text-base font-medium text-foreground">Current Balance</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                    className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>
              </div>

              {formData.balance > 0 && (
                <div className="rounded-lg p-4 border border-border/40 bg-primary/3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-foreground">Account Balance:</span>
                    <span className="text-xl font-bold text-primary">
                      ${formData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-5 border-t border-border/30">
                <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "h-12 px-6 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200",
                      isMobile && "w-full"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving || !formData.name.trim()}
                    className={cn(
                      "h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200",
                      "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                      isMobile && "w-full"
                    )}
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Investment Account'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};