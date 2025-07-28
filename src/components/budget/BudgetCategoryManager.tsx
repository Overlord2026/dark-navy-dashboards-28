import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign, TrendingDown } from 'lucide-react';
import { defaultBudgetCategories, getMainBudgetCategories, getSubcategories } from '@/data/budgetCategories';
import { BudgetCategory } from '@/types/budget';

export const BudgetCategoryManager = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultBudgetCategories);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    type: 'expense',
    isDefault: false,
  });

  const mainCategories = getMainBudgetCategories();

  const handleAddCategory = () => {
    if (newCategory.name) {
      const category: BudgetCategory = {
        id: `custom-${Date.now()}`,
        name: newCategory.name,
        type: newCategory.type || 'expense',
        color: newCategory.color || 'hsl(var(--primary))',
        icon: newCategory.icon,
        isDefault: false,
        parentCategory: newCategory.parentCategory,
      };
      
      setCategories([...categories, category]);
      setNewCategory({ type: 'expense', isDefault: false });
      setShowAddDialog(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId && cat.parentCategory !== categoryId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Budget Categories</h3>
          <p className="text-sm text-muted-foreground">
            Manage your income and expense categories for better budget tracking
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your budget items
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategory.name || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="category-type">Type</Label>
                <Select
                  value={newCategory.type}
                  onValueChange={(value: 'income' | 'expense') => 
                    setNewCategory({ ...newCategory, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parent-category">Parent Category (Optional)</Label>
                <Select
                  value={newCategory.parentCategory || ''}
                  onValueChange={(value) => 
                    setNewCategory({ ...newCategory, parentCategory: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Main Category)</SelectItem>
                    {mainCategories
                      .filter(cat => cat.type === newCategory.type)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Expense Categories
            </CardTitle>
            <CardDescription>Categories for tracking expenses and spending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainCategories
              .filter(category => category.type === 'expense')
              .map((category) => {
                const subcategories = getSubcategories(category.id);
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {subcategories.length > 0 && (
                            <span className="text-sm text-muted-foreground ml-2">
                              ({subcategories.length} subcategories)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {category.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                        {!category.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {subcategories.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {subcategories.map((subcat) => (
                          <div key={subcat.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">{subcat.name}</span>
                            {!subcat.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(subcat.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Income Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Income Categories
            </CardTitle>
            <CardDescription>Categories for tracking income and revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainCategories
              .filter(category => category.type === 'income')
              .map((category) => {
                const subcategories = getSubcategories(category.id);
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {subcategories.length > 0 && (
                            <span className="text-sm text-muted-foreground ml-2">
                              ({subcategories.length} subcategories)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {category.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                        {!category.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {subcategories.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {subcategories.map((subcat) => (
                          <div key={subcat.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">{subcat.name}</span>
                            {!subcat.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(subcat.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};