/**
 * Multi-Phase Analysis Input Form
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  DollarSign, 
  Target, 
  Percent, 
  Calendar,
  TrendingUp,
  Settings,
  Info
} from 'lucide-react';
import { MultiPhaseInput, AlternativeAssetConfig } from '@/engines/multiPhase/multiPhaseEngine';

interface MultiPhaseInputsProps {
  input: MultiPhaseInput;
  onInputChange: (updates: Partial<MultiPhaseInput>) => void;
  onAlternativeAssetsChange: (updates: Partial<AlternativeAssetConfig>) => void;
  onAdvisorOverridesChange: (overrides: MultiPhaseInput['advisorOverrides']) => void;
  hasAlternativeAssetAccess: {
    privateCredit: boolean;
    infrastructure: boolean;
    cryptoStaking: boolean;
  };
}

export function MultiPhaseInputs({
  input,
  onInputChange,
  onAlternativeAssetsChange,
  onAdvisorOverridesChange,
  hasAlternativeAssetAccess
}: MultiPhaseInputsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (field: keyof MultiPhaseInput, value: any) => {
    onInputChange({ [field]: value });
  };

  const handleAlternativeAssetChange = (
    category: keyof AlternativeAssetConfig,
    field: string,
    value: number
  ) => {
    onAlternativeAssetsChange({
      [category]: {
        ...input.alternativeAssets[category],
        [field]: value
      }
    });
  };

  return (
    <div className="grid gap-6">
      {/* Demographics & Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={input.currentAge}
                  onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={input.retirementAge}
                  onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Financial Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetIncome">Target Annual Income</Label>
              <Input
                id="targetIncome"
                type="number"
                value={input.targetIncome}
                onChange={(e) => handleInputChange('targetIncome', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(input.targetIncome)} annually
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio & Contributions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Portfolio Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="portfolioValue">Current Portfolio Value</Label>
              <Input
                id="portfolioValue"
                type="number"
                value={input.portfolioValue}
                onChange={(e) => handleInputChange('portfolioValue', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(input.portfolioValue)}
              </p>
            </div>
            <div>
              <Label htmlFor="annualContribution">Annual Contribution</Label>
              <Input
                id="annualContribution"
                type="number"
                value={input.annualContribution}
                onChange={(e) => handleInputChange('annualContribution', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(input.annualContribution)} per year
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              Tax Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ordinaryTax">Ordinary Income</Label>
                <Input
                  id="ordinaryTax"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={input.taxRates.ordinary}
                  onChange={(e) => handleInputChange('taxRates', {
                    ...input.taxRates,
                    ordinary: parseFloat(e.target.value) || 0
                  })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.taxRates.ordinary * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="ltgTax">Long-Term Capital Gains</Label>
                <Input
                  id="ltgTax"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={input.taxRates.ltg}
                  onChange={(e) => handleInputChange('taxRates', {
                    ...input.taxRates,
                    ltg: parseFloat(e.target.value) || 0
                  })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.taxRates.ltg * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Alternative Asset Configuration
          </CardTitle>
          <CardDescription>
            Configure expected returns and risk parameters for alternative investments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Private Credit */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                Private Credit
                {hasAlternativeAssetAccess.privateCredit ? (
                  <Badge variant="default">Accessible</Badge>
                ) : (
                  <Badge variant="secondary">Min: $250K</Badge>
                )}
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="privateCreditReturn">Expected Return</Label>
                <Input
                  id="privateCreditReturn"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.privateCredit.expectedReturn}
                  onChange={(e) => handleAlternativeAssetChange(
                    'privateCredit',
                    'expectedReturn',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.privateCredit}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.privateCredit.expectedReturn * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="privateCreditDrawdown">Max Drawdown</Label>
                <Input
                  id="privateCreditDrawdown"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.privateCredit.maxDrawdown}
                  onChange={(e) => handleAlternativeAssetChange(
                    'privateCredit',
                    'maxDrawdown',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.privateCredit}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.privateCredit.maxDrawdown * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="privateCreditLiquidity">Liquidity Days</Label>
                <Input
                  id="privateCreditLiquidity"
                  type="number"
                  value={input.alternativeAssets.privateCredit.liquidityDays}
                  onChange={(e) => handleAlternativeAssetChange(
                    'privateCredit',
                    'liquidityDays',
                    parseInt(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.privateCredit}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Infrastructure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                Infrastructure
                {hasAlternativeAssetAccess.infrastructure ? (
                  <Badge variant="default">Accessible</Badge>
                ) : (
                  <Badge variant="secondary">Min: $500K</Badge>
                )}
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="infrastructureReturn">Expected Return</Label>
                <Input
                  id="infrastructureReturn"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.infrastructure.expectedReturn}
                  onChange={(e) => handleAlternativeAssetChange(
                    'infrastructure',
                    'expectedReturn',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.infrastructure}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.infrastructure.expectedReturn * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="infrastructureDrawdown">Max Drawdown</Label>
                <Input
                  id="infrastructureDrawdown"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.infrastructure.maxDrawdown}
                  onChange={(e) => handleAlternativeAssetChange(
                    'infrastructure',
                    'maxDrawdown',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.infrastructure}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.infrastructure.maxDrawdown * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="infrastructureLiquidity">Liquidity Days</Label>
                <Input
                  id="infrastructureLiquidity"
                  type="number"
                  value={input.alternativeAssets.infrastructure.liquidityDays}
                  onChange={(e) => handleAlternativeAssetChange(
                    'infrastructure',
                    'liquidityDays',
                    parseInt(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.infrastructure}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Crypto Staking */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                Crypto Staking
                {hasAlternativeAssetAccess.cryptoStaking ? (
                  <Badge variant="default">Accessible</Badge>
                ) : (
                  <Badge variant="secondary">Min: $10K</Badge>
                )}
              </h4>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="cryptoStakingAPR">Staking APR</Label>
                <Input
                  id="cryptoStakingAPR"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.cryptoStaking.stakingAPR}
                  onChange={(e) => handleAlternativeAssetChange(
                    'cryptoStaking',
                    'stakingAPR',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.cryptoStaking}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.cryptoStaking.stakingAPR * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="cryptoSlashing">Slashing Risk</Label>
                <Input
                  id="cryptoSlashing"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.cryptoStaking.slashingProb}
                  onChange={(e) => handleAlternativeAssetChange(
                    'cryptoStaking',
                    'slashingProb',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.cryptoStaking}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.cryptoStaking.slashingProb * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <Label htmlFor="cryptoUnbond">Unbond Days</Label>
                <Input
                  id="cryptoUnbond"
                  type="number"
                  value={input.alternativeAssets.cryptoStaking.unbondDays}
                  onChange={(e) => handleAlternativeAssetChange(
                    'cryptoStaking',
                    'unbondDays',
                    parseInt(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.cryptoStaking}
                />
              </div>
              <div>
                <Label htmlFor="cryptoTax">Tax Rate</Label>
                <Input
                  id="cryptoTax"
                  type="number"
                  step="0.001"
                  value={input.alternativeAssets.cryptoStaking.taxRate}
                  onChange={(e) => handleAlternativeAssetChange(
                    'cryptoStaking',
                    'taxRate',
                    parseFloat(e.target.value) || 0
                  )}
                  disabled={!hasAlternativeAssetAccess.cryptoStaking}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(input.alternativeAssets.cryptoStaking.taxRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}