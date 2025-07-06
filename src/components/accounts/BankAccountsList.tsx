import React, { useState } from 'react';
import { Trash2, Edit, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
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

export function BankAccountsList() {
  const { accounts, loading, deleteAccount } = useBankAccounts();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (accountToDelete) {
      await deleteAccount(accountToDelete);
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

  const getAccountTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'checking': 'Checking',
      'savings': 'Savings',
      'money-market': 'Money Market',
      'cd': 'CD',
      'hsa': 'HSA',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className={cn(
        "text-center py-8 text-muted-foreground",
        isMobile ? "py-6" : "py-8"
      )}>
        <DollarSign className={cn(
          "mx-auto mb-3 text-muted-foreground/50",
          isMobile ? "h-8 w-8" : "h-12 w-12"
        )} />
        <p className={cn(isMobile ? "text-sm" : "text-base")}>
          No bank accounts added yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className={cn("p-4", isMobile && "p-3")}>
              <div className={cn(
                "flex justify-between items-start",
                isMobile ? "flex-col gap-3" : "flex-row"
              )}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={cn(
                      "font-semibold text-foreground truncate",
                      isMobile ? "text-sm" : "text-base"
                    )}>
                      {account.name}
                    </h4>
                    <Badge variant="secondary" className={cn(
                      isMobile ? "text-xs px-2 py-1" : "text-sm"
                    )}>
                      {getAccountTypeLabel(account.account_type)}
                    </Badge>
                  </div>
                  <p className={cn(
                    "text-xl font-bold text-primary",
                    isMobile ? "text-lg" : "text-xl"
                  )}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
                
                <div className={cn(
                  "flex gap-2",
                  isMobile ? "w-full justify-end" : "flex-shrink-0"
                )}>
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "sm"}
                    onClick={() => handleDeleteClick(account.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                    {!isMobile && <span className="ml-1">Delete</span>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bank account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}