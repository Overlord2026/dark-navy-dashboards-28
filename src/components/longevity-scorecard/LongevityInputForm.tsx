import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Crown, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { LongevityInputs } from '@/hooks/useLongevityScorecard';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface LongevityInputFormProps {
  inputs: LongevityInputs;
  onUpdateInput: (field: keyof LongevityInputs, value: any) => void;
  onUpdateBucketAllocation: (bucket: keyof LongevityInputs['bucketAllocations'], value: number) => void;
  isQuickStart?: boolean;
  hasReturnedUser?: boolean;
}

const TooltipIcon: React.FC<{ content: string; className?: string }> = ({ content, className = "h-4 w-4" }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className={`${className} text-muted-foreground cursor-help`} />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const LongevityInputForm: React.FC<LongevityInputFormProps> = ({
  inputs,
  onUpdateInput,
  onUpdateBucketAllocation,
  isQuickStart = false,
  hasReturnedUser = false
}) => {
  const { subscriptionPlan } = useSubscriptionAccess();
  const isPremium = subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';
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
      {/* Return User Message */}
      {hasReturnedUser && !isQuickStart && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome back! We've saved your previous data.</span>
              <Badge variant="secondary" className="ml-auto">Update your numbers</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Badge */}
      {isQuickStart && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Quick Start mode: Estimated score based on typical values</span>
              <Badge variant="default" className="ml-auto">Refine for accuracy</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Personal Information
            <TooltipIcon content="Basic information about your current situation and retirement goals" />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              Current Age
              <TooltipIcon content="Your current age in years" className="h-3 w-3" />
            </Label>
            <Input
              id="age"
              type="number"
              value={inputs.age}
              onChange={(e) => onUpdateInput('age', parseInt(e.target.value) || 0)}
              min="18"
              max="100"
              className="text-lg p-3 h-12"
              aria-describedby="age-help"
            />
            <p id="age-help" className="text-xs text-muted-foreground sr-only">
              Enter your current age between 18 and 100
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retirementAge" className="flex items-center gap-2">
              Expected Retirement Age
              <TooltipIcon content="The age at which you plan to stop working full-time" className="h-3 w-3" />
            </Label>
            <Input
              id="retirementAge"
              type="number"
              value={inputs.expectedRetirementAge}
              onChange={(e) => onUpdateInput('expectedRetirementAge', parseInt(e.target.value) || 0)}
              min={inputs.age}
              max="100"
              className="text-lg p-3 h-12"
              aria-describedby="retirement-help"
            />
            <p id="retirement-help" className="text-xs text-muted-foreground sr-only">
              Age when you plan to retire, must be at least your current age
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthspan" className="flex items-center gap-2">
              Expected Years of Good Health
              <TooltipIcon content="How many years do you expect to remain healthy and active in retirement? This affects healthcare costs and lifestyle planning." className="h-3 w-3" />
            </Label>
            <Input
              id="healthspan"
              type="number"
              value={inputs.healthspanYears}
              onChange={(e) => onUpdateInput('healthspanYears', parseInt(e.target.value) || 0)}
              min="1"
              max="50"
              className="text-lg p-3 h-12"
              aria-describedby="healthspan-help"
            />
            <p id="healthspan-help" className="text-xs text-muted-foreground">
              Years of active, healthy living you expect in retirement
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifespan" className="flex items-center gap-2">
              Projected Lifespan
              <TooltipIcon content="Your estimated total lifespan. Consider family history, health, and lifestyle factors." className="h-3 w-3" />
            </Label>
            <Input
              id="lifespan"
              type="number"
              value={inputs.projectedLifespan}
              onChange={(e) => onUpdateInput('projectedLifespan', parseInt(e.target.value) || 0)}
              min={inputs.expectedRetirementAge}
              max="120"
              className="text-lg p-3 h-12"
              aria-describedby="lifespan-help"
            />
            <p id="lifespan-help" className="text-xs text-muted-foreground">
              Your estimated total lifespan based on health and family history
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Financial Information
            <TooltipIcon content="Your current financial situation and retirement income needs" />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="assets" className="flex items-center gap-2">
              Current Total Assets
              <TooltipIcon content="All investable assets including 401k, IRA, savings, investments (excluding primary residence)" className="h-3 w-3" />
            </Label>
            <Input
              id="assets"
              type="number"
              value={inputs.currentAssets}
              onChange={(e) => onUpdateInput('currentAssets', parseInt(e.target.value) || 0)}
              min="0"
              step="10000"
              className="text-lg p-3 h-12"
              aria-describedby="assets-help"
            />
            <p id="assets-help" className="text-xs text-muted-foreground">
              {formatCurrency(inputs.currentAssets)} - Include retirement accounts, investments, savings
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income" className="flex items-center gap-2">
              Annual Income
              <TooltipIcon content="Your current gross annual income from all sources" className="h-3 w-3" />
            </Label>
            <Input
              id="income"
              type="number"
              value={inputs.annualIncome}
              onChange={(e) => onUpdateInput('annualIncome', parseInt(e.target.value) || 0)}
              min="0"
              step="5000"
              className="text-lg p-3 h-12"
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(inputs.annualIncome)} - Before taxes and deductions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spending" className="flex items-center gap-2">
              Annual Spending Needs in Retirement
              <TooltipIcon content="How much you estimate you'll need to spend each year in retirement (in today's purchasing power)" className="h-3 w-3" />
            </Label>
            <Input
              id="spending"
              type="number"
              value={inputs.annualSpending}
              onChange={(e) => onUpdateInput('annualSpending', parseInt(e.target.value) || 0)}
              min="0"
              step="5000"
              className="text-lg p-3 h-12"
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(inputs.annualSpending)} (in today's dollars)
            </p>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              Expected Inflation Rate
              <TooltipIcon content="Inflation increases your cost of living each year. Historical average is 2-3%. Use our default or adjust for your own assumptions." />
            </Label>
            <div className="space-y-2">
              <Slider
                value={[inputs.inflationRate]}
                onValueChange={(value) => onUpdateInput('inflationRate', value[0])}
                max={7}
                min={1}
                step={0.1}
                className="w-full h-6 cursor-pointer"
                aria-label="Expected inflation rate"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span className="font-medium text-base">{inputs.inflationRate}%</span>
                <span>7%</span>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          {isPremium && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Include Social Security
                  <Crown className="h-3 w-3 text-amber-500" />
                  <TooltipIcon content="Add Social Security benefits to your retirement income calculation" className="h-3 w-3" />
                </Label>
                <Switch
                  checked={inputs.includeSSI}
                  onCheckedChange={(checked) => onUpdateInput('includeSSI', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {inputs.includeSSI && (
                <div className="space-y-2">
                  <Label htmlFor="socialSecurity" className="flex items-center gap-2">
                    Annual Social Security Benefit
                    <TooltipIcon content="Estimated annual Social Security benefit in today's dollars" className="h-3 w-3" />
                  </Label>
                  <Input
                    id="socialSecurity"
                    type="number"
                    value={inputs.socialSecurityAmount}
                    onChange={(e) => onUpdateInput('socialSecurityAmount', parseInt(e.target.value) || 0)}
                    min="0"
                    step="1000"
                    className="text-lg p-3 h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(inputs.socialSecurityAmount)} annual benefit
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Market Scenario
                  <Crown className="h-3 w-3 text-amber-500" />
                  <TooltipIcon content="Choose different market return scenarios for stress testing" className="h-3 w-3" />
                </Label>
                <Select value={inputs.marketScenario} onValueChange={(value) => onUpdateInput('marketScenario', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (5-6% returns)</SelectItem>
                    <SelectItem value="moderate">Moderate (6-7% returns)</SelectItem>
                    <SelectItem value="historical">Historical (7-8% returns)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {!isPremium && (
            <div className="md:col-span-2">
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-medium">Upgrade to Premium for Social Security integration and advanced market scenarios</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bucket Allocations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Asset Bucket Strategy
            <TooltipIcon content="Allocate your assets across different time horizons for optimal risk management. This bucket approach helps protect against sequence of returns risk." />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Income Now (Years 1-5): {inputs.bucketAllocations.incomeNow}%
                <TooltipIcon content="Conservative investments like CDs, bonds, and money market funds for immediate retirement income needs" className="h-3 w-3" />
              </Label>
              <Slider
                value={[inputs.bucketAllocations.incomeNow]}
                onValueChange={(value) => onUpdateBucketAllocation('incomeNow', value[0])}
                max={60}
                min={0}
                step={5}
                className="h-6 cursor-pointer"
                aria-label="Income Now bucket allocation"
              />
              <p className="text-xs text-muted-foreground">
                Conservative investments: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.incomeNow / 100)}
              </p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Income Later (Years 6-15): {inputs.bucketAllocations.incomeLater}%
                <TooltipIcon content="Moderate growth investments like balanced funds and dividend stocks for medium-term income" className="h-3 w-3" />
              </Label>
              <Slider
                value={[inputs.bucketAllocations.incomeLater]}
                onValueChange={(value) => onUpdateBucketAllocation('incomeLater', value[0])}
                max={60}
                min={0}
                step={5}
                className="h-6 cursor-pointer"
                aria-label="Income Later bucket allocation"
              />
              <p className="text-xs text-muted-foreground">
                Moderate growth: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.incomeLater / 100)}
              </p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Growth (Years 16+): {inputs.bucketAllocations.growth}%
                <TooltipIcon content="Growth investments like stock funds and ETFs for long-term wealth building and inflation protection" className="h-3 w-3" />
              </Label>
              <Slider
                value={[inputs.bucketAllocations.growth]}
                onValueChange={(value) => onUpdateBucketAllocation('growth', value[0])}
                max={70}
                min={0}
                step={5}
                className="h-6 cursor-pointer"
                aria-label="Growth bucket allocation"
              />
              <p className="text-xs text-muted-foreground">
                Long-term growth: {formatCurrency(inputs.currentAssets * inputs.bucketAllocations.growth / 100)}
              </p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Legacy: {inputs.bucketAllocations.legacy}%
                <TooltipIcon content="Assets set aside for estate planning, inheritance, and charitable giving" className="h-3 w-3" />
              </Label>
              <Slider
                value={[inputs.bucketAllocations.legacy]}
                onValueChange={(value) => onUpdateBucketAllocation('legacy', value[0])}
                max={30}
                min={0}
                step={5}
                className="h-6 cursor-pointer"
                aria-label="Legacy bucket allocation"
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