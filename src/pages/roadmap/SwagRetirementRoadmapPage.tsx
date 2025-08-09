import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoadmapFormData {
  // Personal Info
  name: string;
  email: string;
  age: string;
  retirementAge: string;
  state: string;
  
  // Income Now (Years 1-2)
  incomeNow: {
    monthlyExpenses: string;
    incomeSources: string;
    ssAmount: string;
    pensionAmount: string;
    status: 'green' | 'amber' | 'red' | '';
  };
  
  // Income Later (Years 3-12)
  incomeLater: {
    discretionaryBudget: string;
    travelBudget: string;
    rmdEstimate: string;
    sequenceRiskProtection: boolean;
    status: 'green' | 'amber' | 'red' | '';
  };
  
  // Growth (12+ Years)
  growth: {
    portfolioValue: string;
    contributions: string;
    growthRate: string;
    riskBand: 'conservative' | 'moderate' | 'moderate_aggressive' | '';
    rebalanceCadence: 'monthly' | 'quarterly' | 'annually' | '';
    status: 'green' | 'amber' | 'red' | '';
  };
  
  // Legacy
  legacy: {
    estatePlanDocs: string;
    beneficiaries: string;
    charitableGoals: string;
    legacyVaultNeeded: boolean;
    status: 'green' | 'amber' | 'red' | '';
  };
  
  // Additional Planning
  healthcare: {
    ltcPlan: string;
    stressTestEnabled: boolean;
    status: 'green' | 'amber' | 'red' | '';
  };
  
  taxes: {
    withdrawalSequence: string;
    rothConversions: string;
    conversionTileEnabled: boolean;
    status: 'green' | 'amber' | 'red' | '';
  };
  
  liquidity: {
    cashBufferMonths: number;
    adequate: boolean;
  };
}

export const SwagRetirementRoadmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RoadmapFormData>({
    name: '',
    email: '',
    age: '',
    retirementAge: '',
    state: '',
    incomeNow: {
      monthlyExpenses: '',
      incomeSources: '',
      ssAmount: '',
      pensionAmount: '',
      status: ''
    },
    incomeLater: {
      discretionaryBudget: '',
      travelBudget: '',
      rmdEstimate: '',
      sequenceRiskProtection: false,
      status: ''
    },
    growth: {
      portfolioValue: '',
      contributions: '',
      growthRate: '',
      riskBand: '',
      rebalanceCadence: '',
      status: ''
    },
    legacy: {
      estatePlanDocs: '',
      beneficiaries: '',
      charitableGoals: '',
      legacyVaultNeeded: false,
      status: ''
    },
    healthcare: {
      ltcPlan: '',
      stressTestEnabled: false,
      status: ''
    },
    taxes: {
      withdrawalSequence: '',
      rothConversions: '',
      conversionTileEnabled: false,
      status: ''
    },
    liquidity: {
      cashBufferMonths: 0,
      adequate: false
    }
  });
  
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle prefill from scorecard
  useEffect(() => {
    const prefill = searchParams.get('prefill');
    const source = searchParams.get('source');
    
    if (prefill === 'true' && source === 'scorecard') {
      // Extract prefill data from URL params
      const prefillData: any = {};
      for (const [key, value] of searchParams.entries()) {
        if (key !== 'prefill' && key !== 'source') {
          prefillData[key] = value;
        }
      }
      
      // Apply prefill data to form
      setFormData(prev => ({
        ...prev,
        incomeNow: {
          ...prev.incomeNow,
          status: prefillData.income_now_phase_status || ''
        },
        incomeLater: {
          ...prev.incomeLater,
          status: prefillData.income_later_phase_status || '',
          sequenceRiskProtection: prefillData.income_later_sequence_risk_protection === 'true'
        },
        growth: {
          ...prev.growth,
          status: prefillData.growth_phase_status || '',
          riskBand: prefillData.growth_risk_band_suggestion || '',
          rebalanceCadence: prefillData.growth_rebalance_cadence || ''
        },
        legacy: {
          ...prev.legacy,
          status: prefillData.legacy_phase_status || '',
          legacyVaultNeeded: prefillData.legacy_vault_nudge === 'true'
        },
        healthcare: {
          ...prev.healthcare,
          status: prefillData.healthcare_ltc_status || '',
          stressTestEnabled: prefillData.healthcare_stress_test_enabled === 'true'
        },
        taxes: {
          ...prev.taxes,
          status: prefillData.tax_strategy_status || '',
          conversionTileEnabled: prefillData.roth_conversion_tile_enabled === 'true'
        },
        liquidity: {
          cashBufferMonths: parseInt(prefillData.liquidity_buffer_months) || 0,
          adequate: prefillData.liquidity_cash_buffer_adequate === 'true'
        }
      }));

      toast({
        title: "Scorecard Data Loaded",
        description: "Your retirement confidence scorecard responses have been pre-filled.",
      });
    }
  }, [searchParams, toast]);

  const steps = [
    'Personal Info',
    'Income Now (1-2 Years)',
    'Income Later (3-12 Years)', 
    'Growth (12+ Years)',
    'Legacy Planning',
    'Additional Planning'
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'amber': return <Clock className="h-5 w-5 text-warning" />;
      case 'red': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'green': return <Badge className="bg-success text-success-foreground">On Track</Badge>;
      case 'amber': return <Badge className="bg-warning text-warning-foreground">Needs Attention</Badge>;
      case 'red': return <Badge className="bg-destructive text-destructive-foreground">Priority</Badge>;
      default: return null;
    }
  };

  const handleInputChange = (section: keyof RoadmapFormData, field: string, value: any) => {
    if (section === 'name' || section === 'email' || section === 'age' || section === 'retirementAge' || section === 'state') {
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    } else if (typeof formData[section] === 'object' && formData[section] !== null) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Store roadmap intake session
      const { error } = await supabase.from('roadmap_intake_sessions').insert({
        persona: 'client-family',
        intake_data: formData,
        status: 'completed',
        source: searchParams.get('source') || 'direct'
      });

      if (error) {
        console.error('Roadmap submission error:', error);
        toast({
          title: "Submission Error",
          description: "There was an issue saving your roadmap. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Roadmap Created!",
          description: "Your SWAG™ Retirement Roadmap has been generated successfully.",
        });
        setShowResults(true);
      }
    } catch (error) {
      console.error('Roadmap submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name' as any, '', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email' as any, '', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label htmlFor="age">Current Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age' as any, '', e.target.value)}
            placeholder="Enter your current age"
          />
        </div>
        <div>
          <Label htmlFor="retirementAge">Target Retirement Age</Label>
          <Input
            id="retirementAge"
            type="number"
            value={formData.retirementAge}
            onChange={(e) => handleInputChange('retirementAge' as any, '', e.target.value)}
            placeholder="When do you plan to retire?"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="state">State of Residence</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state' as any, '', e.target.value)}
            placeholder="Enter your state"
          />
        </div>
      </div>
    </div>
  );

  const renderIncomeNow = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Income Now (Years 1-2)</h3>
        {getStatusIcon(formData.incomeNow.status)}
        {getStatusBadge(formData.incomeNow.status)}
      </div>
      <p className="text-muted-foreground mb-4">
        Essential monthly expenses covered by safe income sources during your first 1-2 years of retirement.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthlyExpenses">Monthly Core Expenses ($)</Label>
          <Input
            id="monthlyExpenses"
            type="number"
            value={formData.incomeNow.monthlyExpenses}
            onChange={(e) => handleInputChange('incomeNow', 'monthlyExpenses', e.target.value)}
            placeholder="Enter monthly expenses"
          />
        </div>
        <div>
          <Label htmlFor="ssAmount">Social Security ($/month)</Label>
          <Input
            id="ssAmount"
            type="number"
            value={formData.incomeNow.ssAmount}
            onChange={(e) => handleInputChange('incomeNow', 'ssAmount', e.target.value)}
            placeholder="Expected SS benefits"
          />
        </div>
        <div>
          <Label htmlFor="pensionAmount">Pension Income ($/month)</Label>
          <Input
            id="pensionAmount"
            type="number"
            value={formData.incomeNow.pensionAmount}
            onChange={(e) => handleInputChange('incomeNow', 'pensionAmount', e.target.value)}
            placeholder="Pension benefits"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="incomeSources">Other Income Sources</Label>
        <Textarea
          id="incomeSources"
          value={formData.incomeNow.incomeSources}
          onChange={(e) => handleInputChange('incomeNow', 'incomeSources', e.target.value)}
          placeholder="List any other reliable income sources (rental income, annuities, part-time work, etc.)"
          className="h-20"
        />
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your SWAG™ Retirement Roadmap</h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive view of your retirement strategy across all four phases
        </p>
      </div>

      {/* Personal Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-semibold">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Age</p>
            <p className="font-semibold">{formData.age}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Retirement Age</p>
            <p className="font-semibold">{formData.retirementAge}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">State</p>
            <p className="font-semibold">{formData.state}</p>
          </div>
        </CardContent>
      </Card>

      {/* Phase Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Income Now (Years 1-2)</CardTitle>
            {getStatusIcon(formData.incomeNow.status)}
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Monthly Expenses:</strong> ${formData.incomeNow.monthlyExpenses}</p>
            <p><strong>Social Security:</strong> ${formData.incomeNow.ssAmount}</p>
            <p><strong>Pension:</strong> ${formData.incomeNow.pensionAmount}</p>
            {getStatusBadge(formData.incomeNow.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Income Later (Years 3-12)</CardTitle>
            {getStatusIcon(formData.incomeLater.status)}
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Discretionary Budget:</strong> ${formData.incomeLater.discretionaryBudget}</p>
            <p><strong>Travel Budget:</strong> ${formData.incomeLater.travelBudget}</p>
            {getStatusBadge(formData.incomeLater.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Growth (12+ Years)</CardTitle>
            {getStatusIcon(formData.growth.status)}
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Portfolio Value:</strong> ${formData.growth.portfolioValue}</p>
            <p><strong>Risk Band:</strong> {formData.growth.riskBand}</p>
            <p><strong>Rebalance:</strong> {formData.growth.rebalanceCadence}</p>
            {getStatusBadge(formData.growth.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Legacy Planning</CardTitle>
            {getStatusIcon(formData.legacy.status)}
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Estate Docs:</strong> {formData.legacy.estatePlanDocs}</p>
            <p><strong>Vault Needed:</strong> {formData.legacy.legacyVaultNeeded ? 'Yes' : 'No'}</p>
            {getStatusBadge(formData.legacy.status)}
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4">
        <Button onClick={() => setShowResults(false)} variant="outline" size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
        </Button>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Ready to refine your roadmap with a fiduciary advisor?
          </p>
          <Button size="lg">
            Schedule Planning Session <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (showResults) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {renderResults()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4">SWAG™ Retirement Roadmap</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Build your personalized retirement strategy across all four phases
          </p>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{steps[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && renderPersonalInfo()}
            {currentStep === 1 && renderIncomeNow()}
            {/* Add other step renderers here */}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {currentStep === steps.length - 1 ? (
              isSubmitting ? 'Creating Roadmap...' : 'Complete Roadmap'
            ) : (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};