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
import { HelpCircle, RotateCcw, TrendingUp, DollarSign, Clock, Heart, Calculator, Share, FileDown, Sparkles } from 'lucide-react';
import CountUp from 'react-countup';
import { Celebration } from '@/components/ConfettiAnimation';
import { PrizeModal } from '@/components/PrizeModal';
import { playSound } from '@/utils/sounds';
import { DiamondTrophy, GoldenTrophy, SilverTrophy, BronzeTrophy } from '@/components/TrophyIcons';

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
    timeHorizonOptions,
    resetToDefaults,
    calculateSavings
  } = useValueDrivenSavings();

  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prize, setPrize] = useState<{
    prizeText: string;
    analogy: string;
    tier: 'fireworks' | 'fanfare' | 'champagne' | 'cash';
    icon: React.ReactNode;
    primaryCta: {
      label: string;
      onClick: () => void;
    };
    secondaryCta: {
      label: string;
      onClick: () => void;
    };
  } | null>(null);



  const trackAnalytics = (event: string, properties: Record<string, any>) => {
    // Analytics tracking - replace with your preferred analytics service
    console.log('Analytics Event:', event, properties);
    // Example: analytics.track(event, properties);
  };

  const triggerCelebration = (savings: number) => {
    setShowConfetti(true);
    
    let prizeText = "", analogy = "", soundKey: 'cash' | 'champagne' | 'fanfare' | 'fireworks' = 'cash';
    let tier: 'fireworks' | 'fanfare' | 'champagne' | 'cash' = 'cash';
    let icon: React.ReactNode = <BronzeTrophy />;
    let primaryCtaLabel = "Book My Free Savings Review";
    
    if (savings > 1_000_000) {
      prizeText = "Generational Wealth!";
      analogy = "That's enough to buy a second home or endow a family legacy!";
      soundKey = "fireworks";
      tier = "fireworks";
      icon = <DiamondTrophy />;
      primaryCtaLabel = "Schedule Executive Wealth Review";
    } else if (savings > 500_000) {
      prizeText = "Incredible Savings!";
      analogy = "You could fund a decade of concierge healthcare or two luxury world cruises.";
      soundKey = "fanfare";
      tier = "fanfare";
      icon = <GoldenTrophy />;
      primaryCtaLabel = "Book My Private Consultation";
    } else if (savings > 250_000) {
      prizeText = "Major Milestone!";
      analogy = "That's a med school tuition or 8 years of family health insurance.";
      soundKey = "champagne";
      tier = "champagne";
      icon = <SilverTrophy />;
      primaryCtaLabel = "Get My Personalized Analysis";
    } else if (savings > 100_000) {
      prizeText = "Big Win!";
      analogy = "That's a new Tesla or a luxury European vacation every 5 years.";
      soundKey = "cash";
      tier = "cash";
      icon = <BronzeTrophy />;
      primaryCtaLabel = "Book My Free Savings Review";
    }

    if (prizeText) {
      const prizeData = {
        prizeText,
        analogy,
        tier,
        icon,
        primaryCta: {
          label: primaryCtaLabel,
          onClick: () => {
            trackAnalytics('cta_clicked', { 
              tier, 
              savings_amount: savings, 
              cta_type: 'primary',
              cta_label: primaryCtaLabel 
            });
            window.open("/schedule", "_blank");
          }
        },
        secondaryCta: {
          label: "Share My Savings",
          onClick: () => {
            trackAnalytics('share_clicked', { 
              tier, 
              savings_amount: savings 
            });
            handleShare();
          }
        }
      };
      
      setPrize(prizeData);
      playSound(soundKey);
      
      // Track celebration event
      trackAnalytics('celebration_triggered', {
        tier,
        savings_amount: savings,
        prize_text: prizeText
      });
    }
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setShowResults(false);
    
    // Simulate calculation time for dramatic effect
    setTimeout(() => {
      const calculated = calculateSavings();
      setResults(calculated);
      setIsCalculating(false);
      setShowResults(true);
      
      // Trigger celebration based on savings amount
      triggerCelebration(calculated.totalFeeSavings);
    }, 1000);
  };

  const handleShare = async () => {
    const shareText = `💰 I could save ${formatCurrency(results?.totalFeeSavings || 0)} on investment fees over ${timeHorizon} years! That's ${formatNumber(results?.longevityYears || 0)} additional years of funding. ${prize?.analogy || "Real savings achieved!"} \n\nCalculate your savings: ${window.location.origin}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Investment Fee Savings Calculator Results',
          text: shareText,
          url: window.location.origin
        });
        trackAnalytics('share_completed', { 
          method: 'native',
          savings_amount: results?.totalFeeSavings || 0,
          tier: prize?.tier || 'unknown'
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        trackAnalytics('share_completed', { 
          method: 'clipboard',
          savings_amount: results?.totalFeeSavings || 0,
          tier: prize?.tier || 'unknown'
        });
        // Show success feedback
        alert('Savings details copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      trackAnalytics('share_failed', { 
        error: error.message,
        savings_amount: results?.totalFeeSavings || 0 
      });
    }
  };

  const isFormValid = portfolioValue > 0 && growthRate > 0 && timeHorizon > 0 && currentAdvisorFee > 0 && ourFee > 0 && annualWithdrawal > 0;

  const chartData = results ? results.traditional.yearlyBalances.map((balance: number, index: number) => ({
    year: index,
    traditional: balance / 1000000,
    valueModel: results.valueModel.yearlyBalances[index] / 1000000
  })) : [];

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
      <Celebration trigger={showConfetti} />
      
      <PrizeModal
        open={!!prize}
        prizeText={prize?.prizeText || ""}
        analogy={prize?.analogy || ""}
        icon={prize?.icon}
        primaryCta={prize?.primaryCta}
        secondaryCta={prize?.secondaryCta}
        onClose={() => {
          trackAnalytics('modal_closed', { 
            tier: prize?.tier || 'unknown',
            savings_amount: results?.totalFeeSavings || 0 
          });
          setPrize(null);
        }}
      />
      
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

        {/* Calculate Button */}
        <div className="space-y-4">
          <Button 
            onClick={() => {
              trackAnalytics('calculate_clicked', {
                portfolio_value: portfolioValue,
                time_horizon: timeHorizon,
                current_fee: currentAdvisorFee,
                our_fee: ourFee
              });
              handleCalculate();
            }} 
            disabled={!isFormValid || isCalculating}
            size="lg"
            className="w-full text-lg py-6"
          >
            <Calculator className="h-5 w-5 mr-2" />
            {isCalculating ? "Crunching the numbers..." : "See My Savings"}
          </Button>


          {/* Results Cards */}
          {showResults && results && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <DashboardCard title="Current Advisor" className="text-center">
                  <div className="space-y-2">
                    <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div className="text-2xl font-bold text-foreground">
                      <CountUp
                        start={0}
                        end={results.traditional.finalValue}
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
                        end={results.valueModel.finalValue}
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
                        end={results.totalFeeSavings}
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
                        end={results.longevityYears}
                        duration={2}
                        decimals={1}
                        formattingFn={(num) => formatNumber(num)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Additional Years</p>
                  </div>
                </DashboardCard>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    trackAnalytics('share_button_clicked', {
                      source: 'results_section',
                      savings_amount: results?.totalFeeSavings || 0
                    });
                    handleShare();
                  }} 
                  variant="outline"
                  className="hover:scale-105 transition-all duration-200"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share My Savings
                </Button>
                <Button 
                  onClick={() => {
                    trackAnalytics('download_report_clicked', {
                      savings_amount: results?.totalFeeSavings || 0,
                      time_horizon: timeHorizon
                    });
                    alert('Report download coming soon!');
                  }}
                  variant="outline"
                  className="hover:scale-105 transition-all duration-200"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart - Only show when results are available */}
      {showResults && results && (
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
      )}
    </div>
  );
};