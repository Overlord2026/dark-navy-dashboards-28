import React, { useState } from 'react';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, ExternalLink, Users, TrendingUp } from 'lucide-react';
import { PrivateMarketHero } from '@/components/investments/PrivateMarketHero';
import { CuratedPartners } from '@/components/investments/CuratedPartners';
import { PartnerApplication } from '@/components/investments/PartnerApplication';
import { ManagerResearch } from '@/components/investments/ManagerResearch';
import { InvestmentWebinars } from '@/components/investments/InvestmentWebinars';
import { useCelebration } from '@/hooks/useCelebration';

export default function PrivateMarket() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPartnerApplication, setShowPartnerApplication] = useState(false);
  const { triggerCelebration } = useCelebration();

  const handleApplyAsPartner = () => {
    setShowPartnerApplication(true);
    // Track analytics
    console.log('Partner application initiated');
  };

  const handleSpeakToAdvisor = () => {
    triggerCelebration('milestone', 'Fiduciary advisor consultation requested!');
    console.log('Speak to advisor requested');
    // Handle advisor consultation request
  };

  return (
    <FeatureGate
      featureId="private-market-alpha"
      featureName="Private Market Alpha"
      requiredPlans={['premium', 'elite']}
      usePlanUpgradePrompt={true}
    >
      <div className="min-h-screen">
        {/* Hero Section */}
        <PrivateMarketHero />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="partners">Curated Partners</TabsTrigger>
              <TabsTrigger value="research">Manager Research</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
              <TabsTrigger value="alpha">Private Alpha</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Overview Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Why Private Market Alpha?</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Institutional-Quality Access</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Access the same private market opportunities typically reserved for pension funds, 
                          endowments, and sovereign wealth funds. Our curated marketplace features vetted 
                          managers across private equity, real estate, credit, and alternative strategies.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Rigorous Due Diligence</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Every partner undergoes comprehensive due diligence including performance analysis, 
                          operational review, regulatory verification, and reference checks. Our investment 
                          committee maintains strict standards for marketplace inclusion.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Fiduciary Guidance</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Work with fee-only fiduciary advisors who provide unbiased guidance on private 
                          market allocation, manager selection, and portfolio construction. No sales pressure, 
                          just expertise aligned with your interests.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Asset Class Overview */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Asset Class Coverage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: "Private Equity",
                          description: "Buyout, growth, and special situations across all market segments",
                          partners: 45,
                          minInvestment: "$1M"
                        },
                        {
                          name: "Real Estate", 
                          description: "Core, value-add, and opportunistic strategies in commercial properties",
                          partners: 32,
                          minInvestment: "$500K"
                        },
                        {
                          name: "Private Credit",
                          description: "Direct lending, distressed debt, and specialty finance strategies", 
                          partners: 28,
                          minInvestment: "$1M"
                        },
                        {
                          name: "Infrastructure",
                          description: "Core infrastructure, renewable energy, and digital infrastructure",
                          partners: 18,
                          minInvestment: "$5M"
                        },
                        {
                          name: "Venture Capital",
                          description: "Early-stage and growth equity in technology and innovation",
                          partners: 22,
                          minInvestment: "$250K"
                        },
                        {
                          name: "Hedge Funds",
                          description: "Multi-strategy, long/short equity, and event-driven strategies",
                          partners: 15,
                          minInvestment: "$1M"
                        }
                      ].map((assetClass) => (
                        <Card key={assetClass.name} className="p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold mb-2">{assetClass.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{assetClass.description}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{assetClass.partners} Partners</span>
                            <span>From {assetClass.minInvestment}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Get Started</h3>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gold-premium text-primary hover:bg-gold-dark"
                        onClick={handleSpeakToAdvisor}
                      >
                        Speak to a Fiduciary Advisor
                      </Button>
                      <Button variant="outline" className="w-full">
                        Download Private Market Guide
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Sample Research Report
                      </Button>
                    </div>
                  </Card>

                  {/* For Partners */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-gold-premium/10">
                    <h3 className="font-semibold mb-3">Are You a Manager?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join our curated marketplace and connect with qualified family office investors.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-gold-premium text-gold-dark hover:bg-gold-premium/10"
                      onClick={handleApplyAsPartner}
                    >
                      Apply to Become a Partner
                    </Button>
                  </Card>

                  {/* Compliance Notice */}
                  <Card className="p-6 bg-muted/50">
                    <div className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-gold-dark flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Important Disclosure</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          All partners pay to appear on our marketplace. Listings do not constitute 
                          investment recommendations. Past performance does not guarantee future results. 
                          <button className="text-gold-dark hover:underline ml-1">
                            View our methodology
                          </button>
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Market Insights */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Market Insights</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">$847B</div>
                        <div className="text-xs text-muted-foreground">Private Markets AUM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold-dark">12.3%</div>
                        <div className="text-xs text-muted-foreground">Avg Annual Returns</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">23%</div>
                        <div className="text-xs text-muted-foreground">Allocation Target</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="partners">
              <CuratedPartners />
            </TabsContent>

            <TabsContent value="research">
              <ManagerResearch />
            </TabsContent>

            <TabsContent value="webinars">
              <InvestmentWebinars />
            </TabsContent>

            <TabsContent value="alpha" className="space-y-8">
              {/* Private Alpha Content */}
              <Card className="p-8 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                  <Badge className="bg-gold-premium text-primary">Coming Soon</Badge>
                  <h2 className="text-3xl font-bold">Private Market Alpha Intelligence</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our proprietary AI-driven analysis platform will provide real-time insights on 
                    private market trends, manager performance, and allocation opportunities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-gold-dark mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Performance Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Real-time performance tracking and benchmarking
                      </p>
                    </div>
                    <div className="text-center">
                      <Users className="w-8 h-8 text-gold-dark mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Manager Intelligence</h3>
                      <p className="text-sm text-muted-foreground">
                        Deep insights on team, strategy, and operations
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-gold-dark mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Risk Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive risk analysis and monitoring
                      </p>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="bg-gold-premium text-primary hover:bg-gold-dark font-semibold"
                  >
                    Join Alpha Waitlist
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Partner Application Modal */}
        <PartnerApplication 
          isOpen={showPartnerApplication} 
          onClose={() => setShowPartnerApplication(false)} 
        />
      </div>
    </FeatureGate>
  );
}