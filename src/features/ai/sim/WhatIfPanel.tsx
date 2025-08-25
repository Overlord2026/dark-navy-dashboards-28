import React from 'react';
import { recordReceipt } from '@/features/receipts/record';
import { useMc401k } from '@/features/roadmap/useMc401k';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface WhatIfPanelProps {
  base: {
    employeePct?: number;
    annualSalary?: number;
    currentAge?: number;
    retirementAge?: number;
    currentBalance?: number;
    monthlyExpenses?: number;
    inflationRate?: number;
    returnRate?: number;
  };
  persona?: string;
  userId?: string;
}

interface ScenarioDelta {
  employeePct: number;
  annuitizePct: number;
  returnRate: number;
  retirementAge: number;
}

export default function WhatIfPanel({ base, persona = 'Family', userId }: WhatIfPanelProps) {
  const [delta, setDelta] = React.useState<ScenarioDelta>({
    employeePct: 1,
    annuitizePct: 0,
    returnRate: 0,
    retirementAge: 0
  });

  const [savedScenarios, setSavedScenarios] = React.useState<Array<{
    id: string;
    name: string;
    delta: ScenarioDelta;
    successProb: number;
    timestamp: string;
  }>>([]);

  const [baseSuccessProb, setBaseSuccessProb] = React.useState(0.75);
  const [modifiedSuccessProb, setModifiedSuccessProb] = React.useState(0.75);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const { toast } = useToast();
  const mcHook = useMc401k();

  // Calculate success probability based on scenario changes
  const calculateSuccessProb = React.useCallback((scenarioDelta: ScenarioDelta) => {
    let prob = baseSuccessProb;
    
    // Deferral increase generally improves success
    prob += scenarioDelta.employeePct * 0.02;
    
    // Return rate changes
    prob += scenarioDelta.returnRate * 0.15;
    
    // Retirement age changes (later = better)
    prob += scenarioDelta.retirementAge * 0.03;
    
    // Annuitization can provide stability but lower growth
    prob += scenarioDelta.annuitizePct * 0.001;
    
    return Math.max(0.1, Math.min(0.95, prob));
  }, [baseSuccessProb]);

  // Update modified success probability when delta changes
  React.useEffect(() => {
    setModifiedSuccessProb(calculateSuccessProb(delta));
  }, [delta, calculateSuccessProb]);

  const probabilityDelta = modifiedSuccessProb - baseSuccessProb;

  async function saveScenario() {
    if (isCalculating) {
      toast({
        title: "Error",
        description: "Scenario calculation not ready. Please wait.",
        variant: "destructive"
      });
      return;
    }

    const scenarioId = crypto.randomUUID();
    const scenarioName = `Scenario ${savedScenarios.length + 1}`;
    
    const newScenario = {
      id: scenarioId,
      name: scenarioName,
      delta,
      successProb: modifiedSuccessProb,
      timestamp: new Date().toISOString()
    };

    setSavedScenarios(prev => [...prev, newScenario]);

    // Log content-free receipt
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.whatif.save',
      reasons: [
        `scenario:${scenarioId}`,
        `delta_deferral:${delta.employeePct}`,
        `delta_annuitize:${delta.annuitizePct}`,
        `success_prob:${Math.round(modifiedSuccessProb * 100)}`,
        persona
      ],
      created_at: new Date().toISOString()
    } as any);

    toast({
      title: "Scenario Saved",
      description: `${scenarioName} saved with ${Math.round(modifiedSuccessProb * 100)}% success probability.`
    });
  }

  async function applyScenario() {
    // Log the scenario application
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.whatif.apply',
      reasons: [
        `delta_deferral:${delta.employeePct}`,
        `success_improvement:${Math.round(probabilityDelta * 100)}`,
        persona
      ],
      created_at: new Date().toISOString()
    } as any);

    toast({
      title: "Scenario Applied",
      description: "Your changes have been applied to your retirement plan."
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          🔮 What-If Simulation Studio
          <Badge variant="secondary" className="text-xs">
            {persona}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="deferral-delta" className="text-sm">
              Deferral Change (%)
            </Label>
            <Input
              id="deferral-delta"
              type="number"
              value={delta.employeePct}
              onChange={(e) => setDelta({...delta, employeePct: Number(e.target.value || 0)})}
              className="mt-1"
              step="0.5"
              min="-10"
              max="10"
            />
          </div>
          
          <div>
            <Label htmlFor="annuitize-delta" className="text-sm">
              Annuitize (%)
            </Label>
            <Input
              id="annuitize-delta"
              type="number"
              value={delta.annuitizePct}
              onChange={(e) => setDelta({...delta, annuitizePct: Number(e.target.value || 0)})}
              className="mt-1"
              step="5"
              min="0"
              max="100"
            />
          </div>

          <div>
            <Label htmlFor="return-delta" className="text-sm">
              Return Change (%)
            </Label>
            <Input
              id="return-delta"
              type="number"
              value={delta.returnRate}
              onChange={(e) => setDelta({...delta, returnRate: Number(e.target.value || 0)})}
              className="mt-1"
              step="0.1"
              min="-2"
              max="2"
            />
          </div>

          <div>
            <Label htmlFor="retirement-delta" className="text-sm">
              Retirement Age (+/-)
            </Label>
            <Input
              id="retirement-delta"
              type="number"
              value={delta.retirementAge}
              onChange={(e) => setDelta({...delta, retirementAge: Number(e.target.value || 0)})}
              className="mt-1"
              step="1"
              min="-5"
              max="5"
            />
          </div>
        </div>

        {/* Results Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {Math.round(baseSuccessProb * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Current Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(modifiedSuccessProb * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Scenario Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              probabilityDelta > 0 ? 'text-green-600' : 
              probabilityDelta < 0 ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {probabilityDelta > 0 ? '+' : ''}
              {Math.round(probabilityDelta * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Change</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={saveScenario} 
            variant="outline"
            disabled={isCalculating}
          >
            Save Scenario
          </Button>
          <Button 
            onClick={applyScenario}
            disabled={isCalculating || probabilityDelta <= 0}
          >
            Apply Changes
          </Button>
        </div>

        {/* Saved Scenarios */}
        {savedScenarios.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Saved Scenarios</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedScenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center justify-between p-2 bg-background rounded border text-sm">
                  <div>
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Deferral: +{scenario.delta.employeePct}% | 
                      Success: {Math.round(scenario.successProb * 100)}%
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(scenario.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scenario Impact Details */}
        <div className="mt-4 p-3 bg-background rounded border">
          <div className="text-sm font-medium mb-2">Scenario Impact</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">New Deferral Rate</div>
              <div className="font-medium">
                {Math.round(((base.employeePct || 0) + delta.employeePct / 100) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Retirement Age</div>
              <div className="font-medium">
                {(base.retirementAge || 65) + delta.retirementAge}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Expected Return</div>
              <div className="font-medium">
                {Math.round(((base.returnRate || 0.07) + delta.returnRate / 100) * 100 * 100) / 100}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Annuitization</div>
              <div className="font-medium">
                {delta.annuitizePct}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}