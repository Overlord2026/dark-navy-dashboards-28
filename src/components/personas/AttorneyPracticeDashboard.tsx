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
  Scale, 
  Users, 
  FileText, 
  BookOpen, 
  Award,
  Settings,
  BarChart3,
  MessageSquare,
  Crown,
  Lock,
  Target,
  DollarSign,
  Shield,
  CheckCircle,
  TrendingUp,
  Clock,
  Briefcase
} from "lucide-react";

export const AttorneyPracticeDashboard: React.FC = () => {
  const user = null; // TODO: Connect to actual user context
  const [activeClients] = useState(67);
  const [activeCases] = useState(34);
  const [monthlyBillings] = useState(89500);

  const isPremium = isPremiumClient(user);

  const BasicFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client & Matter Dashboard</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">Active clients</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contract Library</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">456</div>
          <p className="text-xs text-muted-foreground">Documents & templates</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          <Briefcase className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCases}</div>
          <p className="text-xs text-muted-foreground">Ongoing matters</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CLE Tracking</CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18/24</div>
          <p className="text-xs text-muted-foreground">CLE hours completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Billings</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyBillings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Client Portal</CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">Active conversations</p>
        </CardContent>
      </Card>
    </div>
  );

  const PremiumFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PremiumFeatureGate
        featureName="adv-regulatory"
        featureLabel="ADV/Regulatory Automation"
        featureDescription="Automated regulatory compliance and filing management"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              ADV/Regulatory Automation
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automated compliance and regulatory management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Next Filing Due:</span>
                <span className="font-medium">March 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Compliance Status:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Current</Badge>
              </div>
              <Button className="w-full">Manage Compliance</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="lead-engine"
        featureLabel="Lead to Sales Engine"
        featureDescription="Advanced client acquisition and referral management"
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
                <span className="font-medium text-primary">9</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-medium">28%</span>
              </div>
              <Button className="w-full">View Pipeline</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="workflow-automation"
        featureLabel="Advanced Workflow Automation"
        featureDescription="Automate case management and document workflows"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Workflow Automation
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Automate case workflows and document processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Workflows:</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span>Time Saved:</span>
                <span className="font-medium">32 hours/week</span>
              </div>
              <Button className="w-full">Manage Workflows</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>

      <PremiumFeatureGate
        featureName="team-collaboration"
        featureLabel="Team Collaboration"
        featureDescription="Advanced team collaboration and case management tools"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Collaboration
              <FeatureAccessIndicator requiredTier="premium" />
            </CardTitle>
            <CardDescription>Enhanced team coordination and case sharing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Team Members:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Shared Cases:</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600">24 active</Badge>
              </div>
              <Button className="w-full">Manage Team</Button>
            </div>
          </CardContent>
        </Card>
      </PremiumFeatureGate>
    </div>
  );

  return (
    <ResponsiveDashboard persona="attorney">
      <InAppSupport />
      <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Attorney! 
          {isPremium && <Crown className="inline h-6 w-6 ml-2 text-yellow-300" />}
        </h1>
        <p className="text-white/90">
          Your comprehensive legal practice dashboard is ready. Manage cases, track compliance, and grow your practice with advanced tools.
        </p>
        {!isPremium && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              <Lock className="inline h-4 w-4 mr-1" />
              You're on the Basic plan. Upgrade to Premium for regulatory automation, advanced workflows, and team collaboration!
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
                    Premium Legal Plan
                  </>
                ) : (
                  <>
                    <Scale className="h-5 w-5 text-muted-foreground" />
                    Basic Legal Plan
                  </>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPremium 
                  ? "Full access to all premium features including regulatory automation, advanced workflows, and team collaboration"
                  : "Essential practice management tools. Upgrade for automation, advanced workflows, and compliance features"
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
                <p className="text-xs text-muted-foreground">+4 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCases}</div>
                <p className="text-xs text-muted-foreground">Ongoing matters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Billings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyBillings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CLE Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18/24</div>
                <p className="text-xs text-muted-foreground">Hours completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common legal practice tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  New Client
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Briefcase className="h-6 w-6" />
                  Open Case
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Create Document
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Clock className="h-6 w-6" />
                  Log Time
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
          <UniversalLeadPipeline persona="attorney" />
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Legal Tools</h3>
            <Badge className="bg-primary text-primary-foreground">New</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Contract Generator
                </CardTitle>
                <CardDescription>AI-powered contract and document creation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-3">Generate Contract</Button>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Create custom legal documents</p>
                  <p>• Review and analyze contracts</p>
                  <p>• Compliance checking</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Estate Plan Creator
                </CardTitle>
                <CardDescription>Automated estate planning documents</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-3">Create Estate Plan</Button>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Generate wills and trusts</p>
                  <p>• Power of attorney documents</p>
                  <p>• Estate tax planning</p>
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
              <CardDescription>Master your legal practice management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Getting Started Guide
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Briefcase className="h-6 w-6" />
                  Case Management Training
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  Compliance Best Practices
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Practice Growth Strategies
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">What's Included:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Comprehensive setup tutorials</li>
                  <li>• Case management workflows</li>
                  <li>• Client communication templates</li>
                  <li>• CLE tracking guides</li>
                  {isPremium && <li>• Advanced workflow automation</li>}
                  {isPremium && <li>• Regulatory compliance training</li>}
                  {isPremium && <li>• Team collaboration setup</li>}
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
              <h3 className="text-xl font-semibold">Elevate Your Legal Practice</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upgrade to Premium for ADV/regulatory automation, advanced workflow management, 
                team collaboration tools, and comprehensive compliance features.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Regulatory Automation
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Advanced Workflows
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Team Collaboration
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Lead Engine
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