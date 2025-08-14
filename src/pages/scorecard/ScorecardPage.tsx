import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, Shield, Users, BookOpen, ArrowRight } from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { ScorecardParams, ScorecardResults, Account, HealthInputs } from '@/lib/scorecard/types';
import { runScorecardTaxAware } from '@/lib/scorecard/engine';
import { AccountsEditor } from '@/components/scorecard/AccountsEditor';
import { LTCPanel } from '@/components/scorecard/LTCPanel';
import { scorecardToRoadmap } from '@/lib/swag/transform';

export const ScorecardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { persona } = usePersona();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<ScorecardResults | null>(null);
  const [params, setParams] = useState<ScorecardParams>({
    currentAge: 45,
    targetRetirementAge: 65,
    lifeExpectancy: 90,
    currentIncome: 150000,
    savingsRate: 15,
    targetRetirementSpend: 120000,
    inflationRate: 0.03,
    expectedReturn: 0.07,
    effectiveTaxRate: 0.25,
    capGainsRate: 0.15,
    socialSecurityMonthly: 2500,
    pensionMonthly: 0,
    health: {
      currentAge: 45,
      retirementAge: 65,
      healthStatus: 'good',
      familyHistory: 'average',
      ltcInsurance: false,
      medicalExpenses: 8000,
      prescriptionCosts: 2000,
    },
    accounts: []
  });

  const personaGroup = persona || 'family';

  useEffect(() => {
    analytics.track('scorecard.page_viewed', { 
      persona_group: personaGroup,
      source: searchParams.get('source') || 'direct'
    });
  }, [personaGroup]);

  const updateParam = (key: keyof ScorecardParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const updateHealthParam = (key: keyof HealthInputs, value: any) => {
    setParams(prev => ({
      ...prev,
      health: { ...prev.health, [key]: value }
    }));
  };

  const updateAccounts = (accounts: Account[]) => {
    setParams(prev => ({ ...prev, accounts }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Run the scorecard calculation
      const calculationResults = runScorecardTaxAware(params);
      setResults(calculationResults);

      // Save to database
      const { data: runData, error: runError } = await supabase
        .from('scorecard_runs')
        .insert({
          inputs: params as any,
          results: calculationResults as any,
          score: calculationResults.score
        })
        .select('id')
        .single();

      if (runError) {
        console.error('Error saving scorecard run:', runError);
      } else if (runData) {
        // Save accounts
        if (params.accounts.length > 0) {
          const accountsData = params.accounts.map(acc => ({
            scorecard_run_id: runData.id,
            account_name: acc.name,
            tax_type: acc.taxType,
            qualified: acc.qualified,
            balance: acc.balance,
            annual_contrib: acc.annualContrib,
            expected_return: acc.expectedReturn
          }));

          const { error: accountsError } = await supabase
            .from('scorecard_accounts')
            .insert(accountsData);

          if (accountsError) {
            console.error('Error saving accounts:', accountsError);
          }
        }
      }

      analytics.track('scorecard.run', {
        persona_group: personaGroup,
        score: calculationResults.score,
        ltcRisk: calculationResults.ltc.riskScore,
        taxDrag: (1 - calculationResults.afterTaxNW / params.accounts.reduce((sum, acc) => sum + acc.balance, 0)) || 0
      });

    } catch (error) {
      console.error('Scorecard calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "There was an issue calculating your scorecard. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRequestReview = async () => {
    try {
      // Create SWAG intake record
      const { error } = await supabase.from('swag_intakes').insert({
        persona_group: personaGroup,
        status: 'created',
        meeting_type: 'right_fit'
      });

      if (error) {
        console.error('Error creating SWAG intake:', error);
        toast({
          title: "Error",
          description: "Failed to schedule review. Please try again.",
          variant: "destructive"
        });
        return;
      }

      analytics.track('scorecard.request_review', {
        persona_group: personaGroup,
        score: results?.score,
        ltcRisk: results?.ltc.riskScore
      });

      navigate('/meet?type=right_fit&source=scorecard');
    } catch (error) {
      console.error('Error requesting review:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveToClient = async () => {
    try {
      const { error } = await supabase.from('swag_intakes').insert({
        persona_group: personaGroup,
        status: 'saved'
      });

      if (error) {
        console.error('Error saving to client:', error);
        toast({
          title: "Error",
          description: "Failed to save to client. Please try again.",
          variant: "destructive"
        });
        return;
      }

      analytics.track('scorecard.saved', {
        persona_group: personaGroup,
        score: results?.score
      });

      toast({
        title: "Saved Successfully",
        description: "Scorecard has been saved to client record."
      });
    } catch (error) {
      console.error('Error saving scorecard:', error);
    }
  };

  const handleAttachToSWAG = async () => {
    if (!results) return;

    try {
      const roadmapData = scorecardToRoadmap(params, results);
      
      analytics.track('roadmap.attached', {
        persona_group: personaGroup,
        score: results.score,
        source: 'scorecard'
      });

      // Navigate to SWAG roadmap with prefilled data
      const queryParams = new URLSearchParams({
        source: 'scorecard',
        prefill: JSON.stringify(roadmapData)
      });
      
      navigate(`/roadmap/new?${queryParams}`);
    } catch (error) {
      console.error('Error attaching to SWAG:', error);
      toast({
        title: "Error",
        description: "Failed to attach to SWAG plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Confident', variant: 'default' as const, className: 'bg-green-100 text-green-800' };
    if (score >= 65) return { label: 'Work in Progress', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' };
    return { label: 'At Risk', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' };
  };

  if (results) {
    const scoreBadge = getScoreBadge(results.score);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Results Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Your Retirement Confidence Score™</h1>
            <div className={`text-8xl font-bold mb-4 ${getScoreColor(results.score)}`}>
              {results.score}
            </div>
            <Badge className={scoreBadge.className}>
              {scoreBadge.label}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.breakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={value} className="w-20" />
                      <span className="font-medium w-8">{value}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>After-Tax Net Worth:</span>
                  <span className="font-medium">{formatCurrency(results.afterTaxNW)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Spending Target:</span>
                  <span className="font-medium">{formatCurrency(results.spendAtStart)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guaranteed Income:</span>
                  <span className="font-medium">{formatCurrency(results.guaranteed)}</span>
                </div>
                <div className="flex justify-between">
                  <span>First Year Gap:</span>
                  <span className="font-medium">{formatCurrency(results.firstYearGap)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax Year 1:</span>
                  <span className="font-medium">{formatCurrency(results.estTaxYear1)}</span>
                </div>
              </CardContent>
            </Card>

            {/* LTC Panel */}
            <LTCPanel ltcResult={results.ltc} />

            {/* Withdrawal Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Withdrawal Strategy Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(results.slices).map(([source, amount]) => {
                  if (amount === 0) return null;
                  return (
                    <div key={source} className="flex justify-between">
                      <span className="capitalize">{source}</span>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {personaGroup === 'family' ? (
              <Button onClick={handleRequestReview} size="lg" className="flex items-center gap-2">
                Request Review (Right-Fit Call)
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveToClient} variant="outline" size="lg">
                  Save to Client
                </Button>
                <Button onClick={handleAttachToSWAG} size="lg" className="flex items-center gap-2">
                  Attach to SWAG Plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Retirement Confidence Scorecard™</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get a comprehensive tax-aware analysis of your retirement readiness, including long-term care planning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={params.currentAge}
                    onChange={(e) => updateParam('currentAge', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="targetAge">Target Retirement Age</Label>
                  <Input
                    id="targetAge"
                    type="number"
                    value={params.targetRetirementAge}
                    onChange={(e) => updateParam('targetRetirementAge', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
                  <Input
                    id="lifeExpectancy"
                    type="number"
                    value={params.lifeExpectancy}
                    onChange={(e) => updateParam('lifeExpectancy', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Income & Savings */}
            <Card>
              <CardHeader>
                <CardTitle>Income & Savings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentIncome">Current Annual Income</Label>
                    <Input
                      id="currentIncome"
                      type="number"
                      value={params.currentIncome}
                      onChange={(e) => updateParam('currentIncome', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="savingsRate">Savings Rate (%)</Label>
                    <Input
                      id="savingsRate"
                      type="number"
                      min="0"
                      max="100"
                      value={params.savingsRate}
                      onChange={(e) => updateParam('savingsRate', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="retirementSpend">Target Annual Retirement Spending</Label>
                  <Input
                    id="retirementSpend"
                    type="number"
                    value={params.targetRetirementSpend}
                    onChange={(e) => updateParam('targetRetirementSpend', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Investment & Tax */}
            <Card>
              <CardHeader>
                <CardTitle>Investment & Tax Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.01"
                      value={(params.expectedReturn * 100).toFixed(2)}
                      onChange={(e) => updateParam('expectedReturn', Number(e.target.value) / 100)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.01"
                      value={(params.inflationRate * 100).toFixed(2)}
                      onChange={(e) => updateParam('inflationRate', Number(e.target.value) / 100)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="effectiveTax">Effective Tax Rate (%)</Label>
                    <Input
                      id="effectiveTax"
                      type="number"
                      step="0.01"
                      value={(params.effectiveTaxRate * 100).toFixed(2)}
                      onChange={(e) => updateParam('effectiveTaxRate', Number(e.target.value) / 100)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capGains">Capital Gains Rate (%)</Label>
                    <Input
                      id="capGains"
                      type="number"
                      step="0.01"
                      value={((params.capGainsRate || 0.15) * 100).toFixed(2)}
                      onChange={(e) => updateParam('capGainsRate', Number(e.target.value) / 100)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Security & Pension */}
            <Card>
              <CardHeader>
                <CardTitle>Guaranteed Income</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="socialSecurity">Monthly Social Security</Label>
                  <Input
                    id="socialSecurity"
                    type="number"
                    value={params.socialSecurityMonthly}
                    onChange={(e) => updateParam('socialSecurityMonthly', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="pension">Monthly Pension</Label>
                  <Input
                    id="pension"
                    type="number"
                    value={params.pensionMonthly}
                    onChange={(e) => updateParam('pensionMonthly', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Health Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Health & LTC Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="healthStatus">Health Status</Label>
                    <Select 
                      value={params.health.healthStatus} 
                      onValueChange={(value: any) => updateHealthParam('healthStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="familyHistory">Family History</Label>
                    <Select 
                      value={params.health.familyHistory} 
                      onValueChange={(value: any) => updateHealthParam('familyHistory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="concerning">Concerning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ltcInsurance"
                    checked={params.health.ltcInsurance}
                    onCheckedChange={(checked) => updateHealthParam('ltcInsurance', checked)}
                  />
                  <Label htmlFor="ltcInsurance">I have long-term care insurance</Label>
                </div>
                
                {params.health.ltcInsurance && (
                  <div>
                    <Label htmlFor="ltcCoverage">Daily LTC Coverage Amount</Label>
                    <Input
                      id="ltcCoverage"
                      type="number"
                      value={params.health.ltcCoverage || 200}
                      onChange={(e) => updateHealthParam('ltcCoverage', Number(e.target.value))}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medicalExpenses">Annual Medical Expenses</Label>
                    <Input
                      id="medicalExpenses"
                      type="number"
                      value={params.health.medicalExpenses}
                      onChange={(e) => updateHealthParam('medicalExpenses', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prescriptionCosts">Annual Prescription Costs</Label>
                    <Input
                      id="prescriptionCosts"
                      type="number"
                      value={params.health.prescriptionCosts}
                      onChange={(e) => updateHealthParam('prescriptionCosts', Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts Editor */}
          <div className="space-y-6">
            <AccountsEditor
              accounts={params.accounts}
              onChange={updateAccounts}
            />
            
            {/* Calculate Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handleCalculate} 
                  disabled={isCalculating}
                  size="lg" 
                  className="w-full"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate My Retirement Confidence Score™'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};