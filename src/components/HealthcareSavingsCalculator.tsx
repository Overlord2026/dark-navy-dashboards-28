import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoldButton, GoldOutlineButton } from "@/components/ui/brandButtons";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DollarSign, TrendingUp, Calendar, Heart, Info, Percent } from "lucide-react";
import { useHealthcareSavings } from "@/hooks/useHealthcareSavings";
import { BfoCard } from '@/components/ui/BfoCard';

export default function HealthcareSavingsCalculator() {
  const {
    portfolioValue,
    setPortfolioValue,
    currentAdvisorFee,
    setCurrentAdvisorFee,
    currentFeeType,
    setCurrentFeeType,
    ourFee,
    setOurFee,
    ourFeeType,
    setOurFeeType,
    growthRate,
    setGrowthRate,
    timeHorizon,
    setTimeHorizon,
    metrics,
    timeHorizonOptions
  } = useHealthcareSavings();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Healthcare Savings Calculator</h1>
        <p className="text-muted-foreground">
          See how our value-driven pricing can fund your family's healthcare optimization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Parameters</CardTitle>
            <CardDescription>Adjust these settings to see your potential savings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Portfolio Value */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Current Portfolio Value</Label>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary-foreground" />
                </div>
                <Input
                  type="text"
                  value={portfolioValue.toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/,/g, '')) || 0;
                    setPortfolioValue(value);
                  }}
                  className="w-40"
                />
              </div>
            </div>

            {/* Growth Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Expected Annual Growth Rate</Label>
                <Badge variant="secondary">{growthRate}%</Badge>
              </div>
              <Slider
                value={[growthRate]}
                onValueChange={(value) => setGrowthRate(value[0])}
                max={12}
                min={4}
                step={0.5}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">Range: 4% - 12%</div>
            </div>

            {/* Time Horizon */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Time Horizon</Label>
              <div className="flex flex-wrap gap-2">
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

            {/* Current Advisor Fee */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Current Advisor Fee</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">$</Label>
                  <Switch
                    checked={currentFeeType === 'percentage'}
                    onCheckedChange={(checked) => setCurrentFeeType(checked ? 'percentage' : 'flat')}
                  />
                  <Label className="text-sm">%</Label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-destructive rounded flex items-center justify-center">
                  {currentFeeType === 'percentage' ? (
                    <Percent className="h-4 w-4 text-destructive-foreground" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-destructive-foreground" />
                  )}
                </div>
                <Input
                  type="text"
                  value={currentFeeType === 'percentage' ? `${currentAdvisorFee}%` : formatCurrency(currentAdvisorFee)}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[,%$]/g, '');
                    const value = parseFloat(cleanValue) || 0;
                    setCurrentAdvisorFee(value);
                  }}
                  className="w-32"
                />
              </div>
              <Slider
                value={[currentAdvisorFee]}
                onValueChange={(value) => setCurrentAdvisorFee(value[0])}
                max={currentFeeType === 'percentage' ? 3 : 50000}
                min={currentFeeType === 'percentage' ? 0.5 : 1000}
                step={currentFeeType === 'percentage' ? 0.25 : 1000}
                className="w-full"
              />
            </div>

            {/* Our Fee */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Our Fee</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">$</Label>
                  <Switch
                    checked={ourFeeType === 'percentage'}
                    onCheckedChange={(checked) => setOurFeeType(checked ? 'percentage' : 'flat')}
                  />
                  <Label className="text-sm">%</Label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  {ourFeeType === 'percentage' ? (
                    <Percent className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <Input
                  type="text"
                  value={ourFeeType === 'percentage' ? `${ourFee}%` : formatCurrency(ourFee)}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[,%$]/g, '');
                    const value = parseFloat(cleanValue) || 0;
                    setOurFee(value);
                  }}
                  className="w-32"
                />
              </div>
              <Slider
                value={[ourFee]}
                onValueChange={(value) => setOurFee(value[0])}
                max={ourFeeType === 'percentage' ? 2 : 30000}
                min={ourFeeType === 'percentage' ? 0.25 : 500}
                step={ourFeeType === 'percentage' ? 0.25 : 500}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Side-by-Side Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Comparison</CardTitle>
            <CardDescription>Traditional vs Value Model Results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Traditional Model</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Fee:</span>
                    <span className="font-medium">{formatCurrency(metrics.traditional.annualFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Final Value:</span>
                    <span className="font-medium">{formatCurrency(metrics.traditional.finalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Fees Paid:</span>
                    <span className="font-medium text-destructive">{formatCurrency(metrics.traditional.totalFees)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-primary">Value Model</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Fee:</span>
                    <span className="font-medium">{formatCurrency(metrics.valueModel.annualFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Final Value:</span>
                    <span className="font-medium">{formatCurrency(metrics.valueModel.finalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Fees Paid:</span>
                    <span className="font-medium text-primary">{formatCurrency(metrics.valueModel.totalFees)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <BfoCard className="mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatCurrency(metrics.annualFeeSavings)}
                </div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
              </div>
            </BfoCard>
          </CardContent>
        </Card>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Fee Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(metrics.annualFeeSavings)}
            </div>
            <p className="text-xs text-muted-foreground">Every year you save</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compound Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              {formatCurrency(metrics.totalCompoundSavings)}
            </div>
            <p className="text-xs text-muted-foreground">Over {timeHorizon} years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Additional Longevity</CardTitle>
            <Calendar className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              {metrics.additionalYears.toFixed(1)} years
            </div>
            <p className="text-xs text-muted-foreground">Your money lasts longer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthcare Funding</CardTitle>
            <Heart className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">
              {formatCurrency(metrics.healthcareFunding)}
            </div>
            <p className="text-xs text-muted-foreground">Annual healthcare budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Healthcare Integration Message */}
      <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Healthcare Optimization Integration</h3>
              <p className="text-sm text-muted-foreground">
                Your annual savings of <strong>{formatCurrency(metrics.annualFeeSavings)}</strong> can fund comprehensive 
                family health optimization including preventive care, advanced testing, personalized medicine, 
                and longevity protocols. This investment in your health can add decades to your lifespan 
                while improving quality of life.
              </p>
              <div className="flex gap-3 pt-2">
                <GoldButton>
                  Schedule Health Consultation
                </GoldButton>
                <GoldOutlineButton>
                  View Health Plans
                </GoldOutlineButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}