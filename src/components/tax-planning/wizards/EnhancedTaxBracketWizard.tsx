import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Crown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  DollarSign,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useTaxRules } from '@/hooks/useTaxRules';
import { FilingStatus } from '@/types/tax-rules';

interface WizardStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const WizardStep: React.FC<WizardStepProps> = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <div className="max-w-md mx-auto space-y-4">
      {children}
    </div>
  </motion.div>
);

interface WizardCalculatorProps {
  subscriptionTier: string;
}

export const EnhancedTaxBracketWizard: React.FC<WizardCalculatorProps> = ({ subscriptionTier }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { getTaxBrackets, getStandardDeduction, calculateTax, loading } = useTaxRules();

  // Form data
  const [incomeInfo, setIncomeInfo] = useState({
    income: 75000,
    filingStatus: 'single' as FilingStatus,
    taxYear: 2024
  });

  const [deductionInfo, setDeductionInfo] = useState({
    itemizeDeductions: false,
    mortgageInterest: 0,
    stateLocalTax: 0,
    charitableGiving: 0,
    medicalExpenses: 0
  });

  const [results, setResults] = useState<any>(null);

  const isPremium = subscriptionTier === 'premium';

  const steps = [
    {
      title: "Income & Filing",
      description: "Tell us about your income and filing status",
      isValid: incomeInfo.income > 0
    },
    {
      title: "Deductions",
      description: "Configure your tax deductions",
      isValid: true
    },
    {
      title: "Tax Analysis",
      description: "Your complete tax breakdown and optimization tips",
      isValid: true
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = useCallback(async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const brackets = getTaxBrackets(incomeInfo.taxYear, incomeInfo.filingStatus);
    const standardDeduction = getStandardDeduction(incomeInfo.taxYear, incomeInfo.filingStatus);
    
    const totalItemizedDeductions = deductionInfo.itemizeDeductions ? 
      deductionInfo.mortgageInterest + deductionInfo.stateLocalTax + 
      deductionInfo.charitableGiving + deductionInfo.medicalExpenses : 0;
    
    const finalDeduction = Math.max(standardDeduction, totalItemizedDeductions);
    const taxableIncome = Math.max(0, incomeInfo.income - finalDeduction);
    const totalTax = calculateTax(incomeInfo.income, incomeInfo.taxYear, incomeInfo.filingStatus);
    
    const effectiveRate = incomeInfo.income > 0 ? (totalTax / incomeInfo.income) * 100 : 0;
    const marginalRate = brackets.find(bracket => 
      taxableIncome >= bracket.min_income && 
      (!bracket.max_income || taxableIncome <= bracket.max_income)
    )?.rate || 10;

    const bracketData = brackets.map(bracket => ({
      bracket: `${bracket.rate}%`,
      min: bracket.min_income,
      max: bracket.max_income || 600000,
      rate: bracket.rate,
      inBracket: taxableIncome >= bracket.min_income && 
                 (!bracket.max_income || taxableIncome <= bracket.max_income),
      taxInBracket: calculateTaxInBracket(taxableIncome, bracket)
    }));

    // Tax optimization suggestions
    const suggestions = [];
    if (!deductionInfo.itemizeDeductions && totalItemizedDeductions > standardDeduction) {
      suggestions.push({
        title: "Consider Itemizing",
        description: `You could save ${((totalItemizedDeductions - standardDeduction) * marginalRate / 100).toFixed(0)} by itemizing deductions`,
        impact: "medium"
      });
    }
    
    if (incomeInfo.income > 100000) {
      suggestions.push({
        title: "401(k) Contributions",
        description: "Maximize pre-tax retirement contributions to reduce taxable income",
        impact: "high"
      });
    }

    setResults({
      totalTax,
      effectiveRate,
      marginalRate,
      taxableIncome,
      deductionUsed: finalDeduction,
      deductionSavings: finalDeduction * marginalRate / 100,
      bracketData,
      suggestions
    });

    setIsCalculating(false);
    setShowResults(true);
    setShowConfetti(true);
    
    setTimeout(() => setShowConfetti(false), 3000);
  }, [incomeInfo, deductionInfo, getTaxBrackets, getStandardDeduction, calculateTax]);

  const calculateTaxInBracket = (taxableIncome: number, bracket: any) => {
    if (taxableIncome <= bracket.min_income) return 0;
    const upperLimit = bracket.max_income || taxableIncome;
    const incomeInBracket = Math.min(taxableIncome, upperLimit) - bracket.min_income;
    return incomeInBracket * bracket.rate / 100;
  };

  useEffect(() => {
    if (currentStep === 2 && !showResults) {
      calculateResults();
    }
  }, [currentStep, calculateResults, showResults]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const ResultsCard = ({ title, value, icon: Icon, color = "text-primary", subtitle }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="text-center">
        <CardContent className="p-4">
          <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Tax Bracket Analyzer</CardTitle>
            {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        <CardDescription>
          {steps[currentStep].description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <WizardStep
                title={steps[0].title}
                description={steps[0].description}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="income">Annual Income</Label>
                    <Input
                      id="income"
                      type="number"
                      value={incomeInfo.income}
                      onChange={(e) => setIncomeInfo(prev => ({ 
                        ...prev, 
                        income: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="filingStatus">Filing Status</Label>
                    <Select 
                      value={incomeInfo.filingStatus} 
                      onValueChange={(value: FilingStatus) => setIncomeInfo(prev => ({ 
                        ...prev, 
                        filingStatus: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                        <SelectItem value="married_separately">Married Filing Separately</SelectItem>
                        <SelectItem value="head_of_household">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taxYear">Tax Year</Label>
                    <Select 
                      value={incomeInfo.taxYear.toString()} 
                      onValueChange={(value) => setIncomeInfo(prev => ({ 
                        ...prev, 
                        taxYear: parseInt(value) 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Live Preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-muted rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Quick Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Income: {formatCurrency(incomeInfo.income)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {incomeInfo.filingStatus.replace('_', ' ')}
                    </p>
                  </motion.div>
                </div>
              </WizardStep>
            )}

            {currentStep === 1 && (
              <WizardStep
                title={steps[1].title}
                description={steps[1].description}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="itemize"
                      type="checkbox"
                      checked={deductionInfo.itemizeDeductions}
                      onChange={(e) => setDeductionInfo(prev => ({ 
                        ...prev, 
                        itemizeDeductions: e.target.checked 
                      }))}
                      className="rounded"
                    />
                    <Label htmlFor="itemize">Itemize Deductions</Label>
                  </div>
                  
                  {deductionInfo.itemizeDeductions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="mortgage">Mortgage Interest</Label>
                        <Input
                          id="mortgage"
                          type="number"
                          value={deductionInfo.mortgageInterest}
                          onChange={(e) => setDeductionInfo(prev => ({ 
                            ...prev, 
                            mortgageInterest: parseInt(e.target.value) || 0 
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stateLocal">State & Local Tax</Label>
                        <Input
                          id="stateLocal"
                          type="number"
                          value={deductionInfo.stateLocalTax}
                          onChange={(e) => setDeductionInfo(prev => ({ 
                            ...prev, 
                            stateLocalTax: parseInt(e.target.value) || 0 
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="charity">Charitable Giving</Label>
                        <Input
                          id="charity"
                          type="number"
                          value={deductionInfo.charitableGiving}
                          onChange={(e) => setDeductionInfo(prev => ({ 
                            ...prev, 
                            charitableGiving: parseInt(e.target.value) || 0 
                          }))}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Standard vs Itemized Preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-muted rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Deduction Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Standard: {formatCurrency(getStandardDeduction(incomeInfo.taxYear, incomeInfo.filingStatus))}
                    </p>
                    {deductionInfo.itemizeDeductions && (
                      <p className="text-sm text-muted-foreground">
                        Itemized: {formatCurrency(
                          deductionInfo.mortgageInterest + deductionInfo.stateLocalTax + 
                          deductionInfo.charitableGiving + deductionInfo.medicalExpenses
                        )}
                      </p>
                    )}
                  </motion.div>
                </div>
              </WizardStep>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {isCalculating ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-4"
                    >
                      <Calculator className="w-full h-full text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">Calculating Your Tax Situation...</h3>
                    <p className="text-muted-foreground">Analyzing brackets and optimizations</p>
                  </div>
                ) : showResults && results ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Analysis Complete! 🎯</h3>
                      <p className="text-muted-foreground">Here's your complete tax breakdown</p>
                    </div>

                    {/* Key Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ResultsCard
                        title="Total Tax"
                        value={formatCurrency(results.totalTax)}
                        icon={DollarSign}
                        color="text-red-600"
                        subtitle={`${results.effectiveRate.toFixed(1)}% effective rate`}
                      />
                      <ResultsCard
                        title="Marginal Rate"
                        value={`${results.marginalRate}%`}
                        icon={TrendingUp}
                        color="text-blue-600"
                        subtitle="Top tax bracket"
                      />
                      <ResultsCard
                        title="Deduction Savings"
                        value={formatCurrency(results.deductionSavings)}
                        icon={BarChart3}
                        color="text-green-600"
                        subtitle={formatCurrency(results.deductionUsed)}
                      />
                    </div>

                    {/* Tax Bracket Visualization */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tax Bracket Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={results.bracketData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bracket" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            <Bar 
                              dataKey="taxInBracket" 
                              fill={(entry: any) => entry.inBracket ? "#22c55e" : "#e5e7eb"}
                              name="Tax in Bracket"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Optimization Suggestions */}
                    {results.suggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Tax Optimization Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {results.suggestions.map((suggestion: any, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-3 border rounded-lg"
                              >
                                <h4 className="font-medium">{suggestion.title}</h4>
                                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                                <Badge 
                                  variant={suggestion.impact === 'high' ? 'default' : 'secondary'}
                                  className="mt-2"
                                >
                                  {suggestion.impact} impact
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < 2 && (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={nextStep}
              disabled={!steps[currentStep].isValid}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 2 && showResults && (
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(0)}>
              Start Over
            </Button>
            <Button>
              Save Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};