import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  Crown, 
  Users, 
  FileText, 
  CreditCard, 
  Store, 
  BarChart3, 
  Target, 
  Shield, 
  Brain, 
  Calendar, 
  Home, 
  Vault, 
  GraduationCap,
  Gift,
  TrendingUp,
  X
} from 'lucide-react';

interface ToolFeature {
  name: string;
  icon: React.ReactNode;
  description: string;
  basicIncluded: boolean;
  premiumIncluded: boolean;
  isPremiumOnly?: boolean;
}

const advisorTools: ToolFeature[] = [
  {
    name: "CRM & Client Book",
    icon: <Users className="h-5 w-5" />,
    description: "Manage clients, households, prospects, tasks",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Lead-to-Sales Engine",
    icon: <Target className="h-5 w-5" />,
    description: "Create ad campaigns, track leads, SWAG Score™",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Automated Meeting Scheduler",
    icon: <Calendar className="h-5 w-5" />,
    description: "Calendar sync, reminders, Zoom/Google Meet",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Secure Document Sharing",
    icon: <FileText className="h-5 w-5" />,
    description: "Encrypted document requests and collaboration",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Portfolio Review Generator",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "In-depth analytics, proposal builder, PDF export",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Risk Scoring & Analytics",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Portfolio risk, risk/return, alternative models",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Tax Return Scanner",
    icon: <FileText className="h-5 w-5" />,
    description: "Scan client tax returns, instant insights",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Estate Plan Creator",
    icon: <Shield className="h-5 w-5" />,
    description: "On-demand estate docs, workflow, e-signature",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Billing & Subscription",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Client invoicing, Stripe integration, audit trail",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Compliance Center",
    icon: <Shield className="h-5 w-5" />,
    description: "ADV automation, CE credits, audit logs",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Business Practice Mgmt",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Track tasks, workflows, performance dashboards",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "AI Copilot (Linda, voice AI)",
    icon: <Brain className="h-5 w-5" />,
    description: "Meeting confirmations, AI summaries, reminders",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Family Collaboration Portal",
    icon: <Users className="h-5 w-5" />,
    description: "Invite family, assign tasks, view joint docs",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Marketplace & VIP Wall",
    icon: <Store className="h-5 w-5" />,
    description: "Connect with accountants, attorneys, insurance",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Referral & Rewards",
    icon: <Gift className="h-5 w-5" />,
    description: "Track client referrals, credits, leaderboard",
    basicIncluded: true,
    premiumIncluded: true
  },
  {
    name: "Marketing Campaigns",
    icon: <Target className="h-5 w-5" />,
    description: "Bulk invites, VIP onboarding, analytics",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Properties/Entity Mgmt",
    icon: <Home className="h-5 w-5" />,
    description: "Link client assets to LLCs, track ownership",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Secure Family Vault",
    icon: <Vault className="h-5 w-5" />,
    description: "Access, store, and collaborate on vault docs",
    basicIncluded: false,
    premiumIncluded: true,
    isPremiumOnly: true
  },
  {
    name: "Education Hub",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "White-labeled guides, videos, client assignments",
    basicIncluded: true,
    premiumIncluded: true
  }
];

interface AdvisorToolsInventoryProps {
  onUpgradeToPremium: () => void;
}

export function AdvisorToolsInventory({ onUpgradeToPremium }: AdvisorToolsInventoryProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const basicTools = advisorTools.filter(tool => tool.basicIncluded);
  const premiumOnlyTools = advisorTools.filter(tool => tool.isPremiumOnly);

  const renderToolCard = (tool: ToolFeature, isPremium: boolean = false) => (
    <Card key={tool.name} className={`${isPremium ? 'border-primary/40 bg-primary/5' : 'border-border'} transition-colors hover:border-primary/60`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tool.icon}
            <CardTitle className="text-base">{tool.name}</CardTitle>
          </div>
          {isPremium && <Crown className="h-4 w-4 text-primary" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm">{tool.description}</CardDescription>
        {isPremium && (
          <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary">
            Premium Only
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  const renderTableRow = (tool: ToolFeature) => (
    <tr key={tool.name} className="border-b">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {tool.icon}
          <div>
            <div className="font-medium">{tool.name}</div>
            <div className="text-sm text-muted-foreground">{tool.description}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        {tool.basicIncluded ? (
          <Check className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground mx-auto" />
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {tool.premiumIncluded ? (
          <Check className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground mx-auto" />
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Your Complete Advisor Toolkit</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to run a modern advisory practice. Start with Basic features, 
          then unlock Premium tools to supercharge your growth.
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'cards' ? (
        <div className="space-y-8">
          {/* Basic Tools */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold">Basic Features</h3>
              <Badge variant="outline">Included Free</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {basicTools.map(tool => renderToolCard(tool))}
            </div>
          </div>

          {/* Premium Tools */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold">Premium Features</h3>
              <Badge className="bg-primary text-primary-foreground">
                <Crown className="h-3 w-3 mr-1" />
                Premium Only
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumOnlyTools.map(tool => renderToolCard(tool, true))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="text-center py-3 px-4 font-semibold">Basic</th>
                <th className="text-center py-3 px-4 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    Premium
                    <Crown className="h-4 w-4 text-primary" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {advisorTools.map(tool => renderTableRow(tool))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upsell Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Ready to Supercharge Your Practice?</CardTitle>
              <CardDescription className="text-base">
                Unlock Premium features and win more clients with advanced tools, AI assistance, and automation
              </CardDescription>
            </div>
            <Crown className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onUpgradeToPremium} className="gap-2">
              <Crown className="h-4 w-4" />
              Start 30-Day Free Trial
            </Button>
            <Button variant="outline">Learn More About Premium</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}