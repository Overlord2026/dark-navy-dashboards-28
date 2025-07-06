import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Banknote, RefreshCw, Building2 } from 'lucide-react';
import { useBankAccounts } from '@/context/BankAccountsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const BankAccountsList = () => {
  const { accounts, deleteAccount, syncPlaidAccount, saving } = useBankAccounts();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{ id: string; name: string } | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleDeleteClick = (account: any) => {
    setAccountToDelete({ id: account.id, name: `${getAccountTypeLabel(account.account_type)} - ${account.name}` });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (accountToDelete) {
      await deleteAccount(accountToDelete.id);
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleSync = async (accountId: string) => {
    setSyncingId(accountId);
    await syncPlaidAccount(accountId);
    setSyncingId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatSyncDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const getAccountTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'checking': 'Checking',
      'savings': 'Savings',
      'money-market': 'Money Market',
      'cd': 'Certificate of Deposit',
      'hsa': 'Health Savings Account',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  // Separate accounts by type
  const plaidAccounts = accounts.filter(account => account.is_plaid_linked);
  const manualAccounts = accounts.filter(account => !account.is_plaid_linked);

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <Banknote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No bank accounts added yet.</p>
        <p className="text-sm text-muted-foreground">Add your first account to start tracking.</p>
      </div>
    );
  }

  // Helper function to render accounts for mobile
  const renderMobileAccounts = (accountsList: any[], title: string) => {
    if (accountsList.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground border-b pb-2">{title}</h4>
        {accountsList.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg">{account.name}</h4>
                  {account.is_plaid_linked && (
                    <Badge variant="secondary" className="text-xs">
                      <Building2 className="h-3 w-3 mr-1" />
                      Plaid
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{getAccountTypeLabel(account.account_type)}</Badge>
                </div>
                {account.institution_name && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {account.institution_name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">
                  {formatCurrency(account.balance)}
                </p>
                {account.is_plaid_linked && account.last_plaid_sync && (
                  <p className="text-xs text-muted-foreground">
                    Synced: {formatSyncDate(account.last_plaid_sync)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {account.is_plaid_linked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(account.id)}
                  disabled={syncingId === account.id || saving}
                  className="flex-1"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${syncingId === account.id ? 'animate-spin' : ''}`} />
                  {syncingId === account.id ? "Syncing..." : "Sync"}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-red-600 hover:text-red-700 ${account.is_plaid_linked ? 'flex-1' : 'flex-1'}`}
                onClick={() => handleDeleteClick(account)}
                disabled={saving}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-6">
          {renderMobileAccounts(plaidAccounts, "Connected Via Plaid")}
          {renderMobileAccounts(manualAccounts, "Manual Accounts")}
        </div>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{accountToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Helper function to render accounts for desktop
  const renderDesktopAccounts = (accountsList: any[], title: string) => {
    if (accountsList.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground border-b pb-2">{title}</h4>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountsList.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center gap-2">
                        {account.name}
                        {account.is_plaid_linked && (
                          <Badge variant="secondary" className="text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            Plaid
                          </Badge>
                        )}
                      </div>
                      {account.institution_name && (
                        <p className="text-xs text-muted-foreground">
                          {account.institution_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getAccountTypeLabel(account.account_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(account.balance)}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.is_plaid_linked && account.last_plaid_sync && (
                      <p className="text-xs text-muted-foreground">
                        Synced: {formatSyncDate(account.last_plaid_sync)}
                      </p>
                    )}
                    {account.is_plaid_linked && !account.last_plaid_sync && (
                      <p className="text-xs text-muted-foreground">Never synced</p>
                    )}
                    {!account.is_plaid_linked && (
                      <p className="text-xs text-muted-foreground">Manual</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {account.is_plaid_linked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSync(account.id)}
                          disabled={syncingId === account.id || saving}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RefreshCw className={`h-4 w-4 ${syncingId === account.id ? 'animate-spin' : ''}`} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(account)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {renderDesktopAccounts(plaidAccounts, "Connected Via Plaid")}
        {renderDesktopAccounts(manualAccounts, "Manual Accounts")}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{accountToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};