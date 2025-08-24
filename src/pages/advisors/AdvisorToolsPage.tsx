import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Map, 
  FileText, 
  TrendingUp,
  Download,
  Play
} from 'lucide-react';
import { ToolGate } from '@/components/shared/ToolGate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { emitReceipt } from '@/lib/analytics';

interface ToolResult {
  id: string;
  type: string;
  clientName: string;
  result: any;
  createdAt: string;
}

export function AdvisorToolsPage() {
  const { toast } = useToast();
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [roadmapData, setRoadmapData] = useState({
    clientName: '',
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    monthlyContribution: '',
    targetIncome: ''
  });
  const [proposalData, setProposalData] = useState({
    clientName: '',
    proposalType: 'comprehensive',
    portfolioValue: '',
    riskTolerance: 'moderate'
  });

  const [results] = useState<ToolResult[]>([
    {
      id: '1',
      type: 'Retirement Roadmap',
      clientName: 'Sarah Johnson',
      result: { shortfall: 125000, recommendedSavings: 1200 },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'Proposal Report',
      clientName: 'Michael Chen',
      result: { fees: 8500, projectedReturn: 7.2 },
      createdAt: '2024-01-14'
    }
  ]);

  const tools = [
    {
      key: 'roadmap',
      title: 'Retirement Roadmap',
      description: 'Generate comprehensive retirement planning analysis',
      icon: Map,
      variant: 'default' as const
    },
    {
      key: 'proposal',
      title: 'Proposal/Report',
      description: 'Create detailed client proposals and reports',
      icon: FileText,
      variant: 'default' as const
    },
    {
      key: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Analyze client risk tolerance and capacity',
      icon: TrendingUp,
      variant: 'outline' as const
    },
    {
      key: 'tax-optimizer',
      title: 'Tax Optimizer',
      description: 'Optimize tax strategies and withholding',
      icon: Calculator,
      variant: 'outline' as const
    }
  ];

  const handleRunRoadmap = async () => {
    if (!roadmapData.clientName || !roadmapData.currentAge || !roadmapData.retirementAge) {
      toast({
        title: "Validation Error",
        description: "Client name, current age, and retirement age are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate calculation
      const currentAge = parseInt(roadmapData.currentAge);
      const retirementAge = parseInt(roadmapData.retirementAge);
      const currentSavings = parseInt(roadmapData.currentSavings) || 0;
      const monthlyContrib = parseInt(roadmapData.monthlyContribution) || 0;
      const targetIncome = parseInt(roadmapData.targetIncome) || 50000;

      const yearsToRetirement = retirementAge - currentAge;
      const futureValue = currentSavings * Math.pow(1.07, yearsToRetirement) + 
                         (monthlyContrib * 12) * (Math.pow(1.07, yearsToRetirement) - 1) / 0.07;
      const neededCapital = targetIncome * 25; // 4% rule
      const shortfall = Math.max(0, neededCapital - futureValue);

      // Emit Decision-RDS receipt
      await emitReceipt('Decision-RDS', {
        action: 'tool.roadmap.calculated',
        clientName: roadmapData.clientName,
        calculation: {
          currentAge,
          retirementAge,
          yearsToRetirement,
          currentSavings,
          monthlyContribution: monthlyContrib,
          targetIncome,
          projectedValue: futureValue,
          shortfall
        }
      });

      toast({
        title: "Roadmap Generated",
        description: `Retirement analysis completed for ${roadmapData.clientName}`
      });

      setIsRoadmapOpen(false);
      setRoadmapData({
        clientName: '',
        currentAge: '',
        retirementAge: '',
        currentSavings: '',
        monthlyContribution: '',
        targetIncome: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate roadmap",
        variant: "destructive"
      });
    }
  };

  const handleRunProposal = async () => {
    if (!proposalData.clientName || !proposalData.portfolioValue) {
      toast({
        title: "Validation Error",
        description: "Client name and portfolio value are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const portfolioValue = parseInt(proposalData.portfolioValue);
      const feeRate = proposalData.proposalType === 'comprehensive' ? 0.0125 : 0.01;
      const annualFee = portfolioValue * feeRate;

      // Emit Decision-RDS receipt
      await emitReceipt('Decision-RDS', {
        action: 'tool.proposal.generated',
        clientName: proposalData.clientName,
        proposal: {
          type: proposalData.proposalType,
          portfolioValue,
          feeRate,
          annualFee,
          riskTolerance: proposalData.riskTolerance
        }
      });

      toast({
        title: "Proposal Generated",
        description: `Proposal created for ${proposalData.clientName}`
      });

      setIsProposalOpen(false);
      setProposalData({
        clientName: '',
        proposalType: 'comprehensive',
        portfolioValue: '',
        riskTolerance: 'moderate'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate proposal",
        variant: "destructive"
      });
    }
  };

  const handleExportResult = (result: ToolResult) => {
    let content = '';
    
    if (result.type === 'Retirement Roadmap') {
      content = `
Retirement Roadmap - ${result.clientName}
Generated: ${result.createdAt}

Analysis Results:
- Projected Shortfall: $${result.result.shortfall?.toLocaleString() || 'N/A'}
- Recommended Monthly Savings: $${result.result.recommendedSavings?.toLocaleString() || 'N/A'}

This analysis was generated using professional financial planning software.
      `;
    } else if (result.type === 'Proposal Report') {
      content = `
Investment Proposal - ${result.clientName}
Generated: ${result.createdAt}

Proposal Details:
- Annual Advisory Fee: $${result.result.fees?.toLocaleString() || 'N/A'}
- Projected Annual Return: ${result.result.projectedReturn || 'N/A'}%

This proposal is subject to market conditions and regulatory approval.
      `;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.type.toLowerCase().replace(' ', '-')}-${result.clientName.toLowerCase().replace(' ', '-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${result.type} exported successfully`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advisor Tools</h1>
          <p className="text-muted-foreground">Professional calculators and analysis tools</p>
        </div>
      </div>

      {/* Core Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Core Calculators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <ToolGate key={tool.key} toolKey={tool.key}>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <tool.icon className="w-6 h-6 text-primary" />
                    <h3 className="font-medium">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  
                  {tool.key === 'roadmap' ? (
                    <Dialog open={isRoadmapOpen} onOpenChange={setIsRoadmapOpen}>
                      <DialogTrigger asChild>
                        <Button variant={tool.variant} size="sm" className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Retirement Roadmap Calculator</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="clientName">Client Name *</Label>
                            <Input
                              id="clientName"
                              value={roadmapData.clientName}
                              onChange={(e) => setRoadmapData({ ...roadmapData, clientName: e.target.value })}
                              placeholder="Enter client name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="currentAge">Current Age *</Label>
                              <Input
                                id="currentAge"
                                type="number"
                                value={roadmapData.currentAge}
                                onChange={(e) => setRoadmapData({ ...roadmapData, currentAge: e.target.value })}
                                placeholder="35"
                              />
                            </div>
                            <div>
                              <Label htmlFor="retirementAge">Retirement Age *</Label>
                              <Input
                                id="retirementAge"
                                type="number"
                                value={roadmapData.retirementAge}
                                onChange={(e) => setRoadmapData({ ...roadmapData, retirementAge: e.target.value })}
                                placeholder="65"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="currentSavings">Current Savings</Label>
                            <Input
                              id="currentSavings"
                              type="number"
                              value={roadmapData.currentSavings}
                              onChange={(e) => setRoadmapData({ ...roadmapData, currentSavings: e.target.value })}
                              placeholder="100000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                            <Input
                              id="monthlyContribution"
                              type="number"
                              value={roadmapData.monthlyContribution}
                              onChange={(e) => setRoadmapData({ ...roadmapData, monthlyContribution: e.target.value })}
                              placeholder="1000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="targetIncome">Target Retirement Income</Label>
                            <Input
                              id="targetIncome"
                              type="number"
                              value={roadmapData.targetIncome}
                              onChange={(e) => setRoadmapData({ ...roadmapData, targetIncome: e.target.value })}
                              placeholder="80000"
                            />
                          </div>
                          <Button onClick={handleRunRoadmap} className="w-full">
                            Calculate Roadmap
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : tool.key === 'proposal' ? (
                    <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
                      <DialogTrigger asChild>
                        <Button variant={tool.variant} size="sm" className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Proposal Generator</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="proposalClientName">Client Name *</Label>
                            <Input
                              id="proposalClientName"
                              value={proposalData.clientName}
                              onChange={(e) => setProposalData({ ...proposalData, clientName: e.target.value })}
                              placeholder="Enter client name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="proposalType">Proposal Type</Label>
                            <Select value={proposalData.proposalType} onValueChange={(value) => setProposalData({ ...proposalData, proposalType: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="comprehensive">Comprehensive Planning</SelectItem>
                                <SelectItem value="investment">Investment Management</SelectItem>
                                <SelectItem value="retirement">Retirement Planning</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="portfolioValue">Portfolio Value *</Label>
                            <Input
                              id="portfolioValue"
                              type="number"
                              value={proposalData.portfolioValue}
                              onChange={(e) => setProposalData({ ...proposalData, portfolioValue: e.target.value })}
                              placeholder="500000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                            <Select value={proposalData.riskTolerance} onValueChange={(value) => setProposalData({ ...proposalData, riskTolerance: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="conservative">Conservative</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="aggressive">Aggressive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleRunProposal} className="w-full">
                            Generate Proposal
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant={tool.variant} size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Run Tool
                    </Button>
                  )}
                </div>
              </ToolGate>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tool Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Calculator className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="font-medium">{result.type}</h3>
                    <p className="text-sm text-muted-foreground">{result.clientName} • {result.createdAt}</p>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportResult(result)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}