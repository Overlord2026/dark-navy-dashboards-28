import { useState } from 'react';
import { TransactionFilter, Category } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TransactionFiltersProps {
  filter: TransactionFilter;
  categories: Category[];
  onFilterChange: (filter: TransactionFilter) => void;
}

export function TransactionFilters({ filter, categories, onFilterChange }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (updates: Partial<TransactionFilter>) => {
    onFilterChange({ ...filter, ...updates });
  };

  const clearFilter = (key: keyof TransactionFilter) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    onFilterChange(newFilter);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.keys(filter).length;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search transactions..."
          value={filter.search || ''}
          onChange={(e) => updateFilter({ search: e.target.value || undefined })}
          className="flex-1"
        />
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">{getActiveFilterCount()}</Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      <CollapsibleContent>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filter.categoryIds?.[0] || 'all'}
                  onValueChange={(value) => 
                    updateFilter({ 
                      categoryIds: value === 'all' ? undefined : [value] 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select
                  value={filter.type || 'all'}
                  onValueChange={(value) => 
                    updateFilter({ type: value === 'all' ? undefined : value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filter.status || 'all'}
                  onValueChange={(value) => 
                    updateFilter({ status: value === 'all' ? undefined : value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filter.amountMin || ''}
                    onChange={(e) => updateFilter({ 
                      amountMin: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filter.amountMax || ''}
                    onChange={(e) => updateFilter({ 
                      amountMax: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filter.dateFrom || ''}
                    onChange={(e) => updateFilter({ 
                      dateFrom: e.target.value || undefined 
                    })}
                  />
                  <Input
                    type="date"
                    value={filter.dateTo || ''}
                    onChange={(e) => updateFilter({ 
                      dateTo: e.target.value || undefined 
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {getActiveFilterCount() > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Active Filters</label>
                <div className="flex flex-wrap gap-2">
                  {filter.search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filter.search}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => clearFilter('search')}
                      />
                    </Badge>
                  )}
                  {filter.categoryIds?.length && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {categories.find(c => c.id === filter.categoryIds![0])?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => clearFilter('categoryIds')}
                      />
                    </Badge>
                  )}
                  {filter.type && (
                    <Badge variant="secondary" className="gap-1">
                      Type: {filter.type}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => clearFilter('type')}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}