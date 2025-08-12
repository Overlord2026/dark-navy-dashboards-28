import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  FileText,
  Settings,
  PlayCircle,
  CheckCircle
} from 'lucide-react';
import { SwagPhaseManager } from '@/components/swag-retirement/SwagPhaseManager';
import { EnhancedProfileForm } from '@/components/swag-retirement/EnhancedProfileForm';
import { useSwagRetirementCalculator } from '@/hooks/useSwagRetirementCalculator';
import { SwagRetirementAnalysisInput, SwagRetirementAnalysisResults, SwagPhase, EnhancedProfile } from '@/types/swag-retirement';

const DEFAULT_PHASES: SwagPhase[] = [
  {
    id: 'income-now',
    name: 'Income Now',
    yearStart: 1,
    yearEnd: 2,
    description: 'Core necessities (housing, food, utilities, health), 1–2 years liquidity',
    fundingRequirement: 120000,
    investmentCategories: [
      {
        id: 'cash-equivalents',
        name: 'Cash & Equivalents',
        description: 'High-yield savings, money market, short-term CDs',
        allocation: 60,
        targetAllocation: 60,
        riskLevel: 'conservative',
        expectedReturn: 4.5,
        risk: 2,
        products: []
      },
      {
        id: 'short-bonds',
        name: 'Short-Term Bonds',
        description: 'Treasury bills, high-grade corporate bonds',
        allocation: 40,
        targetAllocation: 40,
        riskLevel: 'conservative',
        expectedReturn: 5.0,
        risk: 3,
        products: []
      }
    ],
    enabled: true,
    order: 1
  },
  {
    id: 'income-later',
    name: 'Income Later',
    yearStart: 3,
    yearEnd: 12,
    description: 'Discretionary spend, RMDs, travel, safe-yield investments',
    fundingRequirement: 800000,
    investmentCategories: [
      {
        id: 'private-credit',
        name: 'Private Credit',
        description: 'Direct lending, asset-based lending',
        targetAllocation: 30,
        riskLevel: 'moderate',
        expectedReturn: 8.0,
        products: []
      },
      {
        id: 'dividend-stocks',
        name: 'Dividend Stocks',
        description: 'High-quality dividend paying companies',
        targetAllocation: 40,
        riskLevel: 'moderate',
        expectedReturn: 7.5,
        products: []
      },
      {
        id: 'annuities',
        name: 'Select Annuities',
        description: 'Fixed indexed annuities for guaranteed income',
        targetAllocation: 30,
        riskLevel: 'conservative',
        expectedReturn: 6.0,
        products: []
      }
    ],
    enabled: true,
    order: 2
  },
  {
    id: 'growth',
    name: 'Growth',
    yearStart: 12,
    yearEnd: null,
    description: 'Long-term growth (dividend stocks, high-growth equities, blockchain, private equity)',
    fundingRequirement: 1500000,
    investmentCategories: [
      {
        id: 'growth-equities',
        name: 'Growth Equities',
        description: 'High-growth technology and emerging market stocks',
        targetAllocation: 40,
        riskLevel: 'aggressive',
        expectedReturn: 10.0,
        products: []
      },
      {
        id: 'private-equity',
        name: 'Private Equity',
        description: 'Venture capital and growth capital investments',
        targetAllocation: 30,
        riskLevel: 'aggressive',
        expectedReturn: 12.0,
        products: []
      },
      {
        id: 'alternative-investments',
        name: 'Alternative Investments',
        description: 'Blockchain, commodities, hedge funds',
        targetAllocation: 30,
        riskLevel: 'aggressive',
        expectedReturn: 9.0,
        products: []
      }
    ],
    enabled: true,
    order: 3
  },
  {
    id: 'legacy',
    name: 'Legacy',
    yearStart: 1,
    yearEnd: null,
    description: 'Estate planning, charitable giving, family wealth transfer',
    fundingRequirement: 500000,
    investmentCategories: [
      {
        id: 'life-insurance',
        name: 'Life Insurance',
        description: 'Permanent life insurance for estate liquidity',
        targetAllocation: 40,
        riskLevel: 'conservative',
        expectedReturn: 4.0,
        products: []
      },
      {
        id: 'trust-investments',
        name: 'Trust Investments',
        description: 'Conservative investments held in trust structures',
        targetAllocation: 60,
        riskLevel: 'moderate',
        expectedReturn: 6.5,
        products: []
      }
    ],
    enabled: true,
    order: 4
  }
];

export default function SwagRetirementRoadmap() {
  const [activeStep, setActiveStep] = useState<'profile' | 'analysis' | 'results'>('profile');
  const [phases] = useState<SwagPhase[]>(DEFAULT_PHASES);
  const [results, setResults] = useState<SwagRetirementAnalysisResults | null>(null);
  const { calculateSwagRetirement, loading, error } = useSwagRetirementCalculator();

  const [profile, setProfile] = useState<EnhancedProfile>({
    primaryClient: {
      name: '',
      age: 45,
      occupation: '',
      retirementAge: 65,
      stateOfResidence: '',
      taxBracket: '22%'
    },
    dependents: [],
    beneficiaries: [],
    professionals: {},
    estateDocuments: {
      will: { hasDocument: false },
      trust: { hasDocument: false },
      powerOfAttorney: { hasDocument: false },
      healthDirectives: { hasDocument: false },
      digitalAssets: { hasDocument: false }
    },
    filingStatus: 'married_joint',
    assets: {
      liquid: [],
      taxable: [],
      taxDeferred: [],
      roth: [],
      realEstate: [],
      business: [],
      digitalAssets: [],
      insurance: [],
      annuities: [],
      collectibles: []
    },
    incomeStreams: {
      employment: [],
      socialSecurity: {
        primaryBenefitAge67: 0,
        filingStrategy: '',
        taxable: true
      },
      pensions: [],
      rental: [],
      business: [],
      investments: [],
      other: []
    },
    expenses: {
      housing: { current: 0, retirement: 0, inflationProtected: true, essential: true },
      transportation: { current: 0, retirement: 0, inflationProtected: true, essential: true },
      food: { current: 0, retirement: 0, inflationProtected: true, essential: true },
      healthcare: { current: 0, retirement: 0, inflationProtected: true, essential: true },
      insurance: { current: 0, retirement: 0, inflationProtected: true, essential: true },
      entertainment: { current: 0, retirement: 0, inflationProtected: false, essential: false },
      education: { current: 0, retirement: 0, inflationProtected: true, essential: false },
      charitable: { current: 0, retirement: 0, inflationProtected: false, essential: false },
      other: { current: 0, retirement: 0, inflationProtected: false, essential: false },
      totalMonthly: 0,
      inflationAssumption: 3.0
    }
  });

  const handleSaveProfile = () => {
    console.log('Profile saved:', profile);
    // TODO: Save to backend
  };

  const handleRunAnalysis = async () => {
    try {
      setActiveStep('analysis');
      
      // Convert enhanced profile to analysis input format
      const analysisInput: SwagRetirementAnalysisInput = {
        profile: {
          client: profile.client ?? { firstName: profile.primaryClient.name || '', lastName: '', age: profile.primaryClient.age },
          spouse: profile.spouse ? { firstName: profile.spouse.name, lastName: '', age: profile.spouse.age } : {},
          filingStatus: profile.filingStatus,
          primaryClient: {
            name: profile.primaryClient.name,
            age: profile.primaryClient.age,
            retirementAge: profile.primaryClient.retirementAge,
            stateOfResidence: profile.primaryClient.stateOfResidence,
            taxBracket: profile.primaryClient.taxBracket
          }
        },
        phases,
        goals: {
          retirementAge: profile.primaryClient.retirementAge,
          retirementDate: new Date(new Date().getFullYear() + (profile.primaryClient.retirementAge - profile.primaryClient.age), 0, 1),
          currentAge: profile.primaryClient.age,
          desiredLifestyle: 'moderate',
          annualRetirementIncome: profile.expenses.totalMonthly * 12,
          inflationRate: profile.expenses.inflationAssumption,
          lifeExpectancy: 90
        },
        socialSecurity: {
          enabled: profile.incomeStreams.socialSecurity.primaryBenefitAge67 > 0,
          currentEarnings: 100000, // TODO: Calculate from employment income
          earningsHistory: [],
          filingAge: 67,
          spousalBenefit: !!profile.spouse,
          colaAdjustment: true
        },
        pension: {
          enabled: profile.incomeStreams.pensions.length > 0,
          monthlyBenefit: profile.incomeStreams.pensions[0]?.monthlyBenefit || 0,
          startAge: profile.incomeStreams.pensions[0]?.startAge || 65,
          survivorBenefit: profile.incomeStreams.pensions[0]?.survivorBenefit || 0,
          colaProtection: profile.incomeStreams.pensions[0]?.colaAdjustment || false
        },
        accounts: [], // TODO: Map from profile assets
        expenses: [], // TODO: Map from profile expenses
        taxOptimization: {
          withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'],
          rothConversionStrategy: false,
          taxBracketManagement: true,
          harverstLosses: false
        },
        healthcare: {
          currentAge: profile.primaryClient.age,
          estimatedAnnualCost: profile.expenses.healthcare.current * 12,
          longTermCareInsurance: false,
          longTermCareCost: 60000,
          medicareSupplementation: true
        },
        legacy: {
          targetInheritance: 500000,
          charitableGiving: profile.expenses.charitable.current * 12,
          estateTaxPlanning: profile.estateDocuments.trust.hasDocument
        }
      };

      const analysisResults = await calculateSwagRetirement(analysisInput);
      setResults(analysisResults);
      setActiveStep('results');
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getStepIcon = (step: string) => {
    if (step === 'profile') return <FileText className="h-5 w-5" />;
    if (step === 'analysis') return <Calculator className="h-5 w-5" />;
    return <Target className="h-5 w-5" />;
  };

  const getStepStatus = (step: string) => {
    if (activeStep === step) return 'active';
    if (step === 'profile') return 'completed';
    if (step === 'analysis' && activeStep === 'results') return 'completed';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              SWAG Retirement Roadmap™
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Strategic Wealth Allocation & Growth - Your personalized 4-phase retirement framework
            </p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {[
                  { key: 'profile', label: 'Enhanced Profile', icon: 'FileText' },
                  { key: 'analysis', label: 'SWAG Analysis', icon: 'Calculator' },
                  { key: 'results', label: 'Phase Results', icon: 'Target' }
                ].map((step, index) => {
                  const status = getStepStatus(step.key);
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 
                          ${status === 'completed' ? 'bg-emerald border-emerald text-white' :
                            status === 'active' ? 'bg-primary border-primary text-white' :
                            'bg-muted border-muted-foreground text-muted-foreground'}`}>
                          {status === 'completed' ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            getStepIcon(step.key)
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <div className="font-medium text-sm">{step.label}</div>
                          <Badge variant={status === 'active' ? 'default' : 'outline'} className="mt-1">
                            {status === 'completed' ? 'Complete' : 
                             status === 'active' ? 'Active' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      {index < 2 && (
                        <div className={`w-16 h-0.5 mx-4 
                          ${status === 'completed' ? 'bg-emerald' : 'bg-muted'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          {activeStep === 'profile' && (
            <Card>
              <CardContent className="p-8">
                <EnhancedProfileForm
                  profile={profile}
                  onProfileChange={setProfile}
                  onSave={handleSaveProfile}
                />
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setActiveStep('analysis')} className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Start SWAG Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 'analysis' && (
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <Calculator className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Running SWAG Analysis</h2>
                    <p className="text-muted-foreground">
                      Processing your profile through our 4-phase retirement framework...
                    </p>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <Progress value={loading ? 85 : 100} className="h-3" />
                    <div className="text-sm text-muted-foreground">
                      {loading ? 'Calculating phase allocations and projections...' : 'Analysis complete!'}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setActiveStep('profile')}>
                      Back to Profile
                    </Button>
                    <Button onClick={handleRunAnalysis} disabled={loading}>
                      {loading ? 'Processing...' : 'Run Analysis'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 'results' && results && (
            <SwagPhaseManager
              phases={phases}
              allocations={results.phaseAllocations}
              projections={results.phaseProjections}
            />
          )}

          {/* Phase Overview (Always Visible) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SWAG Framework Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{phase.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        Phase {index + 1}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Timeline:</span>
                        <span className="font-medium">
                          {phase.yearStart}{phase.yearEnd ? `-${phase.yearEnd}y` : '+'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Categories:</span>
                        <span className="font-medium">{phase.investmentCategories.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}