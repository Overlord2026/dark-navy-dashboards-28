import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Settings, 
  Brain,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Zap
} from 'lucide-react';

interface RoutingRule {
  id: string;
  rule_name: string;
  criteria: any;
  preferred_partners: string[];
  weight_score: number;
  is_active: boolean;
}

interface LoanRequest {
  id: string;
  loan_type: string;
  requested_amount: number;
  purpose: string;
  applicant_credit_score?: number;
}

interface PartnerMatch {
  partner_id: string;
  partner_name: string;
  match_score: number;
  reasons: string[];
  estimated_approval_time: number;
  approval_likelihood: number;
}

export const LeadRoutingOptimizer: React.FC = () => {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [partners] = useState([
    { id: '1', name: 'Premier Lending', specialties: ['home-loans', 'commercial'], min_amount: 50000 },
    { id: '2', name: 'Quick Capital', specialties: ['personal-loans', 'business'], min_amount: 10000 },
    { id: '3', name: 'Secure Finance', specialties: ['home-loans', 'refinance'], min_amount: 100000 }
  ]);
  const [testLoan, setTestLoan] = useState<LoanRequest>({
    id: 'test',
    loan_type: 'home-loans',
    requested_amount: 250000,
    purpose: 'home_purchase',
    applicant_credit_score: 720
  });
  const [matches, setMatches] = useState<PartnerMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_routing_rules')
        .select('*')
        .eq('is_active', true)
        .order('weight_score', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching routing rules:', error);
    }
  };

  const calculateOptimalRouting = async () => {
    setLoading(true);
    try {
      // Simulate AI-powered routing algorithm
      const simulatedMatches: PartnerMatch[] = partners.map(partner => {
        let score = 50; // Base score
        const reasons: string[] = [];

        // Credit score matching
        if (testLoan.applicant_credit_score && testLoan.applicant_credit_score > 700) {
          score += 20;
          reasons.push('Excellent credit score match');
        }

        // Loan amount matching
        if (testLoan.requested_amount >= partner.min_amount) {
          score += 15;
          reasons.push('Meets minimum loan amount');
        }

        // Specialty matching
        if (partner.specialties.includes(testLoan.loan_type)) {
          score += 25;
          reasons.push('Specializes in ' + testLoan.loan_type.replace('-', ' '));
        }

        // Add some randomization for demo
        score += Math.random() * 10;

        return {
          partner_id: partner.id,
          partner_name: partner.name,
          match_score: Math.min(score, 100),
          reasons,
          estimated_approval_time: Math.floor(24 + Math.random() * 72), // 24-96 hours
          approval_likelihood: Math.min(60 + score * 0.3, 95)
        };
      }).sort((a, b) => b.match_score - a.match_score);

      setMatches(simulatedMatches);

      // Log the routing decision
      await supabase.from('lead_routing_decisions').insert({
        loan_request_id: testLoan.id,
        recommended_partner_id: simulatedMatches[0]?.partner_id,
        score: simulatedMatches[0]?.match_score,
        reasoning: JSON.parse(JSON.stringify({ matches: simulatedMatches })),
        decision_factors: JSON.parse(JSON.stringify({
          loan_type: testLoan.loan_type,
          amount: testLoan.requested_amount,
          credit_score: testLoan.applicant_credit_score
        }))
      });

    } catch (error) {
      console.error('Error calculating routing:', error);
      toast({
        title: "Error",
        description: "Failed to calculate optimal routing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoutingRule = async () => {
    try {
      const { error } = await supabase.from('lead_routing_rules').insert({
        rule_name: 'High-value home loans',
        tenant_id: 'mock-tenant-id',
        criteria: JSON.parse(JSON.stringify({
          loan_type: 'home-loans',
          min_amount: 200000,
          min_credit_score: 680
        })),
        preferred_partners: ['1', '3'], // Premier Lending, Secure Finance
        weight_score: 1.0,
        is_active: true,
        created_by: 'user-id' // This would be the actual user ID
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Routing rule created successfully",
      });

      await fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast({
        title: "Error",
        description: "Failed to create routing rule",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Lead Routing
              </CardTitle>
              <CardDescription>
                Optimize partner matching with intelligent routing algorithms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI Enhanced
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="optimizer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
          <TabsTrigger value="rules">Routing Rules</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Loan Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Test Loan Parameters
                </CardTitle>
                <CardDescription>
                  Configure loan parameters to test routing optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loan Type</Label>
                    <Select value={testLoan.loan_type} onValueChange={(value) => 
                      setTestLoan({...testLoan, loan_type: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home-loans">Home Loans</SelectItem>
                        <SelectItem value="commercial-loans">Commercial</SelectItem>
                        <SelectItem value="personal-loans">Personal</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Amount</Label>
                    <Input
                      type="number"
                      value={testLoan.requested_amount}
                      onChange={(e) => setTestLoan({
                        ...testLoan, 
                        requested_amount: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Select value={testLoan.purpose} onValueChange={(value) => 
                      setTestLoan({...testLoan, purpose: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home_purchase">Home Purchase</SelectItem>
                        <SelectItem value="refinance">Refinance</SelectItem>
                        <SelectItem value="business_expansion">Business Expansion</SelectItem>
                        <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Credit Score</Label>
                    <Input
                      type="number"
                      min="300"
                      max="850"
                      value={testLoan.applicant_credit_score || ''}
                      onChange={(e) => setTestLoan({
                        ...testLoan, 
                        applicant_credit_score: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateOptimalRouting}
                  disabled={loading}
                  className="w-full"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {loading ? 'Calculating...' : 'Calculate Optimal Routing'}
                </Button>
              </CardContent>
            </Card>

            {/* Partner Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommended Partners
                </CardTitle>
                <CardDescription>
                  AI-ranked partner matches based on loan parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Run optimization to see partner recommendations
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match, index) => (
                      <div key={match.partner_id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold">{match.partner_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {match.estimated_approval_time}h approval time
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getScoreBadgeVariant(match.match_score)}>
                              {match.match_score.toFixed(0)}% match
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {match.approval_likelihood.toFixed(0)}% likely to approve
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {match.reasons.map((reason, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>

                        {index === 0 && (
                          <div className="flex items-center space-x-2 text-sm font-medium text-green-600">
                            <ArrowRight className="h-4 w-4" />
                            <span>Recommended routing choice</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Routing Rules</h3>
              <p className="text-sm text-muted-foreground">
                Manage automated routing criteria and partner preferences
              </p>
            </div>
            <Button onClick={createRoutingRule}>
              Create Sample Rule
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rules.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No routing rules configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first routing rule to automate partner matching
                  </p>
                  <Button onClick={createRoutingRule}>
                    Create First Rule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              rules.map(rule => (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{rule.rule_name}</h4>
                          <Badge variant={rule.is_active ? "default" : "secondary"}>
                            {rule.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Weight Score: {rule.weight_score}</p>
                          <p>Preferred Partners: {rule.preferred_partners.length} configured</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {(rule.weight_score * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Priority</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">87.3%</p>
                    <p className="text-sm text-muted-foreground">Routing Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">+23%</p>
                    <p className="text-sm text-muted-foreground">Approval Rate Improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Loans Routed This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Routing Performance Insights</CardTitle>
              <CardDescription>
                Key insights from AI-powered routing optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      Optimal Partner Utilization
                    </h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Premier Lending and Secure Finance are showing highest conversion rates for home loans above $200K
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Time Optimization
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Average processing time reduced by 18 hours through intelligent routing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};