import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Building2,
  FileCheck,
  Vault,
  Bot,
  Palette,
  BarChart3,
  HeadphonesIcon,
  Crown,
  Lock,
  ArrowUp
} from 'lucide-react';

const EliteFamilyOfficeDashboardPage: React.FC = () => {
  const basicFeatures = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Manage up to 3 client families',
      action: 'View Clients'
    },
    {
      icon: FileCheck,
      title: 'Basic Compliance',
      description: 'Basic compliance reminders and alerts',
      action: 'View Compliance'
    },
    {
      icon: Vault,
      title: 'Document Vault',
      description: 'Basic vault storage (up to 5GB)',
      action: 'Access Vault'
    },
    {
      icon: Building2,
      title: 'Marketplace Access',
      description: 'Connect with other professionals',
      action: 'Browse Marketplace'
    }
  ];

  const premiumFeatures = [
    {
      icon: Users,
      title: 'Unlimited Client Dashboards',
      description: 'Manage unlimited client families',
      locked: true
    },
    {
      icon: Building2,
      title: 'Entity Management',
      description: 'Full Business & Entity Management module',
      locked: true
    },
    {
      icon: FileCheck,
      title: 'Advanced Compliance',
      description: 'Automated state/entity deadline tracking',
      locked: true
    },
    {
      icon: Bot,
      title: 'AI Concierge',
      description: 'Task automation and intelligent assistance',
      locked: true
    },
    {
      icon: Palette,
      title: 'White-Label Branding',
      description: 'Customize platform with your brand',
      locked: true
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Portfolio and compliance scoring',
      locked: true
    },
    {
      icon: HeadphonesIcon,
      title: 'Priority VIP Support',
      description: '24/7 dedicated account management',
      locked: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Elite Family Office Dashboard</h1>
                <p className="text-sm text-muted-foreground">Command center for multi-generational wealth</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
                <Crown className="h-3 w-3 mr-1 text-amber-600" />
                <span className="text-amber-800 font-medium">Basic Plan</span>
              </Badge>
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid grid-cols-7 w-full max-w-4xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="vault">Vault</TabsTrigger>
            <TabsTrigger value="concierge">AI Concierge</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Main Dashboard */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Elite Command Center</h2>
              <p className="text-muted-foreground mb-4">
                Manage your family office operations with premium tools and advanced automation.
              </p>
              <Button variant="outline">
                Take Platform Tour
              </Button>
            </div>

            {/* Basic Features */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Your Current Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {basicFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        {feature.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Premium Features Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Premium Features</h3>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Upgrade Now
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <Card key={index} className="relative opacity-75 border-dashed">
                    <div className="absolute top-4 right-4">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg text-muted-foreground">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" className="w-full" disabled>
                        Premium Only
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="clients" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Client Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage your family office clients and their complex structures
              </p>
              <Button variant="outline">Add First Client</Button>
            </div>
          </TabsContent>

          <TabsContent value="entities" className="space-y-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Entity Management</h3>
              <p className="text-muted-foreground mb-4">
                Track complex ownership structures and entity relationships
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Premium Feature</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance Center</h3>
              <p className="text-muted-foreground mb-4">
                Stay on top of regulatory requirements and filing deadlines
              </p>
              <Button variant="outline">View Compliance Calendar</Button>
            </div>
          </TabsContent>

          <TabsContent value="vault" className="space-y-6">
            <div className="text-center py-12">
              <Vault className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Document Vault</h3>
              <p className="text-muted-foreground mb-4">
                Encrypted storage for sensitive family office documents
              </p>
              <Button variant="outline">Access Vault</Button>
            </div>
          </TabsContent>

          <TabsContent value="concierge" className="space-y-6">
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Concierge</h3>
              <p className="text-muted-foreground mb-4">
                Your intelligent assistant for task automation and coordination
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Premium Feature</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Reports</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive analytics and performance insights
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Premium Feature</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EliteFamilyOfficeDashboardPage;
