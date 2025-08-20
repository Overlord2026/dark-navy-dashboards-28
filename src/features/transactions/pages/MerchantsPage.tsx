import { useState } from 'react';
import { Merchant } from '../types';
import { useMerchants, useUpdateMerchant, useCategories } from '../api/transactionsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit2, Store, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  
  const { data: merchants = [], isLoading } = useMerchants();
  const { data: categories = [] } = useCategories();
  const updateMerchantMutation = useUpdateMerchant();

  const handleUpdateMerchant = (id: string, data: Partial<Merchant>) => {
    updateMerchantMutation.mutate({ id, data }, {
      onSuccess: () => {
        toast.success('Merchant updated successfully');
        setEditingMerchant(null);
      }
    });
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading merchants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Merchants</h1>
          <p className="text-muted-foreground">
            Manage merchant information and default categories
          </p>
        </div>
        
        <Badge variant="outline">
          {merchants.length} merchants
        </Badge>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Merchants Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Original Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Average Amount</TableHead>
              <TableHead>Last Transaction</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.map(merchant => {
              const category = categories.find(c => c.id === merchant.categoryId);
              
              return (
                <TableRow key={merchant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {merchant.logo && (
                        <img 
                          src={merchant.logo} 
                          alt={merchant.displayName}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{merchant.displayName}</div>
                        {merchant.website && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {merchant.website}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {merchant.name}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    {category ? (
                      <Badge variant="outline" className="gap-1">
                        {category.emoji} {category.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No default</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary">
                      {merchant.transactionCount}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="font-mono">
                    {merchant.averageAmount ? `$${merchant.averageAmount.toFixed(2)}` : '-'}
                  </TableCell>
                  
                  <TableCell>
                    {merchant.lastTransactionDate 
                      ? format(new Date(merchant.lastTransactionDate), 'MMM d, yyyy')
                      : '-'
                    }
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingMerchant(merchant)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {filteredMerchants.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No merchants found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingMerchant} onOpenChange={() => setEditingMerchant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
          </DialogHeader>
          {editingMerchant && (
            <MerchantForm 
              merchant={editingMerchant}
              onSubmit={(data) => handleUpdateMerchant(editingMerchant.id, data)}
              categories={categories}
              isLoading={updateMerchantMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MerchantFormProps {
  merchant: Merchant;
  onSubmit: (data: Partial<Merchant>) => void;
  categories: any[];
  isLoading: boolean;
}

function MerchantForm({ merchant, onSubmit, categories, isLoading }: MerchantFormProps) {
  const [formData, setFormData] = useState({
    displayName: merchant.displayName,
    categoryId: merchant.categoryId || '',
    website: merchant.website || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      categoryId: formData.categoryId || undefined,
      website: formData.website || undefined
    };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="originalName">Original Name (Read-only)</Label>
        <Input
          id="originalName"
          value={merchant.name}
          disabled
          className="bg-muted"
        />
      </div>
      
      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={formData.displayName}
          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Default Category</Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="No default category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No default category</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          placeholder="https://example.com"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          Update Merchant
        </Button>
      </div>
    </form>
  );
}