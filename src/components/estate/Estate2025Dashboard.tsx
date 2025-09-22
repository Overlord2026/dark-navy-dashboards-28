import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Shield,
  Calculator,
  Clock
} from 'lucide-react';
import { Estate2025Calculator, ESTATE_2025_RULES } from '@/lib/estate/estate2025Rules';
import { EstateStrategyAnalysis, RecommendedStrategy } from '@/types/estate-2025';

interface Estate2025DashboardProps {
  initialEstateValue?: number;
  initialMaritalStatus?: 'single' | 'married';
  initialState?: string;
  initialAge?: number;
}

export const Estate2025Dashboard: React.FC<Estate2025DashboardProps> = ({
  initialEstateValue = 15000000,
  initialMaritalStatus = 'married',
  initialState = 'NY',
  initialAge = 65
}) => {
  const [estateValue, setEstateValue] = useState(initialEstateValue);
  const [maritalStatus, setMaritalStatus] = useState(initialMaritalStatus);
  const [state, setState] = useState(initialState);
  const [age, setAge] = useState(initialAge);
  const [analysis, setAnalysis] = useState<EstateStrategyAnalysis | null>(null);

  useEffect(() => {
    calculateAnalysis();
  }, [estateValue, maritalStatus, state, age]);

  const calculateAnalysis = () => {
    const federalTax = Estate2025Calculator.calculateFederalTax(estateValue, maritalStatus);
    const stateTax = Estate2025Calculator.calculateStateTax(estateValue, state);
    const sunsetImpact = Estate2025Calculator.calculateSunsetImpact(estateValue, maritalStatus);
    const urgencyScore = Estate2025Calculator.generateUrgencyScore(estateValue, maritalStatus, age);
    const abTrustAnalysis = Estate2025Calculator.analyzeABTrustStrategy(estateValue, state);

    const strategies: RecommendedStrategy[] = [
      {
        id: 'gifting',
        strategy_name: 'Annual Gifting Program',
        description: `Use increased $19,000 annual exclusion for 2025. For married couple, gift $38,000 per recipient annually.`,
        potential_savings: 152000, // Assumes 4 recipients over 10 years at 40% tax rate
        implementation_urgency: urgencyScore > 50 ? 'high' : 'medium',
        time_sensitive: true,
        professional_required: ['advisor', 'attorney'],
      },
      {
        id: 'ab_trust',
        strategy_name: 'AB Trust vs Portability',
        description: abTrustAnalysis.recommended 
          ? `AB Trust recommended for ${state} - provides additional state tax benefits`
          : `Portability may be sufficient - ${state} recognizes federal portability`,
        potential_savings: Math.abs(abTrustAnalysis.vs_portability.net_advantage),
        implementation_urgency: maritalStatus === 'married' ? 'high' : 'low',
        time_sensitive: false,
        professional_required: ['attorney'],
        ab_trust_analysis: abTrustAnalysis,
      },
    ];

    if (sunsetImpact > 100000) {
      strategies.unshift({
        id: 'sunset_urgency',
        strategy_name: '2026 Sunset Mitigation',
        description: 'Urgent: Estate tax exemption drops ~50% in 2026. Consider immediate lifetime gifts using current exemption.',
        potential_savings: sunsetImpact,
        implementation_urgency: 'critical',
        time_sensitive: true,
        professional_required: ['attorney', 'cpa', 'advisor'],
      });
    }

    setAnalysis({
      client_profile: { estate_value: estateValue, marital_status: maritalStatus, state, age },
      current_exposure: {
        federal_tax_due: federalTax,
        state_tax_due: stateTax,
        total_tax_exposure: federalTax + stateTax,
      },
      sunset_impact: {
        post_2026_federal_tax: federalTax + sunsetImpact,
        additional_tax_risk: sunsetImpact,
        urgency_score: urgencyScore,
      },
      recommended_strategies: strategies,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  if (!analysis) return <div className="flex items-center justify-center h-64">Calculating analysis...</div>;

  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            2025 Estate Tax Analysis
          </CardTitle>
          <CardDescription>
            Updated for 2025 rules: $14.06M federal exemption, $19K annual exclusion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="estate-value">Estate Value</Label>
              <Input
                id="estate-value"
                type="number"
                value={estateValue}
                onChange={(e) => setEstateValue(Number(e.target.value))}
                placeholder="15000000"
              />
            </div>
            <div>
              <Label htmlFor="marital-status">Marital Status</Label>
              <Select value={maritalStatus} onValueChange={(value: 'single' | 'married') => setMaritalStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTATE_2025_RULES.state_exemptions.map(s => (
                    <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
                  ))}
                  <SelectItem value="FL">FL (No Estate Tax)</SelectItem>
                  <SelectItem value="TX">TX (No Estate Tax)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="65"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sunset Warning Alert */}
      {analysis.sunset_impact.additional_tax_risk > 100000 && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>2026 Sunset Alert:</strong> Estate tax exemption is scheduled to drop by ~50% in 2026. 
            Your additional tax risk: <strong>{formatCurrency(analysis.sunset_impact.additional_tax_risk)}</strong>
            <div className="mt-2">
              <Badge variant="destructive">
                Urgency Score: {Math.round(analysis.sunset_impact.urgency_score)}/100
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tax Overview</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="ab-trust">AB Trust Analysis</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Federal Tax</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analysis.current_exposure.federal_tax_due)}</div>
                <p className="text-xs text-muted-foreground">
                  Exemption: {formatCurrency(ESTATE_2025_RULES.federal.estate_exemption * (maritalStatus === 'married' ? 2 : 1))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">State Tax ({state})</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analysis.current_exposure.state_tax_due)}</div>
                <p className="text-xs text-muted-foreground">
                  {ESTATE_2025_RULES.state_exemptions.find(s => s.state === state)?.exemption_amount 
                    ? `Exemption: ${formatCurrency(ESTATE_2025_RULES.state_exemptions.find(s => s.state === state)!.exemption_amount)}`
                    : 'No state estate tax'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">2026 Additional Risk</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  +{formatCurrency(analysis.sunset_impact.additional_tax_risk)}
                </div>
                <p className="text-xs text-muted-foreground">
                  If no action taken before sunset
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies">
          <div className="space-y-4">
            {analysis.recommended_strategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.strategy_name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={getUrgencyColor(strategy.implementation_urgency)}>
                        {strategy.implementation_urgency}
                      </Badge>
                      {strategy.time_sensitive && (
                        <Badge variant="outline">Time Sensitive</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(strategy.potential_savings)}
                      </div>
                      <p className="text-sm text-muted-foreground">Potential Tax Savings</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Professional Team:</div>
                      <div className="flex gap-1 flex-wrap">
                        {strategy.professional_required.map(prof => (
                          <Badge key={prof} variant="secondary" className="text-xs">
                            {prof}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ab-trust">
          {maritalStatus === 'married' && analysis.recommended_strategies.find(s => s.ab_trust_analysis) && (
            <Card>
              <CardHeader>
                <CardTitle>AB Trust vs Portability Analysis</CardTitle>
                <CardDescription>
                  Comparison of estate planning strategies for married couples
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const abAnalysis = analysis.recommended_strategies.find(s => s.ab_trust_analysis)?.ab_trust_analysis!;
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">AB Trust Strategy</h4>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(abAnalysis.vs_portability.ab_trust_benefit)}
                          </div>
                          <p className="text-sm text-muted-foreground">Tax Savings</p>
                          <div className="mt-2">
                            <Badge variant="outline">
                              Complexity: {abAnalysis.ongoing_complexity}
                            </Badge>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">Portability Election</h4>
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(abAnalysis.vs_portability.portability_benefit)}
                          </div>
                          <p className="text-sm text-muted-foreground">Tax Savings</p>
                          <div className="mt-2">
                            <Badge variant="outline">
                              Complexity: low
                            </Badge>
                          </div>
                        </Card>
                      </div>

                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Recommendation:</strong> {abAnalysis.recommended ? 'AB Trust' : 'Portability'}
                          <br />
                          <div className="mt-2">
                            {abAnalysis.state_considerations.map((consideration, idx) => (
                              <div key={idx} className="text-sm">• {consideration}</div>
                            ))}
                          </div>
                          <div className="mt-2 text-sm">
                            Estimated implementation cost: {formatCurrency(abAnalysis.implementation_cost)}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projections">
          <Card>
            <CardHeader>
              <CardTitle>5-Year Estate Tax Projection</CardTitle>
              <CardDescription>
                Projected tax impact with and without sunset provision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Law (Through 2025)</h4>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analysis.current_exposure.total_tax_exposure)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Estate Tax</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Post-Sunset (2026+)</h4>
                    <div className="text-2xl font-bold text-destructive">
                      {formatCurrency(analysis.sunset_impact.post_2026_federal_tax + analysis.current_exposure.state_tax_due)}
                    </div>
                    <p className="text-sm text-muted-foreground">Projected Estate Tax</p>
                  </div>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Planning Window:</strong> You have approximately {2026 - new Date().getFullYear()} year(s) 
                    to implement strategies using the current higher exemption amounts.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};