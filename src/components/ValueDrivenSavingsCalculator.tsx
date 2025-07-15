import React, { useState, useEffect } from 'react';
import { useValueDrivenSavings } from '@/hooks/useValueDrivenSavings';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { HelpCircle, RotateCcw, TrendingUp, DollarSign, Clock, Heart } from 'lucide-react';
import CountUp from 'react-countup';
import Confetti from 'react-confetti';

interface ValueDrivenSavingsCalculatorProps {
  isHeroWidget?: boolean;
  className?: string;
}

export const ValueDrivenSavingsCalculator: React.FC<ValueDrivenSavingsCalculatorProps> = ({ 
  isHeroWidget = false,
  className = "" 
}) => {
  const {
    portfolioValue,
    setPortfolioValue,
    growthRate,
    setGrowthRate,
    timeHorizon,
    setTimeHorizon,
    currentAdvisorFee,
    setCurrentAdvisorFee,
    ourFee,
    setOurFee,
    ourFeeType,
    setOurFeeType,
    annualWithdrawal,
    setAnnualWithdrawal,
    calculations,
    timeHorizonOptions,
    resetToDefaults
  } = useValueDrivenSavings();

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (calculations.totalFeeSavings > 250000) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [calculations.totalFeeSavings]);

  const chartData = calculations.traditional.yearlyBalances.map((balance, index) => ({
    year: index,
    traditional: balance / 1000000,
    valueModel: calculations.valueModel.yearlyBalances[index] / 1000000
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <div className="text-center space-y-2">
        <h1 className={`font-bold text-foreground ${isHeroWidget ? 'text-3xl' : 'text-4xl'}`}>
          Value-Driven Pricing Model Savings Calculator
        </h1>
        <p className="text-muted-foreground text-lg">
          See how our lower fees can extend your wealth and fund your healthspan goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <DashboardCard title="Input Parameters" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="portfolio">Current Portfolio Value</Label>
              <Input
                id="portfolio"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="growth">Expected Annual Growth Rate (%)</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={[growthRate]}
                  onValueChange={(value) => setGrowthRate(value[0])}
                  max={15}
                  min={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">
                  {formatNumber(growthRate)}%
                </div>
              </div>
            </div>

            <div>
              <Label>Time Horizon</Label>
              <div className="flex gap-2 mt-2">
                {timeHorizonOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={timeHorizon === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeHorizon(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="currentFee">Current Advisor Fee (% of AUM)</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={[currentAdvisorFee]}
                  onValueChange={(value) => setCurrentAdvisorFee(value[0])}
                  max={3}
                  min={0.5}
                  step={0.05}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">
                  {formatNumber(currentAdvisorFee)}%
                </div>
              </div>
            </div>

            <div>
              <Label>Our Fee Model</Label>
              <RadioGroup
                value={ourFeeType}
                onValueChange={(value) => setOurFeeType(value as 'percentage' | 'flat')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Lower % of AUM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat" id="flat" />
                  <Label htmlFor="flat">Flat Annual Fee</Label>
                </div>
              </RadioGroup>
              
              {ourFeeType === 'percentage' ? (
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[ourFee]}
                    onValueChange={(value) => setOurFee(value[0])}
                    max={2}
                    min={0.25}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {formatNumber(ourFee)}%
                  </div>
                </div>
              ) : (
                <Input
                  type="number"
                  value={ourFee}
                  onChange={(e) => setOurFee(Math.max(0, Number(e.target.value)))}
                  className="mt-2"
                  placeholder="Annual fee amount"
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="withdrawal">Annual Withdrawal for Longevity</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calculated as extra portfolio growth divided by your selected annual withdrawal for health or retirement.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="withdrawal"
                type="number"
                value={annualWithdrawal}
                onChange={(e) => setAnnualWithdrawal(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <Button onClick={resetToDefaults} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </DashboardCard>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DashboardCard title="Current Advisor" className="text-center">
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-2xl font-bold text-foreground">
                  <CountUp
                    start={0}
                    end={calculations.traditional.finalValue}
                    duration={2}
                    formattingFn={formatCurrency}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Final Portfolio Value</p>
              </div>
            </DashboardCard>

            <DashboardCard title="Our Value Model" className="text-center">
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-accent" />
                <div className="text-2xl font-bold text-accent">
                  <CountUp
                    start={0}
                    end={calculations.valueModel.finalValue}
                    duration={2}
                    formattingFn={formatCurrency}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Final Portfolio Value</p>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DashboardCard title="Total Fee Savings" className="text-center">
              <div className="space-y-2">
                <DollarSign className="h-8 w-8 mx-auto text-green-500" />
                <div className="text-2xl font-bold text-green-500">
                  <CountUp
                    start={0}
                    end={calculations.totalFeeSavings}
                    duration={2}
                    formattingFn={formatCurrency}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Over {timeHorizon} Years</p>
              </div>
            </DashboardCard>

            <DashboardCard title="Longevity Years Gained" className="text-center">
              <div className="space-y-2">
                <Heart className="h-8 w-8 mx-auto text-red-500" />
                <div className="text-2xl font-bold text-red-500">
                  <CountUp
                    start={0}
                    end={calculations.longevityYears}
                    duration={2}
                    decimals={1}
                    formattingFn={(num) => formatNumber(num)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Additional Years</p>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>

      {/* Chart */}
      <DashboardCard title="Portfolio Growth Comparison" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Portfolio Value ($M)', angle: -90, position: 'insideLeft' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="traditional"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              name="Current Advisor"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="valueModel"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              name="Our Value Model"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard>
    </div>
  );
};