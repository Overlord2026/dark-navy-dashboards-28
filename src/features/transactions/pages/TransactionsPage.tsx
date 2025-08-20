import { useState } from 'react';
import { TransactionFilter, BulkEditData } from '../types';
import { useTransactions, useCategories, useBulkUpdateTransactions, useHideTransactions, useRestoreTransactions } from '../api/transactionsApi';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionRow } from '../components/TransactionRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Tag, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export function TransactionsPage() {
  const [filter, setFilter] = useState<TransactionFilter>({});
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState<string>('');

  const { data: transactions = [], isLoading } = useTransactions(filter);
  const { data: categories = [] } = useCategories();
  const bulkUpdateMutation = useBulkUpdateTransactions();
  const hideTransactionsMutation = useHideTransactions();
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

  const handleBulkCategoryUpdate = () => {
    if (!bulkCategory || selectedTransactions.size === 0) return;

    const data: BulkEditData = { categoryId: bulkCategory };
    bulkUpdateMutation.mutate({
      ids: Array.from(selectedTransactions),
      data
    }, {
      onSuccess: () => {
        toast.success(`Updated ${selectedTransactions.size} transactions`);
        setSelectedTransactions(new Set());
        setBulkCategory('');
      }
    });
  };

  const handleBulkHide = () => {
    if (selectedTransactions.size === 0) return;

    hideTransactionsMutation.mutate(Array.from(selectedTransactions), {
      onSuccess: () => {
        toast.success(`Hidden ${selectedTransactions.size} transactions`);
        setSelectedTransactions(new Set());
      }
    });
  };

  const handleHideTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    if (transaction.isHidden) {
      restoreTransactionsMutation.mutate([transactionId], {
        onSuccess: () => {
          toast.success('Transaction restored');
        }
      });
    } else {
      hideTransactionsMutation.mutate([transactionId], {
        onSuccess: () => {
          toast.success('Transaction hidden');
        }
      });
    }
  };

  const visibleTransactions = transactions.filter(t => !t.isHidden);
  const hiddenCount = transactions.filter(t => t.isHidden).length;

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and categorize your transactions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {visibleTransactions.length} visible
          </Badge>
          {hiddenCount > 0 && (
            <Badge variant="secondary">
              {hiddenCount} hidden
            </Badge>
          )}
        </div>
      </div>

      <TransactionFilters
        filter={filter}
        categories={categories}
        onFilterChange={setFilter}
      />

      {/* Bulk Actions */}
      {selectedTransactions.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Bulk Actions ({selectedTransactions.size} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Select value={bulkCategory} onValueChange={setBulkCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleBulkCategoryUpdate}
                  disabled={!bulkCategory || bulkUpdateMutation.isPending}
                >
                  Apply Category
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleBulkHide}
                disabled={hideTransactionsMutation.isPending}
                className="gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Hide Selected
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

      {/* Hidden Transactions Toggle */}
      {hiddenCount > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-hidden"
            checked={filter.isHidden === true}
            onCheckedChange={(checked) => 
              setFilter(prev => ({ 
                ...prev, 
                isHidden: checked ? true : undefined 
              }))
            }
          />
          <label htmlFor="show-hidden" className="text-sm">
            Show {hiddenCount} hidden transactions
          </label>
        </div>
      )}

      {/* Transactions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    visibleTransactions.length > 0 && 
                    selectedTransactions.size === visibleTransactions.length
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
            {(filter.isHidden ? transactions : visibleTransactions).map(transaction => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                isSelected={selectedTransactions.has(transaction.id)}
                onSelect={handleSelectTransaction}
                onHide={handleHideTransaction}
              />
            ))}
          </TableBody>
        </Table>
      </Card>

      {(filter.isHidden ? transactions : visibleTransactions).length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}