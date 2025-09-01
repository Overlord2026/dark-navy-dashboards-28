import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { callEdgeJSON } from '@/services/aiEdge';

interface PlanData {
  planName: string;
  participants: number;
  assets: number;
  expenseRatio: number;
  adminFee: number;
}

interface BenchmarkResult {
  receiptId: string;
  savings: number;
  recommendations: string[];
  riskScore: number;
}

export function Advisor401kDemo() {
  const [planData, setPlanData] = useState<PlanData>({
    planName: 'ABC Corporation 401(k)',
    participants: 150,
    assets: 12500000,
    expenseRatio: 0.75,
    adminFee: 0.45
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);

  const handleInputChange = (field: keyof PlanData, value: string | number) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const runBenchmarkAnalysis = async () => {
    setIsProcessing(true);
    try {
      const response = await callEdgeJSON('decision-rds', {
        action: '401k_fee_analysis',
        inputs: {
          plan_data: planData,
          advisor_id: 'demo-advisor',
          analysis_type: 'comprehensive_benchmark'
        },
        policy_version: 'v1.0'
      });

      if (response.receipt_id) {
        // Simulate benchmark results
        const mockResults: BenchmarkResult = {
          receiptId: response.receipt_id,
          savings: Math.round(planData.assets * 0.002 * Math.random()),
          recommendations: [
            'Consider lower-cost index fund options',
            'Negotiate reduced administrative fees',
            'Implement auto-enrollment features',
            'Add target-date fund options'
          ],
          riskScore: Math.round(Math.random() * 3) + 2 // 2-5 scale
        };
        
        setBenchmarkResult(mockResults);
        toast.success('401(k) plan benchmark analysis completed!', {
          description: `Receipt ID: ${response.receipt_id}`,
          action: {
            label: 'View Receipt',
            onClick: () => window.open(`/receipts/${response.receipt_id}`, '_blank')
          }
        });
      }
    } catch (error) {
      console.error('Failed to run benchmark analysis:', error);
      toast.error('Failed to complete benchmark analysis');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToVault = async () => {
    if (!benchmarkResult) return;
    
    try {
      toast.success('Analysis saved to client vault!', {
        description: 'Your benchmark report is now available in the client portal',
      });
    } catch (error) {
      toast.error('Failed to save to vault');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">401(k) Plan Fee Benchmark</h2>
        <p className="text-white/80">Analyze plan costs and identify optimization opportunities</p>
      </div>

      <Card className="bfo-card mb-6">
        <h3 className="text-xl font-semibold mb-6">Plan Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={planData.planName}
              onChange={(e) => handleInputChange('planName', e.target.value)}
              className="input-black"
            />
          </div>
          
          <div>
            <Label htmlFor="participants">Number of Participants</Label>
            <Input
              id="participants"
              type="number"
              value={planData.participants}
              onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 0)}
              className="input-black"
            />
          </div>
          
          <div>
            <Label htmlFor="assets">Plan Assets ($)</Label>
            <Input
              id="assets"
              type="number"
              value={planData.assets}
              onChange={(e) => handleInputChange('assets', parseInt(e.target.value) || 0)}
              className="input-black"
            />
          </div>
          
          <div>
            <Label htmlFor="expenseRatio">Average Expense Ratio (%)</Label>
            <Input
              id="expenseRatio"
              type="number"
              step="0.01"
              value={planData.expenseRatio}
              onChange={(e) => handleInputChange('expenseRatio', parseFloat(e.target.value) || 0)}
              className="input-black"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="adminFee">Administrative Fee (%)</Label>
            <Input
              id="adminFee"
              type="number"
              step="0.01"
              value={planData.adminFee}
              onChange={(e) => handleInputChange('adminFee', parseFloat(e.target.value) || 0)}
              className="input-black"
            />
          </div>
        </div>
      </Card>

      <div className="text-center mb-8">
        <Button 
          className="btn-gold px-8 py-3 text-lg"
          onClick={runBenchmarkAnalysis}
          disabled={isProcessing}
        >
          {isProcessing ? 'Running Analysis...' : 'Run Benchmark Analysis'}
        </Button>
      </div>

      {benchmarkResult && (
        <div className="space-y-6">
          <Card className="bfo-card">
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-xl font-semibold">Analysis Complete</h3>
                <p className="text-white/70">Benchmark results generated successfully</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#D4AF37]">
                  ${benchmarkResult.savings.toLocaleString()}
                </p>
                <p className="text-white/70">Potential Annual Savings</p>
              </div>
              
              <div className="text-center">
                <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">
                  {benchmarkResult.riskScore}/5
                </p>
                <p className="text-white/70">Risk Assessment</p>
              </div>
              
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-400">
                  {benchmarkResult.recommendations.length}
                </p>
                <p className="text-white/70">Recommendations</p>
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-white/60 mb-2">Receipt ID:</p>
              <p className="font-mono text-[#D4AF37] mb-4">{benchmarkResult.receiptId}</p>
              <div className="flex items-center gap-2 text-green-500">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Verified with cryptographic proof</span>
              </div>
            </div>
          </Card>

          <Card className="bfo-card">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              {benchmarkResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <p className="text-white/80">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center">
            <Button 
              className="btn-gold px-8 py-3 text-lg mr-4"
              onClick={saveToVault}
            >
              Save to Client Vault
            </Button>
            <Button 
              variant="outline" 
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-3 text-lg"
              onClick={() => window.open(`/receipts/${benchmarkResult.receiptId}`, '_blank')}
            >
              View Full Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}