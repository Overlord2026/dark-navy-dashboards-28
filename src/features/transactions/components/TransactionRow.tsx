import { useState } from 'react';
import { Transaction, Category } from '../types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Edit2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { useUpdateTransaction } from '../api/transactionsApi';

interface TransactionRowProps {
  transaction: Transaction;
  categories: Category[];
  isSelected: boolean;
  onSelect: (transactionId: string, selected: boolean) => void;
  onHide: (transactionId: string) => void;
}

export function TransactionRow({ 
  transaction, 
  categories, 
  isSelected, 
  onSelect, 
  onHide 
}: TransactionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: transaction.description,
    categoryId: transaction.categoryId || '',
    notes: transaction.notes || ''
  });

  const updateTransaction = useUpdateTransaction();

  const handleSave = () => {
    updateTransaction.mutate({
      id: transaction.id,
      data: editData
    }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setEditData({
      description: transaction.description,
      categoryId: transaction.categoryId || '',
      notes: transaction.notes || ''
    });
    setIsEditing(false);
  };

  const category = categories.find(c => c.id === transaction.categoryId);

  return (
    <TableRow className={`${transaction.isHidden ? 'opacity-50' : ''}`}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(transaction.id, !!checked)}
        />
      </TableCell>
      
      <TableCell>
        {format(new Date(transaction.date), 'MMM d, yyyy')}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full"
          />
        ) : (
          <div>
            <div className="font-medium">{transaction.description}</div>
            {transaction.originalDescription !== transaction.description && (
              <div className="text-sm text-muted-foreground">
                Originally: {transaction.originalDescription}
              </div>
            )}
          </div>
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Select value={editData.categoryId} onValueChange={(value) => setEditData(prev => ({ ...prev, categoryId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-2">
                    {cat.emoji} {cat.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          category ? (
            <Badge variant="outline" className="gap-1">
              {category.emoji} {category.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground">Uncategorized</span>
          )
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
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                disabled={updateTransaction.isPending}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onHide(transaction.id)}
              >
                {transaction.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}