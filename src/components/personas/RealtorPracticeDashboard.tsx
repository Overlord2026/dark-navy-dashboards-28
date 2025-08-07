import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumFeatureGate } from "@/components/premium/PremiumFeatureGate";
import { FeatureAccessIndicator } from "@/components/navigation/FeatureAccessIndicator";
import { isPremiumClient } from "@/utils/tierUtils";
import { LeadSourcesManager } from "@/components/leads/LeadSourcesManager";
import { UniversalLeadPipeline } from "@/components/personas/UniversalLeadPipeline";
import { InAppSupport } from "@/components/support/InAppSupport";
import { ResponsiveDashboard } from "@/components/mobile/ResponsiveDashboard";
import { 
  Home, 
  Users, 
  FileText, 
  Calculator,
  Crown,
  Lock,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clipboard,
  BarChart3,
  Settings,
  Brain,
  Key,
  Search
} from "lucide-react";

export const RealtorPracticeDashboard: React.FC = () => {
  const user = null; // TODO: Connect to actual user context
  const [activeListings] = useState(47);
  const [monthlyRevenue] = useState(68900);
  const [closedDeals] = useState(8);

  const isPremium = isPremiumClient(user);

  const BasicFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Property Listings</CardTitle>
          <Home className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeListings}</div>
          <p className="text-xs text-muted-foreground">Active listings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rent/Bill Tracker</CardTitle>
          <Calculator className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$24,500</div>
          <p className="text-xs text-muted-foreground">Monthly collections</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client Portal</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">Active clients</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Document Management</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">Documents stored</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tenant Screening</CardTitle>
          <Search className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">Pending applications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Scheduling</CardTitle>
          <Clipboard className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">34</div>
          <p className="text-xs text-muted-foreground">Upcoming tasks</p>
        </CardContent>
      </Card>
    </div>
  );

  const PremiumFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PremiumFeatureGate
        featureName="lead-engine"
        featureLabel="Lead to Sales Engine"
        featureDescription="Advanced prospect management and conversion tracking"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Lead to Sales Engine
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Convert prospects into clients efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Prospects:</span>
                <span className="font-medium text-primary">18</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-medium">42%</span>
              </div>
              <Button className="w-full">View Pipeline</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="campaign-automation"
        featureLabel="Campaign Automation"
        featureDescription="Automated marketing campaigns for listings and leads"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Campaign Automation
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automate listing promotions and lead nurturing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Campaigns:</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex justify-between">
                <span>Leads Generated:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">47 this month</Badge>
              </div>
              <Button className="w-full">Manage Campaigns</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="esign"
        featureLabel="eSign Rental Agreements"
        featureDescription="Digital signature solutions for rental and purchase agreements"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              eSign Agreements
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Digital signature workflows for all agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Pending Signatures:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate:</span>
                <span className="font-medium">94%</span>
              </div>
              <Button className="w-full">Send Agreement</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="analytics"
        featureLabel="Marketing Analytics"
        featureDescription="Detailed analytics and ROI tracking for marketing efforts"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Marketing Analytics
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Track marketing performance and ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Marketing ROI:</span>
                <span className="font-medium">340%</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per Lead:</span>
                <span className="font-medium">$89</span>
              </div>
              <Button className="w-full">View Analytics</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>
    </div>
  );

  return (
    <ResponsiveDashboard persona="realtor">
      <InAppSupport />
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, Realtor! 
            {isPremium && <Crown className="inline h-6 w-6 ml-2 text-yellow-300" />}
          </h1>
          <p className="text-white/90">
            Your comprehensive real estate practice dashboard is ready. Manage properties, track leads, and grow your real estate business with advanced tools.
          </p>
          {!isPremium && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-sm">
                <Lock className="inline h-4 w-4 mr-1" />
                You're on the Basic plan. Upgrade to Premium for lead engine, campaign automation, eSign, and analytics!
              </p>
            </div>
          )}
        </div>

        {/* Tier Status */}
        <Card className={isPremium ? "border-primary bg-primary/5" : "border-muted"}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {isPremium ? (
                    <>
                      <Crown className="h-5 w-5 text-primary" />
                      Premium Realtor Plan
                    </>
                  ) : (
                    <>
                      <Home className="h-5 w-5 text-muted-foreground" />
                      Basic Realtor Plan
                    </>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPremium 
                    ? "Full access to all premium features including lead engine, campaign automation, eSign, and advanced analytics"
                    : "Essential real estate management tools. Upgrade for advanced lead generation, automation, and analytics"
                  }
                </p>
              </div>
              {!isPremium && (
                <Button className="gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="basic">Basic Features</TabsTrigger>
            <TabsTrigger value="premium">
              Premium Features
              {!isPremium && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeListings}</div>
                  <p className="text-xs text-muted-foreground">+5 this month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{closedDeals}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+22% growth</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Days on Market</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">-5 days vs market</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common real estate tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Home className="h-6 w-6" />
                    Add Listing
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    New Client
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Search className="h-6 w-6" />
                    Screen Tenant
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Create Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="basic" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Basic Plan Features</h3>
              <Badge variant="outline">Included in your plan</Badge>
            </div>
            <BasicFeatures />
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Premium Plan Features</h3>
              {isPremium ? (
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              ) : (
                <Badge variant="outline" className="border-primary text-primary">
                  <Lock className="h-3 w-3 mr-1" />
                  Upgrade Required
                </Badge>
              )}
            </div>
            <PremiumFeatures />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Lead Management</h3>
              {isPremium ? (
                <Badge className="bg-primary text-primary-foreground">Premium Active</Badge>
              ) : (
                <Badge variant="outline" className="border-primary text-primary">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium Feature
                </Badge>
              )}
            </div>
            <LeadSourcesManager />
            <UniversalLeadPipeline persona="realtor" />
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Real Estate Tools</h3>
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Property Valuation AI
                  </CardTitle>
                  <CardDescription>AI-powered property valuation and market analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-3">Analyze Property</Button>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Instant property valuations</p>
                    <p>• Market trend analysis</p>
                    <p>• Comparative market analysis</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Investment Calculator
                  </CardTitle>
                  <CardDescription>Advanced ROI and investment property analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-3">Calculate ROI</Button>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Cash flow projections</p>
                    <p>• Cap rate calculations</p>
                    <p>• Investment scenarios</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Training & Resources
                </CardTitle>
                <CardDescription>Master your real estate practice management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Getting Started Guide
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Home className="h-6 w-6" />
                    Listing Management
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Client Relationship
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Market Analysis
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Real estate practice setup</li>
                    <li>• Listing optimization strategies</li>
                    <li>• Client communication templates</li>
                    <li>• Market analysis training</li>
                    {isPremium && <li>• Advanced lead generation</li>}
                    {isPremium && <li>• Campaign automation setup</li>}
                    {isPremium && <li>• eSign workflow training</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upgrade CTA for Basic Users */}
        {!isPremium && (
          <Card className="border-primary bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Crown className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Accelerate Your Real Estate Business</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upgrade to Premium for advanced lead generation, campaign automation, 
                  eSign capabilities, and comprehensive marketing analytics.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Lead Engine
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Campaign Automation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    eSign Solutions
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Analytics
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveDashboard>
  );
};