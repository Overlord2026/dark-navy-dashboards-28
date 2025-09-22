import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SequenceRiskInput } from '@/engines/sequenceRisk/sequenceRiskEngine';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface SequenceRiskInputsProps {
  input: SequenceRiskInput;
  onUpdateInput: (updates: Partial<SequenceRiskInput>) => void;
  onUpdateAssetAllocation: (allocation: Partial<SequenceRiskInput['assetAllocation']>) => void;
  onUpdatePhaseProtection: (protection: Partial<SequenceRiskInput['phaseProtection']>) => void;
}

export const SequenceRiskInputs: React.FC<SequenceRiskInputsProps> = ({
  input,
  onUpdateInput,
  onUpdateAssetAllocation,
  onUpdatePhaseProtection
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Settings</CardTitle>
          <CardDescription>Configure initial portfolio and withdrawal parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="initialPortfolio">Initial Portfolio</Label>
              <Input
                id="initialPortfolio"
                type="number"
                value={input.initialPortfolio}
                onChange={(e) => onUpdateInput({ initialPortfolio: Number(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(input.initialPortfolio)}
              </p>
            </div>
            
            <div>
              <Label htmlFor="annualWithdrawal">Annual Withdrawal</Label>
              <Input
                id="annualWithdrawal"
                type="number"
                value={input.annualWithdrawal}
                onChange={(e) => onUpdateInput({ annualWithdrawal: Number(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(input.annualWithdrawal)} ({formatPercentage(input.annualWithdrawal / input.initialPortfolio)})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="retirementAge">Retirement Age</Label>
              <Input
                id="retirementAge"
                type="number"
                value={input.retirementAge}
                onChange={(e) => onUpdateInput({ retirementAge: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="longevityAge">Life Expectancy</Label>
              <Input
                id="longevityAge"
                type="number"
                value={input.longevityAge}
                onChange={(e) => onUpdateInput({ longevityAge: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="startYear">Retirement Start Year</Label>
            <Input
              id="startYear"
              type="number"
              min="1990"
              max="2024"
              value={input.startYear}
              onChange={(e) => onUpdateInput({ startYear: Number(e.target.value) })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Choose a year between 1990-2024 to simulate historical returns
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inflationAdjusted"
              checked={input.inflationAdjustedWithdrawals}
              onCheckedChange={(checked) => onUpdateInput({ inflationAdjustedWithdrawals: checked })}
            />
            <Label htmlFor="inflationAdjusted">Inflation-Adjusted Withdrawals</Label>
          </div>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Set portfolio allocation between stocks and bonds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Stocks: {input.assetAllocation.stocks}%</Label>
            <Slider
              value={[input.assetAllocation.stocks]}
              onValueChange={([value]) => {
                onUpdateAssetAllocation({ 
                  stocks: value, 
                  bonds: 100 - value 
                });
              }}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Bonds: {input.assetAllocation.bonds}%</Label>
            <Slider
              value={[input.assetAllocation.bonds]}
              onValueChange={([value]) => {
                onUpdateAssetAllocation({ 
                  bonds: value, 
                  stocks: 100 - value 
                });
              }}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Current Allocation</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Stocks (S&P 500):</span>
                <span className="font-medium">{input.assetAllocation.stocks}%</span>
              </div>
              <div className="flex justify-between">
                <span>Bonds:</span>
                <span className="font-medium">{input.assetAllocation.bonds}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Protection */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Phase Protection Strategy</CardTitle>
          <CardDescription>
            Protect against sequence risk with safer investments during early retirement years
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="phaseProtection"
              checked={input.phaseProtection?.enabled || false}
              onCheckedChange={(checked) => onUpdatePhaseProtection({ enabled: checked })}
            />
            <Label htmlFor="phaseProtection">Enable Phase Protection</Label>
          </div>

          {input.phaseProtection?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="incomeNowYears">Protection Years</Label>
                <Input
                  id="incomeNowYears"
                  type="number"
                  value={input.phaseProtection.incomeNowYears}
                  onChange={(e) => onUpdatePhaseProtection({ incomeNowYears: Number(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Years of safer investments
                </p>
              </div>

              <div>
                <Label htmlFor="incomeNowReturn">Expected Return</Label>
                <Input
                  id="incomeNowReturn"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={input.phaseProtection.incomeNowReturn}
                  onChange={(e) => onUpdatePhaseProtection({ incomeNowReturn: Number(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercentage(input.phaseProtection.incomeNowReturn)} (e.g., private credit)
                </p>
              </div>

              <div>
                <Label htmlFor="maxDrawdown">Max Drawdown</Label>
                <Input
                  id="maxDrawdown"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={input.phaseProtection.maxDrawdown}
                  onChange={(e) => onUpdatePhaseProtection({ maxDrawdown: Number(e.target.value) })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercentage(input.phaseProtection.maxDrawdown)} maximum loss
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};