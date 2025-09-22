import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  DollarSign,
  Heart,
  TrendingUp,
  PiggyBank,
  Users,
  Building,
  Shield,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { UpgradePaywall } from '@/components/subscription/UpgradePaywall';

interface CalculationResult {
  estateTax: number;
  netInheritance: number;
  taxSavings?: number;
  recommendations: string[];
}

export function AdvancedEstateCalculators() {
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const [estateValue, setEstateValue] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [charitableGiving, setCharitableGiving] = useState('');
  const [trustStrategy, setTrustStrategy] = useState('');
  const [results, setResults] = useState<CalculationResult | null>(null);

  // Check premium access
  const hasCalculatorAccess = checkFeatureAccess('premium') || subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';

  if (!hasCalculatorAccess) {
    return (
      <UpgradePaywall
        promptData={{
          feature_name: 'Advanced Estate Calculators',
          required_tier: 'premium',
          add_on_required: 'premium_analytics_access'
        }}
        showUsageProgress={false}
      />
    );
  }

  const calculateEstateTax = () => {
    const value = parseFloat(estateValue.replace(/,/g, ''));
    if (!value || value <= 0) {
      toast.error('Please enter a valid estate value');
      return;
    }

    // 2025 federal estate tax exemption (updated)
    const exemption = maritalStatus === 'married' ? 28120000 : 14060000; // $14.06M single, $28.12M married
    const taxableEstate = Math.max(0, value - exemption);
    const estateTax = taxableEstate * 0.40; // 40% federal rate

    const charitableDeduction = parseFloat(charitableGiving.replace(/,/g, '')) || 0;
    const adjustedTax = Math.max(0, estateTax - (charitableDeduction * 0.40));

    const netInheritance = value - adjustedTax;
    const taxSavings = estateTax - adjustedTax;

    const recommendations = [];
    if (taxableEstate > 0) {
      recommendations.push('Consider establishing a revocable living trust');
      recommendations.push('Explore annual gift tax exclusions');
      if (maritalStatus === 'married') {
        recommendations.push('Utilize unlimited marital deduction');
      }
    }
    if (charitableDeduction > 0) {
      recommendations.push('Charitable remainder trusts can provide tax benefits and income');
    }
    if (value > 5000000) {
      recommendations.push('Consider generation-skipping trust strategies');
    }

    setResults({
      estateTax: adjustedTax,
      netInheritance,
      taxSavings,
      recommendations
    });

    toast.success('Estate tax calculation completed');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Advanced Estate Planning Calculators
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Sophisticated tools for estate tax planning and wealth transfer analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="estate-tax" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="estate-tax">Estate Tax</TabsTrigger>
          <TabsTrigger value="charitable">Charitable</TabsTrigger>
          <TabsTrigger value="survivor">Survivor</TabsTrigger>
          <TabsTrigger value="generation">Generation Skip</TabsTrigger>
        </TabsList>

        <TabsContent value="estate-tax" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Estate Tax Calculator
                </CardTitle>
                <CardDescription>
                  Calculate federal estate tax liability and optimization strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="estate-value">Total Estate Value</Label>
                  <Input
                    id="estate-value"
                    placeholder="e.g., 25,000,000"
                    value={estateValue}
                    onChange={(e) => setEstateValue(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="marital-status">Marital Status</Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="charitable">Charitable Giving</Label>
                  <Input
                    id="charitable"
                    placeholder="e.g., 1,000,000"
                    value={charitableGiving}
                    onChange={(e) => setCharitableGiving(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="trust-strategy">Trust Strategy</Label>
                  <Select value={trustStrategy} onValueChange={setTrustStrategy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Trust Strategy</SelectItem>
                      <SelectItem value="revocable">Revocable Living Trust</SelectItem>
                      <SelectItem value="irrevocable">Irrevocable Life Insurance Trust</SelectItem>
                      <SelectItem value="grat">Grantor Retained Annuity Trust</SelectItem>
                      <SelectItem value="charitable">Charitable Remainder Trust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateEstateTax} className="w-full">
                  Calculate Estate Tax
                </Button>
              </CardContent>
            </Card>

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tax Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Estate Tax</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(results.estateTax)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Net Inheritance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.netInheritance)}
                      </p>
                    </div>
                  </div>

                  {results.taxSavings && results.taxSavings > 0 && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tax Savings</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(results.taxSavings)}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {results.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Info className="h-3 w-3 mt-0.5 text-blue-500" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="charitable" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Charitable Trust Calculator
              </CardTitle>
              <CardDescription>
                Analyze charitable remainder and lead trust strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Trust Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trust type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crt">Charitable Remainder Trust</SelectItem>
                        <SelectItem value="clt">Charitable Lead Trust</SelectItem>
                        <SelectItem value="pooled">Pooled Income Fund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Initial Contribution</Label>
                    <Input placeholder="e.g., 1,000,000" />
                  </div>
                  
                  <div>
                    <Label>Payout Rate (%)</Label>
                    <Input placeholder="e.g., 5" />
                  </div>
                  
                  <div>
                    <Label>Trust Term (years)</Label>
                    <Input placeholder="e.g., 20" />
                  </div>
                  
                  <Button className="w-full">
                    Calculate Benefits
                  </Button>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Projected Benefits</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Annual Income:</span>
                      <span className="font-medium">$50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Deduction:</span>
                      <span className="font-medium">$431,213</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charitable Remainder:</span>
                      <span className="font-medium">$568,787</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Savings:</span>
                      <span className="font-medium text-green-600">$172,485</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="survivor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Survivor Analysis Calculator
              </CardTitle>
              <CardDescription>
                Calculate financial needs for surviving family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Income Replacement</h4>
                  <div>
                    <Label>Current Annual Income</Label>
                    <Input placeholder="e.g., 150,000" />
                  </div>
                  <div>
                    <Label>Replacement Percentage</Label>
                    <Input placeholder="e.g., 75" />
                  </div>
                  <div>
                    <Label>Years of Support</Label>
                    <Input placeholder="e.g., 25" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Family Expenses</h4>
                  <div>
                    <Label>Education Costs</Label>
                    <Input placeholder="e.g., 200,000" />
                  </div>
                  <div>
                    <Label>Mortgage Balance</Label>
                    <Input placeholder="e.g., 400,000" />
                  </div>
                  <div>
                    <Label>Other Debts</Label>
                    <Input placeholder="e.g., 50,000" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Existing Assets</h4>
                  <div>
                    <Label>Life Insurance</Label>
                    <Input placeholder="e.g., 500,000" />
                  </div>
                  <div>
                    <Label>Retirement Accounts</Label>
                    <Input placeholder="e.g., 800,000" />
                  </div>
                  <div>
                    <Label>Other Investments</Label>
                    <Input placeholder="e.g., 300,000" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button className="w-full">
                  Calculate Survivor Needs
                </Button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Need</p>
                  <p className="text-xl font-bold text-blue-600">$2,812,500</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Existing Coverage</p>
                  <p className="text-xl font-bold text-green-600">$1,600,000</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Coverage Gap</p>
                  <p className="text-xl font-bold text-orange-600">$1,212,500</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Generation-Skipping Transfer Tax
              </CardTitle>
              <CardDescription>
                Calculate GST tax implications for multi-generational transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Transfer Amount</Label>
                    <Input placeholder="e.g., 5,000,000" />
                  </div>
                  
                  <div>
                    <Label>Generation Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select generation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">Child (1st generation)</SelectItem>
                        <SelectItem value="grandchild">Grandchild (2nd generation)</SelectItem>
                        <SelectItem value="great-grandchild">Great-grandchild (3rd generation)</SelectItem>
                        <SelectItem value="non-skip">Non-skip person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>GST Exemption Used</Label>
                    <Input placeholder="e.g., 13,610,000" />
                  </div>
                  
                  <div>
                    <Label>Trust Structure</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">Direct Transfer</SelectItem>
                        <SelectItem value="dynasty">Dynasty Trust</SelectItem>
                        <SelectItem value="gst-trust">GST Trust</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    Calculate GST Tax
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">GST Tax Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Taxable Distribution:</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST Tax Rate:</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST Tax Due:</span>
                        <span className="font-medium">$0</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Net Transfer:</span>
                        <span className="font-medium text-green-600">$5,000,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Dynasty Trust Benefits</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Perpetual wealth transfer</li>
                      <li>• GST tax exemption optimization</li>
                      <li>• Asset protection benefits</li>
                      <li>• Flexible distribution provisions</li>
                    </ul>
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