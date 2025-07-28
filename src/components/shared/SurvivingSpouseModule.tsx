import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  AlertTriangle, 
  DollarSign, 
  TrendingDown, 
  TrendingUp,
  Calculator, 
  Download, 
  Calendar,
  Shield,
  BookOpen,
  Users,
  FileText,
  Lock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface SpouseData {
  age: number;
  income: number;
  socialSecurity: number;
  retirementAssets: number;
  taxBracket: number;
  lifeExpectancy: number;
}

interface StressTestResults {
  currentIncome: number;
  survivorIncome: number;
  incomeReduction: number;
  taxIncrease: number;
  resilienceScore: number;
  recommendations: string[];
  socialSecurityImpact: number;
  livingExpensesChange: number;
}

export function SurvivingSpouseModule() {
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  // Check basic access (free tier users can see educational content, basic+ can use calculator)
  const hasBasicAccess = subscriptionPlan?.tier !== 'free';
  // Check premium access (premium+ users get advanced features)
  const hasPremiumAccess = subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';

  const [spouse1, setSpouse1] = useState<SpouseData>({
    age: 60,
    income: 80000,
    socialSecurity: 2500,
    retirementAssets: 750000,
    taxBracket: 22,
    lifeExpectancy: 85
  });

  const [spouse2, setSpouse2] = useState<SpouseData>({
    age: 58,
    income: 60000,
    socialSecurity: 2000,
    retirementAssets: 500000,
    taxBracket: 22,
    lifeExpectancy: 87
  });

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateStressTest = (): StressTestResults => {
    const totalCurrentIncome = spouse1.income + spouse2.income;
    const totalSocialSecurity = spouse1.socialSecurity + spouse2.socialSecurity;
    
    // Simulate loss of higher earning spouse
    const higherEarner = spouse1.income > spouse2.income ? spouse1 : spouse2;
    const lowerEarner = spouse1.income > spouse2.income ? spouse2 : spouse1;
    
    const survivorIncome = lowerEarner.income + (higherEarner.socialSecurity * 0.5); // Survivor benefits
    const incomeReduction = ((totalCurrentIncome - survivorIncome) / totalCurrentIncome) * 100;
    
    // Tax penalty - filing single vs married filing jointly
    const currentTaxRate = 22; // Married filing jointly
    const survivorTaxRate = 24; // Single filer at similar income
    const taxIncrease = survivorTaxRate - currentTaxRate;
    
    const socialSecurityImpact = totalSocialSecurity - (higherEarner.socialSecurity * 0.5);
    const livingExpensesChange = -15; // Typically 15% reduction in expenses
    
    // Calculate resilience score
    const totalAssets = spouse1.retirementAssets + spouse2.retirementAssets;
    const annualIncomeCoverage = totalAssets / survivorIncome;
    let resilienceScore = 50;
    
    if (annualIncomeCoverage > 25) resilienceScore += 30;
    else if (annualIncomeCoverage > 20) resilienceScore += 20;
    else if (annualIncomeCoverage > 15) resilienceScore += 10;
    
    if (incomeReduction < 30) resilienceScore += 20;
    else if (incomeReduction < 50) resilienceScore += 10;
    
    const recommendations = [];
    if (incomeReduction > 40) {
      recommendations.push('Consider life insurance to replace income');
      recommendations.push('Maximize Social Security strategies');
    }
    if (taxIncrease > 2) {
      recommendations.push('Implement Roth conversion strategies');
      recommendations.push('Consider tax-efficient withdrawal sequencing');
    }
    if (resilienceScore < 60) {
      recommendations.push('Build emergency fund for surviving spouse');
      recommendations.push('Consider long-term care insurance');
    }
    
    return {
      currentIncome: totalCurrentIncome,
      survivorIncome,
      incomeReduction,
      taxIncrease,
      resilienceScore: Math.min(100, resilienceScore),
      recommendations,
      socialSecurityImpact,
      livingExpensesChange
    };
  };

  const results = calculateStressTest();

  const handleStressTest = () => {
    if (!hasBasicAccess) {
      toast.error('Please upgrade to access the Surviving Spouse Stress Test');
      return;
    }
    setShowResults(true);
    toast.success('Stress test completed! Review your results below.');
  };

  const handleDownloadReport = async () => {
    if (!email) {
      toast.error('Please enter your email to download the report');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulate PDF generation and email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Your Surviving Spouse Stress Test report has been sent to your email!');
      // TODO: Integrate with document vault for premium users
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookConsultation = () => {
    window.open('https://calendly.com/tonygomes/surviving-spouse-review', '_blank');
  };

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
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <CardContent className="p-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-3xl font-bold">Surviving Spouse & Widow's Penalty</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Understand and prepare for the financial impact when one spouse passes away. 
              The "Widow's Penalty" can reduce survivor income by 25-50% due to tax changes and benefit losses.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Income typically drops 25-50%</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Tax rates often increase</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Planning prevents crisis</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="calculator">Stress Test</TabsTrigger>
          <TabsTrigger value="cases">Case Studies</TabsTrigger>
          <TabsTrigger value="action">Take Action</TabsTrigger>
        </TabsList>

        {/* Education Content */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  What is the Widow's Penalty?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The "Widow's Penalty" refers to the significant financial impact on the surviving spouse when their partner dies. This includes:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-red-500 mt-0.5" />
                    <span><strong>Income Loss:</strong> Loss of the deceased spouse's income and benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-red-500 mt-0.5" />
                    <span><strong>Tax Increase:</strong> Change from married filing jointly to single filer status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-red-500 mt-0.5" />
                    <span><strong>Social Security:</strong> Survivor receives only the higher of the two benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-red-500 mt-0.5" />
                    <span><strong>Medicare:</strong> Loss of spouse's Medicare benefits and coverage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Why Planning Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Without proper planning, the surviving spouse may face:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <h4 className="font-semibold text-sm text-red-800 dark:text-red-200 mb-1">
                      Immediate Financial Strain
                    </h4>
                    <p className="text-xs text-red-600 dark:text-red-300">
                      Sudden loss of income while maintaining similar living expenses
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <h4 className="font-semibold text-sm text-orange-800 dark:text-orange-200 mb-1">
                      Tax Shock
                    </h4>
                    <p className="text-xs text-orange-600 dark:text-orange-300">
                      Higher tax rates on retirement distributions and Social Security
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-1">
                      Forced Lifestyle Changes
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      May need to sell home, reduce expenses, or return to work
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Common Scenarios & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">High-Income Couples</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Life insurance to replace income</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Roth conversions while in lower brackets</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Tax-efficient withdrawal strategies</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Fixed-Income Retirees</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Optimize Social Security claiming strategies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Consider immediate annuities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Long-term care insurance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stress Test Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Surviving Spouse Stress Test
              </CardTitle>
              <CardDescription>
                Model the financial impact if one spouse passes away first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasBasicAccess && (
                <div className="p-4 bg-muted rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Premium Feature</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to access the complete Surviving Spouse Stress Test and personalized recommendations.
                  </p>
                  <Button size="sm">Upgrade Now</Button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spouse 1 Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Spouse 1</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spouse1-age">Age</Label>
                        <Input
                          id="spouse1-age"
                          type="number"
                          value={spouse1.age}
                          onChange={(e) => setSpouse1({...spouse1, age: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouse1-income">Annual Income</Label>
                        <Input
                          id="spouse1-income"
                          type="number"
                          value={spouse1.income}
                          onChange={(e) => setSpouse1({...spouse1, income: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spouse1-ss">Monthly Social Security</Label>
                        <Input
                          id="spouse1-ss"
                          type="number"
                          value={spouse1.socialSecurity}
                          onChange={(e) => setSpouse1({...spouse1, socialSecurity: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouse1-assets">Retirement Assets</Label>
                        <Input
                          id="spouse1-assets"
                          type="number"
                          value={spouse1.retirementAssets}
                          onChange={(e) => setSpouse1({...spouse1, retirementAssets: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Spouse 2 Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Spouse 2</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spouse2-age">Age</Label>
                        <Input
                          id="spouse2-age"
                          type="number"
                          value={spouse2.age}
                          onChange={(e) => setSpouse2({...spouse2, age: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouse2-income">Annual Income</Label>
                        <Input
                          id="spouse2-income"
                          type="number"
                          value={spouse2.income}
                          onChange={(e) => setSpouse2({...spouse2, income: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spouse2-ss">Monthly Social Security</Label>
                        <Input
                          id="spouse2-ss"
                          type="number"
                          value={spouse2.socialSecurity}
                          onChange={(e) => setSpouse2({...spouse2, socialSecurity: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouse2-assets">Retirement Assets</Label>
                        <Input
                          id="spouse2-assets"
                          type="number"
                          value={spouse2.retirementAssets}
                          onChange={(e) => setSpouse2({...spouse2, retirementAssets: Number(e.target.value)})}
                          disabled={!hasBasicAccess}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleStressTest}
                  size="lg"
                  disabled={!hasBasicAccess}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Stress Test
                </Button>
              </div>

              {/* Results */}
              {showResults && hasBasicAccess && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Stress Test Results
                      <Badge variant={getScoreBadgeVariant(results.resilienceScore)}>
                        Resilience Score: {results.resilienceScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${results.currentIncome.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Current Combined Income</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          ${results.survivorIncome.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Survivor Income</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          -{results.incomeReduction.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Income Reduction</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          +{results.taxIncrease}%
                        </div>
                        <div className="text-sm text-muted-foreground">Tax Rate Increase</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Personalized Recommendations:</h4>
                      <div className="space-y-2">
                        {results.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="email-report">Email for detailed report</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email-report"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Button onClick={handleDownloadReport} disabled={isSubmitting}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Case Studies */}
        <TabsContent value="cases" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: "The Johnson Family",
                scenario: "High-earning couple, $150K combined income",
                challenge: "Survivor would face 40% income drop + higher tax bracket",
                solution: "Life insurance + Roth conversions + estate planning",
                outcome: "Reduced income gap to 15%, saved $50K annually in taxes"
              },
              {
                title: "The Chen Family", 
                scenario: "Retired couple on fixed income, $80K annually",
                challenge: "Loss of pension + Social Security reduction",
                solution: "Optimized Social Security timing + annuity purchase",
                outcome: "Maintained 85% of income for surviving spouse"
              }
            ].map((caseStudy, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                  <CardDescription>{caseStudy.scenario}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-red-600 mb-1">Challenge:</h4>
                    <p className="text-sm">{caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600 mb-1">Solution:</h4>
                    <p className="text-sm">{caseStudy.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-green-600 mb-1">Outcome:</h4>
                    <p className="text-sm">{caseStudy.outcome}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Take Action */}
        <TabsContent value="action" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book a Resilience Review
                </CardTitle>
                <CardDescription>
                  Schedule a complimentary consultation with our surviving spouse specialists
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Review your stress test results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Discuss implementation strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Create action plan with timelines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No cost, no obligation</span>
                  </li>
                </ul>
                <Button onClick={handleBookConsultation} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Free Review
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Action Steps
                </CardTitle>
                <CardDescription>
                  Start protecting your family today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { action: "Review Social Security strategies", urgency: "high" },
                    { action: "Assess life insurance needs", urgency: "high" },
                    { action: "Consider Roth conversions", urgency: "medium" },
                    { action: "Update estate planning documents", urgency: "medium" },
                    { action: "Plan tax-efficient withdrawals", urgency: "low" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">{item.action}</span>
                      <Badge variant={
                        item.urgency === 'high' ? 'destructive' : 
                        item.urgency === 'medium' ? 'default' : 'secondary'
                      }>
                        {item.urgency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cross-linking to other features */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>Related Planning Areas</CardTitle>
              <CardDescription>
                Explore other tools and features to complete your planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Estate Planning</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm">Tax Planning</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Social Security</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Heart className="h-6 w-6" />
                  <span className="text-sm">Insurance Review</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}