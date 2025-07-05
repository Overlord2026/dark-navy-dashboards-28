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
} from '@/components/ui/alert-dialog';
import { Trash2, TrendingUp } from 'lucide-react';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const InvestmentAccountsList = () => {
  const { accounts, deleteAccount, saving } = useInvestmentAccounts();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (account: any) => {
    setAccountToDelete({ id: account.id, name: account.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (accountToDelete) {
      await deleteAccount(accountToDelete.id);
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

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
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No investment accounts added yet.</p>
        <p className="text-sm text-muted-foreground">Add your first account to start tracking.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{account.name}</h4>
                  <Badge variant="outline" className="mt-1">
                    {formatAccountType(account.account_type)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{formatAccountType(account.account_type)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-600 hover:text-red-700"
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {formatAccountType(account.account_type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {formatCurrency(account.balance)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(account)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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