import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  Megaphone, 
  FileText, 
  Target, 
  Shield, 
  Filter, 
  AlertTriangle,
  Play,
  Search,
  DollarSign,
  BarChart3,
  Users,
  Calendar,
  Upload,
  UserPlus,
  Download,
  CheckCircle
} from 'lucide-react';

const brandTools = [
  {
    key: 'campaign-builder',
    title: 'Campaign Builder',
    description: 'Create compliant campaigns with templates and automation',
    icon: Megaphone,
    route: '/tools/campaign-builder',
    status: 'ready'
  },
  {
    key: 'brief-templates',
    title: 'Brief Templates',
    description: 'Professional campaign briefs with FTC compliance built-in',
    icon: FileText,
    route: '/tools/brief-templates',
    status: 'ready'
  },
  {
    key: 'offer-creation',
    title: 'Offer Creation',
    description: 'Structure offers with automatic compliance checks',
    icon: Target,
    route: '/tools/offer-creation',
    status: 'ready'
  },
  {
    key: 'escrow-tax',
    title: 'Escrow + Tax Automation',
    description: 'Automated payments and tax compliance for campaigns',
    icon: DollarSign,
    route: '/tools/escrow-tax',
    status: 'ready'
  },
  {
    key: 'discovery-filters',
    title: 'Discovery Filters',
    description: 'Find talent by sport, region, engagement metrics',
    icon: Search,
    route: '/tools/discovery-filters',
    status: 'ready'
  },
  {
    key: 'compliance-ftc',
    title: 'FTC Guardrails',
    description: 'Real-time compliance checking and documentation',
    icon: Shield,
    route: '/tools/compliance-ftc',
    status: 'ready'
  }
];

const quickActions = [
  { label: 'Create Brief', route: '/brand/brief', icon: FileText, description: 'Start a new campaign brief' },
  { label: 'Find Athletes', route: '/brand/athletes', icon: Users, description: 'Browse athlete index' },
  { label: 'Upload Brand Kit', route: '/brand/assets', icon: Upload, description: 'Manage brand assets' },
  { label: 'Invite Team', route: '/brand/team', icon: UserPlus, description: 'Add team members' },
  { label: 'Export Campaign', route: '/brand/export', icon: Download, description: 'Download campaign pack' }
];

interface BrandHubProps {
  segment?: 'enterprise' | 'local-business';
}

export function BrandHub({ segment = 'enterprise' }: BrandHubProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  
  const isEnterprise = segment === 'enterprise';
  
  useEffect(() => {
    // Check for onboarding data
    const locationState = location.state as any;
    if (locationState?.selectedTemplate) {
      setSelectedTemplate(locationState.selectedTemplate);
      setOnboardingData(locationState.onboardingData);
      
      // Show welcome toast
      toast({
        title: "Welcome to your brand workspace!",
        description: `Your ${locationState.selectedTemplate.replace('-', ' ')} template is ready to customize.`,
      });
    }
  }, [location]);
  
  const segmentTitle = isEnterprise ? 'Enterprise Brand Hub' : 'Local Business Hub';
  const segmentDescription = isEnterprise 
    ? 'Scale campaigns across markets with compliance automation and performance tracking'
    : 'Launch local campaigns fast—templates, compliance checks, and payments in one place';

  const handleDemoOpen = () => {
    navigate(`/demos/brand-${segment}`);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('brand.quickAction.click', { 
        label: action.label,
        route: action.route 
      });
    }
    
    navigate(action.route);
  };

  return (
    <>
      <Helmet>
        <title>{segmentTitle} Campaign Hub | Family Office Marketplace</title>
        <meta name="description" content={segmentDescription} />
        <meta name="keywords" content="brand campaigns, influencer marketing, FTC compliance, campaign automation" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{segmentTitle} Hub</h1>
                  <p className="text-muted-foreground">{segmentDescription}</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {isEnterprise ? 'Enterprise' : 'Local Business'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleDemoOpen}>
                  <Play className="w-4 h-4 mr-2" />
                  60-sec Demo
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-all group"
                    onClick={() => handleQuickAction(action)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-5 h-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Pipeline Status */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Campaign Pipeline</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Current Campaign Status</h3>
                  {selectedTemplate && (
                    <Badge variant="outline">{selectedTemplate.replace('-', ' ')} Template</Badge>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { step: 'Brief', status: selectedTemplate ? 'complete' : 'pending', icon: FileText },
                    { step: 'Offer', status: 'pending', icon: Target },
                    { step: 'Approvals', status: 'pending', icon: CheckCircle },
                    { step: 'e-Sign', status: 'pending', icon: FileText },
                    { step: 'Payment', status: 'pending', icon: DollarSign }
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          item.status === 'complete' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-medium">{item.step}</div>
                        <Badge 
                          variant={item.status === 'complete' ? 'default' : 'secondary'}
                          className="text-xs mt-1"
                        >
                          {item.status === 'complete' ? 'Done' : 'Pending'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Campaign Tools */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Campaign Management Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Card 
                    key={tool.key}
                    className="cursor-pointer hover:shadow-md transition-all group"
                    onClick={() => navigate(tool.route)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {tool.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            {tool.status === 'ready' ? 'Ready' : 'Coming Soon'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* FTC Compliance Banner */}
          <section>
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      FTC Disclosure Required
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                      All paid partnerships must include proper FTC disclosures. Our compliance tools automatically generate required disclaimers and log proof slips.
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Analytics - FTC compliance click
                          if (typeof window !== 'undefined' && (window as any).analytics) {
                            (window as any).analytics.track('proof.created', { 
                              type: 'ftc-disclosure-banner' 
                            });
                          }
                          navigate('/brand/compliance');
                        }}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300"
                      >
                        Generate FTC Disclosure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Analytics - export click
                          if (typeof window !== 'undefined' && (window as any).analytics) {
                            (window as any).analytics.track('export.pack', { 
                              type: 'campaign-pack-csv-docs' 
                            });
                          }
                          navigate('/brand/export');
                        }}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300"
                      >
                        Export Campaign Pack
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}