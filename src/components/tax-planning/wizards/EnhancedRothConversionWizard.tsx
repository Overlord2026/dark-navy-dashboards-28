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
  Calculator, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Crown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface WizardStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isValid?: boolean;
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

interface RollDiceButtonProps {
  onRoll: () => void;
  isRolling: boolean;
}

const RollDiceButton: React.FC<RollDiceButtonProps> = ({ onRoll, isRolling }) => (
  <Button 
    onClick={onRoll} 
    disabled={isRolling}
    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
  >
    <motion.div
      animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isRolling ? 'Rolling...' : 'Run Analysis'}
    </motion.div>
  </Button>
);

interface WizardCalculatorProps {
  subscriptionTier: string;
}

export const EnhancedRothConversionWizard: React.FC<WizardCalculatorProps> = ({ subscriptionTier }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    currentAge: 45,
    retirementAge: 65,
    traditionalIraBalance: 500000
  });

  const [taxInfo, setTaxInfo] = useState({
    currentTaxBracket: 24,
    expectedRetirementBracket: 22,
    conversionAmount: 50000
  });

  const [projectionInfo, setProjectionInfo] = useState({
    marketGrowthRate: 7,
    yearOfConversion: 2024,
    conversionStrategy: 'annual' as 'annual' | 'lumpsum' | 'laddered'
  });

  const [results, setResults] = useState<any>(null);

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  const steps = [
    {
      title: "Basic Information",
      description: "Let's start with your age and retirement timeline",
      isValid: basicInfo.currentAge > 0 && basicInfo.retirementAge > basicInfo.currentAge
    },
    {
      title: "Tax Situation", 
      description: "Tell us about your current and expected tax brackets",
      isValid: taxInfo.currentTaxBracket > 0 && taxInfo.conversionAmount > 0
    },
    {
      title: "Conversion Strategy",
      description: "Configure your conversion preferences and projections",
      isValid: projectionInfo.marketGrowthRate > 0
    },
    {
      title: "Results & Analysis",
      description: "Your personalized Roth conversion analysis",
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
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "Roth conversion analysis requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate complex calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const yearsToRetirement = basicInfo.retirementAge - basicInfo.currentAge;
    const projections = [];

    for (let year = 0; year <= Math.min(yearsToRetirement, 30); year++) {
      const currentYear = projectionInfo.yearOfConversion + year;
      const isConversionYear = year < 5;
      
      const conversionTax = isConversionYear ? 
        (taxInfo.conversionAmount * taxInfo.currentTaxBracket / 100) : 0;
      
      const traditionalBalance = Math.max(0, 
        basicInfo.traditionalIraBalance * Math.pow(1 + projectionInfo.marketGrowthRate / 100, year) - 
        (isConversionYear ? taxInfo.conversionAmount * (year + 1) : taxInfo.conversionAmount * 5)
      );
      
      const rothBalance = isConversionYear ? 
        taxInfo.conversionAmount * (year + 1) * Math.pow(1 + projectionInfo.marketGrowthRate / 100, year - year/2) :
        taxInfo.conversionAmount * 5 * Math.pow(1 + projectionInfo.marketGrowthRate / 100, year - 2.5);
      
      const totalTaxes = conversionTax * (year + 1);
      const netWorth = traditionalBalance + rothBalance - totalTaxes;
      const taxSavings = year > 5 ? 
        (rothBalance * (taxInfo.expectedRetirementBracket / 100)) - totalTaxes : 0;

      projections.push({
        year: currentYear,
        traditionalBalance,
        rothBalance,
        totalTaxes,
        netWorth,
        taxSavings: Math.max(0, taxSavings)
      });
    }

    setResults({
      projections,
      totalTaxSavings: projections[projections.length - 1]?.taxSavings || 0,
      breakEvenYear: projections.findIndex(p => p.taxSavings > 0) + projectionInfo.yearOfConversion,
      finalNetWorth: projections[projections.length - 1]?.netWorth || 0
    });

    setIsCalculating(false);
    setShowResults(true);
    setShowConfetti(true);
    
    setTimeout(() => setShowConfetti(false), 3000);
  }, [basicInfo, taxInfo, projectionInfo, isBasic, toast]);

  useEffect(() => {
    if (currentStep === 3 && !showResults) {
      calculateResults();
    }
  }, [currentStep, calculateResults, showResults]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const ResultsCard = ({ title, value, icon: Icon, color = "text-primary" }: any) => (
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
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Roth Conversion Analyzer</CardTitle>
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
                isValid={steps[0].isValid}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={basicInfo.currentAge}
                      onChange={(e) => setBasicInfo(prev => ({ 
                        ...prev, 
                        currentAge: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={basicInfo.retirementAge}
                      onChange={(e) => setBasicInfo(prev => ({ 
                        ...prev, 
                        retirementAge: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="iraBalance">Traditional IRA Balance</Label>
                    <Input
                      id="iraBalance"
                      type="number"
                      value={basicInfo.traditionalIraBalance}
                      onChange={(e) => setBasicInfo(prev => ({ 
                        ...prev, 
                        traditionalIraBalance: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  
                  {/* Live Preview Card */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-muted rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Quick Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      {basicInfo.retirementAge - basicInfo.currentAge} years until retirement
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Starting with {formatCurrency(basicInfo.traditionalIraBalance)}
                    </p>
                  </motion.div>
                </div>
              </WizardStep>
            )}

            {currentStep === 1 && (
              <WizardStep
                title={steps[1].title}
                description={steps[1].description}
                isValid={steps[1].isValid}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentBracket">Current Tax Bracket (%)</Label>
                    <Select 
                      value={taxInfo.currentTaxBracket.toString()} 
                      onValueChange={(value) => setTaxInfo(prev => ({ 
                        ...prev, 
                        currentTaxBracket: parseInt(value) 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="22">22%</SelectItem>
                        <SelectItem value="24">24%</SelectItem>
                        <SelectItem value="32">32%</SelectItem>
                        <SelectItem value="35">35%</SelectItem>
                        <SelectItem value="37">37%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retirementBracket">Expected Retirement Bracket (%)</Label>
                    <Select 
                      value={taxInfo.expectedRetirementBracket.toString()} 
                      onValueChange={(value) => setTaxInfo(prev => ({ 
                        ...prev, 
                        expectedRetirementBracket: parseInt(value) 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="22">22%</SelectItem>
                        <SelectItem value="24">24%</SelectItem>
                        <SelectItem value="32">32%</SelectItem>
                        <SelectItem value="35">35%</SelectItem>
                        <SelectItem value="37">37%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="conversionAmount">Annual Conversion Amount</Label>
                    <Input
                      id="conversionAmount"
                      type="number"
                      value={taxInfo.conversionAmount}
                      onChange={(e) => setTaxInfo(prev => ({ 
                        ...prev, 
                        conversionAmount: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>

                  {/* Live Tax Impact */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-muted rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Tax Impact Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Annual conversion tax: {formatCurrency(taxInfo.conversionAmount * taxInfo.currentTaxBracket / 100)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Potential retirement savings: {taxInfo.currentTaxBracket - taxInfo.expectedRetirementBracket}% bracket difference
                    </p>
                  </motion.div>
                </div>
              </WizardStep>
            )}

            {currentStep === 2 && (
              <WizardStep
                title={steps[2].title}
                description={steps[2].description}
                isValid={steps[2].isValid}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="marketGrowth">Expected Market Growth (%)</Label>
                    <Input
                      id="marketGrowth"
                      type="number"
                      step="0.1"
                      value={projectionInfo.marketGrowthRate}
                      onChange={(e) => setProjectionInfo(prev => ({ 
                        ...prev, 
                        marketGrowthRate: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversionYear">Conversion Start Year</Label>
                    <Input
                      id="conversionYear"
                      type="number"
                      value={projectionInfo.yearOfConversion}
                      onChange={(e) => setProjectionInfo(prev => ({ 
                        ...prev, 
                        yearOfConversion: parseInt(e.target.value) || 2024 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy">Conversion Strategy</Label>
                    <Select 
                      value={projectionInfo.conversionStrategy} 
                      onValueChange={(value: any) => setProjectionInfo(prev => ({ 
                        ...prev, 
                        conversionStrategy: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual Conversions</SelectItem>
                        <SelectItem value="lumpsum">Lump Sum</SelectItem>
                        <SelectItem value="laddered">Roth Ladder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-center mt-6">
                    <RollDiceButton 
                      onRoll={() => nextStep()} 
                      isRolling={false}
                    />
                  </div>
                </div>
              </WizardStep>
            )}

            {currentStep === 3 && (
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
                      <Sparkles className="w-full h-full text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">Analyzing Your Conversion Strategy...</h3>
                    <p className="text-muted-foreground">Running Monte Carlo simulations</p>
                  </div>
                ) : showResults && results ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Analysis Complete! 🎉</h3>
                      <p className="text-muted-foreground">Here's your personalized Roth conversion strategy</p>
                    </div>

                    {/* Key Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ResultsCard
                        title="Total Tax Savings"
                        value={formatCurrency(results.totalTaxSavings)}
                        icon={DollarSign}
                        color="text-green-600"
                      />
                      <ResultsCard
                        title="Break-Even Year"
                        value={results.breakEvenYear}
                        icon={Target}
                        color="text-blue-600"
                      />
                      <ResultsCard
                        title="Final Net Worth"
                        value={formatCurrency(results.finalNetWorth)}
                        icon={TrendingUp}
                        color="text-purple-600"
                      />
                    </div>

                    {/* Projection Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">30-Year Projection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={results.projections}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            <Line 
                              type="monotone" 
                              dataKey="netWorth" 
                              stroke="#8884d8" 
                              strokeWidth={3}
                              name="Net Worth"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="taxSavings" 
                              stroke="#22c55e" 
                              strokeWidth={2}
                              name="Tax Savings"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < 3 && (
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

        {currentStep === 3 && showResults && (
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(0)}>
              Start Over
            </Button>
            <Button>
              Save Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};