import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumFeatureGate } from "@/components/premium/PremiumFeatureGate";
import { FeatureAccessIndicator } from "@/components/navigation/FeatureAccessIndicator";
import { isPremiumClient } from "@/utils/tierUtils";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  Award,
  Brain,
  BarChart3,
  MessageSquare,
  Crown,
  Lock,
  Target,
  DollarSign,
  BookOpen,
  Shield,
  Scan,
  FileSearch,
  HelpCircle
} from "lucide-react";
import { LeadSourcesManager } from "@/components/leads/LeadSourcesManager";
import { UniversalLeadPipeline } from "@/components/personas/UniversalLeadPipeline";
import { InAppSupport } from "@/components/support/InAppSupport";

export const AdvisorPracticeDashboard: React.FC = () => {
  const user = null; // TODO: Connect to actual user context
  const [activeClients] = useState(47);
  const [aum] = useState(12500000);
  const [monthlyFees] = useState(15750);

  const isPremium = isPremiumClient(user);

  const BasicFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dashboard & CRM</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">Active clients</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client Onboarding</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">Magic links sent this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Analysis</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(aum / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">Assets under management</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Document Vault</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">Client documents stored</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyFees.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98%</div>
          <p className="text-xs text-muted-foreground">Compliance score</p>
        </CardContent>
      </Card>
    </div>
  );

  const PremiumFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PremiumFeatureGate
        featureName="ce-automation"
        featureLabel="CE/ADV Automation"
        featureDescription="Automated continuing education tracking and ADV filing management"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              CE/ADV Automation
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automated compliance tracking and filing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>CE Credits Due:</span>
                <span className="font-medium">12 by Dec 31</span>
              </div>
              <div className="flex justify-between">
                <span>ADV Filing Status:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Up to date</Badge>
              </div>
              <Button className="w-full">Manage Compliance</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="lead-engine"
        featureLabel="Lead to Sales Engine"
        featureDescription="Advanced lead generation and conversion tracking"
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
                <span>Hot Leads:</span>
                <span className="font-medium text-primary">8</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-medium">23%</span>
              </div>
              <Button className="w-full">View Pipeline</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="ai-copilot"
        featureLabel="AI Copilot"
        featureDescription="AI-powered meeting analytics and insights"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Copilot & Analytics
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>AI-powered insights and automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Meetings Analyzed:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Action Items Generated:</span>
                <span className="font-medium">67</span>
              </div>
              <Button className="w-full">View Insights</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="campaign-management"
        featureLabel="Campaign Management"
        featureDescription="Advanced marketing campaign tracking and analytics"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Campaign Management
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Track marketing campaigns and ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Campaigns:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Response Rate:</span>
                <span className="font-medium">18%</span>
              </div>
              <Button className="w-full">Manage Campaigns</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Financial Advisor! 
          {isPremium && <Crown className="inline h-6 w-6 ml-2 text-yellow-300" />}
        </h1>
        <p className="text-white/90">
          Your comprehensive practice management dashboard is ready. Manage clients, track compliance, and grow your business with advanced tools.
        </p>
        {!isPremium && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              <Lock className="inline h-4 w-4 mr-1" />
              You're on the Basic plan. Upgrade to Premium for CE automation, lead engine, AI copilot, and more!
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Sources</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="premium">
            Premium
            {!isPremium && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeClients}</div>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AUM</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(aum / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">+12% YoY</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyFees.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Recurring fees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">All requirements met</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions with AI Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Essential practice management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Add Client
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Upload Document
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <MessageSquare className="h-6 w-6" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Tools</CardTitle>
                <CardDescription>Instant analysis and document generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Scan className="h-6 w-6" />
                    Tax Scan
                  </Button>
                  <Button className="h-20 flex flex-col gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <FileSearch className="h-6 w-6" />
                    Estate Plan
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Brain className="h-6 w-6" />
                    AI Analysis
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Target className="h-6 w-6" />
                    Risk Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <LeadSourcesManager />
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <UniversalLeadPipeline persona="advisor" isPremium={isPremium} />
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

        <TabsContent value="training" className="space-y-6">
          <BasicFeatures />
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <InAppSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
};