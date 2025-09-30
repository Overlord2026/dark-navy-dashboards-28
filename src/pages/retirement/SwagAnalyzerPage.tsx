import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScenarioBar } from '@/components/retirement/ScenarioBar';
import { createRetirementAnalysis, runStressTest, generateScenarios, PREDEFINED_SCENARIOS } from '@/lib/retirement/engine';
import type { RetirementAnalysisInput, RetirementAnalysisResults } from '@/types/retirement';
import { useRetirementIntake } from '@/store/retirementIntake';
import { FileDown, Play, Plus } from 'lucide-react';

export default function SwagAnalyzerPage() {
  const navigate = useNavigate();
  const { inputs: storedInputs } = useRetirementIntake();
  const [activeScenario, setActiveScenario] = useState('base');
  const [results, setResults] = useState<Record<string, RetirementAnalysisResults>>({});
  const [loading, setLoading] = useState(false);

  // Sample input for demo
  const sampleInput: RetirementAnalysisInput = {
    goals: {
      retirementAge: 65,
      retirementDate: new Date('2030-01-01'),
      currentAge: 55,
      desiredLifestyle: 'moderate',
      annualRetirementIncome: 80000,
      inflationRate: 0.03,
      lifeExpectancy: 90
    },
    socialSecurity: {
      enabled: true,
      currentEarnings: 100000,
      earningsHistory: [],
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
        id: '1',
        type: '401k',
        balance: 500000,
        annualContribution: 22500,
        employerMatch: 5000,
        expectedReturn: 0.07,
        taxStatus: 'pre_tax',
        requiredMinDistribution: true,
        rmdAge: 73
      }
    ],
    expenses: [
      {
        id: '1',
        name: 'Living Expenses',
        currentAmount: 60000,
        retirementAmount: 60000,
        inflationProtected: true,
        essential: true
      }
    ],
    taxOptimization: {
      withdrawalSequence: ['taxable', 'tax_deferred', 'tax_free'],
      rothConversionStrategy: true,
      taxBracketManagement: true,
      harverstLosses: true
    },
    healthcare: {
      currentAge: 55,
      estimatedAnnualCost: 15000,
      longTermCareInsurance: false,
      longTermCareCost: 0,
      medicareSupplementation: true
    },
    legacy: {
      targetInheritance: 500000,
      charitableGiving: 50000,
      estateTaxPlanning: true
    }
  };

  // Use stored inputs from intake or fallback to sample
  const analysisInput = (storedInputs as RetirementAnalysisInput) || sampleInput;

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const scenarios = generateScenarios(analysisInput);
      const newResults: Record<string, RetirementAnalysisResults> = {};
      
      for (const scenario of scenarios) {
        if (scenario.id === 'base') {
          newResults[scenario.id] = await createRetirementAnalysis(analysisInput);
        } else {
          newResults[scenario.id] = await runStressTest(analysisInput, scenario);
        }
      }
      
      setResults(newResults);
    } finally {
      setLoading(false);
    }
  };

  const currentResult = results[activeScenario];
  const scenarioResults = Object.entries(results).reduce((acc, [id, result]) => {
    acc[id] = { swagScore: result.monteCarlo.swagScore };
    return acc;
  }, {} as Record<string, { swagScore: number }>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SWAG Retirement Analyzer™</h1>
          <p className="text-muted-foreground">
            Outcome-first stress testing across retirement phases
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Analysis Controls</CardTitle>
            <CardDescription>Run comprehensive retirement analysis</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={handleRunAnalysis} 
              disabled={loading}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {loading ? 'Running Analysis...' : 'Run Analysis'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/wealth/retirement/start')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </CardContent>
        </Card>

        {Object.keys(results).length > 0 && (
          <>
            <ScenarioBar
              scenarios={PREDEFINED_SCENARIOS}
              activeScenario={activeScenario}
              onScenarioChange={setActiveScenario}
              results={scenarioResults}
            />

            {currentResult && (
              <div className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Readiness Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-6xl font-bold text-primary">
                      {currentResult.readinessScore.toFixed(0)}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monte Carlo Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                        <div className="text-2xl font-bold">
                          {(currentResult.monteCarlo.successProbability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">SWAG Score</div>
                        <div className="text-2xl font-bold">
                          {currentResult.monteCarlo.swagScore.toFixed(0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Years Sustained</div>
                        <div className="text-2xl font-bold">
                          {currentResult.monteCarlo.yearsOfPortfolioSustainability}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Income Gap</div>
                        <div className="text-2xl font-bold">
                          ${(currentResult.monthlyIncomeGap / 1000).toFixed(1)}K
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentResult.recommendations.map((rec) => (
                        <div key={rec.id} className="border-l-4 border-primary pl-4">
                          <div className="font-semibold">{rec.title}</div>
                          <div className="text-sm text-muted-foreground">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Export PDF Report
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
