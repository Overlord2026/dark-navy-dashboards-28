import { useState } from 'react';
import { Category } from '../types';
import { useCategories, useCreateCategory, useUpdateCategory } from '../api/transactionsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Folder, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

export function CategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const handleCreateCategory = (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Category created successfully');
        setIsCreateOpen(false);
      }
    });
  };

  const handleUpdateCategory = (id: string, data: Partial<Category>) => {
    updateCategoryMutation.mutate({ id, data }, {
      onSuccess: () => {
        toast.success('Category updated successfully');
        setEditingCategory(null);
      }
    });
  };

  const groupedCategories = {
    income: categories.filter(c => c.type === 'income'),
    expense: categories.filter(c => c.type === 'expense'),
    transfer: categories.filter(c => c.type === 'transfer')
  };

  const renderCategoryGroup = (title: string, type: 'income' | 'expense' | 'transfer', categoryList: Category[]) => {
    const parentCategories = categoryList.filter(c => !c.parentId);
    const childCategories = categoryList.filter(c => c.parentId);

    return (
      <Card key={type}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            {title}
            <Badge variant="outline">{categoryList.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {parentCategories.map(category => {
            const children = childCategories.filter(c => c.parentId === category.id);
            
            return (
              <div key={category.id} className="space-y-2">
                <CategoryItem 
                  category={category} 
                  onEdit={setEditingCategory}
                  isParent
                />
                {children.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {children.map(child => (
                      <CategoryItem 
                        key={child.id}
                        category={child} 
                        onEdit={setEditingCategory}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Organize your transactions with custom categories
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              onSubmit={handleCreateCategory}
              categories={categories}
              isLoading={createCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {renderCategoryGroup('Income', 'income', groupedCategories.income)}
        {renderCategoryGroup('Expenses', 'expense', groupedCategories.expense)}
        {renderCategoryGroup('Transfers', 'transfer', groupedCategories.transfer)}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm 
              category={editingCategory}
              onSubmit={(data) => handleUpdateCategory(editingCategory.id, data)}
              categories={categories}
              isLoading={updateCategoryMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  isParent?: boolean;
}

function CategoryItem({ category, onEdit, isParent = false }: CategoryItemProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${isParent ? 'bg-muted/50' : 'bg-background'}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{category.emoji}</span>
        <div>
          <div className="font-medium">{category.name}</div>
          {category.isDefault && (
            <Badge variant="outline" className="text-xs">Default</Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          style={{ borderColor: category.color, color: category.color }}
        >
          {category.type}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(category)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  isLoading: boolean;
}

function CategoryForm({ category, onSubmit, categories, isLoading }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    emoji: category?.emoji || '📁',
    color: category?.color || 'hsl(var(--primary))',
    type: category?.type || 'expense' as const,
    parentId: category?.parentId || '',
    isActive: category?.isActive ?? true,
    isDefault: category?.isDefault || false,
    sortOrder: category?.sortOrder || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      parentId: formData.parentId || undefined
    };
    
    onSubmit(data);
  };

  const parentOptions = categories.filter(c => 
    c.type === formData.type && 
    !c.parentId && 
    c.id !== category?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="emoji">Emoji</Label>
          <Input
            id="emoji"
            value={formData.emoji}
            onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
            maxLength={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="parent">Parent Category</Label>
          <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="None (top level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None (top level)</SelectItem>
              {parentOptions.map(parent => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.emoji} {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {category ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
}