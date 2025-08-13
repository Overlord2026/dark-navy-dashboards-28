'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Target, 
  FileText,
  Settings,
  PlayCircle,
  CheckCircle
} from 'lucide-react';
import { SwagPhaseManager } from '@/components/swag-retirement/SwagPhaseManager';
import { EnhancedProfileForm } from '@/components/swag-retirement/EnhancedProfileForm';
import { SwagRetirementPDFExport } from '@/components/swag-retirement/SwagRetirementPDFExport';
import { useSwagRetirementCalculator } from '@/hooks/useSwagRetirementCalculator';
import { 
  SwagRetirementAnalysisInput, 
  SwagRetirementAnalysisResults, 
  SwagPhase, 
  EnhancedProfile 
} from '@/types/swag-retirement';

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
    investmentCategories: [],
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
    investmentCategories: [],
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
    investmentCategories: [],
    enabled: true,
    order: 4
  }
];

export default function SwagRetirementRoadmapPage() {
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
      liquid: [], taxable: [], taxDeferred: [], roth: [], realEstate: [],
      business: [], digitalAssets: [], insurance: [], annuities: [], collectibles: []
    },
    incomeStreams: {
      employment: [],
      socialSecurity: { primaryBenefitAge67: 0, filingStrategy: '', taxable: true },
      pensions: [], rental: [], business: [], investments: [], other: []
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

  const handleRunAnalysis = async () => {
    try {
      setActiveStep('analysis');
      const analysisInput: SwagRetirementAnalysisInput = {
        profile: {
          primaryClient: profile.primaryClient,
          spouse: profile.spouse,
          filingStatus: profile.filingStatus,
          estateDocuments: profile.estateDocuments
        },
        phases: phases,
        socialSecurity: { clientStartAge: 67, colaPct: 2.0 },
        assets: [],
        assumptions: {
          inflation: 3.0,
          returns: { incomeNow: 4.0, incomeLater: 5.2, growth: 7.1, legacy: 6.0 },
          reserveAmount: 120000
        },
        taxOptimization: {
          withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'],
          rothConversionStrategy: false,
          taxBracketManagement: true,
          harvestLosses: false // Fixed spelling
        }
      };

      const analysisResults = await calculateSwagRetirement(analysisInput);
      setResults(analysisResults);
      setActiveStep('results');
    } catch (err) {
      console.error('Analysis failed:', err);
    }
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

          {/* Results with PDF Export */}
          {activeStep === 'results' && results && (
            <>
              <div className="flex justify-end mb-4">
                <SwagRetirementPDFExport
                  inputs={{
                    profile: {
                      primaryClient: profile.primaryClient,
                      spouse: profile.spouse,
                      filingStatus: profile.filingStatus,
                      estateDocuments: profile.estateDocuments
                    },
                    phases: phases,
                    socialSecurity: { clientStartAge: 67, colaPct: 2.0 },
                    assets: [],
                    assumptions: {
                      inflation: 3.0,
                      returns: { incomeNow: 4.0, incomeLater: 5.2, growth: 7.1, legacy: 6.0 },
                      reserveAmount: 120000
                    },
                    taxOptimization: {
                      withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'],
                      rothConversionStrategy: false,
                      taxBracketManagement: true,
                      harvestLosses: false
                    }
                  }}
                  results={results}
                  loading={loading}
                />
              </div>
              <SwagPhaseManager
                phases={phases}
                allocations={results.phaseAllocations || []}
                projections={results.phaseProjections || []}
              />
            </>
          )}

          {/* Analysis Step */}
          {activeStep === 'analysis' && (
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Running SWAG Analysis</h2>
                  <Progress value={loading ? 85 : 100} className="h-3 max-w-md mx-auto" />
                  <Button onClick={handleRunAnalysis} disabled={loading}>
                    {loading ? 'Processing...' : 'Run Analysis'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Step */}
          {activeStep === 'profile' && (
            <Card>
              <CardContent className="p-8">
                <EnhancedProfileForm
                  profile={profile}
                  onProfileChange={setProfile}
                  onSave={() => console.log('Profile saved')}
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

        </div>
      </div>
    </div>
  );
}