import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScenarioBar } from '@/components/retirement/ScenarioBar';
import { PolicyPanel } from '@/components/retirement/PolicyPanel';
import { ResultsKpiTiles } from '@/components/retirement/ResultsKpiTiles';
import { createRetirementAnalysis, runStressTest, generateScenarios, PREDEFINED_SCENARIOS } from '@/lib/retirement/engine';
import type { RetirementAnalysisInput, RetirementAnalysisResults, RetirementPolicy } from '@/types/retirement';
import { useRetirementIntake } from '@/store/retirementIntake';
import { buildExplainPackFromState, downloadSwagExplainPack } from '@/lib/explainpack';
import { createScenario, createVersion, enqueueRunAndInvoke, waitForRun, fetchRunSummary, type RetirementResults } from '@/data/analyzer';
import { Play, Plus, Download, Printer, Save, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function SwagAnalyzerPage() {
  const navigate = useNavigate();
  const { inputs: storedInputs } = useRetirementIntake();
  const [activeScenario, setActiveScenario] = useState('base');
  const [results, setResults] = useState<Record<string, RetirementAnalysisResults>>({});
  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('My Retirement Plan');
  const [selectedVersion, setSelectedVersion] = useState('v1');
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [mcResults, setMcResults] = useState<RetirementResults | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [policy, setPolicy] = useState<RetirementPolicy>({
    guardrails: {
      method: 'none',
      initial_withdrawal_rate: 0.04,
      bands_pct: 0.20,
      raise_cut_pct: { up: 0.10, down: 0.10 }
    },
    metrics: {
      etayFormula: '',
      seayFormula: ''
    }
  });

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
  const analysisInput = {
    ...((storedInputs as RetirementAnalysisInput) || sampleInput),
    policy
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const scenarios = generateScenarios(analysisInput);
      const newResults: Record<string, RetirementAnalysisResults> = {};
      
      for (const scenario of scenarios) {
        if (scenario.id === 'base') {
          newResults[scenario.id] = await createRetirementAnalysis(analysisInput, policy);
        } else {
          newResults[scenario.id] = await runStressTest(analysisInput, scenario, policy);
        }
      }
      
      setResults(newResults);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }

    try {
      const scenario = await createScenario(scenarioName, `Scenario: ${activeScenario}`);
      setCurrentScenarioId(scenario.id);

      const version = await createVersion(scenario.id, 'v1', analysisInput, policy);
      setCurrentVersionId(version.id);

      toast.success('Scenario saved successfully');
      setSaveDialogOpen(false);
      setScenarioName('');
    } catch (error) {
      console.error('Failed to save scenario:', error);
      toast.error('Failed to save scenario');
    }
  };

  const handleRunSimulation = async () => {
    if (!currentResult) {
      toast.error('Please run analysis first');
      return;
    }

    try {
      // Ensure we have a saved scenario/version
      let versionId = currentVersionId;
      if (!versionId) {
        const scenario = await createScenario(`Auto-saved ${new Date().toISOString()}`, `Scenario: ${activeScenario}`);
        const version = await createVersion(scenario.id, 'v1', analysisInput, policy);
        versionId = version.id;
        setCurrentScenarioId(scenario.id);
        setCurrentVersionId(versionId);
      }

      // Enqueue the run and invoke edge function
      setRunStatus('queued');
      const runId = await enqueueRunAndInvoke(versionId, 5000);
      
      // Wait for completion
      setRunStatus('running');
      const completedRun = await waitForRun(runId);
      
      if (completedRun.status === 'failed') {
        setRunStatus('failed');
        toast.error(`Simulation failed: ${completedRun.error_message}`);
        return;
      }

      // Fetch results
      const simResults = await fetchRunSummary(runId);
      if (simResults) {
        setMcResults(simResults);
        setRunStatus('completed');
        toast.success('Monte Carlo simulation completed');
      }
    } catch (error) {
      console.error('Failed to run simulation:', error);
      setRunStatus('failed');
      toast.error('Failed to run simulation');
    }
  };

  const handleExportJson = async () => {
    try {
      const explainPack = await buildExplainPackFromState(
        activeScenario,
        policy,
        currentResult
      );
      downloadSwagExplainPack(explainPack);
    } catch (error) {
      console.error('Failed to export ExplainPack:', error);
    }
  };

  const handlePrintPdf = async () => {
    try {
      const explainPack = await buildExplainPackFromState(
        activeScenario,
        policy,
        currentResult
      );

      // Store in sessionStorage
      sessionStorage.setItem('swag-print-data', JSON.stringify({
        explainPack,
        currentResult
      }));

      // Open print view in new tab
      window.open('/wealth/retirement/print', '_blank');
    } catch (error) {
      console.error('Failed to prepare print view:', error);
      toast.error('Failed to open print view');
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

        {/* Initial Analysis Button */}
        {Object.keys(results).length === 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Run comprehensive retirement analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
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
        )}

        {Object.keys(results).length > 0 && (
          <>
            {/* Scenario Bar */}
            <ScenarioBar
              scenarios={PREDEFINED_SCENARIOS}
              activeScenario={activeScenario}
              onScenarioChange={setActiveScenario}
              results={scenarioResults}
            />

            {currentResult && (
              <>
                {/* Premium Results Header Bar */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Scenario</div>
                          <div className="text-xl font-semibold">{scenarioName}</div>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="w-40">
                          <div className="text-sm text-muted-foreground mb-1">Version</div>
                          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="v1">Version 1</SelectItem>
                              <SelectItem value="v2">Version 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={handleRunSimulation}
                          disabled={runStatus === 'running' || runStatus === 'queued'}
                          className="gap-2"
                        >
                          {runStatus === 'running' || runStatus === 'queued' ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Run MC
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handlePrintPdf}
                          className="gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Export
                        </Button>
                        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                              <Save className="h-4 w-4" />
                              Save
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Save Scenario</DialogTitle>
                              <DialogDescription>
                                Save this retirement scenario for future reference
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="scenario-name">Scenario Name</Label>
                                <Input
                                  id="scenario-name"
                                  placeholder="My Retirement Plan"
                                  value={scenarioName}
                                  onChange={(e) => setScenarioName(e.target.value)}
                                />
                              </div>
                            </div>
                            <Button onClick={handleSaveScenario}>Save</Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Layout: Results + Policy Panel */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                  {/* LEFT: Results column */}
                  <div className="space-y-6">
                    {/* KPI Tiles */}
                    <ResultsKpiTiles
                      successProbability={mcResults?.success_probability || currentResult.monteCarlo.successProbability}
                      etayValue={mcResults?.etay_value}
                      seayValue={mcResults?.seay_value}
                      breachRate={mcResults?.breach_rate || 0}
                    />

                    {/* Readiness Score Card */}
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

                    {/* Monte Carlo Results Card */}
                    {mcResults && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Extended Monte Carlo Results</CardTitle>
                          <CardDescription>5,000 path simulation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Terminal P10</div>
                              <div className="text-2xl font-bold">
                                ${mcResults.terminal_p10 ? (mcResults.terminal_p10 / 1000).toFixed(0) : '—'}K
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Terminal P50</div>
                              <div className="text-2xl font-bold">
                                ${mcResults.terminal_p50 ? (mcResults.terminal_p50 / 1000).toFixed(0) : '—'}K
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Terminal P90</div>
                              <div className="text-2xl font-bold">
                                ${mcResults.terminal_p90 ? (mcResults.terminal_p90 / 1000).toFixed(0) : '—'}K
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recommendations Card */}
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
                  </div>

                  {/* RIGHT: Policy Panel with subtle divider */}
                  <div className="border-l pl-6">
                    <PolicyPanel policy={policy} onChange={setPolicy} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
