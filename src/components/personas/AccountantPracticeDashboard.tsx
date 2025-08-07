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
  Calculator, 
  Users, 
  FileText, 
  Upload, 
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
  CheckCircle,
  TrendingUp,
  Settings
} from "lucide-react";

export const AccountantPracticeDashboard: React.FC = () => {
  const user = null; // TODO: Connect to actual user context
  const [activeClients] = useState(89);
  const [filedReturns] = useState(156);
  const [monthlyRevenue] = useState(24500);

  const isPremium = isPremiumClient(user);

  const BasicFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client Dashboard</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">Active clients</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Document Vault</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">Secure documents stored</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tax Returns Filed</CardTitle>
          <Calculator className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filedReturns}</div>
          <p className="text-xs text-muted-foreground">This tax season</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">eSign Requests</CardTitle>
          <CheckCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">43</div>
          <p className="text-xs text-muted-foreground">Pending signatures</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">96%</div>
          <p className="text-xs text-muted-foreground">Basic compliance score</p>
        </CardContent>
      </Card>
    </div>
  );

  const PremiumFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PremiumFeatureGate
        featureName="ce-automation"
        featureLabel="CE Tracker Automation"
        featureDescription="Automated continuing education tracking and compliance management"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              CE Tracker Automation
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automated continuing education management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>CE Credits Due:</span>
                <span className="font-medium">40 by Dec 31</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">28/40</Badge>
              </div>
              <Button className="w-full">Manage CE Credits</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="lead-engine"
        featureLabel="Lead to Sales Engine"
        featureDescription="Convert prospects into clients with advanced CRM"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Lead to Sales Engine
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Advanced prospect management and conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Prospects:</span>
                <span className="font-medium text-primary">12</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-medium">31%</span>
              </div>
              <Button className="w-full">View Pipeline</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="ai-tax-scan"
        featureLabel="AI Tax Scanning"
        featureDescription="AI-powered document scanning and tax preparation automation"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Tax Scanning
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automated document processing and data extraction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Documents Processed:</span>
                <span className="font-medium">342</span>
              </div>
              <div className="flex justify-between">
                <span>Time Saved:</span>
                <span className="font-medium">24 hours</span>
              </div>
              <Button className="w-full">Process Documents</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="integrations"
        featureLabel="QuickBooks & Gusto Integration"
        featureDescription="Seamless integration with popular accounting and payroll software"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Software Integrations
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Connect with QuickBooks, Gusto, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Connected Apps:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Data Synced:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Real-time</Badge>
              </div>
              <Button className="w-full">Manage Integrations</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>
    </div>
  );

  return (
    <ResponsiveDashboard persona="cpa">
      <InAppSupport />
      <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, CPA! 
          {isPremium && <Crown className="inline h-6 w-6 ml-2 text-yellow-300" />}
        </h1>
        <p className="text-white/90">
          Your comprehensive accounting practice dashboard is ready. Manage clients, automate workflows, and grow your practice with advanced tools.
        </p>
        {!isPremium && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              <Lock className="inline h-4 w-4 mr-1" />
              You're on the Basic plan. Upgrade to Premium for CE automation, AI tax scanning, integrations, and more!
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
                    Premium CPA Plan
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    Basic CPA Plan
                  </>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPremium 
                  ? "Full access to all premium features including AI tax scanning, integrations, and advanced analytics"
                  : "Essential practice management tools. Upgrade for automation, AI features, and integrations"
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
                <p className="text-xs text-muted-foreground">+7 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tax Returns</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filedReturns}</div>
                <p className="text-xs text-muted-foreground">This season</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">All requirements met</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common accounting practice tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Add Client
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  Upload Documents
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calculator className="h-6 w-6" />
                  Prepare Return
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Send eSign
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
          <UniversalLeadPipeline persona="cpa" />
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Practice Tools</h3>
            <Badge className="bg-primary text-primary-foreground">New</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Instant Tax Scan
                </CardTitle>
                <CardDescription>AI-powered document processing and tax preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-3">Upload & Scan Documents</Button>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Extract data from tax documents automatically</p>
                  <p>• Identify missing forms and schedules</p>
                  <p>• Generate preliminary tax calculations</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Business Formation AI
                </CardTitle>
                <CardDescription>Automated business entity recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-3">Create Business Plan</Button>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Recommend optimal business structure</p>
                  <p>• Generate formation documents</p>
                  <p>• Tax optimization strategies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training & Resources
              </CardTitle>
              <CardDescription>Master your accounting practice management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Getting Started Guide
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calculator className="h-6 w-6" />
                  Tax Preparation Training
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  Compliance Best Practices
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Client Growth Strategies
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">What's Included:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Comprehensive setup videos</li>
                  <li>• Tax season workflow guides</li>
                  <li>• Client onboarding templates</li>
                  <li>• Compliance checklists and forms</li>
                  {isPremium && <li>• AI tax scanning tutorials</li>}
                  {isPremium && <li>• Integration setup guides</li>}
                  {isPremium && <li>• Advanced feature training</li>}
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
              <h3 className="text-xl font-semibold">Transform Your Accounting Practice</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upgrade to Premium for CE automation, AI-powered tax scanning, advanced integrations, 
                bulk client onboarding, and comprehensive analytics.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  CE Automation
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  AI Tax Scanning
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Integrations
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