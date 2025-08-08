import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/ui/Logo';
import { withTrademarks } from '@/utils/trademark';
import { 
  Users, 
  TrendingUp, 
  Vault, 
  Building, 
  Heart, 
  Star,
  Shield,
  DollarSign,
  FileText,
  Calculator,
  PieChart,
  Target,
  Clock,
  ArrowLeft,
  ArrowRight,
  Lock,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { analyticsEvents } from '@/analytics/events';

// Mock data for demo components
const mockRetirementData = {
  swagScore: 85,
  currentAge: 58,
  retirementAge: 65,
  portfolioValue: 2500000,
  monthlyExpenses: 8500,
  successProbability: 89,
  scenarios: [
    { name: 'Conservative', probability: 95, finalValue: 2800000 },
    { name: 'Moderate', probability: 89, finalValue: 3200000 },
    { name: 'Aggressive', probability: 78, finalValue: 3800000 }
  ]
};

const mockVaultData = {
  folders: [
    { name: 'Estate Planning', docCount: 12, lastUpdated: '2024-01-15' },
    { name: 'Tax Documents', docCount: 8, lastUpdated: '2024-01-10' },
    { name: 'Insurance Policies', docCount: 6, lastUpdated: '2024-01-05' },
    { name: 'Investment Accounts', docCount: 15, lastUpdated: '2024-01-08' }
  ],
  recentDocuments: [
    { name: 'Will & Testament (Updated)', type: 'Legal', date: '2024-01-15' },
    { name: '2023 Tax Return', type: 'Tax', date: '2024-01-10' },
    { name: 'Life Insurance Policy', type: 'Insurance', date: '2024-01-05' }
  ]
};

const pricingTiers = [
  {
    name: 'Basic',
    price: '$2,500',
    period: 'per quarter',
    description: 'Essential family office services',
    features: [
      'Investment management',
      'Basic retirement planning',
      'Quarterly check-ins',
      'Email support',
      'Basic document storage'
    ],
    popular: false
  },
  {
    name: 'Premium',
    price: '$5,000',
    period: 'per quarter',
    description: 'Comprehensive wealth management',
    features: [
      'Everything in Basic',
      withTrademarks('SWAG GPS™ Retirement Roadmap'),
      'Tax planning & preparation',
      'Estate planning coordination',
      'Monthly meetings',
      'Phone & video support',
      withTrademarks('Family Legacy Box™'),
      'Professional network access'
    ],
    popular: true
  },
  {
    name: 'Elite',
    price: '$10,000',
    period: 'per quarter',
    description: 'Complete family office experience',
    features: [
      'Everything in Premium',
      'Dedicated family CFO',
      'Private market access',
      'Healthcare optimization',
      'Business entity management',
      'Concierge services',
      'Weekly availability',
      'Family governance'
    ],
    popular: false
  }
];

export default function Demo() {
  const [searchParams] = useSearchParams();
  const [activeView, setActiveView] = useState('client');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const view = searchParams.get('view') || 'client';
    const tab = searchParams.get('tab') || 'overview';
    setActiveView(view);
    setActiveTab(tab);

    analyticsEvents.trackPageView({
      page_name: 'demo',
      page_path: '/demo',
    });

    analyticsEvents.trackCustomEvent('demo_tab_view', { view, tab });
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    analyticsEvents.trackCustomEvent('demo_tab_view', { view: activeView, tab: newTab });
  };

  const renderRetirementDemo = () => (
    <div className="space-y-8">
      <Card className="bg-gradient-primary text-white border-0">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {withTrademarks("SWAG GPS™ Retirement Roadmap")} Demo
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="text-4xl font-bold">{mockRetirementData.swagScore}</div>
              <div className="text-white/80">SWAG Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{mockRetirementData.successProbability}%</div>
              <div className="text-white/80">Success Probability</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{mockRetirementData.retirementAge - mockRetirementData.currentAge}</div>
              <div className="text-white/80">Years to Retirement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="stress-test">Stress Test</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">${(mockRetirementData.portfolioValue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Current Portfolio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">${mockRetirementData.monthlyExpenses.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly Expenses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">7.2%</div>
                <div className="text-sm text-muted-foreground">Expected Return</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">32</div>
                <div className="text-sm text-muted-foreground">Years in Retirement</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid gap-4">
            {mockRetirementData.scenarios.map((scenario, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{scenario.name} Scenario</h3>
                    <p className="text-sm text-muted-foreground">
                      {scenario.probability}% success probability
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${(scenario.finalValue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Final Value</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cash-flow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Interactive cash flow chart would appear here</p>
                  <p className="text-sm mt-2">Showing income, expenses, and portfolio withdrawals over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monte-carlo">
          <Card>
            <CardHeader>
              <CardTitle>Monte Carlo Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Monte Carlo simulation results would appear here</p>
                  <p className="text-sm mt-2">1,000 market scenarios analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Optimize Tax-Deferred Withdrawals</h3>
                    <p className="text-muted-foreground">Consider Roth conversions in lower income years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Increase Emergency Fund</h3>
                    <p className="text-muted-foreground">Build 12-month expense buffer for market volatility</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stress-test">
          <Card>
            <CardHeader>
              <CardTitle>Stress Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>2008 Financial Crisis</span>
                  <Badge variant="secondary">Portfolio survives</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Extended Bear Market (5 years)</span>
                  <Badge variant="secondary">Portfolio survives</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>High Inflation (8% for 3 years)</span>
                  <Badge variant="outline">Adjustments needed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderVaultDemo = () => (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0">
        <CardContent className="p-8 text-center">
          <Vault className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            {withTrademarks("Family Legacy Box™")} Demo
          </h2>
          <p className="text-white/80">
            Secure, organized storage for all your important documents and family information
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Document Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockVaultData.folders.map((folder, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{folder.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {folder.docCount} documents
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{folder.lastUpdated}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockVaultData.recentDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-muted-foreground">{doc.type}</div>
                </div>
                <div className="text-sm text-muted-foreground">{doc.date}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="font-bold">Bank-Grade Encryption</h3>
              <p className="text-sm text-muted-foreground">256-bit AES encryption</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="font-bold">Family Access Control</h3>
              <p className="text-sm text-muted-foreground">Role-based permissions</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="font-bold">Automatic Backups</h3>
              <p className="text-sm text-muted-foreground">Daily cloud backups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPricingDemo = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Family Office Plan</h2>
        <p className="text-xl text-muted-foreground">
          Transparent pricing with no hidden fees. Scale up or down as your needs change.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="text-3xl font-bold">{tier.price}</div>
              <div className="text-muted-foreground">{tier.period}</div>
              <p className="text-sm">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                className={`w-full mt-6 ${tier.popular ? '' : 'variant-outline'}`}
                variant={tier.popular ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Questions about pricing?</h3>
          <p className="text-muted-foreground mb-6">
            We offer flexible fee structures including flat fees, AUM-based pricing, or hybrid models 
            tailored to your family's specific needs and complexity.
          </p>
          <Button size="lg">
            Schedule a Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDefaultDemo = () => (
    <div className="space-y-8">
      <Card className="bg-gradient-primary text-white border-0">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {withTrademarks("Boutique Family Office™")} Platform Demo
          </h2>
          <p className="text-white/80 text-lg">
            Experience the full family office platform with integrated wealth and health management
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick access to different demo views */}
        {[
          { id: 'client', title: 'Client Portal', icon: Users, description: 'Family dashboard and coordination' },
          { id: 'retirement', title: 'Retirement Roadmap', icon: TrendingUp, description: 'SWAG GPS™ analysis' },
          { id: 'vault', title: 'Family Vault', icon: Vault, description: 'Secure document storage' },
          { id: 'entities', title: 'Properties & Entities', icon: Building, description: 'Business and real estate' },
          { id: 'health', title: 'Healthcare', icon: Heart, description: 'Longevity planning' },
          { id: 'marketplace', title: 'Professional Network', icon: Star, description: 'Vetted advisors and experts' }
        ].map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.id} to={`/demo?view=${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (activeView) {
      case 'retirement':
        return renderRetirementDemo();
      case 'vault':
        return renderVaultDemo();
      case 'pricing':
        return renderPricingDemo();
      case 'client':
      case 'entities':
      case 'health':
      case 'marketplace':
        return renderDefaultDemo();
      case 'all':
      default:
        return renderDefaultDemo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" />
          <div className="flex items-center space-x-4">
            <Badge variant="outline">Demo Mode</Badge>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {renderCurrentView()}

          {/* Demo Navigation */}
          <Card className="mt-12 bg-muted/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Ready to try the real platform?</h3>
              <p className="text-muted-foreground mb-6">
                This demo shows read-only previews. Sign up for full access to all features and personalized analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/signup">
                  <Button size="lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/calculator">
                  <Button variant="outline" size="lg">
                    Try Calculator First
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}