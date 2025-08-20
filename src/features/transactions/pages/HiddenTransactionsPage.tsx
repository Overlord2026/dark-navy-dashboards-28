import { useState } from 'react';
import { TransactionFilter } from '../types';
import { useTransactions, useCategories, useRestoreTransactions } from '../api/transactionsApi';
import { TransactionRow } from '../components/TransactionRow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function HiddenTransactionsPage() {
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());

  const filter: TransactionFilter = { isHidden: true };
  const { data: transactions = [], isLoading } = useTransactions(filter);
  const { data: categories = [] } = useCategories();
  const restoreTransactionsMutation = useRestoreTransactions();

  const handleSelectTransaction = (transactionId: string, selected: boolean) => {
    const newSelected = new Set(selectedTransactions);
    if (selected) {
      newSelected.add(transactionId);
    } else {
      newSelected.delete(transactionId);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(new Set(transactions.map(t => t.id)));
    } else {
      setSelectedTransactions(new Set());
    }
  };

  const handleRestoreSelected = () => {
    if (selectedTransactions.size === 0) return;

    restoreTransactionsMutation.mutate(Array.from(selectedTransactions), {
      onSuccess: () => {
        toast.success(`Restored ${selectedTransactions.size} transactions`);
        setSelectedTransactions(new Set());
      }
    });
  };

  const handleRestoreTransaction = (transactionId: string) => {
    restoreTransactionsMutation.mutate([transactionId], {
      onSuccess: () => {
        toast.success('Transaction restored');
      }
    });
  };

  if (isLoading) {
    return <div>Loading hidden transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hidden Transactions</h1>
          <p className="text-muted-foreground">
            Manage transactions that have been hidden from your main view
          </p>
        </div>
        
        <Badge variant="outline">
          {transactions.length} hidden
        </Badge>
      </div>

      {/* Bulk Actions */}
      {selectedTransactions.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Bulk Actions ({selectedTransactions.size} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRestoreSelected}
                disabled={restoreTransactionsMutation.isPending}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Restore Selected
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setSelectedTransactions(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden Transactions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    transactions.length > 0 && 
                    selectedTransactions.size === transactions.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id} className="opacity-75">
                <TableCell>
                  <Checkbox
                    checked={selectedTransactions.has(transaction.id)}
                    onCheckedChange={(checked) => handleSelectTransaction(transaction.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    {transaction.originalDescription !== transaction.description && (
                      <div className="text-sm text-muted-foreground">
                        Originally: {transaction.originalDescription}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {transaction.categoryId ? (
                    <Badge variant="outline" className="gap-1">
                      {categories.find(c => c.id === transaction.categoryId)?.emoji}
                      {categories.find(c => c.id === transaction.categoryId)?.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Uncategorized</span>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.accountName}
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span className={transaction.amount < 0 ? 'text-destructive' : 'text-success'}>
                    {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {transaction.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRestoreTransaction(transaction.id)}
                    disabled={restoreTransactionsMutation.isPending}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {transactions.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hidden transactions</p>
              <p className="text-sm">Transactions you hide will appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}