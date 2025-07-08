import React, { useState } from 'react';
import { useBankAccounts } from '@/context/BankAccountsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Trash2, 
  RefreshCw, 
  Building2, 
  CreditCard, 
  Wallet,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function EnhancedBankAccountsList() {
  const { accounts, loading, saving, deleteAccount, syncPlaidAccount } = useBankAccounts();
  const isMobile = useIsMobile();
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No bank accounts connected</h3>
          <p className="text-muted-foreground mb-4">
            Connect your bank accounts to get started with automatic transaction tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Badge variant="outline" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Secure with Plaid
            </Badge>
            <Badge variant="outline" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Bank-level encryption
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'savings':
        return <PiggyBank className="h-4 w-4 text-green-500" />;
      case 'credit':
        return <CreditCard className="h-4 w-4 text-red-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  const toggleBalanceVisibility = (accountId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(accountId)) {
      newHidden.delete(accountId);
    } else {
      newHidden.add(accountId);
    }
    setHiddenBalances(newHidden);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const connectedAccounts = accounts.filter(account => account.is_plaid_linked).length;

  // Mobile view with enhanced cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-lg font-semibold">{connectedAccounts}/{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Cards */}
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getAccountTypeIcon(account.account_type)}
                  <div>
                    <h4 className="font-medium">{account.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {account.institution_name || account.account_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.is_plaid_linked ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => toggleBalanceVisibility(account.id)}
                      >
                        {hiddenBalances.has(account.id) ? (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show Balance
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Balance
                          </>
                        )}
                      </DropdownMenuItem>
                      {account.is_plaid_linked && (
                        <DropdownMenuItem 
                          onClick={() => syncPlaidAccount(account.id)}
                          disabled={saving}
                        >
                          <RefreshCw className={cn("h-4 w-4 mr-2", saving && "animate-spin")} />
                          Sync Account
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => deleteAccount(account.id)}
                        disabled={saving}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-2xl font-bold">
                    {hiddenBalances.has(account.id) ? '••••••' : formatCurrency(account.balance)}
                  </p>
                  {account.last_plaid_sync && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {new Date(account.last_plaid_sync).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Badge 
                    variant={account.is_plaid_linked ? "secondary" : "outline"} 
                    className="text-xs"
                  >
                    {account.is_plaid_linked ? "Connected" : "Manual"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {account.account_type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connected Accounts</p>
                <p className="text-xl font-bold">{connectedAccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-xl font-bold">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getAccountTypeIcon(account.account_type)}
                      <div>
                        <p className="font-medium">{account.name}</p>
                        {account.last_plaid_sync && (
                          <p className="text-xs text-muted-foreground">
                            Last synced: {new Date(account.last_plaid_sync).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {account.institution_name || 'Manual Entry'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {account.account_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {account.is_plaid_linked ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600">Manual</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold">
                        {hiddenBalances.has(account.id) ? '••••••' : formatCurrency(account.balance)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBalanceVisibility(account.id)}
                        className="h-6 w-6 p-0"
                      >
                        {hiddenBalances.has(account.id) ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {account.is_plaid_linked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => syncPlaidAccount(account.id)}
                          disabled={saving}
                          className="h-8 w-8 p-0"
                        >
                          <RefreshCw className={cn("h-4 w-4", saving && "animate-spin")} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAccount(account.id)}
                        disabled={saving}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}