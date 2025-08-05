import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Shield, 
  Palette, 
  Globe, 
  Gift,
  Star,
  CheckCircle
} from 'lucide-react';

interface EnterpriseFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'premium' | 'coming_soon';
  category: 'compliance' | 'branding' | 'management' | 'benefits';
}

const enterpriseFeatures: EnterpriseFeature[] = [
  {
    title: 'White Label Branding',
    description: 'Customize the platform with your firm\'s branding, colors, and logo',
    icon: <Palette className="w-5 h-5" />,
    status: 'premium',
    category: 'branding'
  },
  {
    title: 'Compliance Management',
    description: 'Built-in compliance tools for broker-dealers and RIAs',
    icon: <Shield className="w-5 h-5" />,
    status: 'available',
    category: 'compliance'
  },
  {
    title: 'Multi-Firm Management',
    description: 'Manage multiple firms and their respective client bases',
    icon: <Building2 className="w-5 h-5" />,
    status: 'available',
    category: 'management'
  },
  {
    title: 'Employee Benefits Platform',
    description: 'Offer as a benefit to employees and their families',
    icon: <Gift className="w-5 h-5" />,
    status: 'available',
    category: 'benefits'
  },
  {
    title: 'Custom Domain',
    description: 'Host the platform on your own domain',
    icon: <Globe className="w-5 h-5" />,
    status: 'premium',
    category: 'branding'
  },
  {
    title: 'Advanced Analytics',
    description: 'Detailed reporting and analytics for firm performance',
    icon: <Star className="w-5 h-5" />,
    status: 'coming_soon',
    category: 'management'
  }
];

export const EnterpriseFeatures = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFeatures = selectedCategory === 'all' 
    ? enterpriseFeatures 
    : enterpriseFeatures.filter(feature => feature.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>;
      case 'premium':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Premium</Badge>;
      case 'coming_soon':
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Enterprise Solutions</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive tools for broker-dealers, RIAs, and enterprise firms to serve their clients at scale
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  {feature.status === 'available' && (
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Compliance & Regulatory Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Broker-Dealer Compliance</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>FINRA compliance monitoring</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Communication oversight</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Advertising approval workflows</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">RIA Compliance</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>SEC/State registration support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Fiduciary standard adherence</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Form ADV integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>White Label Customization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Visual Branding</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom logo and favicon</li>
                    <li>• Brand color palette</li>
                    <li>• Custom fonts and typography</li>
                    <li>• Branded email templates</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Domain & Hosting</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom domain setup</li>
                    <li>• SSL certificate management</li>
                    <li>• CDN optimization</li>
                    <li>• White-label URL structure</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  Request Branding Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Employee Benefits Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Offer comprehensive family financial wellness as an employee benefit, 
                increasing retention and satisfaction while demonstrating your commitment to employee wellbeing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">For HR Departments</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Easy enrollment process</li>
                    <li>• Usage analytics</li>
                    <li>• Wellness reporting</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">For Employees</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Family financial planning</li>
                    <li>• Professional advisor access</li>
                    <li>• Educational resources</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">For Companies</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Improved retention</li>
                    <li>• Enhanced benefits package</li>
                    <li>• Tax advantages</li>
                  </ul>
                </Card>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="mr-4">
                  View Pricing
                </Button>
                <Button>
                  Talk to Benefits Specialist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};