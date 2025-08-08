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
  ArrowRight,
  Bot,
  Network,
  Bell
} from 'lucide-react';

export const InsuranceDashboardTourStep = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const basicCards = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: "Client Policy Vault",
      description: "View and share insurance documents securely",
      features: ["Policy storage", "Document sharing", "Benefits summaries"]
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      title: "Basic CRM",
      description: "Client contact information and policy tracking",
      features: ["Contact management", "Policy tracking", "Basic notes"]
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-purple-600" />,
      title: "Medicare Call Recording",
      description: "Basic call recording and storage for compliance",
      features: ["Call recording", "Basic storage", "Compliance timestamps"]
    },
    {
      icon: <Network className="h-6 w-6 text-amber-600" />,
      title: "Marketplace Access",
      description: "Search and connect with other professionals",
      features: ["Professional search", "Basic messaging", "Referral tracking"]
    }
  ];

  const premiumCards = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Advanced Medicare Compliance Suite",
      description: "Multi-year archive with AI transcript search",
      features: ["AI transcription", "Advanced search", "Compliance scoring"],
      premium: true
    },
    {
      icon: <Bot className="h-6 w-6 text-green-600" />,
      title: "AI Sales Copilot",
      description: "Call prep, objection handling, follow-up automation",
      features: ["Call preparation", "Real-time guidance", "Automated follow-ups"],
      premium: true
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: "Lead-to-Sales Engine",
      description: "Campaign builder, lead scoring, and analytics",
      features: ["Campaign automation", "Lead scoring", "ROI tracking"],
      premium: true
    },
    {
      icon: <Bell className="h-6 w-6 text-purple-600" />,
      title: "Automated Renewal Reminders",
      description: "Client education campaigns and renewal automation",
      features: ["Smart reminders", "Educational content", "Renewal tracking"],
      premium: true
    },
    {
      icon: <Crown className="h-6 w-6 text-amber-600" />,
      title: "Premium Marketplace Placement",
      description: "Featured placement in professional searches",
      features: ["Priority listing", "Enhanced profile", "Advanced analytics"],
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
          Explore your Insurance + Medicare professional workspace
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
            <h3 className="text-2xl font-semibold">Essential Insurance & Medicare Tools</h3>
            <p className="text-muted-foreground">
              Everything you need to manage clients, stay compliant, and grow your business
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

          <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200">
            <CardContent className="p-6 text-center">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">
                Ready to Start Your Insurance Business?
              </h4>
              <p className="text-blue-700 mb-4">
                Your basic compliance and client management tools are ready to use. 
                Start serving clients and upgrade to Premium anytime for advanced features.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started with Basic Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="text-center mb-6">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-4">
              <Crown className="h-3 w-3 mr-1" />
              Premium Plan
            </Badge>
            <h3 className="text-2xl font-semibold">Advanced Growth & Automation Tools</h3>
            <p className="text-muted-foreground">
              Unlock the full power of insurance sales automation and professional networking
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
                Upgrade to Premium and get access to AI-powered sales tools, advanced compliance features, 
                marketing automation, and priority marketplace placement to grow your insurance business faster.
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
              <h4 className="font-semibold">Insurance + Medicare Hub</h4>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            </div>
            
            <div className="grid gap-3 md:grid-cols-6 text-sm">
              {['Policy Vault', 'Client CRM', 'Call Recording', 'Marketplace', 'AI Copilot', 'Analytics'].map((tab, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded text-center ${
                    idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-white border'
                  }`}
                >
                  {tab}
                  {idx >= 4 && (
                    <Lock className="h-3 w-3 inline ml-1 opacity-50" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              Premium features (AI Copilot, Analytics) are locked until upgrade
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Ready to Launch Your Insurance Business?</h3>
          <p className="text-muted-foreground mb-6">
            Your compliance-ready workspace is set up with client management, call recording, 
            and marketplace access. Start with Basic features and upgrade to Premium anytime.
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