
import React from 'react';
import { useBankAccounts } from '@/context/BankAccountsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaggeredList, StaggeredItem } from '@/components/animations/StaggeredList';
import { AggregationGate } from '@/components/ui/AggregationGate';

export function BankAccountsList() {
  const { accounts, loading, saving, deleteAccount, syncPlaidAccount } = useBankAccounts();

  if (loading) {
    return (
      <StaggeredList className="space-y-4">
        {[1, 2, 3].map((i) => (
          <StaggeredItem key={i}>
            <Card className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          </StaggeredItem>
        ))}
      </StaggeredList>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No bank accounts connected yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Use the "Add Bank Account" button above to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <StaggeredList className="space-y-4">
      {accounts.map((account) => (
        <StaggeredItem key={account.id}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {account.is_plaid_linked && (
                    <Badge variant="secondary" className="text-xs">
                      Plaid Connected
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {account.account_type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(account.balance)}
                  </p>
                  {account.last_plaid_sync && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last synced: {new Date(account.last_plaid_sync).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {account.is_plaid_linked && (
                    <AggregationGate>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncPlaidAccount(account.id)}
                        disabled={saving}
                        className="text-xs"
                      >
                        <RefreshCw className={cn("h-3 w-3 mr-1", saving && "animate-spin")} />
                        Sync
                      </Button>
                    </AggregationGate>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAccount(account.id)}
                    disabled={saving}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggeredItem>
      ))}
    </StaggeredList>
  );
}
