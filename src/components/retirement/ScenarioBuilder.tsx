import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Area, AreaChart } from 'recharts';
import { 
  Plus, Calendar, DollarSign, TrendingUp, TrendingDown, AlertTriangle, 
  Briefcase, Home, Heart, GraduationCap, PiggyBank, Shield, Zap,
  BarChart3, Copy, Trash2, Eye, EyeOff, Calculator, Target
} from 'lucide-react';
import { useRetirementCalculator } from '@/hooks/useRetirementCalculator';
import { RetirementAnalysisInput, RetirementAnalysisResults, ScenarioComparison } from '@/types/retirement';
import { ResponsiveChart } from '@/components/ui/responsive-chart';

interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'early_retirement' | 'business_sale' | 'inheritance' | 'ltc_event' | 'roth_conversion' | 'market_crash' | 'healthcare_event' | 'windfall';
  inputs: Partial<RetirementAnalysisInput>;
  results?: RetirementAnalysisResults;
  isActive: boolean;
  color: string;
}

interface ScenarioBuilderProps {
  baselineInputs: RetirementAnalysisInput;
  baselineResults?: RetirementAnalysisResults;
  onInputsChange: (inputs: RetirementAnalysisInput) => void;
}

const scenarioTemplates = [
  {
    type: 'early_retirement',
    name: 'Early Retirement',
    description: 'Retire 5 years earlier than planned',
    icon: Calendar,
    color: '#8B5CF6',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      goals: { ...inputs.goals, retirementAge: inputs.goals.retirementAge - 5 }
    })
  },
  {
    type: 'business_sale',
    name: 'Business Sale',
    description: 'Windfall from business or property sale',
    icon: Briefcase,
    color: '#10B981',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      accounts: [...inputs.accounts, {
        id: 'business_sale',
        type: 'brokerage' as const,
        balance: 500000,
        annualContribution: 0,
        expectedReturn: 7,
        taxStatus: 'after_tax' as const
      }]
    })
  },
  {
    type: 'inheritance',
    name: 'Inheritance',
    description: 'Unexpected inheritance received',
    icon: Home,
    color: '#F59E0B',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      accounts: [...inputs.accounts, {
        id: 'inheritance',
        type: 'brokerage' as const,
        balance: 300000,
        annualContribution: 0,
        expectedReturn: 7,
        taxStatus: 'after_tax' as const
      }]
    })
  },
  {
    type: 'ltc_event',
    name: 'Long-Term Care',
    description: 'Extended care needs event',
    icon: Heart,
    color: '#EF4444',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      healthcare: { 
        ...inputs.healthcare, 
        longTermCareInsurance: false,
        longTermCareCost: inputs.healthcare.longTermCareCost + 80000
      }
    })
  },
  {
    type: 'roth_conversion',
    name: 'Roth Conversion',
    description: 'Strategic Roth IRA conversions',
    icon: PiggyBank,
    color: '#06B6D4',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      taxOptimization: { ...inputs.taxOptimization, rothConversionStrategy: true }
    })
  },
  {
    type: 'market_crash',
    name: 'Market Crash',
    description: '30% portfolio decline scenario',
    icon: TrendingDown,
    color: '#DC2626',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      accounts: inputs.accounts.map(acc => ({ ...acc, balance: acc.balance * 0.7 }))
    })
  },
  {
    type: 'healthcare_event',
    name: 'Healthcare Crisis',
    description: 'Major medical expense event',
    icon: Shield,
    color: '#F97316',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      healthcare: { 
        ...inputs.healthcare, 
        estimatedAnnualCost: inputs.healthcare.estimatedAnnualCost * 2
      }
    })
  },
  {
    type: 'windfall',
    name: 'Investment Windfall',
    description: 'Lucky investment or lottery win',
    icon: Zap,
    color: '#84CC16',
    defaultModifications: (inputs: RetirementAnalysisInput) => ({
      accounts: [...inputs.accounts, {
        id: 'windfall',
        type: 'brokerage' as const,
        balance: 1000000,
        annualContribution: 0,
        expectedReturn: 7,
        taxStatus: 'after_tax' as const
      }]
    })
  }
];

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  baselineInputs,
  baselineResults,
  onInputsChange
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isCreatingScenario, setIsCreatingScenario] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const { calculateRetirement, loading } = useRetirementCalculator();

  const handleCreateScenario = useCallback(async (
    type: string, 
    name: string, 
    modifications: Partial<RetirementAnalysisInput>
  ) => {
    const template = scenarioTemplates.find(t => t.type === type);
    if (!template) return;

    const scenarioId = `scenario_${Date.now()}`;
    const scenarioInputs = { ...baselineInputs, ...modifications };

    try {
      const results = await calculateRetirement(scenarioInputs);
      
      const newScenario: Scenario = {
        id: scenarioId,
        name,
        description: template.description,
        type: type as any,
        inputs: modifications,
        results,
        isActive: true,
        color: template.color
      };

      setScenarios(prev => [...prev, newScenario]);
      setSelectedScenario(scenarioId);
    } catch (error) {
      console.error('Failed to create scenario:', error);
    }
  }, [baselineInputs, calculateRetirement]);

  const handleToggleScenario = useCallback((scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, isActive: !s.isActive } : s
    ));
  }, []);

  const handleDeleteScenario = useCallback((scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (selectedScenario === scenarioId) {
      setSelectedScenario(null);
    }
  }, [selectedScenario]);

  const activeScenarios = useMemo(() => 
    scenarios.filter(s => s.isActive), [scenarios]);

  const comparisonData = useMemo(() => {
    if (!baselineResults || activeScenarios.length === 0) return [];

    const years = Math.min(30, baselineResults.projectedCashFlow.length);
    return Array.from({ length: years }, (_, index) => {
      const year = index + 1;
      const age = baselineInputs.goals.currentAge + index;
      
      const dataPoint: any = {
        year,
        age,
        baseline: baselineResults.projectedCashFlow[index]?.endingBalance || 0
      };

      activeScenarios.forEach(scenario => {
        if (scenario.results?.projectedCashFlow[index]) {
          dataPoint[scenario.id] = scenario.results.projectedCashFlow[index].endingBalance;
        }
      });

      return dataPoint;
    });
  }, [baselineResults, activeScenarios, baselineInputs.goals.currentAge]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getScenarioIcon = (type: string) => {
    const template = scenarioTemplates.find(t => t.type === type);
    return template?.icon || Target;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <CardTitle>Scenario Builder</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                className="gap-2"
              >
                {showComparison ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showComparison ? 'Hide' : 'Show'} Comparison
              </Button>
              <Dialog open={isCreatingScenario} onOpenChange={setIsCreatingScenario}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Scenario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Scenario</DialogTitle>
                  </DialogHeader>
                  <ScenarioCreationForm 
                    onCreateScenario={handleCreateScenario}
                    onClose={() => setIsCreatingScenario(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Baseline */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover-scale ${
                selectedScenario === null ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedScenario(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-medium">Baseline Plan</span>
                </div>
                <Badge variant="outline">Base</Badge>
              </div>
              {baselineResults && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{baselineResults.monteCarlo.successProbability.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SWAG Score</span>
                    <span className="font-medium">{baselineResults.monteCarlo.swagScore.toFixed(0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Scenarios */}
            {scenarios.map(scenario => {
              const IconComponent = getScenarioIcon(scenario.type);
              return (
                <div
                  key={scenario.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover-scale ${
                    selectedScenario === scenario.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" style={{ color: scenario.color }} />
                      <span className="font-medium">{scenario.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={scenario.isActive}
                        onCheckedChange={() => handleToggleScenario(scenario.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScenario(scenario.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{scenario.description}</p>
                  {scenario.results && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-medium">{scenario.results.monteCarlo.successProbability.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">SWAG Score</span>
                        <span className="font-medium">{scenario.results.monteCarlo.swagScore.toFixed(0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {scenarios.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No scenarios created yet</p>
                <p className="text-xs">Add scenarios to compare outcomes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenario Details & Comparison */}
        <div className="lg:col-span-2 space-y-6">
          {showComparison && activeScenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Projection Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart height={320} minHeight={200}>
                  <AreaChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="age" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `Age ${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === 'baseline' ? 'Baseline' : scenarios.find(s => s.id === name)?.name || name
                      ]}
                      labelFormatter={(value) => `Age ${value}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Baseline"
                    />
                    
                    {activeScenarios.map(scenario => (
                      <Area
                        key={scenario.id}
                        type="monotone"
                        dataKey={scenario.id}
                        stackId="2"
                        stroke={scenario.color}
                        fill={scenario.color}
                        fillOpacity={0.3}
                        name={scenario.name}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveChart>
              </CardContent>
            </Card>
          )}

          {/* Monte Carlo Comparison */}
          {activeScenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Results Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Baseline */}
                  {baselineResults && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium">Baseline Plan</span>
                        </div>
                        <Badge variant="outline">Base</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className="text-lg font-semibold">{baselineResults.monteCarlo.successProbability.toFixed(1)}%</p>
                          <Progress value={baselineResults.monteCarlo.successProbability} className="mt-1" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">SWAG Score</p>
                          <p className="text-lg font-semibold">{baselineResults.monteCarlo.swagScore.toFixed(0)}</p>
                          <Progress value={baselineResults.monteCarlo.swagScore} className="mt-1" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Median Value</p>
                          <p className="text-sm font-medium">{formatCurrency(baselineResults.monteCarlo.medianPortfolioValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">10th Percentile</p>
                          <p className="text-sm font-medium">{formatCurrency(baselineResults.monteCarlo.worstCase10th)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Scenarios */}
                  {activeScenarios.map(scenario => {
                    if (!scenario.results) return null;
                    
                    const IconComponent = getScenarioIcon(scenario.type);
                    return (
                      <div key={scenario.id} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" style={{ color: scenario.color }} />
                            <span className="font-medium">{scenario.name}</span>
                          </div>
                          <Badge style={{ backgroundColor: scenario.color, color: 'white' }}>
                            {scenario.results.monteCarlo.successProbability >= (baselineResults?.monteCarlo.successProbability || 0) ? '+' : '-'}
                            {Math.abs(scenario.results.monteCarlo.successProbability - (baselineResults?.monteCarlo.successProbability || 0)).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Success Rate</p>
                            <p className="text-lg font-semibold">{scenario.results.monteCarlo.successProbability.toFixed(1)}%</p>
                            <Progress value={scenario.results.monteCarlo.successProbability} className="mt-1" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">SWAG Score</p>
                            <p className="text-lg font-semibold">{scenario.results.monteCarlo.swagScore.toFixed(0)}</p>
                            <Progress value={scenario.results.monteCarlo.swagScore} className="mt-1" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Median Value</p>
                            <p className="text-sm font-medium">{formatCurrency(scenario.results.monteCarlo.medianPortfolioValue)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">10th Percentile</p>
                            <p className="text-sm font-medium">{formatCurrency(scenario.results.monteCarlo.worstCase10th)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Scenario Creation Form Component
interface ScenarioCreationFormProps {
  onCreateScenario: (type: string, name: string, modifications: Partial<RetirementAnalysisInput>) => void;
  onClose: () => void;
}

const ScenarioCreationForm: React.FC<ScenarioCreationFormProps> = ({ onCreateScenario, onClose }) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [scenarioName, setScenarioName] = useState('');
  const [customModifications, setCustomModifications] = useState<any>({});

  const handleCreateScenario = () => {
    if (!selectedType || !scenarioName) return;

    const template = scenarioTemplates.find(t => t.type === selectedType);
    if (!template) return;

    // This is a simplified version - in a full implementation, you'd have 
    // detailed forms for each scenario type
    const baseModifications = template.defaultModifications({} as any);
    const finalModifications = { ...baseModifications, ...customModifications };

    onCreateScenario(selectedType, scenarioName, finalModifications);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {scenarioTemplates.map(template => {
          const IconComponent = template.icon;
          return (
            <Card
              key={template.type}
              className={`cursor-pointer transition-all hover-scale ${
                selectedType === template.type ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedType(template.type);
                setScenarioName(template.name);
              }}
            >
              <CardContent className="p-4 text-center">
                <IconComponent 
                  className="h-8 w-8 mx-auto mb-2" 
                  style={{ color: template.color }} 
                />
                <h3 className="font-medium text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedType && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="scenario-name">Scenario Name</Label>
            <Input
              id="scenario-name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Enter scenario name"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateScenario}
              disabled={!selectedType || !scenarioName}
            >
              Create Scenario
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};