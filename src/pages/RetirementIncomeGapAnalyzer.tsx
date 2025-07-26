import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Calculator, DollarSign, Star } from 'lucide-react';
import CountUp from 'react-countup';
import { useEventTracking } from '@/hooks/useEventTracking';

export default function RetirementIncomeGapAnalyzer() {
  const navigate = useNavigate();
  const { trackCalculatorUsed, trackFeatureUsed } = useEventTracking();
  const [currentAge, setCurrentAge] = useState(45);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentIncome, setCurrentIncome] = useState(150000);
  const [desiredIncomeReplacement, setDesiredIncomeReplacement] = useState(80);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [estimatedSocialSecurity, setEstimatedSocialSecurity] = useState(30000);
  const [showResults, setShowResults] = useState(false);

  const calculateGap = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const desiredAnnualIncome = currentIncome * (desiredIncomeReplacement / 100);
    const neededFromSavings = desiredAnnualIncome - estimatedSocialSecurity;
    
    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
    
    // Calculate future value of monthly contributions
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    const futureValueContributions = monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    
    const totalSavingsAtRetirement = futureValueCurrentSavings + futureValueContributions;
    
    // Using 4% withdrawal rule
    const availableAnnualIncome = totalSavingsAtRetirement * 0.04;
    const gap = neededFromSavings - availableAnnualIncome;
    
    return {
      desiredAnnualIncome,
      neededFromSavings,
      totalSavingsAtRetirement,
      availableAnnualIncome,
      gap,
      isOnTrack: gap <= 0,
      shortfallPercentage: gap > 0 ? (gap / neededFromSavings) * 100 : 0
    };
  };

  const handleAnalyze = () => {
    const results = calculateGap();
    setShowResults(true);
    
    // Track calculator usage
    trackCalculatorUsed('income_gap_analyzer', {
      currentAge,
      retirementAge,
      currentIncome,
      projectedSavings: results.totalSavingsAtRetirement,
      gap: results.gap,
      isOnTrack: results.isOnTrack
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const results = showResults ? calculateGap() : null;

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'gap_analyzer' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handleEmailResults = () => {
    // Track lead capture attempt
    trackFeatureUsed('save_results_request', { 
      source: 'gap_analyzer', 
      tool: 'income_gap_analyzer' 
    });
    
    // Show lead capture form (placeholder for now)
    const email = prompt('Enter your email to save your results:');
    if (email) {
      console.log('Lead captured:', email);
      // TODO: Implement proper lead capture integration
      alert('Results saved! Check your email for details.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" onClick={() => navigate('/')} />
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Calculator */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Retirement Income Gap Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover if your retirement savings will generate enough income to maintain your desired lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Your Information
                </CardTitle>
                <CardDescription>
                  Enter your details to analyze your retirement income gap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentIncome">Current Annual Income</Label>
                  <Input
                    id="currentIncome"
                    type="number"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="desiredReplacement">Desired Income Replacement (%)</Label>
                  <Input
                    id="desiredReplacement"
                    type="number"
                    value={desiredIncomeReplacement}
                    onChange={(e) => setDesiredIncomeReplacement(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Most retirees need 70-90% of pre-retirement income
                  </p>
                </div>

                <div>
                  <Label htmlFor="currentSavings">Current Retirement Savings</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyContribution">Monthly Retirement Contribution</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="socialSecurity">Estimated Annual Social Security</Label>
                  <Input
                    id="socialSecurity"
                    type="number"
                    value={estimatedSocialSecurity}
                    onChange={(e) => setEstimatedSocialSecurity(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Check your estimate at ssa.gov
                  </p>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Analyze My Income Gap
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {showResults && results ? (
              <div className="space-y-6">
                {/* Status Card */}
                <Card className={results.isOnTrack ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'}>
                  <CardHeader className="text-center">
                    {results.isOnTrack ? (
                      <>
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                        <CardTitle className="text-green-700 dark:text-green-400">
                          You're On Track!
                        </CardTitle>
                        <CardDescription>
                          Your current savings plan should meet your retirement income goals
                        </CardDescription>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-2" />
                        <CardTitle className="text-red-700 dark:text-red-400">
                          Income Gap Detected
                        </CardTitle>
                        <CardDescription>
                          You may need to adjust your savings strategy
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>
                </Card>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Retirement Income Need</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        <CountUp
                          start={0}
                          end={results.desiredAnnualIncome}
                          duration={2}
                          formattingFn={formatCurrency}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Annual income desired</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Projected Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        <CountUp
                          start={0}
                          end={results.totalSavingsAtRetirement}
                          duration={2}
                          formattingFn={formatCurrency}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Total at retirement</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Available Annual Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        <CountUp
                          start={0}
                          end={results.availableAnnualIncome + estimatedSocialSecurity}
                          duration={2}
                          formattingFn={formatCurrency}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(results.availableAnnualIncome)} from savings + {formatCurrency(estimatedSocialSecurity)} Social Security
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {results.isOnTrack ? 'Surplus' : 'Shortfall'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${results.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                        <CountUp
                          start={0}
                          end={Math.abs(results.gap)}
                          duration={2}
                          formattingFn={formatCurrency}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {results.isOnTrack ? 'Extra income available' : 'Additional income needed'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>
                      {results.isOnTrack 
                        ? 'Great job! Consider these optimization opportunities:'
                        : 'Here are strategies to close your income gap:'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="flex-1"
                        onClick={handleScheduleReview}
                      >
                        Schedule Strategy Session
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleEmailResults}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Save My Results
                      </Button>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Get Your Customized Retirement Roadmap</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {results.isOnTrack 
                          ? 'Optimize your strategy with tax-efficient withdrawal planning and advanced strategies.'
                          : 'Get a detailed plan to close your income gap with specific action steps and timeline.'
                        }
                      </p>
                      <Button variant="outline" size="sm" onClick={() => navigate('/roadmap-info')}>
                        Learn More About Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Analyze?</CardTitle>
                  <CardDescription>
                    Fill out the form on the left to see your retirement income gap analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Your personalized income gap analysis will appear here
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">What you'll discover:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Whether you're on track for your retirement goals</li>
                      <li>• How much income your savings will generate</li>
                      <li>• Specific strategies to close any gaps</li>
                      <li>• Optimization opportunities for better outcomes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Tools */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Complete Your Retirement Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Button variant="outline" onClick={() => navigate('/scorecard')}>
                Take Confidence Scorecard
              </Button>
              <Button variant="outline" onClick={() => navigate('/calculator')}>
                Calculate Fee Impact
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Explore All Tools
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}