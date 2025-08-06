import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calculator, DollarSign, Calendar, TrendingDown, Save, BarChart3 } from 'lucide-react';

interface ScenarioResults {
  base_monthly_payment?: number;
  with_extra_payment?: number;
  original_payoff_months?: number;
  new_payoff_months?: number;
  months_saved?: number;
  total_interest_saved?: number;
  original_total_interest?: number;
  monthly_payment?: number;
  total_payments?: number;
  total_interest?: number;
}

export function LoanScenarioCalculator() {
  const [scenarioForm, setScenarioForm] = useState({
    scenario_name: '',
    base_loan_amount: 500000,
    base_interest_rate: 6.25,
    base_term_months: 360,
    scenario_type: 'early_payoff',
    extra_monthly_payment: 500,
    annual_extra_payment: 0,
    new_interest_rate: 5.75
  });

  const [results, setResults] = useState<ScenarioResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const { toast } = useToast();

  const calculateScenario = async () => {
    setIsLoading(true);
    try {
      let params = {};
      
      switch (scenarioForm.scenario_type) {
        case 'early_payoff':
          params = { extra_monthly_payment: scenarioForm.extra_monthly_payment };
          break;
        case 'extra_payments':
          params = { annual_extra_payment: scenarioForm.annual_extra_payment };
          break;
        case 'rate_change':
          params = { new_interest_rate: scenarioForm.new_interest_rate };
          break;
      }

      const { data, error } = await supabase.rpc('calculate_loan_scenario', {
        p_loan_amount: scenarioForm.base_loan_amount,
        p_interest_rate: scenarioForm.base_interest_rate / 100,
        p_term_months: scenarioForm.base_term_months,
        p_scenario_type: scenarioForm.scenario_type,
        p_scenario_params: params
      });

      if (error) throw error;

      setResults(data as ScenarioResults);
      toast({
        title: "Scenario Calculated",
        description: "Your loan scenario has been calculated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate scenario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveScenario = async () => {
    if (!results || !scenarioForm.scenario_name) {
      toast({
        title: "Error",
        description: "Please calculate scenario and provide a name before saving",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('loan_scenarios')
        .insert({
          scenario_name: scenarioForm.scenario_name,
          base_loan_amount: scenarioForm.base_loan_amount,
          base_interest_rate: scenarioForm.base_interest_rate,
          base_term_months: scenarioForm.base_term_months,
          scenario_type: scenarioForm.scenario_type,
          scenario_parameters: {},
          calculated_results: results as any,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Scenario Saved",
        description: "Your loan scenario has been saved for future reference!"
      });

      // Reset form
      setScenarioForm(prev => ({
        ...prev,
        scenario_name: ''
      }));
      setResults(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save scenario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Loan Scenario Calculator
          </CardTitle>
          <CardDescription>
            Calculate different payment scenarios to optimize your loan strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={scenarioForm.scenario_type} onValueChange={(value) => 
            setScenarioForm(prev => ({ ...prev, scenario_type: value }))
          }>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="early_payoff">Early Payoff</TabsTrigger>
              <TabsTrigger value="extra_payments">Extra Payments</TabsTrigger>
              <TabsTrigger value="rate_change">Rate Change</TabsTrigger>
            </TabsList>

            {/* Base Loan Information */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="scenario-name">Scenario Name</Label>
                <Input
                  id="scenario-name"
                  value={scenarioForm.scenario_name}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, scenario_name: e.target.value }))}
                  placeholder="My loan scenario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-amount">Loan Amount ($)</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={scenarioForm.base_loan_amount}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, base_loan_amount: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.01"
                  value={scenarioForm.base_interest_rate}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, base_interest_rate: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="term-months">Term (Months)</Label>
                <Input
                  id="term-months"
                  type="number"
                  value={scenarioForm.base_term_months}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, base_term_months: Number(e.target.value) }))}
                />
              </div>
            </div>

            <TabsContent value="early_payoff" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="extra-monthly">Extra Monthly Payment ($)</Label>
                  <Input
                    id="extra-monthly"
                    type="number"
                    value={scenarioForm.extra_monthly_payment}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, extra_monthly_payment: Number(e.target.value) }))}
                    placeholder="500"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculate how much time and interest you can save by making extra monthly payments.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="extra_payments" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="annual-extra">Annual Extra Payment ($)</Label>
                  <Input
                    id="annual-extra"
                    type="number"
                    value={scenarioForm.annual_extra_payment}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, annual_extra_payment: Number(e.target.value) }))}
                    placeholder="6000"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculate the impact of making one large extra payment annually (like a bonus).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="rate_change" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-rate">New Interest Rate (%)</Label>
                  <Input
                    id="new-rate"
                    type="number"
                    step="0.01"
                    value={scenarioForm.new_interest_rate}
                    onChange={(e) => setScenarioForm(prev => ({ ...prev, new_interest_rate: Number(e.target.value) }))}
                    placeholder="5.75"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Compare payments and total interest with a different interest rate (refinancing scenario).
                </p>
              </div>
            </TabsContent>

            <div className="flex gap-2 mt-6">
              <Button onClick={calculateScenario} disabled={isLoading} className="flex-1">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Scenario
              </Button>
              {results && (
                <Button onClick={saveScenario} disabled={isLoading} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Scenario Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarioForm.scenario_type === 'early_payoff' && (
                <>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(results.total_interest_saved || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Interest Saved</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatMonths(results.months_saved || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Time Saved</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <TrendingDown className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(results.with_extra_payment || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">New Monthly Payment</div>
                  </div>
                </>
              )}

              {scenarioForm.scenario_type === 'extra_payments' && (
                <>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(results.base_monthly_payment || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Base Monthly Payment</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency((results as any).monthly_extra_payment || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Extra (from Annual)</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <TrendingDown className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency((results as any).total_monthly_payment || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Monthly Payment</div>
                  </div>
                </>
              )}

              {scenarioForm.scenario_type === 'rate_change' && (
                <>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(results.monthly_payment || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Payment</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(results.total_interest || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Interest</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <TrendingDown className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(results.total_payments || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Payments</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}