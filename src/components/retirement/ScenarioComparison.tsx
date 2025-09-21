import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useRetirementScenarios, type AdvisorClient, type RetirementScenario } from '@/hooks/useRetirementScenarios';

interface ScenarioComparisonProps {
  client: AdvisorClient;
}

export function ScenarioComparison({ client }: ScenarioComparisonProps) {
  const { getScenariosForClient } = useRetirementScenarios();
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  
  const clientScenarios = getScenariosForClient(client.id);
  const activeScenarios = clientScenarios.filter(s => s.scenario_status === 'active' || s.scenario_status === 'draft');

  const toggleScenarioSelection = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const selectedScenarioData = selectedScenarios.map(id => 
    clientScenarios.find(s => s.id === id)
  ).filter(Boolean) as RetirementScenario[];

  // Mock comparison results - in real implementation, this would be calculated
  const getScenarioResults = (scenario: RetirementScenario) => {
    const baseResults = {
      successProbability: Math.random() * 40 + 60, // 60-100%
      monthlyIncome: Math.random() * 3000 + 4000, // $4k-7k
      totalNeeded: Math.random() * 300000 + 800000, // $800k-1.1M
      swagScore: Math.random() * 30 + 70, // 70-100
      riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      yearsToGoal: Math.random() * 5 + 15 // 15-20 years
    };
    
    return baseResults;
  };

  const ComparisonMetric = ({ 
    label, 
    scenarios, 
    getValue, 
    format,
    icon: Icon,
    getBadgeVariant 
  }: {
    label: string;
    scenarios: RetirementScenario[];
    getValue: (scenario: RetirementScenario) => number;
    format: (value: number) => string;
    icon: any;
    getBadgeVariant?: (value: number) => 'default' | 'secondary' | 'destructive' | 'outline';
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scenarios.map((scenario) => {
          const value = getValue(scenario);
          return (
            <div key={scenario.id} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {scenario.scenario_name}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{format(value)}</span>
                {getBadgeVariant && (
                  <Badge variant={getBadgeVariant(value)} className="text-xs">
                    {value > 80 ? 'Excellent' : value > 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  const ComparisonChart = ({ scenarios }: { scenarios: RetirementScenario[] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Success Probability Comparison
        </CardTitle>
        <CardDescription>
          Monte Carlo simulation results for each scenario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenarios.map((scenario) => {
          const results = getScenarioResults(scenario);
          return (
            <div key={scenario.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{scenario.scenario_name}</span>
                <span className="text-sm text-muted-foreground">
                  {results.successProbability.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={results.successProbability} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Scenario Comparison</CardTitle>
          <CardDescription>
            Compare retirement scenarios for {client.client_name}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Scenarios to Compare</CardTitle>
          <CardDescription>
            Choose 2-4 scenarios to compare side by side
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  selectedScenarios.includes(scenario.id)
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleScenarioSelection(scenario.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedScenarios.includes(scenario.id)}
                      onChange={() => {}}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{scenario.scenario_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        v{scenario.version_number} • {scenario.scenario_status}
                      </p>
                      {scenario.tags && scenario.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {scenario.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {scenario.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{scenario.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeScenarios.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Scenarios</h3>
              <p className="text-muted-foreground">
                Create some retirement scenarios to start comparing them
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedScenarioData.length >= 2 && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ComparisonMetric
                label="Success Probability"
                scenarios={selectedScenarioData}
                getValue={(scenario) => getScenarioResults(scenario).successProbability}
                format={(value) => `${value.toFixed(1)}%`}
                icon={Target}
                getBadgeVariant={(value) => value > 80 ? 'default' : value > 60 ? 'secondary' : 'destructive'}
              />

              <ComparisonMetric
                label="Monthly Retirement Income"
                scenarios={selectedScenarioData}
                getValue={(scenario) => getScenarioResults(scenario).monthlyIncome}
                format={(value) => `$${value.toLocaleString()}`}
                icon={DollarSign}
              />

              <ComparisonMetric
                label="SWAG Score"
                scenarios={selectedScenarioData}
                getValue={(scenario) => getScenarioResults(scenario).swagScore}
                format={(value) => `${value.toFixed(0)}/100`}
                icon={TrendingUp}
                getBadgeVariant={(value) => value > 85 ? 'default' : value > 70 ? 'secondary' : 'destructive'}
              />

              <ComparisonMetric
                label="Total Amount Needed"
                scenarios={selectedScenarioData}
                getValue={(scenario) => getScenarioResults(scenario).totalNeeded}
                format={(value) => `$${(value / 1000).toFixed(0)}k`}
                icon={Shield}
              />

              <ComparisonMetric
                label="Years to Goal"
                scenarios={selectedScenarioData}
                getValue={(scenario) => getScenarioResults(scenario).yearsToGoal}
                format={(value) => `${value.toFixed(1)} years`}
                icon={TrendingUp}
              />

              <ComparisonChart scenarios={selectedScenarioData} />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedScenarioData.map((scenario) => {
                      const results = getScenarioResults(scenario);
                      return (
                        <div key={scenario.id} className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-3">{scenario.scenario_name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Success Rate</p>
                              <p className="font-semibold">{results.successProbability.toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Monthly Income</p>
                              <p className="font-semibold">${results.monthlyIncome.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">SWAG Score</p>
                              <p className="font-semibold">{results.swagScore.toFixed(0)}/100</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Risk Level</p>
                              <Badge variant={
                                results.riskLevel === 'Low' ? 'default' : 
                                results.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                              }>
                                {results.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Analysis
                </CardTitle>
                <CardDescription>
                  Risk assessment for each scenario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedScenarioData.map((scenario) => {
                    const results = getScenarioResults(scenario);
                    return (
                      <div key={scenario.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold">{scenario.scenario_name}</h4>
                          <Badge variant={
                            results.riskLevel === 'Low' ? 'default' : 
                            results.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                          }>
                            {results.riskLevel} Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            {results.successProbability > 80 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span>Success Probability: {results.successProbability.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>Risk Level: {results.riskLevel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <span>Time to Goal: {results.yearsToGoal.toFixed(1)} years</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Based on the comparison of selected scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedScenarioData.map((scenario, index) => {
                    const results = getScenarioResults(scenario);
                    const isTop = results.swagScore === Math.max(...selectedScenarioData.map(s => getScenarioResults(s).swagScore));
                    
                    return (
                      <div key={scenario.id} className={`p-4 border rounded-lg ${isTop ? 'border-green-200 bg-green-50' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{scenario.scenario_name}</h4>
                          {isTop && (
                            <Badge className="bg-green-600">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          {results.successProbability > 85 && (
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              <span>High probability of meeting retirement goals</span>
                            </div>
                          )}
                          {results.successProbability < 70 && (
                            <div className="flex items-center gap-2 text-yellow-700">
                              <AlertCircle className="h-4 w-4" />
                              <span>Consider increasing savings or adjusting retirement age</span>
                            </div>
                          )}
                          {results.riskLevel === 'High' && (
                            <div className="flex items-center gap-2 text-red-700">
                              <AlertCircle className="h-4 w-4" />
                              <span>High risk - consider more conservative allocation</span>
                            </div>
                          )}
                          <p className="text-muted-foreground">
                            {scenario.assumptions_notes || 'No additional notes for this scenario.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {selectedScenarioData.length < 2 && selectedScenarioData.length > 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select More Scenarios</h3>
            <p className="text-muted-foreground">
              Choose at least 2 scenarios to see detailed comparisons
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}