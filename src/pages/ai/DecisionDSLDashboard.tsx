/**
 * Decision DSL Dashboard
 * Interactive interface for testing and managing decision rules
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  runRules, 
  globalRuleRegistry, 
  type Rule, 
  type RuleContext, 
  type DecisionResult 
} from '@/features/ai/decisions/dsl';
import { K401_RULES, sampleK401Context } from '@/features/ai/decisions/rules.k401';
import { ESTATE_RULES, sampleEstateContext } from '@/features/ai/decisions/rules.estate';
import { toast } from 'sonner';
import { 
  Play, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';

export default function DecisionDSLDashboard() {
  const [selectedDomain, setSelectedDomain] = useState('k401');
  const [testContext, setTestContext] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<DecisionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    // Register rule domains
    globalRuleRegistry.register('k401', K401_RULES);
    globalRuleRegistry.register('estate', ESTATE_RULES);
    
    // Set initial rules and context
    loadDomain('k401');
  }, []);

  const loadDomain = (domain: string) => {
    setSelectedDomain(domain);
    const domainRules = globalRuleRegistry.getRules(domain);
    setRules(domainRules);
    
    // Set sample context
    const sampleContext = domain === 'k401' ? sampleK401Context : sampleEstateContext;
    setTestContext(JSON.stringify(sampleContext, null, 2));
  };

  const executeRules = async () => {
    try {
      setLoading(true);
      
      const context: RuleContext = JSON.parse(testContext);
      const result = await runRules(rules, context);
      
      setExecutionResult(result);
      toast.success(`Executed ${result.executions.length} rules, ${result.decisions.length} decisions reached`);
    } catch (error) {
      console.error('Rule execution failed:', error);
      toast.error('Rule execution failed. Check context JSON format.');
    } finally {
      setLoading(false);
    }
  };

  const resetToSample = () => {
    const sampleContext = selectedDomain === 'k401' ? sampleK401Context : sampleEstateContext;
    setTestContext(JSON.stringify(sampleContext, null, 2));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Decision DSL Dashboard</h1>
          <p className="text-muted-foreground">Policy + Reasons → Proof Slips</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetToSample} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Reset Sample
          </Button>
          <Button onClick={executeRules} disabled={loading}>
            <Play className="w-4 h-4 mr-2" />
            Execute Rules
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalRuleRegistry.getAllRules().length}</div>
            <p className="text-xs text-muted-foreground">
              Across {globalRuleRegistry.getDomains().length} domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Domain</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              {selectedDomain} rules loaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Execution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {executionResult ? executionResult.decisions.length : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Decisions reached
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {executionResult 
                ? Math.round((executionResult.executions.filter(e => e.matched).length / executionResult.executions.length) * 100)
                : '-'
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Rules matched
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="execution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="execution">Rule Execution</TabsTrigger>
          <TabsTrigger value="rules">Rule Browser</TabsTrigger>
          <TabsTrigger value="results">Execution Results</TabsTrigger>
          <TabsTrigger value="proofslip">Proof Slip</TabsTrigger>
        </TabsList>

        <TabsContent value="execution" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Domain Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {globalRuleRegistry.getDomains().map(domain => (
                    <Button
                      key={domain}
                      variant={selectedDomain === domain ? 'default' : 'outline'}
                      onClick={() => loadDomain(domain)}
                    >
                      {domain} ({globalRuleRegistry.getRules(domain).length})
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label>Test Context (JSON)</Label>
                  <Textarea
                    value={testContext}
                    onChange={(e) => setTestContext(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter context JSON..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domain Rules ({rules.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {rules.map(rule => (
                    <div key={rule.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{rule.name || rule.id}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rule.description}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline">{rule.category}</Badge>
                          <Badge variant="secondary">P{rule.priority}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map(rule => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-medium">{rule.name || rule.id}</h3>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{rule.category}</Badge>
                          <Badge variant="secondary">Priority {rule.priority}</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Condition</h4>
                        <code className="text-xs bg-muted p-2 rounded block">
                          {rule.when.toString()}
                        </code>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Action</h4>
                        <code className="text-xs bg-muted p-2 rounded block">
                          {rule.then.toString().slice(0, 100)}...
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {executionResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Execution Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{executionResult.executions.length}</div>
                      <p className="text-sm text-muted-foreground">Rules Executed</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {executionResult.executions.filter(e => e.matched).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Rules Matched</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {executionResult.decisions.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Decisions Reached</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Decisions & Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {executionResult.decisions.map((decision, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="font-medium">{decision.action}</h3>
                            <div className="flex gap-1">
                              {decision.reasons.map((reason, j) => (
                                <Badge key={j} variant="outline" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                            {decision.confidence && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs">Confidence:</span>
                                <Progress value={decision.confidence * 100} className="w-20" />
                                <span className="text-xs">{Math.round(decision.confidence * 100)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {decision.next && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-2">Next Steps:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {decision.next.map((step, j) => (
                                <li key={j}>• {step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rule Execution Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {executionResult.executions.map((exec, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 border-b">
                        <div className="flex items-center gap-2">
                          {exec.matched ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                          <span>{exec.ruleId}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">{exec.executionTime}ms</span>
                          <Badge variant={exec.matched ? 'default' : 'secondary'}>
                            {exec.matched ? 'MATCHED' : 'SKIPPED'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="proofslip" className="space-y-4">
          {executionResult && (
            <Card>
              <CardHeader>
                <CardTitle>Cryptographic Proof Slip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Inputs Hash</Label>
                      <Input 
                        value={executionResult.proofSlip.inputsHash} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label>Timestamp</Label>
                      <Input 
                        value={executionResult.proofSlip.timestamp} 
                        readOnly 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Rules Executed</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {executionResult.proofSlip.rulesExecuted.map((ruleId, i) => (
                        <Badge key={i} variant="outline">{ruleId}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Audit Trail</h4>
                    <p className="text-sm text-muted-foreground">
                      This proof slip provides cryptographic evidence that {executionResult.proofSlip.decisionsReached} decisions 
                      were reached by executing {executionResult.proofSlip.rulesExecuted.length} rules against 
                      the provided context at {new Date(executionResult.proofSlip.timestamp).toLocaleString()}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}