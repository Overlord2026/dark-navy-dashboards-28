import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Calculator, 
  Download, 
  Video, 
  Users, 
  AlertTriangle,
  FileText,
  Crown,
  CheckCircle,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { ResidencyAssessment } from '@/components/residency/ResidencyAssessment';
import { StateGuides } from '@/components/residency/StateGuides';
import { WebinarHub } from '@/components/residency/WebinarHub';
import { AdvisorMarketplace } from '@/components/residency/AdvisorMarketplace';
import { AuditRiskAnalyzer } from '@/components/residency/AuditRiskAnalyzer';
import { RelocationConcierge } from '@/components/residency/RelocationConcierge';

export default function ResidencyOptimization() {
  const [activeTab, setActiveTab] = useState('assessment');
  const { checkFeatureAccess } = useSubscriptionAccess();

  const features = [
    {
      id: 'assessment',
      title: 'Residency Assessment',
      description: 'Verify your true state residency status',
      icon: CheckCircle,
      free: true
    },
    {
      id: 'guides',
      title: 'State Guides',
      description: 'Downloadable residency checklists',
      icon: FileText,
      free: true
    },
    {
      id: 'webinars',
      title: 'Seminars & Webinars',
      description: 'Live and recorded educational content',
      icon: Video,
      free: true
    },
    {
      id: 'advisors',
      title: 'Advisor Marketplace',
      description: 'Connect with residency specialists',
      icon: Users,
      free: false
    },
    {
      id: 'audit-risk',
      title: 'Audit Risk Analyzer',
      description: 'AI-powered risk assessment',
      icon: Shield,
      free: false
    },
    {
      id: 'concierge',
      title: 'Relocation Concierge',
      description: 'Premium relocation services',
      icon: Crown,
      free: false
    }
  ];

  const popularStates = [
    { name: 'Florida', savings: '$15,000+', icon: '🌴' },
    { name: 'Texas', savings: '$12,000+', icon: '🤠' },
    { name: 'Tennessee', savings: '$8,000+', icon: '🎸' },
    { name: 'Nevada', savings: '$10,000+', icon: '🎰' },
    { name: 'Wyoming', savings: '$7,500+', icon: '🏔️' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Residency & Relocation Hub</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Optimize your state residency for maximum tax savings and compliance. 
          Complete guides, tools, and expert connections for successful relocation.
        </p>
        
        {/* Popular States */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {popularStates.map((state) => (
            <Card key={state.name} className="text-center p-4">
              <div className="text-2xl mb-2">{state.icon}</div>
              <div className="font-semibold">{state.name}</div>
              <div className="text-sm text-green-600 font-medium">
                Save {state.savings}/year
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const hasAccess = feature.free || checkFeatureAccess('residency_optimization');
            
            return (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex flex-col gap-1 p-3"
                disabled={!hasAccess}
              >
                <div className="flex items-center gap-1">
                  <Icon className="h-4 w-4" />
                  {!feature.free && <Crown className="h-3 w-3 text-primary" />}
                </div>
                <span className="text-xs">{feature.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="assessment">
          <ResidencyAssessment />
        </TabsContent>

        <TabsContent value="guides">
          <StateGuides />
        </TabsContent>

        <TabsContent value="webinars">
          <WebinarHub />
        </TabsContent>

        <TabsContent value="advisors">
          <AdvisorMarketplace />
        </TabsContent>

        <TabsContent value="audit-risk">
          <AuditRiskAnalyzer />
        </TabsContent>

        <TabsContent value="concierge">
          <RelocationConcierge />
        </TabsContent>
      </Tabs>

      {/* Quick Start CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Start Your Residency Optimization Today</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take our free assessment to discover your potential tax savings and compliance gaps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setActiveTab('assessment')}>
              <Calculator className="h-5 w-5 mr-2" />
              Take Free Assessment
            </Button>
            <Button variant="outline" size="lg" onClick={() => setActiveTab('guides')}>
              <Download className="h-5 w-5 mr-2" />
              Download State Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}