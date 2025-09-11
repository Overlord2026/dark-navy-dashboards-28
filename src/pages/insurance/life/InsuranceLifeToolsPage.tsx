import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileDown,
  Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recordDecisionRDS } from "@/features/pro/compliance/DecisionTracker";
import * as Canonical from "@/lib/canonical";
import { SuitabilityDecision } from "@/features/insurance/types";

export default function InsuranceLifeToolsPage() {
  const { toast } = useToast();
  const [analysis1035, setAnalysis1035] = useState({
    currentValue: '',
    surrenderCharges: '',
    newProductRate: '',
    currentProductRate: '',
    clientAge: '',
    suitabilityFactors: [] as string[],
    clientNotes: ''
  });

  const [lifeNeedsData, setLifeNeedsData] = useState({
    currentIncome: '',
    spouseIncome: '',
    monthlyExpenses: '',
    existingCoverage: '',
    debts: '',
    education: '',
    finalExpenses: '',
    dependents: ''
  });

  const [beneficiaryData, setBeneficiaryData] = useState({
    policyNumber: '',
    primaryBeneficiary: '',
    contingentBeneficiary: '',
    changeReason: '',
    documentationType: ''
  });

  const suitabilityFactors = [
    'Age appropriate for product term',
    'Financial capacity verified',
    'Investment experience adequate',
    'Product features match needs',
    'Risk tolerance appropriate',
    'Time horizon suitable',
    'Liquidity needs considered',
    'Tax implications understood'
  ];

  const handle1035Analysis = async () => {
    if (!analysis1035.currentValue || !analysis1035.clientAge) {
      toast({
        title: "Error",
        description: "Current value and client age are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const currentVal = parseFloat(analysis1035.currentValue);
      const surrenderCharges = parseFloat(analysis1035.surrenderCharges || '0');
      const netValue = currentVal - surrenderCharges;
      const age = parseInt(analysis1035.clientAge);
      
      // Simple suitability scoring
      let suitabilityScore = 0;
      const reasons = [];
      
      if (analysis1035.suitabilityFactors.length >= 6) {
        suitabilityScore += 40;
        reasons.push('comprehensive_suitability_review');
      }
      
      if (surrenderCharges / currentVal < 0.05) {
        suitabilityScore += 30;
        reasons.push('minimal_surrender_charges');
      }
      
      if (age < 75) {
        suitabilityScore += 30;
        reasons.push('age_appropriate');
      }
      
      const result: SuitabilityDecision = suitabilityScore >= 70 ? 'approve' : 'review_required';
      
      // Record decision
      const decision = await recordDecisionRDS({
        action: '1035_exchange_analysis',
        persona: 'insurance',
        inputs_hash: await Canonical.hash({
          currentValue: currentVal,
          surrenderCharges,
          clientAge: age,
          factors: analysis1035.suitabilityFactors
        }),
        reasons,
        result: result as 'approve' | 'deny',
        metadata: {
          suitability_score: suitabilityScore,
          net_value: netValue,
          surrender_ratio: surrenderCharges / currentVal
        }
      });

      toast({
        title: result === 'approve' ? "1035 Exchange Approved" : "Review Required",
        description: `Suitability score: ${suitabilityScore}/100. Receipt: ${decision.inputs_hash}`,
        variant: result === 'approve' ? "default" : "destructive"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process 1035 analysis",
        variant: "destructive"
      });
    }
  };

  const handleLifeNeedsAnalysis = async () => {
    if (!lifeNeedsData.currentIncome || !lifeNeedsData.monthlyExpenses) {
      toast({
        title: "Error",
        description: "Current income and monthly expenses are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const income = parseFloat(lifeNeedsData.currentIncome);
      const expenses = parseFloat(lifeNeedsData.monthlyExpenses) * 12;
      const debts = parseFloat(lifeNeedsData.debts || '0');
      const education = parseFloat(lifeNeedsData.education || '0');
      const finalExp = parseFloat(lifeNeedsData.finalExpenses || '25000');
      const existing = parseFloat(lifeNeedsData.existingCoverage || '0');
      
      // Income replacement: 10 years of income less spouse income
      const spouseIncome = parseFloat(lifeNeedsData.spouseIncome || '0');
      const incomeReplacement = (income - spouseIncome) * 10;
      
      const totalNeeds = incomeReplacement + debts + education + finalExp;
      const coverageGap = Math.max(0, totalNeeds - existing);
      
      const decision = await recordDecisionRDS({
        action: 'life_needs_analysis',
        persona: 'insurance',
        inputs_hash: await Canonical.hash({
          income,
          expenses,
          debts,
          education,
          existing
        }),
        reasons: ['income_replacement_calculated', 'debt_coverage_included', 'needs_analysis_complete'],
        result: 'approve',
        metadata: {
          total_needs: totalNeeds,
          coverage_gap: coverageGap,
          income_replacement_years: 10
        }
      });

      toast({
        title: "Life Needs Analysis Complete",
        description: `Coverage gap: $${coverageGap.toLocaleString()}. Receipt: ${decision.inputs_hash}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process life needs analysis",
        variant: "destructive"
      });
    }
  };

  const handleBeneficiaryChange = async () => {
    if (!beneficiaryData.policyNumber || !beneficiaryData.primaryBeneficiary) {
      toast({
        title: "Error",
        description: "Policy number and primary beneficiary are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const decision = await recordDecisionRDS({
        action: 'beneficiary_change',
        persona: 'insurance',
        inputs_hash: await Canonical.hash({
          policy: beneficiaryData.policyNumber,
          primary: beneficiaryData.primaryBeneficiary,
          contingent: beneficiaryData.contingentBeneficiary,
          reason: beneficiaryData.changeReason
        }),
        reasons: ['beneficiary_update_requested', 'documentation_complete', 'minimum_necessary_principle'],
        result: 'approve',
        metadata: {
          change_type: 'beneficiary_designation',
          documentation_required: true,
          privacy_protected: true
        }
      });

      toast({
        title: "Beneficiary Change Processed",
        description: `Change recorded with privacy protection. Receipt: ${decision.inputs_hash}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process beneficiary change",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Life Insurance Tools</h1>
          <p className="text-muted-foreground">
            Analysis tools with explainable proofs and compliance receipts
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Fiduciary Standard</span>
        </div>
      </div>

      <Tabs defaultValue="1035" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1035" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            1035 Exchange
          </TabsTrigger>
          <TabsTrigger value="life-needs" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Life Needs
          </TabsTrigger>
          <TabsTrigger value="beneficiary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Beneficiary
          </TabsTrigger>
        </TabsList>

        {/* 1035 Exchange Analysis */}
        <TabsContent value="1035">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                1035 Exchange Suitability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Product Value *</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={analysis1035.currentValue}
                    onChange={(e) => setAnalysis1035({...analysis1035, currentValue: e.target.value})}
                    placeholder="150000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="surrenderCharges">Surrender Charges</Label>
                  <Input
                    id="surrenderCharges"
                    type="number"
                    value={analysis1035.surrenderCharges}
                    onChange={(e) => setAnalysis1035({...analysis1035, surrenderCharges: e.target.value})}
                    placeholder="7500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentRate">Current Product Rate</Label>
                  <Input
                    id="currentRate"
                    value={analysis1035.currentProductRate}
                    onChange={(e) => setAnalysis1035({...analysis1035, currentProductRate: e.target.value})}
                    placeholder="3.5%"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newRate">New Product Rate</Label>
                  <Input
                    id="newRate"
                    value={analysis1035.newProductRate}
                    onChange={(e) => setAnalysis1035({...analysis1035, newProductRate: e.target.value})}
                    placeholder="4.2%"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientAge">Client Age *</Label>
                  <Input
                    id="clientAge"
                    type="number"
                    value={analysis1035.clientAge}
                    onChange={(e) => setAnalysis1035({...analysis1035, clientAge: e.target.value})}
                    placeholder="62"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Suitability Factors (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suitabilityFactors.map(factor => (
                    <label key={factor} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={analysis1035.suitabilityFactors.includes(factor)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAnalysis1035({
                              ...analysis1035,
                              suitabilityFactors: [...analysis1035.suitabilityFactors, factor]
                            });
                          } else {
                            setAnalysis1035({
                              ...analysis1035,
                              suitabilityFactors: analysis1035.suitabilityFactors.filter(f => f !== factor)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientNotes">Client Notes</Label>
                <Textarea
                  id="clientNotes"
                  value={analysis1035.clientNotes}
                  onChange={(e) => setAnalysis1035({...analysis1035, clientNotes: e.target.value})}
                  placeholder="Additional client considerations..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handle1035Analysis} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Analyze Suitability
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Export Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Life Needs Analysis */}
        <TabsContent value="life-needs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Life Insurance Needs Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentIncome">Current Annual Income *</Label>
                  <Input
                    id="currentIncome"
                    type="number"
                    value={lifeNeedsData.currentIncome}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, currentIncome: e.target.value})}
                    placeholder="75000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spouseIncome">Spouse Annual Income</Label>
                  <Input
                    id="spouseIncome"
                    type="number"
                    value={lifeNeedsData.spouseIncome}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, spouseIncome: e.target.value})}
                    placeholder="45000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses *</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={lifeNeedsData.monthlyExpenses}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, monthlyExpenses: e.target.value})}
                    placeholder="4500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="existingCoverage">Existing Coverage</Label>
                  <Input
                    id="existingCoverage"
                    type="number"
                    value={lifeNeedsData.existingCoverage}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, existingCoverage: e.target.value})}
                    placeholder="100000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="debts">Outstanding Debts</Label>
                  <Input
                    id="debts"
                    type="number"
                    value={lifeNeedsData.debts}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, debts: e.target.value})}
                    placeholder="250000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Education Costs</Label>
                  <Input
                    id="education"
                    type="number"
                    value={lifeNeedsData.education}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, education: e.target.value})}
                    placeholder="50000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="finalExpenses">Final Expenses</Label>
                  <Input
                    id="finalExpenses"
                    type="number"
                    value={lifeNeedsData.finalExpenses}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, finalExpenses: e.target.value})}
                    placeholder="25000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={lifeNeedsData.dependents}
                    onChange={(e) => setLifeNeedsData({...lifeNeedsData, dependents: e.target.value})}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleLifeNeedsAnalysis} className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate Needs
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Export Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Beneficiary Management */}
        <TabsContent value="beneficiary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Beneficiary Change Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Privacy Protected</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Beneficiary changes use minimum-necessary sharing and generate receipts without sensitive content.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number *</Label>
                  <Input
                    id="policyNumber"
                    value={beneficiaryData.policyNumber}
                    onChange={(e) => setBeneficiaryData({...beneficiaryData, policyNumber: e.target.value})}
                    placeholder="POL-12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentationType">Documentation Type</Label>
                  <Select value={beneficiaryData.documentationType} onValueChange={(value) => setBeneficiaryData({...beneficiaryData, documentationType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="change_form">Beneficiary Change Form</SelectItem>
                      <SelectItem value="assignment">Assignment of Benefits</SelectItem>
                      <SelectItem value="court_order">Court Order</SelectItem>
                      <SelectItem value="divorce_decree">Divorce Decree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryBeneficiary">Primary Beneficiary *</Label>
                  <Input
                    id="primaryBeneficiary"
                    value={beneficiaryData.primaryBeneficiary}
                    onChange={(e) => setBeneficiaryData({...beneficiaryData, primaryBeneficiary: e.target.value})}
                    placeholder="Jane Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contingentBeneficiary">Contingent Beneficiary</Label>
                  <Input
                    id="contingentBeneficiary"
                    value={beneficiaryData.contingentBeneficiary}
                    onChange={(e) => setBeneficiaryData({...beneficiaryData, contingentBeneficiary: e.target.value})}
                    placeholder="John Doe Jr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="changeReason">Reason for Change</Label>
                <Select value={beneficiaryData.changeReason} onValueChange={(value) => setBeneficiaryData({...beneficiaryData, changeReason: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marriage">Marriage</SelectItem>
                    <SelectItem value="divorce">Divorce</SelectItem>
                    <SelectItem value="birth">Birth of Child</SelectItem>
                    <SelectItem value="death">Death of Beneficiary</SelectItem>
                    <SelectItem value="client_request">Client Request</SelectItem>
                    <SelectItem value="estate_planning">Estate Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBeneficiaryChange} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Process Change
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  Archive Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}