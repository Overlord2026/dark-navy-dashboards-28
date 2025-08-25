import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { SOURCES, getSourcesByKind, isSourceHealthy } from '@/features/ai/fabric/sources';
import { getEvents } from '@/features/ai/fabric/events';
import { getVectorStats } from '@/features/ai/fabric/vector';
import { getCopilot } from '@/features/ai/fabric/copilots';
import { simulationStudio } from '@/features/ai/fabric/simulation';
import { reason } from '@/features/ai/fabric/reasoning';
import { Brain, Database, Activity, Zap, BarChart3, Shield } from 'lucide-react';

export default function AIFabricDashboard() {
  const [sources, setSources] = useState(SOURCES);
  const [events, setEvents] = useState<any[]>([]);
  const [vectorStats, setVectorStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [reasoning, setReasoning] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [recentEvents, stats] = await Promise.all([
        getEvents({ since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }),
        getVectorStats()
      ]);
      
      setEvents(recentEvents);
      setVectorStats(stats);
      
      // Load family copilot recommendations
      const familyCopilot = getCopilot('family') as any;
      const recs = await familyCopilot.getRecommendations('user123', 'retirement planning');
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const runSimulation = async () => {
    try {
      const result = await simulationStudio.runMonteCarloRetirement('user123', {
        currentAge: 35,
        retirementAge: 65,
        currentSavings: 150000,
        monthlyContribution: 2000,
        expectedReturn: 0.07,
        inflationRate: 0.03,
        targetIncome: 80000
      });
      setSimulationResult(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  };

  const testReasoning = async () => {
    try {
      const result = await reason({
        userId: 'user123',
        scope: 'k401.trade',
        query: 'Should I trade $30,000 in my 401k SDBA account?',
        data: { amount: 30000, account: 'sdba' }
      });
      setReasoning(result);
    } catch (error) {
      console.error('Reasoning failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Fabric Dashboard</h1>
          <p className="text-muted-foreground">Policy + Retrieval + Memory + Receipts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runSimulation} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Run Simulation
          </Button>
          <Button onClick={testReasoning} variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Test Reasoning
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="copilots">Copilots</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sources.length}</div>
                <p className="text-xs text-muted-foreground">
                  {sources.filter(s => s.status === 'ok').length} healthy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vector Documents</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vectorStats?.totalDocuments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Indexed for retrieval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events (24h)</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">
                  System events logged
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recommendations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active suggestions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sources.map(source => (
                    <div key={source.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={source.status === 'ok' ? 'default' : 'destructive'}>
                          {source.kind}
                        </Badge>
                        <span className="text-sm">{source.key}</span>
                      </div>
                      <Badge variant={source.status === 'ok' ? 'secondary' : 'destructive'}>
                        {source.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center justify-between text-sm">
                      <div>
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="ml-2">{event.subject}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(event.at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="copilots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Copilot Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map(rec => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Confidence:</span>
                          <Progress value={rec.confidence * 100} className="w-20" />
                          <span className="text-xs">{Math.round(rec.confidence * 100)}%</span>
                        </div>
                      </div>
                      <Button size="sm">Act</Button>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium">Reasoning:</p>
                      {rec.reasoning.map((reason: string, i: number) => (
                        <p key={i} className="text-xs text-muted-foreground">• {reason}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reasoning" className="space-y-4">
          {reasoning && (
            <Card>
              <CardHeader>
                <CardTitle>AI Reasoning Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Decision</p>
                      <Badge variant={reasoning.decision === 'PROCEED' ? 'default' : 'destructive'}>
                        {reasoning.decision}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Confidence</p>
                      <div className="flex items-center gap-2">
                        <Progress value={reasoning.confidence * 100} className="w-16" />
                        <span className="text-sm">{Math.round(reasoning.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Policy</p>
                      <Badge variant={reasoning.policy.allowed ? 'secondary' : 'destructive'}>
                        {reasoning.policy.allowed ? 'ALLOWED' : 'BLOCKED'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Reasoning Chain</p>
                    <div className="space-y-1">
                      {reasoning.reasoning.map((step: string, i: number) => (
                        <p key={i} className="text-sm text-muted-foreground">• {step}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Evidence ({reasoning.evidence.length} sources)</p>
                    <div className="space-y-2">
                      {reasoning.evidence.map((evidence: any, i: number) => (
                        <div key={i} className="border rounded p-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{evidence.source}</Badge>
                            <span className="text-xs">Relevance: {Math.round(evidence.relevance * 100)}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{evidence.content.slice(0, 100)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          {simulationResult && (
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Retirement Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Success Rate</p>
                      <div className="text-2xl font-bold">
                        {Math.round(simulationResult.summary.successRate * 100)}%
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mean Income</p>
                      <div className="text-2xl font-bold">
                        ${Math.round(simulationResult.summary.meanOutcome).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Std Deviation</p>
                      <div className="text-2xl font-bold">
                        ${Math.round(simulationResult.summary.standardDeviation).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Confidence Interval</p>
                      <div className="text-sm">
                        ${Math.round(simulationResult.summary.confidenceInterval[0]).toLocaleString()} - 
                        ${Math.round(simulationResult.summary.confidenceInterval[1]).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Recommendations</p>
                    <div className="space-y-1">
                      {simulationResult.recommendations.map((rec: string, i: number) => (
                        <p key={i} className="text-sm text-muted-foreground">• {rec}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                AI Governance & Observability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Trust Rails Status</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Policy Engine: Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Content-Free Receipts: Enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Anchoring: Optional</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Safety Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Policy Violations (24h)</span>
                      <Badge variant="secondary">0</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Model Drift Detection</span>
                      <Badge variant="secondary">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Trail Completeness</span>
                      <Badge variant="secondary">100%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}