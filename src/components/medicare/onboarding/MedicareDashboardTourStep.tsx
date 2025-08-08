import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  PhoneCall, 
  Users, 
  TrendingUp, 
  FileText, 
  BarChart3,
  Crown,
  Lock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const MedicareDashboardTourStep = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const basicCards = [
    {
      icon: <PhoneCall className="h-6 w-6 text-blue-600" />,
      title: "Compliance Call Recorder",
      description: "Initiate, record, and store CMS-compliant calls",
      features: ["One-click recording", "Automatic timestamps", "Secure storage"]
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "Secure Client Vault",
      description: "Store CMS-required documents and recordings",
      features: ["Medicare compliance folders", "Document categorization", "Search functionality"]
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Lead Dashboard",
      description: "Track leads and their status through your pipeline",
      features: ["Lead status tracking", "Contact management", "Follow-up reminders"]
    },
    {
      icon: <FileText className="h-6 w-6 text-amber-600" />,
      title: "Education Hub",
      description: "Medicare basics and BFO resources for clients",
      features: ["Medicare guides", "Plan comparisons", "Educational videos"]
    }
  ];

  const premiumCards = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      title: "Advanced Compliance Analytics",
      description: "Call transcription and keyword flagging",
      features: ["AI transcription", "Compliance scoring", "Keyword alerts"],
      premium: true
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      title: "AI Filing Helper",
      description: "Automated compliance form completion",
      features: ["Smart form filling", "Error detection", "Submission tracking"],
      premium: true
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: "Lead-to-Sales Marketing Engine",
      description: "Multi-channel automation and campaigns",
      features: ["Email automation", "SMS campaigns", "LinkedIn outreach"],
      premium: true
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      title: "Campaign Analytics",
      description: "Track ROI and performance metrics",
      features: ["ROI calculations", "Open/click rates", "Lead attribution"],
      premium: true
    },
    {
      icon: <Users className="h-6 w-6 text-amber-600" />,
      title: "Marketplace Integration",
      description: "Direct client and advisor referrals",
      features: ["Referral network", "Cross-selling", "Professional connections"],
      premium: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Dashboard Tour</h2>
        <p className="text-lg text-muted-foreground">
          Explore your Medicare compliance and growth tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Plan Features</TabsTrigger>
          <TabsTrigger value="premium">Premium Plan Features</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="text-center mb-6">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
              Basic Plan - Free
            </Badge>
            <h3 className="text-2xl font-semibold">Essential Compliance Tools</h3>
            <p className="text-muted-foreground">
              Everything you need to stay CMS compliant and manage your clients
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {basicCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {card.icon}
                    <span>{card.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{card.description}</p>
                  <ul className="space-y-2">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="text-center mb-6">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-4">
              <Crown className="h-3 w-3 mr-1" />
              Premium Plan
            </Badge>
            <h3 className="text-2xl font-semibold">Advanced Growth & Automation</h3>
            <p className="text-muted-foreground">
              Unlock the full power of Medicare compliance automation and marketing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {premiumCards.map((card, index) => (
              <Card 
                key={index} 
                className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {card.icon}
                    <span className="text-sm">{card.title}</span>
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit bg-yellow-100 text-yellow-800">
                    Premium
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">{card.description}</p>
                  <ul className="space-y-2">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <Crown className="h-3 w-3 text-yellow-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upgrade CTA */}
          <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-8 text-center">
              <Crown className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Ready to unlock Premium features?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Upgrade to Premium and get access to advanced analytics, AI-powered tools, 
                marketing automation, and dedicated support to grow your Medicare business.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                  Upgrade to Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dashboard Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Dashboard Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Medicare Compliance Hub</h4>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            </div>
            
            <div className="grid gap-3 md:grid-cols-5 text-sm">
              {['Compliance Center', 'Secure Vault', 'Client CRM', 'Marketing Engine', 'Team Management'].map((tab, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded text-center ${
                    idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-white border'
                  }`}
                >
                  {tab}
                  {idx >= 3 && (
                    <Lock className="h-3 w-3 inline ml-1 opacity-50" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              Premium features are locked until upgrade
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Ready to Start Your Medicare Business?</h3>
          <p className="text-muted-foreground mb-6">
            Your compliance-ready workspace is set up and ready to go. 
            Start with Basic features and upgrade to Premium anytime.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Schedule Training Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};