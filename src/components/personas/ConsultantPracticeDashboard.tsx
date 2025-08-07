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
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3,
  Award,
  Target,
  Crown,
  Lock,
  DollarSign,
  Shield,
  TrendingUp,
  Calendar,
  FileText,
  Brain,
  Settings,
  Heart,
  Stethoscope
} from "lucide-react";

export const ConsultantPracticeDashboard: React.FC = () => {
  const user = null; // TODO: Connect to actual user context
  const [activeClients] = useState(28);
  const [activeProjects] = useState(15);
  const [monthlyRevenue] = useState(32500);

  const isPremium = isPremiumClient(user);

  const BasicFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Dashboard</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">Active clients</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resource Library</CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">234</div>
          <p className="text-xs text-muted-foreground">Practice resources</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">Ongoing engagements</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Secure Messaging</CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">47</div>
          <p className="text-xs text-muted-foreground">Active conversations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+18% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagement Analytics</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94%</div>
          <p className="text-xs text-muted-foreground">Client satisfaction</p>
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
                <span className="font-medium text-primary">14</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-medium">35%</span>
              </div>
              <Button className="w-full">View Pipeline</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="bulk-invite"
        featureLabel="Bulk Portal Creation"
        featureDescription="Create multiple client portals and invitations at once"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Bulk Portal Creation
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Scale client onboarding with bulk operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Portals Created:</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span>Active Invitations:</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600">12 pending</Badge>
              </div>
              <Button className="w-full">Bulk Operations</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="campaign-analytics"
        featureLabel="Campaign Analytics"
        featureDescription="Advanced marketing campaign tracking and analytics"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Campaign Analytics
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Track marketing performance and ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Campaigns:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span>Engagement Rate:</span>
                <span className="font-medium">24%</span>
              </div>
              <Button className="w-full">View Analytics</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="ce-tracker"
        featureLabel="CE/CME/CLE Tracker"
        featureDescription="Continuing education tracking for various professional certifications"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              CE/CME/CLE Tracker
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automated continuing education management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Credits Required:</span>
                <span className="font-medium">30 annually</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">22/30</Badge>
              </div>
              <Button className="w-full">Manage Credits</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>
    </div>
  );

  return (
    <ResponsiveDashboard persona="consultant">
      <InAppSupport />
      <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Welcome back, Consultant! 
          {isPremium && <Crown className="inline h-6 w-6 ml-2 text-yellow-300" />}
        </h1>
        <p className="text-white/90">
          Your comprehensive practice dashboard is ready. Manage clients, track outcomes, and grow your consulting or healthcare practice with advanced tools.
        </p>
        {!isPremium && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              <Lock className="inline h-4 w-4 mr-1" />
              You're on the Basic plan. Upgrade to Premium for lead engine, bulk operations, CE tracking, and analytics!
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
                    Premium Consultant Plan
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-5 w-5 text-muted-foreground" />
                    Basic Consultant Plan
                  </>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPremium 
                  ? "Full access to all premium features including lead engine, bulk operations, CE tracking, and advanced analytics"
                  : "Essential practice management tools. Upgrade for advanced client acquisition, automation, and analytics"
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
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeClients}</div>
                <p className="text-xs text-muted-foreground">+6 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">Ongoing engagements</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+18% growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Client satisfaction</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common consulting practice tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Add Client
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Create Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Send Message
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

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training & Resources
              </CardTitle>
              <CardDescription>Master your consulting practice management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Getting Started Guide
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Client Management Training
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Outcome Tracking
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Practice Growth Strategies
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">What's Included:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Practice setup and configuration</li>
                  <li>• Client onboarding workflows</li>
                  <li>• Outcome measurement tools</li>
                  <li>• Communication best practices</li>
                  {isPremium && <li>• Advanced lead generation techniques</li>}
                  {isPremium && <li>• Bulk operation tutorials</li>}
                  {isPremium && <li>• Analytics and reporting training</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <LeadSourcesManager />
          <UniversalLeadPipeline persona="consultant" />
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Treatment Plan AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Plan</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA for Basic Users */}
      {!isPremium && (
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Crown className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Scale Your Consulting Practice</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upgrade to Premium for advanced lead generation, bulk client operations, 
                CE/CME tracking, campaign analytics, and premium outcome analytics.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Lead Engine
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Bulk Operations
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  CE Tracking
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Advanced Analytics
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