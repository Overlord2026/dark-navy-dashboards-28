import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { createHealthRDSReceipt, type HealthRDSReceipt } from '@/types/health-rds';
import { useToast } from '@/hooks/use-toast';

interface HSAInputs {
  planType: string;
  deductible: number;
  outOfPocketMax: number;
  monthlyPremium: number;
  currentHSABalance: number;
  monthlyContribution: number;
  medications: string[];
  eligibleExpenses: string[];
}

interface HSAOutputs {
  monthlySafeToSpend: number;
  projectedOOPCurve: Array<{ month: number; amount: number }>;
  riskScore: 'Low' | 'Medium' | 'High';
}

export function HSAPlannerCard() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<HSAInputs>({
    planType: '',
    deductible: 0,
    outOfPocketMax: 0,
    monthlyPremium: 0,
    currentHSABalance: 0,
    monthlyContribution: 0,
    medications: [],
    eligibleExpenses: []
  });
  const [outputs, setOutputs] = useState<HSAOutputs | null>(null);
  const [gateCheck, setGateCheck] = useState<'pending' | 'passed' | 'failed'>('pending');
  const [newMed, setNewMed] = useState('');
  const [newExpense, setNewExpense] = useState('');

  const performPolicyGateCheck = () => {
    // Mock policy gate check - IRMAA/AGI and plan rules
    const hasValidPlan = inputs.planType && inputs.deductible > 0;
    const withinIRMAALimits = inputs.monthlyContribution <= 450; // 2024 HSA limit / 12
    
    if (hasValidPlan && withinIRMAALimits) {
      setGateCheck('passed');
      calculateOutputs();
    } else {
      setGateCheck('failed');
      toast({
        title: "Policy Gate Failed",
        description: "Plan doesn't meet IRMAA/AGI requirements or contribution limits exceeded.",
        variant: "destructive"
      });
    }
  };

  const calculateOutputs = () => {
    // Mock HSA calculations
    const monthlyExpectedCosts = inputs.medications.length * 50 + 200; // Simplified
    const monthlySafeToSpend = Math.max(0, inputs.currentHSABalance / 12 + inputs.monthlyContribution - monthlyExpectedCosts);
    
    const projectedOOPCurve = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: Math.min(inputs.outOfPocketMax, (i + 1) * monthlyExpectedCosts)
    }));

    const riskScore = monthlySafeToSpend < 100 ? 'High' : monthlySafeToSpend < 300 ? 'Medium' : 'Low';

    setOutputs({
      monthlySafeToSpend,
      projectedOOPCurve,
      riskScore
    });
  };

  const handleApprove = () => {
    if (!outputs) return;

    // Emit Health-RDS receipt
    const receipt: HealthRDSReceipt = createHealthRDSReceipt(
      'Retiree',
      'hh_demo_123',
      `sha256:${Math.random().toString(36).substr(2, 32)}`,
      [
        {
          role: 'Retiree',
          user_id: 'u_123',
          ts: new Date().toISOString(),
          action: 'approve'
        },
        {
          role: 'Plan',
          user_id: 'p_889',
          ts: new Date(Date.now() + 60000).toISOString(),
          action: 'accept'
        }
      ],
      'approve',
      [`hsa_plan_${inputs.planType}`, `deductible_${inputs.deductible}`]
    );

    console.log('HSA Plan Health-RDS Receipt:', receipt);
    
    toast({
      title: "HSA Plan Approved",
      description: `Monthly safe-to-spend: $${outputs.monthlySafeToSpend}. Receipt anchored.`,
    });
  };

  const addMedication = () => {
    if (newMed.trim()) {
      setInputs(prev => ({ ...prev, medications: [...prev.medications, newMed.trim()] }));
      setNewMed('');
    }
  };

  const addExpense = () => {
    if (newExpense.trim()) {
      setInputs(prev => ({ ...prev, eligibleExpenses: [...prev.eligibleExpenses, newExpense.trim()] }));
      setNewExpense('');
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          HSA+ Planner
        </CardTitle>
        <CardDescription>
          Smart HSA planning with policy gates and regulatory compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="planType">Plan Type</Label>
            <Select value={inputs.planType} onValueChange={(value) => setInputs(prev => ({ ...prev, planType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hdhp_bronze">HDHP Bronze</SelectItem>
                <SelectItem value="hdhp_silver">HDHP Silver</SelectItem>
                <SelectItem value="hdhp_gold">HDHP Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductible">Annual Deductible</Label>
            <Input
              type="number"
              value={inputs.deductible || ''}
              onChange={(e) => setInputs(prev => ({ ...prev, deductible: Number(e.target.value) }))}
              placeholder="$3,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="oopMax">Out-of-Pocket Maximum</Label>
            <Input
              type="number"
              value={inputs.outOfPocketMax || ''}
              onChange={(e) => setInputs(prev => ({ ...prev, outOfPocketMax: Number(e.target.value) }))}
              placeholder="$7,500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Monthly HSA Contribution</Label>
            <Input
              type="number"
              value={inputs.monthlyContribution || ''}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyContribution: Number(e.target.value) }))}
              placeholder="$300"
            />
          </div>
        </div>

        {/* Medications List */}
        <div className="space-y-2">
          <Label>Current Medications</Label>
          <div className="flex gap-2">
            <Input
              value={newMed}
              onChange={(e) => setNewMed(e.target.value)}
              placeholder="Add medication..."
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            />
            <Button type="button" onClick={addMedication}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {inputs.medications.map((med, index) => (
              <Badge key={index} variant="secondary">{med}</Badge>
            ))}
          </div>
        </div>

        {/* Policy Gate Check */}
        <div className="flex items-center gap-4">
          <Button onClick={performPolicyGateCheck} disabled={gateCheck === 'passed'}>
            <Shield className="h-4 w-4 mr-2" />
            Run Policy Gate Check
          </Button>
          {gateCheck === 'passed' && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              ✓ Gate Passed
            </Badge>
          )}
          {gateCheck === 'failed' && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Gate Failed
            </Badge>
          )}
        </div>

        {/* Outputs Section */}
        {outputs && gateCheck === 'passed' && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">HSA Analysis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    ${outputs.monthlySafeToSpend.toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Monthly Safe-to-Spend</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {outputs.riskScore}
                  </div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    ${outputs.projectedOOPCurve[11]?.amount.toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Projected Annual OOP</p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handleApprove} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Approve HSA Plan & Generate Receipt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}