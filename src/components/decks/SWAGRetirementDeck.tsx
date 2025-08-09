import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  PieChart, 
  Calendar,
  CheckCircle,
  Download,
  Share2,
  Phone,
  QrCode,
  DollarSign,
  Shield,
  Target,
  Users,
  FileText,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';

interface RetirementData {
  clientName: string;
  phases: {
    incomeNow: { years: string; coverageRatio: number; allocation: any };
    incomeLater: { years: string; coverageRatio: number; allocation: any };
    growth: { years: string; coverageRatio: number; allocation: any };
    legacy: { years: string; coverageRatio: number; allocation: any };
  };
  monteCarloSuccess: number;
  withdrawalRate: number;
  totalAssets: number;
  confidenceScore: number;
  advisorInfo: {
    name: string;
    firm: string;
    phone: string;
    email: string;
  };
}

const sampleData: RetirementData = {
  clientName: "John & Mary Smith",
  phases: {
    incomeNow: { years: "1-2", coverageRatio: 104, allocation: { stocks: 60, bonds: 30, cash: 10 } },
    incomeLater: { years: "3-12", coverageRatio: 97, allocation: { stocks: 65, bonds: 25, cash: 10 } },
    growth: { years: "12+", coverageRatio: 113, allocation: { stocks: 70, bonds: 20, cash: 10 } },
    legacy: { years: "Ongoing", coverageRatio: 109, allocation: { stocks: 50, bonds: 35, cash: 15 } }
  },
  monteCarloSuccess: 87,
  withdrawalRate: 3.8,
  totalAssets: 1250000,
  confidenceScore: 92,
  advisorInfo: {
    name: "Sarah Johnson, CFP®",
    firm: "Premier Wealth Management",
    phone: "(555) 123-4567",
    email: "sarah@premierwm.com"
  }
};

export const SWAGRetirementDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [liveMode, setLiveMode] = useState(false);
  const [retirementData, setRetirementData] = useState<RetirementData>(sampleData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const slides = [
    {
      id: 1,
      title: "Title & Branding",
      content: (
        <div className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Your SWAG™ Retirement Roadmap
            </h1>
            <p className="text-2xl text-muted-foreground">GPS for Your Financial Future</p>
          </div>
          
          <div className="my-12">
            <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto flex items-center justify-center">
              <Target className="h-24 w-24 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold">Prepared for: {retirementData.clientName}</h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive analysis of your retirement strategy
            </p>
          </div>

          <div className="flex justify-center items-center space-x-8 mt-12">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">GPS Navigation</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Risk Management</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Growth Optimization</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "The Four SWAG GPS Phases",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Navigate Your Retirement Journey</h2>
            <p className="text-lg text-muted-foreground">
              Four distinct phases designed to optimize your financial GPS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">Income Now</h3>
                    <p className="text-sm text-muted-foreground">Years 1-2</p>
                  </div>
                </div>
                <p className="text-sm mb-3">Immediate income stability and transition planning</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Coverage: {retirementData.phases.incomeNow.coverageRatio}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-600">Income Later</h3>
                    <p className="text-sm text-muted-foreground">Years 3-12</p>
                  </div>
                </div>
                <p className="text-sm mb-3">Bridge to full retirement income streams</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Coverage: {retirementData.phases.incomeLater.coverageRatio}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-600">Growth</h3>
                    <p className="text-sm text-muted-foreground">12+ Years</p>
                  </div>
                </div>
                <p className="text-sm mb-3">Long-term wealth accumulation and optimization</p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Coverage: {retirementData.phases.growth.coverageRatio}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-600">Legacy</h3>
                    <p className="text-sm text-muted-foreground">Ongoing</p>
                  </div>
                </div>
                <p className="text-sm mb-3">Estate planning and wealth transfer strategies</p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Coverage: {retirementData.phases.legacy.coverageRatio}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-muted/50 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">Your Journey Timeline</h4>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Years 1-2</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Years 3-12</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Years 12+</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Legacy</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Your Roadmap Results",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Retirement Confidence Score</h2>
            <div className="text-6xl font-bold text-primary mb-2">{retirementData.confidenceScore}%</div>
            <p className="text-lg text-muted-foreground">
              Based on Monte Carlo analysis and comprehensive planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Success Probability</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">{retirementData.monteCarloSuccess}%</div>
                <p className="text-sm text-muted-foreground">10,000 scenario Monte Carlo analysis</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Withdrawal Rate</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{retirementData.withdrawalRate}%</div>
                <p className="text-sm text-muted-foreground">Sustainable annual withdrawal</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Total Assets</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">{formatCurrency(retirementData.totalAssets)}</div>
                <p className="text-sm text-muted-foreground">Current portfolio value</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Key Insights from Your Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium">Strong Financial Foundation</p>
                    <p className="text-sm text-muted-foreground">Your current savings rate supports your goals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium">Optimized Asset Allocation</p>
                    <p className="text-sm text-muted-foreground">Risk-adjusted for each retirement phase</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium">Tax-Efficient Strategy</p>
                    <p className="text-sm text-muted-foreground">Roth conversions and withdrawal sequencing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium">Legacy Protection</p>
                    <p className="text-sm text-muted-foreground">Estate planning integration included</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "Integrated Planning Tools",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Planning Integration</h2>
            <p className="text-lg text-muted-foreground">
              Your roadmap integrates all essential retirement planning tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Social Security Optimization</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Maximize lifetime benefits with optimal claiming strategies
                  </p>
                  <Badge variant="outline">Integrated</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Roth Conversion Planning</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tax-efficient conversion strategies for long-term savings
                  </p>
                  <Badge variant="outline">Optimized</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Estate Planning Suite</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wills, trusts, and beneficiary optimization
                  </p>
                  <Badge variant="outline">Included</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Tax Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Multi-year tax planning and bracket management
                  </p>
                  <Badge variant="outline">Coordinated</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Long-Term Care</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Insurance and self-funding analysis
                  </p>
                  <Badge variant="outline">Analyzed</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-red-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Stress Testing</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Market downturns and economic scenario modeling
                  </p>
                  <Badge variant="outline">Validated</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">All Tools Work Together</h3>
                <p className="text-muted-foreground mb-6">
                  Unlike standalone calculators, our integrated approach ensures all strategies 
                  are coordinated and optimized for your specific situation.
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">6</div>
                    <p className="text-sm">Integrated Tools</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1</div>
                    <p className="text-sm">Unified Strategy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">∞</div>
                    <p className="text-sm">Ongoing Optimization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Why SWAG GPS Wins",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">SWAG GPS vs. Generic Calculators</h2>
            <p className="text-lg text-muted-foreground">
              See why our integrated approach delivers superior results
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">Generic Calculators</th>
                  <th className="text-center p-4 font-semibold text-primary">SWAG GPS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Phase-Based Planning</td>
                  <td className="p-4 text-center text-red-500">❌</td>
                  <td className="p-4 text-center text-green-500">✅</td>
                </tr>
                <tr className="border-b bg-muted/20">
                  <td className="p-4 font-medium">Monte Carlo Analysis</td>
                  <td className="p-4 text-center text-yellow-500">Basic</td>
                  <td className="p-4 text-center text-green-500">Advanced (10K scenarios)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Tax Integration</td>
                  <td className="p-4 text-center text-red-500">❌</td>
                  <td className="p-4 text-center text-green-500">✅ Full Integration</td>
                </tr>
                <tr className="border-b bg-muted/20">
                  <td className="p-4 font-medium">Estate Planning</td>
                  <td className="p-4 text-center text-red-500">❌</td>
                  <td className="p-4 text-center text-green-500">✅ Built-in Suite</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Social Security Optimization</td>
                  <td className="p-4 text-center text-yellow-500">Separate Tool</td>
                  <td className="p-4 text-center text-green-500">✅ Integrated</td>
                </tr>
                <tr className="border-b bg-muted/20">
                  <td className="p-4 font-medium">Stress Testing</td>
                  <td className="p-4 text-center text-red-500">❌</td>
                  <td className="p-4 text-center text-green-500">✅ Multiple Scenarios</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Ongoing Updates</td>
                  <td className="p-4 text-center text-red-500">Manual</td>
                  <td className="p-4 text-center text-green-500">✅ Automated</td>
                </tr>
                <tr className="border-b bg-muted/20">
                  <td className="p-4 font-medium">Professional Guidance</td>
                  <td className="p-4 text-center text-red-500">❌</td>
                  <td className="p-4 text-center text-green-500">✅ Advisor Integration</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Generic Calculator Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Single-point-in-time analysis</li>
                  <li>• No phase-specific strategies</li>
                  <li>• Limited scenario modeling</li>
                  <li>• No tax coordination</li>
                  <li>• Requires multiple separate tools</li>
                  <li>• No professional oversight</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600">SWAG GPS Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Four-phase strategic approach</li>
                  <li>• Comprehensive integration</li>
                  <li>• Advanced scenario testing</li>
                  <li>• Tax-efficient optimization</li>
                  <li>• All-in-one platform</li>
                  <li>• Expert advisor support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Next Steps & Action Plan",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Turn Your Roadmap Into Action</h2>
            <p className="text-lg text-muted-foreground">
              Ready to implement your personalized retirement strategy?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Schedule Your Strategy Call</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Meet with {retirementData.advisorInfo.name} to discuss your roadmap and next steps
                </p>
                <Button className="w-full">
                  Book Your Call
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {retirementData.advisorInfo.phone}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardContent className="pt-6 text-center">
                <QrCode className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Access Your Portal</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  View your complete roadmap and run "what-if" scenarios anytime
                </p>
                <Button variant="outline" className="w-full">
                  Open Portal
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Scan QR code on mobile
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="pt-6 text-center">
                <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Ask Linda AI</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Get instant answers about your retirement plan from our AI assistant
                </p>
                <Button variant="outline" className="w-full">
                  Chat with Linda
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Available 24/7
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Your Advisor Team</h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <p className="font-semibold">{retirementData.advisorInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{retirementData.advisorInfo.firm}</p>
                    <p className="text-sm text-muted-foreground">{retirementData.advisorInfo.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold">Ready to Get Started?</h4>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="px-8">
                Schedule Strategy Call
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Download Full Report
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlideData = slides.find(s => s.id === currentSlide);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SWAG™ Retirement Roadmap Deck</h1>
          <p className="text-muted-foreground">Client: {retirementData.clientName}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="live-mode" className="text-sm font-medium">
              Live Data
            </label>
            <Switch 
              id="live-mode"
              checked={liveMode}
              onCheckedChange={setLiveMode}
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        {slides.map((slide) => (
          <Button
            key={slide.id}
            variant={currentSlide === slide.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentSlide(slide.id)}
            className="whitespace-nowrap"
          >
            {slide.id}. {slide.title}
          </Button>
        ))}
      </div>

      {/* Slide Content */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{currentSlideData?.title}</CardTitle>
            <Badge variant="outline">
              Slide {currentSlide} of {slides.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentSlideData?.content}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
          disabled={currentSlide === 1}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`w-3 h-3 rounded-full ${
                slide.id === currentSlide ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))}
          disabled={currentSlide === slides.length}
        >
          Next
        </Button>
      </div>

      {/* Compliance Footer */}
      <div className="text-center text-xs text-muted-foreground border-t pt-4">
        <p>
          This analysis is provided by {retirementData.advisorInfo.name} of {retirementData.advisorInfo.firm}. 
          Investment advisory services offered through SEC registered investment adviser. 
          Past performance does not guarantee future results. This is not a recommendation to buy or sell securities.
        </p>
      </div>
    </div>
  );
};