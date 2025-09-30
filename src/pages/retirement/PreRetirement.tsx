import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { StepIndicator } from '@/components/retirement/intake/StepIndicator';
import { AccountRow } from '@/components/retirement/intake/AccountRow';
import { SummaryCard } from '@/components/retirement/intake/SummaryCard';
import { useRetirementIntake } from '@/store/retirementIntake';
import type { InvestmentAccount } from '@/types/retirement';
import { ArrowLeft, ArrowRight, Play, Plus } from 'lucide-react';

export default function PreRetirement() {
  const navigate = useNavigate();
  const { inputs, updateInputs, setCurrentStep, markStepComplete, completedSteps, currentStep } = useRetirementIntake();
  
  const [localInputs, setLocalInputs] = useState({
    currentAge: inputs?.goals?.currentAge || 55,
    retirementAge: inputs?.goals?.retirementAge || 65,
    spouseAge: inputs?.goals?.currentAge ? inputs.goals.currentAge - 2 : 53,
    spouseRetirementAge: 65,
    state: 'CA',
    lifeExpectancy: inputs?.goals?.lifeExpectancy || 90,
    floorSpending: 60000,
    ceilingSpending: 80000,
    desiredLifestyle: inputs?.goals?.desiredLifestyle || 'moderate' as const,
    colaProtection: true,
    inflationRate: inputs?.goals?.inflationRate || 0.03,
    primaryIncome: 100000,
    spouseIncome: 0,
    ssEnabled: inputs?.socialSecurity?.enabled ?? true,
    ssPrimaryClaimAge: inputs?.socialSecurity?.filingAge || 67,
    ssSpouseClaimAge: 67,
    ssCurrentEarnings: inputs?.socialSecurity?.currentEarnings || 100000,
    pensionEnabled: inputs?.pension?.enabled || false,
    pensionMonthly: inputs?.pension?.monthlyBenefit || 0,
    pensionStartAge: inputs?.pension?.startAge || 65,
    pensionCola: inputs?.pension?.colaProtection || false,
    accounts: inputs?.accounts || [
      {
        id: '1',
        type: '401k' as const,
        balance: 500000,
        annualContribution: 22500,
        expectedReturn: 0.07,
        taxStatus: 'pre_tax' as const,
        requiredMinDistribution: true,
        rmdAge: 73
      }
    ],
    healthcareCost: inputs?.healthcare?.estimatedAnnualCost || 15000,
    medicareSupp: inputs?.healthcare?.medicareSupplementation ?? true,
    ltcInsurance: inputs?.healthcare?.longTermCareInsurance || false,
    ltcCost: inputs?.healthcare?.longTermCareCost || 150000
  });

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    markStepComplete(currentStep);
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRunAnalysis = () => {
    // Compile all inputs into the proper format
    const retirementInput = {
      goals: {
        currentAge: localInputs.currentAge,
        retirementAge: localInputs.retirementAge,
        retirementDate: new Date(new Date().getFullYear() + (localInputs.retirementAge - localInputs.currentAge), 0, 1),
        desiredLifestyle: localInputs.desiredLifestyle,
        annualRetirementIncome: localInputs.ceilingSpending,
        inflationRate: localInputs.inflationRate,
        lifeExpectancy: localInputs.lifeExpectancy
      },
      socialSecurity: {
        enabled: localInputs.ssEnabled,
        currentEarnings: localInputs.ssCurrentEarnings,
        earningsHistory: [],
        filingAge: localInputs.ssPrimaryClaimAge,
        spousalBenefit: localInputs.spouseIncome > 0,
        spousalEarnings: localInputs.spouseIncome,
        colaAdjustment: localInputs.colaProtection
      },
      pension: {
        enabled: localInputs.pensionEnabled,
        monthlyBenefit: localInputs.pensionMonthly,
        startAge: localInputs.pensionStartAge,
        survivorBenefit: 0.5,
        colaProtection: localInputs.pensionCola
      },
      accounts: localInputs.accounts,
      expenses: [
        {
          id: '1',
          name: 'Essential Expenses',
          currentAmount: localInputs.floorSpending,
          retirementAmount: localInputs.floorSpending,
          inflationProtected: localInputs.colaProtection,
          essential: true
        },
        {
          id: '2',
          name: 'Discretionary Expenses',
          currentAmount: localInputs.ceilingSpending - localInputs.floorSpending,
          retirementAmount: localInputs.ceilingSpending - localInputs.floorSpending,
          inflationProtected: localInputs.colaProtection,
          essential: false
        }
      ],
      taxOptimization: {
        withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'] as ('taxable' | 'tax_deferred' | 'tax_free')[],
        rothConversionStrategy: true,
        taxBracketManagement: true,
        harverstLosses: true
      },
      healthcare: {
        currentAge: localInputs.currentAge,
        estimatedAnnualCost: localInputs.healthcareCost,
        longTermCareInsurance: localInputs.ltcInsurance,
        longTermCareCost: localInputs.ltcCost,
        medicareSupplementation: localInputs.medicareSupp
      },
      legacy: {
        targetInheritance: 500000,
        charitableGiving: 50000,
        estateTaxPlanning: true
      }
    };

    updateInputs(retirementInput);
    navigate('/wealth/retirement');
  };

  const addAccount = () => {
    const newAccount: InvestmentAccount = {
      id: Date.now().toString(),
      type: '401k',
      balance: 0,
      annualContribution: 0,
      expectedReturn: 0.07,
      taxStatus: 'pre_tax',
      requiredMinDistribution: true,
      rmdAge: 73
    };
    setLocalInputs({ ...localInputs, accounts: [...localInputs.accounts, newAccount] });
  };

  const updateAccount = (index: number, account: InvestmentAccount) => {
    const newAccounts = [...localInputs.accounts];
    newAccounts[index] = account;
    setLocalInputs({ ...localInputs, accounts: newAccounts });
  };

  const removeAccount = (index: number) => {
    const newAccounts = localInputs.accounts.filter((_, i) => i !== index);
    setLocalInputs({ ...localInputs, accounts: newAccounts });
  };

  const totalAssets = localInputs.accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Retirement Planning Intake</h1>
          <p className="text-muted-foreground">
            Let's gather your information to build a comprehensive retirement analysis
          </p>
        </div>

        <StepIndicator
          totalSteps={6}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Tell us about yourself and your retirement timeline</CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Current Age</Label>
                    <Input
                      type="number"
                      value={localInputs.currentAge}
                      onChange={(e) => setLocalInputs({ ...localInputs, currentAge: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label>Planned Retirement Age</Label>
                    <Input
                      type="number"
                      value={localInputs.retirementAge}
                      onChange={(e) => setLocalInputs({ ...localInputs, retirementAge: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label>State of Residence</Label>
                    <Select
                      value={localInputs.state}
                      onValueChange={(value) => setLocalInputs({ ...localInputs, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Life Expectancy</Label>
                    <Input
                      type="number"
                      value={localInputs.lifeExpectancy}
                      onChange={(e) => setLocalInputs({ ...localInputs, lifeExpectancy: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Cash Flow */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Cash Flow Needs</CardTitle>
                  <CardDescription>Define your spending requirements in retirement</CardDescription>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <Label>Annual Essential Expenses ($)</Label>
                    <Input
                      type="number"
                      value={localInputs.floorSpending}
                      onChange={(e) => setLocalInputs({ ...localInputs, floorSpending: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Basic needs: housing, food, utilities</p>
                  </div>

                  <div>
                    <Label>Annual Comfortable Expenses ($)</Label>
                    <Input
                      type="number"
                      value={localInputs.ceilingSpending}
                      onChange={(e) => setLocalInputs({ ...localInputs, ceilingSpending: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Including discretionary spending</p>
                  </div>

                  <div>
                    <Label>Desired Lifestyle</Label>
                    <Select
                      value={localInputs.desiredLifestyle}
                      onValueChange={(value: any) => setLocalInputs({ ...localInputs, desiredLifestyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="affluent">Affluent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Inflation Rate (%)</Label>
                    <Slider
                      value={[localInputs.inflationRate * 100]}
                      onValueChange={(value) => setLocalInputs({ ...localInputs, inflationRate: value[0] / 100 })}
                      min={0}
                      max={10}
                      step={0.1}
                      className="my-4"
                    />
                    <p className="text-sm text-center">{(localInputs.inflationRate * 100).toFixed(1)}%</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>COLA Protection (Inflation Adjustment)</Label>
                    <Switch
                      checked={localInputs.colaProtection}
                      onCheckedChange={(checked) => setLocalInputs({ ...localInputs, colaProtection: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Income Sources */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Income Sources</CardTitle>
                  <CardDescription>Current salary and expected retirement income</CardDescription>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <Label>Current Annual Salary ($)</Label>
                    <Input
                      type="number"
                      value={localInputs.primaryIncome}
                      onChange={(e) => setLocalInputs({ ...localInputs, primaryIncome: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg">Social Security</Label>
                      <Switch
                        checked={localInputs.ssEnabled}
                        onCheckedChange={(checked) => setLocalInputs({ ...localInputs, ssEnabled: checked })}
                      />
                    </div>

                    {localInputs.ssEnabled && (
                      <div className="space-y-4 ml-4">
                        <div>
                          <Label>Claim Age</Label>
                          <Input
                            type="number"
                            value={localInputs.ssPrimaryClaimAge}
                            onChange={(e) => setLocalInputs({ ...localInputs, ssPrimaryClaimAge: parseInt(e.target.value) || 0 })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Between 62-70</p>
                        </div>

                        <div>
                          <Label>Current Earnings for Estimate ($)</Label>
                          <Input
                            type="number"
                            value={localInputs.ssCurrentEarnings}
                            onChange={(e) => setLocalInputs({ ...localInputs, ssCurrentEarnings: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg">Pension</Label>
                      <Switch
                        checked={localInputs.pensionEnabled}
                        onCheckedChange={(checked) => setLocalInputs({ ...localInputs, pensionEnabled: checked })}
                      />
                    </div>

                    {localInputs.pensionEnabled && (
                      <div className="space-y-4 ml-4">
                        <div>
                          <Label>Monthly Benefit ($)</Label>
                          <Input
                            type="number"
                            value={localInputs.pensionMonthly}
                            onChange={(e) => setLocalInputs({ ...localInputs, pensionMonthly: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div>
                          <Label>Start Age</Label>
                          <Input
                            type="number"
                            value={localInputs.pensionStartAge}
                            onChange={(e) => setLocalInputs({ ...localInputs, pensionStartAge: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>COLA Protection</Label>
                          <Switch
                            checked={localInputs.pensionCola}
                            onCheckedChange={(checked) => setLocalInputs({ ...localInputs, pensionCola: checked })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Accounts */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Investment Accounts</CardTitle>
                  <CardDescription>Add all your retirement savings accounts</CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  {localInputs.accounts.map((account, index) => (
                    <AccountRow
                      key={account.id}
                      account={account}
                      onChange={(updated) => updateAccount(index, updated)}
                      onRemove={() => removeAccount(index)}
                      showRemove={localInputs.accounts.length > 1}
                    />
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAccount}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>

                  <div className="bg-muted p-4 rounded-lg mt-6">
                    <div className="text-sm text-muted-foreground">Total Assets</div>
                    <div className="text-3xl font-bold">${totalAssets.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Healthcare & Risk */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Healthcare & Risk Planning</CardTitle>
                  <CardDescription>Plan for healthcare costs and long-term care</CardDescription>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <Label>Estimated Annual Healthcare Cost ($)</Label>
                    <Input
                      type="number"
                      value={localInputs.healthcareCost}
                      onChange={(e) => setLocalInputs({ ...localInputs, healthcareCost: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Average: $15,000/year</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Medicare Supplementation</Label>
                      <p className="text-xs text-muted-foreground">Medigap or Medicare Advantage</p>
                    </div>
                    <Switch
                      checked={localInputs.medicareSupp}
                      onCheckedChange={(checked) => setLocalInputs({ ...localInputs, medicareSupp: checked })}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Label className="text-lg">Long-Term Care Insurance</Label>
                        <p className="text-xs text-muted-foreground">Do you have LTC coverage?</p>
                      </div>
                      <Switch
                        checked={localInputs.ltcInsurance}
                        onCheckedChange={(checked) => setLocalInputs({ ...localInputs, ltcInsurance: checked })}
                      />
                    </div>

                    {!localInputs.ltcInsurance && (
                      <div className="ml-4">
                        <Label>Estimated Annual LTC Cost ($)</Label>
                        <Input
                          type="number"
                          value={localInputs.ltcCost}
                          onChange={(e) => setLocalInputs({ ...localInputs, ltcCost: parseInt(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Average: $150,000/year if needed</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Review & Launch Analysis</CardTitle>
                  <CardDescription>Confirm your information and run the analysis</CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <SummaryCard
                    title="Profile"
                    items={[
                      { label: 'Current Age', value: localInputs.currentAge.toString() },
                      { label: 'Retirement Age', value: localInputs.retirementAge.toString() },
                      { label: 'State', value: localInputs.state },
                      { label: 'Life Expectancy', value: localInputs.lifeExpectancy.toString() }
                    ]}
                    onEdit={() => setCurrentStep(1)}
                  />

                  <SummaryCard
                    title="Cash Flow"
                    items={[
                      { label: 'Essential Expenses', value: `$${localInputs.floorSpending.toLocaleString()}` },
                      { label: 'Comfortable Spending', value: `$${localInputs.ceilingSpending.toLocaleString()}` },
                      { label: 'Lifestyle', value: localInputs.desiredLifestyle },
                      { label: 'COLA Protection', value: localInputs.colaProtection ? 'Yes' : 'No' }
                    ]}
                    onEdit={() => setCurrentStep(2)}
                  />

                  <SummaryCard
                    title="Income Sources"
                    items={[
                      { label: 'Current Salary', value: `$${localInputs.primaryIncome.toLocaleString()}` },
                      { label: 'Social Security', value: localInputs.ssEnabled ? `Age ${localInputs.ssPrimaryClaimAge}` : 'Not planned' },
                      { label: 'Pension', value: localInputs.pensionEnabled ? `$${localInputs.pensionMonthly}/mo` : 'None' }
                    ]}
                    onEdit={() => setCurrentStep(3)}
                  />

                  <SummaryCard
                    title="Total Assets"
                    items={[
                      { label: 'Number of Accounts', value: localInputs.accounts.length.toString() },
                      { label: 'Total Balance', value: `$${totalAssets.toLocaleString()}` },
                      { label: 'Annual Contributions', value: `$${localInputs.accounts.reduce((sum, acc) => sum + acc.annualContribution, 0).toLocaleString()}` }
                    ]}
                    onEdit={() => setCurrentStep(4)}
                  />

                  <SummaryCard
                    title="Healthcare"
                    items={[
                      { label: 'Annual Cost', value: `$${localInputs.healthcareCost.toLocaleString()}` },
                      { label: 'Medicare Supp', value: localInputs.medicareSupp ? 'Yes' : 'No' },
                      { label: 'LTC Insurance', value: localInputs.ltcInsurance ? 'Yes' : 'No' }
                    ]}
                    onEdit={() => setCurrentStep(5)}
                  />

                  <Button
                    onClick={handleRunAnalysis}
                    size="lg"
                    className="w-full gap-2"
                  >
                    <Play className="h-5 w-5" />
                    Run SWAG Analysis
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < 6 && (
            <Button
              onClick={handleNext}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
