import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Celebration } from '@/components/ConfettiAnimation';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, DollarSign, Calendar, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalculatorInputs {
  portfolioValue: number;
  annualReturn: number;
  timeHorizon: number;
  monthlySpending: number;
  socialSecurity: number;
  pension: number;
  otherIncome: number;
  inflation: number;
  currentFeeModel: number;
  bfoFeeModel: number;
  bfoFeeType: 'flat' | 'hybrid';
}

interface CalculationResults {
  currentTotalFees: number;
  bfoTotalFees: number;
  totalSavings: number;
  monthsExtended: number;
  currentEndingValue: number;
  bfoEndingValue: number;
}

export default function ValueCalculator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackCalculatorView, trackCalculatorRun, trackCalculatorDownloadPdf, trackCalculatorCtaClicked } = useEventTracking();
  
  const [inputs, setInputs] = useState<CalculatorInputs>({
    portfolioValue: 1000000,
    annualReturn: 7,
    timeHorizon: 20,
    monthlySpending: 8000,
    socialSecurity: 2500,
    pension: 0,
    otherIncome: 0,
    inflation: 2,
    currentFeeModel: 1.0,
    bfoFeeModel: 50000,
    bfoFeeType: 'flat'
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    trackCalculatorView();
  }, [trackCalculatorView]);

  const results = useMemo((): CalculationResults => {
    const {
      portfolioValue,
      annualReturn,
      timeHorizon,
      monthlySpending,
      socialSecurity,
      pension,
      otherIncome,
      inflation,
      currentFeeModel,
      bfoFeeModel,
      bfoFeeType
    } = inputs;

    const annualReturnRate = annualReturn / 100;
    const inflationRate = inflation / 100;
    const netMonthlySpending = monthlySpending - socialSecurity - pension - otherIncome;
    const annualNetSpending = Math.max(0, netMonthlySpending * 12);

    let currentValue = portfolioValue;
    let bfoValue = portfolioValue;
    let currentTotalFees = 0;
    let bfoTotalFees = 0;

    for (let year = 1; year <= timeHorizon; year++) {
      // Calculate fees
      const currentFee = currentValue * (currentFeeModel / 100);
      const bfoFee = bfoFeeType === 'flat' ? bfoFeeModel : bfoValue * (bfoFeeModel / 100);
      
      currentTotalFees += currentFee;
      bfoTotalFees += bfoFee;

      // Calculate inflation-adjusted spending
      const inflationMultiplier = Math.pow(1 + inflationRate, year - 1);
      const inflatedAnnualSpending = annualNetSpending * inflationMultiplier;

      // Apply returns, subtract fees and spending
      currentValue = (currentValue - currentFee - inflatedAnnualSpending) * (1 + annualReturnRate);
      bfoValue = (bfoValue - bfoFee - inflatedAnnualSpending) * (1 + annualReturnRate);

      // Prevent negative values
      currentValue = Math.max(0, currentValue);
      bfoValue = Math.max(0, bfoValue);
    }

    const totalSavings = currentTotalFees - bfoTotalFees;
    const finalInflatedMonthlySpending = netMonthlySpending * Math.pow(1 + inflationRate, timeHorizon);
    const monthsExtended = finalInflatedMonthlySpending > 0 ? totalSavings / finalInflatedMonthlySpending : 0;

    return {
      currentTotalFees,
      bfoTotalFees,
      totalSavings,
      monthsExtended,
      currentEndingValue: currentValue,
      bfoEndingValue: bfoValue
    };
  }, [inputs]);

  useEffect(() => {
    if (results.totalSavings > 0 && !showCelebration) {
      setShowCelebration(true);
      
      // Play chime if audio is enabled
      if (audioEnabled) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyu2oYCCl+yunYhTADHm695+O2eSkGH3DJ8Nlp');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Graceful failure
      }

      // Track the calculation
      trackCalculatorRun(inputs, results);
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [results.totalSavings, showCelebration, audioEnabled, trackCalculatorRun, inputs, results]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadPdf = () => {
    trackCalculatorDownloadPdf();
    toast({
      title: "PDF Generation",
      description: "Your calculation report will be available for download shortly.",
    });
  };

  const handleRetirementRoadmap = () => {
    trackCalculatorCtaClicked('retirement_roadmap');
    if (user) {
      navigate('/dashboard/retirement-roadmap');
    } else {
      navigate('/auth/signup?next=/dashboard/retirement-roadmap');
    }
  };

  const handleTalkToAdvisor = () => {
    trackCalculatorCtaClicked('talk_to_advisor');
    navigate('/marketplace?persona=advisor');
  };

  return (
    <div className="min-h-screen bg-background">
      <Celebration trigger={showCelebration} />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex items-center gap-2"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {audioEnabled ? 'Mute' : 'Unmute'} Effects
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Value & Longevity Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how fee optimization extends your wealth and spending timeline
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Panel */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Financial Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Portfolio Value */}
              <div className="space-y-2">
                <Label htmlFor="portfolioValue">Portfolio Value</Label>
                <Input
                  id="portfolioValue"
                  type="number"
                  value={inputs.portfolioValue}
                  onChange={(e) => setInputs(prev => ({ ...prev, portfolioValue: Number(e.target.value) }))}
                />
              </div>

              {/* Annual Return */}
              <div className="space-y-2">
                <Label htmlFor="annualReturn">Annual Portfolio Return (%)</Label>
                <Slider
                  value={[inputs.annualReturn]}
                  onValueChange={([value]) => setInputs(prev => ({ ...prev, annualReturn: value }))}
                  max={12}
                  min={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">{inputs.annualReturn}%</div>
              </div>

              {/* Time Horizon */}
              <div className="space-y-2">
                <Label htmlFor="timeHorizon">Time Horizon (Years)</Label>
                <div className="flex gap-2 mb-2">
                  {[10, 20, 30].map((years) => (
                    <Button
                      key={years}
                      variant={inputs.timeHorizon === years ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputs(prev => ({ ...prev, timeHorizon: years }))}
                    >
                      {years}y
                    </Button>
                  ))}
                </div>
                <Input
                  id="timeHorizon"
                  type="number"
                  value={inputs.timeHorizon}
                  onChange={(e) => setInputs(prev => ({ ...prev, timeHorizon: Number(e.target.value) }))}
                />
              </div>

              {/* Monthly Spending */}
              <div className="space-y-2">
                <Label htmlFor="monthlySpending" className="text-primary font-medium">Monthly Spending (Primary Field)</Label>
                <Input
                  id="monthlySpending"
                  type="number"
                  value={inputs.monthlySpending}
                  onChange={(e) => setInputs(prev => ({ ...prev, monthlySpending: Number(e.target.value) }))}
                  className="border-primary"
                />
              </div>

              {/* Income Offsets */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Monthly Income Offsets</Label>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="socialSecurity" className="text-sm">Social Security</Label>
                    <Input
                      id="socialSecurity"
                      type="number"
                      value={inputs.socialSecurity}
                      onChange={(e) => setInputs(prev => ({ ...prev, socialSecurity: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pension" className="text-sm">Pension</Label>
                    <Input
                      id="pension"
                      type="number"
                      value={inputs.pension}
                      onChange={(e) => setInputs(prev => ({ ...prev, pension: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherIncome" className="text-sm">Other Income</Label>
                    <Input
                      id="otherIncome"
                      type="number"
                      value={inputs.otherIncome}
                      onChange={(e) => setInputs(prev => ({ ...prev, otherIncome: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              {/* Inflation */}
              <div className="space-y-2">
                <Label>Inflation Rate</Label>
                <Select value={inputs.inflation.toString()} onValueChange={(value) => setInputs(prev => ({ ...prev, inflation: Number(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="1">1%</SelectItem>
                    <SelectItem value="2">2%</SelectItem>
                    <SelectItem value="3">3%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fee Models */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentFeeModel">Current AUM Fee (%)</Label>
                  <Slider
                    value={[inputs.currentFeeModel]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, currentFeeModel: value }))}
                    max={2.0}
                    min={0.25}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">{inputs.currentFeeModel}%</div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">BFO Fee Model</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={inputs.bfoFeeType === 'hybrid'}
                      onCheckedChange={(checked) => setInputs(prev => ({ ...prev, bfoFeeType: checked ? 'hybrid' : 'flat' }))}
                    />
                    <Label>{inputs.bfoFeeType === 'hybrid' ? 'Hybrid (AUM % + Flat)' : 'Flat Annual Fee'}</Label>
                  </div>
                  <Input
                    type="number"
                    value={inputs.bfoFeeModel}
                    onChange={(e) => setInputs(prev => ({ ...prev, bfoFeeModel: Number(e.target.value) }))}
                    placeholder={inputs.bfoFeeType === 'hybrid' ? 'AUM %' : 'Annual Fee ($)'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Big Number Tiles */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Current Total Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{formatCurrency(results.currentTotalFees)}</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">BFO Total Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(results.bfoTotalFees)}</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(results.totalSavings)}</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Months Extended</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{Math.round(results.monthsExtended)}</div>
                  <div className="text-sm text-muted-foreground">months</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Portfolio Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Model Ending Value:</span>
                  <span className="font-medium">{formatCurrency(results.currentEndingValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>BFO Model Ending Value:</span>
                  <span className="font-medium text-primary">{formatCurrency(results.bfoEndingValue)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Value Difference:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(results.bfoEndingValue - results.currentEndingValue)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                onClick={handleRetirementRoadmap}
                className="w-full"
                size="lg"
              >
                See Your Retirement Roadmap
              </Button>
              
              <Button
                onClick={handleTalkToAdvisor}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Talk to an Advisor
              </Button>
              
              <Button
                onClick={handleDownloadPdf}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}