import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Holding {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  market_value: number;
  cost_basis?: number;
  asset_class: string;
  sector?: string;
  expense_ratio?: number;
  dividend_yield?: number;
}

const assetClasses = [
  { value: 'equity', label: 'Equity' },
  { value: 'bond', label: 'Bond' },
  { value: 'international_equity', label: 'International Equity' },
  { value: 'emerging_markets', label: 'Emerging Markets' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'cash', label: 'Cash' },
  { value: 'alternative', label: 'Alternative' }
];

const sectors = [
  'Technology', 'Healthcare', 'Financial Services', 'Consumer Discretionary',
  'Communication Services', 'Industrials', 'Consumer Staples', 'Energy',
  'Utilities', 'Materials', 'Real Estate'
];

export const ManualEntryForm: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentHolding, setCurrentHolding] = useState<Partial<Holding>>({
    ticker: '',
    name: '',
    quantity: 0,
    market_value: 0,
    asset_class: 'equity'
  });

  const addHolding = () => {
    if (!currentHolding.ticker || !currentHolding.name || !currentHolding.market_value) {
      toast.error('Please fill in required fields (ticker, name, and market value)');
      return;
    }

    const newHolding: Holding = {
      id: Date.now().toString(),
      ticker: currentHolding.ticker!,
      name: currentHolding.name!,
      quantity: currentHolding.quantity || 0,
      market_value: currentHolding.market_value!,
      cost_basis: currentHolding.cost_basis,
      asset_class: currentHolding.asset_class!,
      sector: currentHolding.sector,
      expense_ratio: currentHolding.expense_ratio,
      dividend_yield: currentHolding.dividend_yield
    };

    if (editingIndex !== null) {
      const updatedHoldings = [...holdings];
      updatedHoldings[editingIndex] = newHolding;
      setHoldings(updatedHoldings);
      setEditingIndex(null);
      toast.success('Holding updated successfully');
    } else {
      setHoldings([...holdings, newHolding]);
      toast.success('Holding added successfully');
    }

    // Reset form
    setCurrentHolding({
      ticker: '',
      name: '',
      quantity: 0,
      market_value: 0,
      asset_class: 'equity'
    });
  };

  const editHolding = (index: number) => {
    setCurrentHolding(holdings[index]);
    setEditingIndex(index);
  };

  const deleteHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
    toast.success('Holding deleted');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setCurrentHolding({
      ticker: '',
      name: '',
      quantity: 0,
      market_value: 0,
      asset_class: 'equity'
    });
  };

  const importFromCSV = () => {
    // Create file input for CSV import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const importedHoldings: Holding[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length < 3) continue;
          
          const holding: Holding = {
            id: Date.now().toString() + i,
            ticker: values[headers.indexOf('ticker')] || values[0],
            name: values[headers.indexOf('name')] || values[1],
            quantity: parseFloat(values[headers.indexOf('quantity')] || values[2]) || 0,
            market_value: parseFloat(values[headers.indexOf('market_value')] || values[3]) || 0,
            cost_basis: parseFloat(values[headers.indexOf('cost_basis')] || '') || undefined,
            asset_class: values[headers.indexOf('asset_class')] || 'equity',
            sector: values[headers.indexOf('sector')] || undefined,
            expense_ratio: parseFloat(values[headers.indexOf('expense_ratio')] || '') || undefined,
            dividend_yield: parseFloat(values[headers.indexOf('dividend_yield')] || '') || undefined
          };
          
          importedHoldings.push(holding);
        }
        
        setHoldings([...holdings, ...importedHoldings]);
        toast.success(`Imported ${importedHoldings.length} holdings from CSV`);
      } catch (error) {
        toast.error('Failed to import CSV file');
      }
    };
    input.click();
  };

  const getTotalValue = () => {
    return holdings.reduce((sum, h) => sum + h.market_value, 0);
  };

  return (
    <div className="space-y-6">
      {/* Import Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Quick Import
          </CardTitle>
          <CardDescription>
            Import holdings from a CSV file or enter manually below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={importFromCSV} variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Import from CSV
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            CSV should include columns: ticker, name, quantity, market_value, asset_class
          </p>
        </CardContent>
      </Card>

      {/* Manual Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingIndex !== null ? 'Edit Holding' : 'Add Holding'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ticker">Ticker Symbol *</Label>
              <Input
                id="ticker"
                value={currentHolding.ticker || ''}
                onChange={(e) => setCurrentHolding({ ...currentHolding, ticker: e.target.value.toUpperCase() })}
                placeholder="e.g., AAPL"
              />
            </div>

            <div>
              <Label htmlFor="name">Security Name *</Label>
              <Input
                id="name"
                value={currentHolding.name || ''}
                onChange={(e) => setCurrentHolding({ ...currentHolding, name: e.target.value })}
                placeholder="e.g., Apple Inc."
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity/Shares</Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                value={currentHolding.quantity || 0}
                onChange={(e) => setCurrentHolding({ ...currentHolding, quantity: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="market_value">Market Value *</Label>
              <Input
                id="market_value"
                type="number"
                step="0.01"
                value={currentHolding.market_value || 0}
                onChange={(e) => setCurrentHolding({ ...currentHolding, market_value: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="cost_basis">Cost Basis</Label>
              <Input
                id="cost_basis"
                type="number"
                step="0.01"
                value={currentHolding.cost_basis || ''}
                onChange={(e) => setCurrentHolding({ ...currentHolding, cost_basis: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="asset_class">Asset Class *</Label>
              <Select
                value={currentHolding.asset_class}
                onValueChange={(value) => setCurrentHolding({ ...currentHolding, asset_class: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset class" />
                </SelectTrigger>
                <SelectContent>
                  {assetClasses.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sector">Sector</Label>
              <Select
                value={currentHolding.sector || ''}
                onValueChange={(value) => setCurrentHolding({ ...currentHolding, sector: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expense_ratio">Expense Ratio (%)</Label>
              <Input
                id="expense_ratio"
                type="number"
                step="0.01"
                value={currentHolding.expense_ratio || ''}
                onChange={(e) => setCurrentHolding({ ...currentHolding, expense_ratio: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="dividend_yield">Dividend Yield (%)</Label>
              <Input
                id="dividend_yield"
                type="number"
                step="0.01"
                value={currentHolding.dividend_yield || ''}
                onChange={(e) => setCurrentHolding({ ...currentHolding, dividend_yield: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={addHolding} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? 'Update Holding' : 'Add Holding'}
            </Button>
            {editingIndex !== null && (
              <Button onClick={cancelEdit} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Holdings List */}
      {holdings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings ({holdings.length})</CardTitle>
            <CardDescription>
              Total Value: ${getTotalValue().toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {holdings.map((holding, index) => (
                <div key={holding.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{holding.ticker}</span>
                      <span className="text-sm text-gray-500">{holding.name}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {holding.asset_class} • {holding.sector || 'No sector'}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium">${holding.market_value.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {((holding.market_value / getTotalValue()) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => editHolding(index)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteHolding(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};