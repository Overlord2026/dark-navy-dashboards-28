import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Account {
  name: string;
  value: number;
  asset_class?: string;
  tax_deferred?: boolean;
}

interface FeeModel {
  id: string;
  name: string;
  description: string;
  tiers: any[];
}

interface Assumptions {
  growth_pct: number;
  horizon_years: number;
  turnover_pct: number;
}

interface FeeScenarioBuilderProps {
  feeModels: FeeModel[];
  onCalculate: (data: {
    accounts: Account[];
    current_model: FeeModel;
    proposed_model: FeeModel;
    assumptions: Assumptions;
  }) => void;
  isLoading?: boolean;
  isDemo?: boolean;
}

export const FeeScenarioBuilder: React.FC<FeeScenarioBuilderProps> = ({
  feeModels,
  onCalculate,
  isLoading = false,
  isDemo = false
}) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([
    { name: 'Taxable Brokerage', value: 600000, asset_class: 'Mixed', tax_deferred: false },
    { name: 'IRA', value: 300000, asset_class: 'Mixed', tax_deferred: true },
    { name: 'Cash', value: 100000, asset_class: 'Cash', tax_deferred: false }
  ]);

  const [currentModelId, setCurrentModelId] = useState('');
  const [proposedModelId, setProposedModelId] = useState('');
  const [assumptions, setAssumptions] = useState<Assumptions>({
    growth_pct: 5,
    horizon_years: 10,
    turnover_pct: 10
  });

  useEffect(() => {
    // Set default models if available
    if (feeModels.length > 0 && !currentModelId) {
      setCurrentModelId(feeModels[0].id);
    }
    if (feeModels.length > 1 && !proposedModelId) {
      const bfoModel = feeModels.find(m => m.name.toLowerCase().includes('bfo'));
      setProposedModelId(bfoModel?.id || feeModels[1].id);
    }
  }, [feeModels, currentModelId, proposedModelId]);

  const addAccount = () => {
    setAccounts(prev => [...prev, { 
      name: 'New Account', 
      value: 0, 
      asset_class: 'Mixed', 
      tax_deferred: false 
    }]);
  };

  const removeAccount = (index: number) => {
    if (accounts.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one account is required.",
        variant: "destructive"
      });
      return;
    }
    setAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const updateAccount = (index: number, field: keyof Account, value: any) => {
    setAccounts(prev => prev.map((account, i) => 
      i === index ? { ...account, [field]: value } : account
    ));
  };

  const getTotalAUM = () => {
    return accounts.reduce((sum, account) => sum + account.value, 0);
  };

  const validateForm = (): boolean => {
    if (accounts.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one account is required.",
        variant: "destructive"
      });
      return false;
    }

    if (getTotalAUM() <= 0) {
      toast({
        title: "Validation Error",
        description: "Total AUM must be greater than zero.",
        variant: "destructive"
      });
      return false;
    }

    if (!currentModelId || !proposedModelId) {
      toast({
        title: "Validation Error",
        description: "Both current and proposed fee models must be selected.",
        variant: "destructive"
      });
      return false;
    }

    if (currentModelId === proposedModelId) {
      toast({
        title: "Validation Error",
        description: "Current and proposed models must be different.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    const currentModel = feeModels.find(m => m.id === currentModelId);
    const proposedModel = feeModels.find(m => m.id === proposedModelId);

    if (!currentModel || !proposedModel) {
      toast({
        title: "Error",
        description: "Selected fee models not found.",
        variant: "destructive"
      });
      return;
    }

    onCalculate({
      accounts,
      current_model: currentModel,
      proposed_model: proposedModel,
      assumptions
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Accounts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Household Accounts</CardTitle>
            <Button type="button" onClick={addAccount} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div key={index} className="grid md:grid-cols-6 gap-3 items-end">
                <div className="md:col-span-2">
                  <Label className="text-xs">Account Name</Label>
                  <Input
                    value={account.name}
                    onChange={(e) => updateAccount(index, 'name', e.target.value)}
                    placeholder="Account name"
                  />
                </div>
                <div>
                  <Label className="text-xs">Value ($)</Label>
                  <Input
                    type="number"
                    value={account.value}
                    onChange={(e) => updateAccount(index, 'value', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1000"
                  />
                </div>
                <div>
                  <Label className="text-xs">Asset Class</Label>
                  <Select
                    value={account.asset_class || 'Mixed'}
                    onValueChange={(value) => updateAccount(index, 'asset_class', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                      <SelectItem value="Stocks">Stocks</SelectItem>
                      <SelectItem value="Bonds">Bonds</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Alternatives">Alternatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`tax-deferred-${index}`}
                    checked={account.tax_deferred || false}
                    onChange={(e) => updateAccount(index, 'tax_deferred', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`tax-deferred-${index}`} className="text-xs">
                    Tax Deferred
                  </Label>
                </div>
                <div>
                  {accounts.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAccount(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total AUM:</span>
              <span className="text-lg font-bold">{formatCurrency(getTotalAUM())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Models Section */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Model Comparison</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Current Fee Model</Label>
            <Select value={currentModelId} onValueChange={setCurrentModelId}>
              <SelectTrigger>
                <SelectValue placeholder="Select current model" />
              </SelectTrigger>
              <SelectContent>
                {feeModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Proposed Fee Model</Label>
            <Select value={proposedModelId} onValueChange={setProposedModelId}>
              <SelectTrigger>
                <SelectValue placeholder="Select proposed model" />
              </SelectTrigger>
              <SelectContent>
                {feeModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assumptions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Assumptions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Expected Annual Return (%)</Label>
            <Input
              type="number"
              value={assumptions.growth_pct}
              onChange={(e) => setAssumptions(prev => ({ 
                ...prev, 
                growth_pct: parseFloat(e.target.value) || 5 
              }))}
              min="0"
              max="20"
              step="0.1"
            />
          </div>
          <div>
            <Label>Time Horizon (Years)</Label>
            <Input
              type="number"
              value={assumptions.horizon_years}
              onChange={(e) => setAssumptions(prev => ({ 
                ...prev, 
                horizon_years: parseInt(e.target.value) || 10 
              }))}
              min="1"
              max="50"
            />
          </div>
          <div>
            <Label>Portfolio Turnover (%)</Label>
            <Input
              type="number"
              value={assumptions.turnover_pct}
              onChange={(e) => setAssumptions(prev => ({ 
                ...prev, 
                turnover_pct: parseFloat(e.target.value) || 10 
              }))}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleCalculate} 
          disabled={isLoading}
          size="lg"
          className="px-8"
        >
          <Calculator className="h-5 w-5 mr-2" />
          {isLoading ? 'Calculating...' : 'Calculate Fee Impact'}
        </Button>
      </div>
    </div>
  );
};