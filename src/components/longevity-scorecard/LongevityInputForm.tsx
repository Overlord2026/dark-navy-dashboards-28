import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { LongevityInputs } from '@/hooks/useLongevityScorecard';

interface LongevityInputFormProps {
  inputs: LongevityInputs;
  onUpdateInput: (field: keyof LongevityInputs, value: any) => void;
  onUpdateBucketAllocation: (bucket: keyof LongevityInputs['bucketAllocations'], value: number) => void;
}

export const LongevityInputForm: React.FC<LongevityInputFormProps> = ({
  inputs,
  onUpdateInput,
  onUpdateBucketAllocation
}) => {
  const formatInputValue = (value: number, type: 'currency' | 'percentage' | 'number') => {
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  const totalBucketAllocation = Object.values(inputs.bucketAllocations).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Personal Information
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Basic information about your current situation and retirement goals</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Current Age</Label>
            <Input
              id="age"
              type="number"
              value={inputs.age}
              onChange={(e) => onUpdateInput('age', parseInt(e.target.value) || 0)}
              min="18"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retirementAge">Expected Retirement Age</Label>
            <Input
              id="retirementAge"
              type="number"
              value={inputs.expectedRetirementAge}
              onChange={(e) => onUpdateInput('expectedRetirementAge', parseInt(e.target.value) || 0)}
              min={inputs.age}
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthspan">
              Expected Years of Good Health
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 ml-1 inline text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How many years do you expect to remain healthy and active in retirement?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="healthspan"
              type="number"
              value={inputs.healthspanYears}
              onChange={(e) => onUpdateInput('healthspanYears', parseInt(e.target.value) || 0)}
              min="1"
              max="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifespan">Projected Lifespan</Label>
            <Input
              id="lifespan"
              type="number"
              value={inputs.projectedLifespan}
              onChange={(e) => onUpdateInput('projectedLifespan', parseInt(e.target.value) || 0)}
              min={inputs.expectedRetirementAge}
              max="120"
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="assets">Current Total Assets</Label>
            <Input
              id="assets"
              type="number"
              value={inputs.currentAssets}
              onChange={(e) => onUpdateInput('currentAssets', parseInt(e.target.value) || 0)}
              min="0"
              step="10000"
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(inputs.currentAssets)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Income</Label>
            <Input
              id="income"
              type="number"
              value={inputs.annualIncome}
              onChange={(e) => onUpdateInput('annualIncome', parseInt(e.target.value) || 0)}
              min="0"
              step="5000"
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(inputs.annualIncome)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spending">Annual Spending Needs in Retirement</Label>
            <Input
              id="spending"
              type="number"
              value={inputs.annualSpending}
              onChange={(e) => onUpdateInput('annualSpending', parseInt(e.target.value) || 0)}
              min="0"
              step="5000"
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(inputs.annualSpending)} (in today's dollars)
            </p>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              Expected Inflation Rate
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Inflation increases your cost of living each year. Use our default or adjust for your own assumptions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="space-y-2">
              <Slider
                value={[inputs.inflationRate]}
                onValueChange={(value) => onUpdateInput('inflationRate', value[0])}
                max={7}
                min={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span className="font-medium">{inputs.inflationRate}%</span>
                <span>7%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bucket Allocations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Asset Bucket Strategy
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Allocate your assets across different time horizons for optimal risk management</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Income Now (Years 1-5): {inputs.bucketAllocations.incomeNow}%</Label>
              <Slider
                value={[inputs.bucketAllocations.incomeNow]}
                onValueChange={(value) => onUpdateBucketAllocation('incomeNow', value[0])}
                max={60}
                min={0}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Conservative investments: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.incomeNow / 100)}
              </p>
            </div>

            <div className="space-y-4">
              <Label>Income Later (Years 6-15): {inputs.bucketAllocations.incomeLater}%</Label>
              <Slider
                value={[inputs.bucketAllocations.incomeLater]}
                onValueChange={(value) => onUpdateBucketAllocation('incomeLater', value[0])}
                max={60}
                min={0}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Moderate growth: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.incomeLater / 100)}
              </p>
            </div>

            <div className="space-y-4">
              <Label>Growth (Years 16+): {inputs.bucketAllocations.growth}%</Label>
              <Slider
                value={[inputs.bucketAllocations.growth]}
                onValueChange={(value) => onUpdateBucketAllocation('growth', value[0])}
                max={70}
                min={0}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Long-term growth: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.growth / 100)}
              </p>
            </div>

            <div className="space-y-4">
              <Label>Legacy: {inputs.bucketAllocations.legacy}%</Label>
              <Slider
                value={[inputs.bucketAllocations.legacy]}
                onValueChange={(value) => onUpdateBucketAllocation('legacy', value[0])}
                max={30}
                min={0}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Estate planning: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.legacy / 100)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Allocation:</span>
              <span className={`font-bold ${totalBucketAllocation === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {totalBucketAllocation}%
              </span>
            </div>
            {totalBucketAllocation !== 100 && (
              <p className="text-xs text-orange-600 mt-1">
                Allocation should total 100%
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};