import React, { useState } from 'react';
import { RetirementCalculatorEngine } from '@/components/retirement/RetirementCalculatorEngine';
import { RetirementErrorBoundary } from '@/components/retirement/RetirementErrorBoundary';
import { PlanImportWizard } from '@/components/retirement/PlanImportWizard';
import { PlanImportDashboard } from '@/components/retirement/PlanImportDashboard';
import { AdvisorClientDashboard } from '@/components/retirement/AdvisorClientDashboard';
import { RetirementAnalysisInput } from '@/types/retirement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SequenceRiskAnalyzer } from '@/components/retirement/SequenceRiskAnalyzer';
import { LTCStressAnalyzer } from '@/components/retirement/LTCStressAnalyzer';
import { MultiPhaseAnalyzer } from '@/components/retirement/MultiPhaseAnalyzer';
import { SurvivingSpouseModule } from '@/components/shared/SurvivingSpouseModule';
import { TaxPlanningModal } from '@/components/calculators/TaxPlanningModal';
import { ClientRiskProfileQuiz } from '@/components/portfolio/ClientRiskProfileQuiz';

export default function RetirementAnalyzerDemo() {
  const [showTaxPlanningModal, setShowTaxPlanningModal] = useState(false);
  const [taxCalculatorType, setTaxCalculatorType] = useState<'roth-conversion' | 'tax-savings-estimator' | 'charitable-gifting'>('roth-conversion');
  const [inputs, setInputs] = useState<RetirementAnalysisInput>({
    goals: {
      retirementAge: 65,
      retirementDate: new Date('2040-01-01'),
      currentAge: 35,
      desiredLifestyle: 'moderate',
      annualRetirementIncome: 120000,
      inflationRate: 2.5,
      lifeExpectancy: 90
    },
    socialSecurity: {
      enabled: true,
      currentEarnings: 100000,
      earningsHistory: [95000, 98000, 100000, 102000, 105000],
      filingAge: 67,
      spousalBenefit: false,
      colaAdjustment: true
    },
    pension: {
      enabled: false,
      monthlyBenefit: 0,
      startAge: 65,
      survivorBenefit: 0,
      colaProtection: false
    },
    accounts: [
      {
        id: '401k_primary',
        type: '401k',
        balance: 150000,
        annualContribution: 22500,
        employerMatch: 5000,
        expectedReturn: 8,
        taxStatus: 'pre_tax',
        requiredMinDistribution: true,
        rmdAge: 73
      },
      {
        id: 'roth_ira',
        type: 'roth_ira',
        balance: 75000,
        annualContribution: 6500,
        expectedReturn: 8,
        taxStatus: 'tax_free'
      },
      {
        id: 'brokerage',
        type: 'brokerage',
        balance: 100000,
        annualContribution: 12000,
        expectedReturn: 7,
        taxStatus: 'after_tax'
      },
      {
        id: 'hsa',
        type: 'hsa',
        balance: 25000,
        annualContribution: 4300,
        expectedReturn: 7,
        taxStatus: 'tax_free'
      }
    ],
    expenses: [
      {
        id: 'housing',
        name: 'Housing & Utilities',
        currentAmount: 36000,
        retirementAmount: 32000,
        inflationProtected: true,
        essential: true
      },
      {
        id: 'food',
        name: 'Food & Groceries',
        currentAmount: 12000,
        retirementAmount: 10000,
        inflationProtected: true,
        essential: true
      },
      {
        id: 'transportation',
        name: 'Transportation',
        currentAmount: 8000,
        retirementAmount: 6000,
        inflationProtected: true,
        essential: true
      },
      {
        id: 'healthcare',
        name: 'Healthcare',
        currentAmount: 8000,
        retirementAmount: 15000,
        inflationProtected: true,
        essential: true
      },
      {
        id: 'entertainment',
        name: 'Entertainment & Travel',
        currentAmount: 15000,
        retirementAmount: 20000,
        inflationProtected: false,
        essential: false
      },
      {
        id: 'miscellaneous',
        name: 'Miscellaneous',
        currentAmount: 6000,
        retirementAmount: 5000,
        inflationProtected: true,
        essential: false
      }
    ],
    taxOptimization: {
      withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'],
      rothConversionStrategy: false,
      taxBracketManagement: true,
      harverstLosses: false
    },
    healthcare: {
      currentAge: 35,
      estimatedAnnualCost: 15000,
      longTermCareInsurance: false,
      longTermCareCost: 60000,
      medicareSupplementation: true
    },
    legacy: {
      targetInheritance: 500000,
      charitableGiving: 10000,
      estateTaxPlanning: false
    }
  });

  const handleRiskProfileComplete = (profile: any) => {
    // Integrate risk profile with retirement inputs
    // This would typically update Monte Carlo parameters based on risk tolerance
    console.log('Risk profile completed:', profile);
  };

  const openTaxCalculator = (type: 'roth-conversion' | 'tax-savings-estimator' | 'charitable-gifting') => {
    setTaxCalculatorType(type);
    setShowTaxPlanningModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              SWAG™ Retirement Analyzer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Next-generation retirement planning with Monte Carlo simulations, scenario modeling, 
              and personalized roadmap generation. Experience the future of financial planning.
            </p>
            <div className="flex justify-center">
              <PlanImportWizard />
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="analyzer">Retirement Analyzer</TabsTrigger>
              <TabsTrigger value="sequence-risk">Sequence Risk</TabsTrigger>
              <TabsTrigger value="ltc-stress">LTC Stress Test</TabsTrigger>
              <TabsTrigger value="multi-phase">Multi-Phase</TabsTrigger>
              <TabsTrigger value="surviving-spouse">Surviving Spouse</TabsTrigger>
              <TabsTrigger value="tax-optimization">Tax Optimization</TabsTrigger>
              <TabsTrigger value="risk-profile">Risk Profile</TabsTrigger>
              <TabsTrigger value="advisor">Advisor Dashboard</TabsTrigger>
              <TabsTrigger value="imports">Plan Imports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyzer" className="mt-8">
              <RetirementErrorBoundary>
                <RetirementCalculatorEngine
                  inputs={inputs}
                  onInputsChange={setInputs}
                />
              </RetirementErrorBoundary>
            </TabsContent>
            
            <TabsContent value="sequence-risk" className="mt-8">
              <SequenceRiskAnalyzer />
            </TabsContent>
            
            <TabsContent value="ltc-stress" className="mt-8">
              <LTCStressAnalyzer />
            </TabsContent>
            
            <TabsContent value="multi-phase" className="mt-8">
              <MultiPhaseAnalyzer />
            </TabsContent>
            
            <TabsContent value="surviving-spouse" className="mt-8">
              <SurvivingSpouseModule />
            </TabsContent>
            
            <TabsContent value="tax-optimization" className="mt-8">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Tax Optimization Suite</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Advanced tax planning tools to optimize your retirement strategy through Roth conversions, 
                    multi-year tax projections, and charitable giving strategies.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    className="p-6 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => openTaxCalculator('roth-conversion')}
                  >
                    <h3 className="font-semibold text-lg mb-2">Roth Conversion Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyze the tax benefits of converting traditional IRA/401k funds to Roth accounts.
                    </p>
                    <div className="text-primary font-medium">Launch Calculator →</div>
                  </div>
                  
                  <div 
                    className="p-6 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => openTaxCalculator('tax-savings-estimator')}
                  >
                    <h3 className="font-semibold text-lg mb-2">Multi-Year Tax Projections</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Project tax savings across multiple years with various optimization strategies.
                    </p>
                    <div className="text-primary font-medium">Launch Calculator →</div>
                  </div>
                  
                  <div 
                    className="p-6 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => openTaxCalculator('charitable-gifting')}
                  >
                    <h3 className="font-semibold text-lg mb-2">Charitable Giving Strategy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Optimize charitable giving for maximum tax benefits and impact.
                    </p>
                    <div className="text-primary font-medium">Launch Calculator →</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="risk-profile" className="mt-8">
              <div className="max-w-3xl mx-auto">
                <div className="text-center space-y-4 mb-8">
                  <h2 className="text-2xl font-bold">Dynamic Risk Profiling</h2>
                  <p className="text-muted-foreground">
                    Complete this comprehensive risk assessment to personalize your retirement projections 
                    and optimize your investment strategy based on your unique risk tolerance and capacity.
                  </p>
                </div>
                <ClientRiskProfileQuiz onComplete={handleRiskProfileComplete} />
              </div>
            </TabsContent>
            
            <TabsContent value="advisor" className="mt-8">
              <AdvisorClientDashboard />
            </TabsContent>
            
            <TabsContent value="imports" className="mt-8">
              <PlanImportDashboard />
            </TabsContent>
          </Tabs>
          
          {/* Tax Planning Modal */}
          <TaxPlanningModal
            open={showTaxPlanningModal}
            onClose={() => setShowTaxPlanningModal(false)}
            calculatorType={taxCalculatorType}
          />
        </div>
      </div>
    </div>
  );
}