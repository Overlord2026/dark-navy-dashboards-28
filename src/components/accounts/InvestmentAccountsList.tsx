import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const InvestmentAccountsList = () => {
  const { accounts, deleteAccount, saving } = useInvestmentAccounts();
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatAccountType = (type: string) => {
    switch (type) {
      case 'roth_ira':
        return 'Roth IRA';
      case 'mutual_fund':
        return 'Mutual Fund';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (accounts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No investment accounts added yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div 
          key={account.id} 
          className={cn(
            "flex items-center justify-between p-3 border border-border rounded-lg bg-card",
            isMobile ? "flex-col space-y-2" : "flex-row"
          )}
        >
          <div className={cn(isMobile ? "w-full text-center" : "flex-1")}>
            <h4 className="font-medium text-card-foreground">{account.name}</h4>
            <p className="text-sm text-muted-foreground">
              {formatAccountType(account.account_type)} • {formatCurrency(account.balance)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteAccount(account.id)}
            disabled={saving}
            className={cn(
              "text-destructive hover:text-destructive",
              isMobile ? "w-full" : "ml-2"
            )}
          >
            <Trash2 className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};