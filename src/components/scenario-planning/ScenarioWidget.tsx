import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Calculator, TrendingUp, Heart, Leaf, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScenarioWidgetProps {
  onRunScenario: (scenarioType: string, scenarioName: string, parameters: any) => void;
  loading?: boolean;
}

const SCENARIO_TYPES = [
  {
    id: 'roth_conversion',
    title: 'Roth IRA Conversion',
    icon: Calculator,
    description: 'Analyze the tax implications and long-term benefits of converting traditional IRA to Roth IRA',
    color: 'text-blue-600'
  },
  {
    id: 'nua',
    title: 'Net Unrealized Appreciation',
    icon: TrendingUp,
    description: 'Evaluate NUA strategy for employer stock in 401(k) plans',
    color: 'text-green-600'
  },
  {
    id: 'charitable',
    title: 'Charitable Giving',
    icon: Heart,
    description: 'Optimize charitable giving strategies for tax efficiency',
    color: 'text-purple-600'
  },
  {
    id: 'loss_harvesting',
    title: 'Tax Loss Harvesting',
    icon: Leaf,
    description: 'Maximize tax savings through strategic loss harvesting',
    color: 'text-orange-600'
  }
];

export function ScenarioWidget({ onRunScenario, loading = false }: ScenarioWidgetProps) {
  const [activeScenario, setActiveScenario] = useState('roth_conversion');
  const [scenarioName, setScenarioName] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRunScenario = () => {
    if (!scenarioName.trim()) {
      return;
    }

    onRunScenario(activeScenario, scenarioName, formData);
  };

  const renderRothConversionInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="currentAge">Current Age</Label>
        <Input
          id="currentAge"
          type="number"
          placeholder="45"
          value={formData.currentAge || ''}
          onChange={(e) => updateFormData('currentAge', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="retirementAge">Retirement Age</Label>
        <Input
          id="retirementAge"
          type="number"
          placeholder="65"
          value={formData.retirementAge || ''}
          onChange={(e) => updateFormData('retirementAge', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="traditionalIRA">Traditional IRA Balance</Label>
        <Input
          id="traditionalIRA"
          type="number"
          placeholder="500000"
          value={formData.traditionalIRA || ''}
          onChange={(e) => updateFormData('traditionalIRA', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conversionAmount">Conversion Amount</Label>
        <Input
          id="conversionAmount"
          type="number"
          placeholder="100000"
          value={formData.conversionAmount || ''}
          onChange={(e) => updateFormData('conversionAmount', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentTaxRate">Current Tax Rate (%)</Label>
        <Input
          id="currentTaxRate"
          type="number"
          placeholder="24"
          value={formData.currentTaxRate || ''}
          onChange={(e) => updateFormData('currentTaxRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="retirementTaxRate">Retirement Tax Rate (%)</Label>
        <Input
          id="retirementTaxRate"
          type="number"
          placeholder="22"
          value={formData.retirementTaxRate || ''}
          onChange={(e) => updateFormData('retirementTaxRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
        <Input
          id="expectedReturn"
          type="number"
          placeholder="7"
          value={formData.expectedReturn || ''}
          onChange={(e) => updateFormData('expectedReturn', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentIncome">Current Annual Income</Label>
        <Input
          id="currentIncome"
          type="number"
          placeholder="150000"
          value={formData.currentIncome || ''}
          onChange={(e) => updateFormData('currentIncome', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderNUAInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sharesOwned">Shares Owned</Label>
        <Input
          id="sharesOwned"
          type="number"
          placeholder="1000"
          value={formData.sharesOwned || ''}
          onChange={(e) => updateFormData('sharesOwned', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="costBasis">Cost Basis (Total)</Label>
        <Input
          id="costBasis"
          type="number"
          placeholder="50000"
          value={formData.costBasis || ''}
          onChange={(e) => updateFormData('costBasis', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentValue">Current Value (Total)</Label>
        <Input
          id="currentValue"
          type="number"
          placeholder="200000"
          value={formData.currentValue || ''}
          onChange={(e) => updateFormData('currentValue', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentTaxRate">Current Tax Rate (%)</Label>
        <Input
          id="currentTaxRate"
          type="number"
          placeholder="24"
          value={formData.currentTaxRate || ''}
          onChange={(e) => updateFormData('currentTaxRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ltcgRate">Long-term Capital Gains Rate (%)</Label>
        <Input
          id="ltcgRate"
          type="number"
          placeholder="15"
          value={formData.ltcgRate || ''}
          onChange={(e) => updateFormData('ltcgRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="holdingPeriod">Expected Holding Period (years)</Label>
        <Input
          id="holdingPeriod"
          type="number"
          placeholder="5"
          value={formData.holdingPeriod || ''}
          onChange={(e) => updateFormData('holdingPeriod', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderCharitableInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="donationAmount">Donation Amount</Label>
        <Input
          id="donationAmount"
          type="number"
          placeholder="25000"
          value={formData.donationAmount || ''}
          onChange={(e) => updateFormData('donationAmount', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="assetType">Asset Type</Label>
        <Select value={formData.assetType || ''} onValueChange={(value) => updateFormData('assetType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select asset type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="appreciated_stock">Appreciated Stock</SelectItem>
            <SelectItem value="real_estate">Real Estate</SelectItem>
            <SelectItem value="other">Other Asset</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="costBasis">Cost Basis</Label>
        <Input
          id="costBasis"
          type="number"
          placeholder="10000"
          value={formData.costBasis || ''}
          onChange={(e) => updateFormData('costBasis', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentValue">Current Value</Label>
        <Input
          id="currentValue"
          type="number"
          placeholder="25000"
          value={formData.currentValue || ''}
          onChange={(e) => updateFormData('currentValue', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          placeholder="24"
          value={formData.taxRate || ''}
          onChange={(e) => updateFormData('taxRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="charitableDeduction">AGI for Deduction Limit</Label>
        <Input
          id="charitableDeduction"
          type="number"
          placeholder="200000"
          value={formData.charitableDeduction || ''}
          onChange={(e) => updateFormData('charitableDeduction', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderLossHarvestingInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="lossesAvailable">Available Losses</Label>
        <Input
          id="lossesAvailable"
          type="number"
          placeholder="15000"
          value={formData.lossesAvailable || ''}
          onChange={(e) => updateFormData('lossesAvailable', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capitalGains">Capital Gains This Year</Label>
        <Input
          id="capitalGains"
          type="number"
          placeholder="10000"
          value={formData.capitalGains || ''}
          onChange={(e) => updateFormData('capitalGains', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ordinaryIncome">Ordinary Income</Label>
        <Input
          id="ordinaryIncome"
          type="number"
          placeholder="150000"
          value={formData.ordinaryIncome || ''}
          onChange={(e) => updateFormData('ordinaryIncome', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taxRate">Ordinary Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          placeholder="24"
          value={formData.taxRate || ''}
          onChange={(e) => updateFormData('taxRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ltcgRate">Long-term Capital Gains Rate (%)</Label>
        <Input
          id="ltcgRate"
          type="number"
          placeholder="15"
          value={formData.ltcgRate || ''}
          onChange={(e) => updateFormData('ltcgRate', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="carryforwardLosses">Existing Carryforward Losses</Label>
        <Input
          id="carryforwardLosses"
          type="number"
          placeholder="5000"
          value={formData.carryforwardLosses || ''}
          onChange={(e) => updateFormData('carryforwardLosses', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderInputs = () => {
    switch (activeScenario) {
      case 'roth_conversion':
        return renderRothConversionInputs();
      case 'nua':
        return renderNUAInputs();
      case 'charitable':
        return renderCharitableInputs();
      case 'loss_harvesting':
        return renderLossHarvestingInputs();
      default:
        return null;
    }
  };

  const selectedScenario = SCENARIO_TYPES.find(s => s.id === activeScenario);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Interactive Scenario Planning
        </CardTitle>
        <CardDescription>
          Run what-if scenarios to optimize your tax strategies with AI-powered analysis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeScenario} onValueChange={setActiveScenario} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            {SCENARIO_TYPES.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${scenario.color}`} />
                  <span className="hidden md:inline">{scenario.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {SCENARIO_TYPES.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <scenario.icon className={`h-6 w-6 ${scenario.color} mt-1`} />
                  <div>
                    <h3 className="text-lg font-semibold">{scenario.title}</h3>
                    <p className="text-muted-foreground">{scenario.description}</p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is for planning purposes only. Consult with a tax professional before making any decisions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenarioName">Scenario Name</Label>
                    <Input
                      id="scenarioName"
                      placeholder="e.g., 2024 Roth Conversion Plan"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                    />
                  </div>

                  {renderInputs()}

                  <div className="pt-4">
                    <Button
                      onClick={handleRunScenario}
                      disabled={loading || !scenarioName.trim()}
                      className="w-full"
                    >
                      {loading ? 'Running Analysis...' : 'Run AI Analysis'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}