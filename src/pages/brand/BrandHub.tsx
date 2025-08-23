import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
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
  Calendar
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
  { label: 'Start New Campaign', route: '/tools/campaign-builder', icon: Megaphone },
  { label: 'Browse Talent', route: '/tools/discovery-filters', icon: Users },
  { label: 'Check Compliance', route: '/tools/compliance-ftc', icon: Shield },
  { label: 'View Analytics', route: '/brand/analytics', icon: BarChart3 },
  { label: 'Schedule Content', route: '/brand/schedule', icon: Calendar }
];

interface BrandHubProps {
  segment?: 'enterprise' | 'local-business';
}

export function BrandHub({ segment = 'enterprise' }: BrandHubProps) {
  const navigate = useNavigate();
  const isEnterprise = segment === 'enterprise';
  
  const segmentTitle = isEnterprise ? 'Enterprise Brand' : 'Local Business';
  const segmentDescription = isEnterprise 
    ? 'Scale campaigns across markets with compliance automation and performance tracking'
    : 'Launch local campaigns fast—templates, compliance checks, and payments in one place';

  const handleDemoOpen = () => {
    navigate(`/demos/brand-${segment}`);
  };

  const handleToolClick = (tool: typeof brandTools[0]) => {
    navigate(tool.route);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                    onClick={() => handleToolClick(tool)}
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

          {/* Compliance Notice */}
          <section>
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      FTC Compliance Required
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                      All campaigns must comply with FTC guidelines for paid partnerships and endorsements. 
                      Our tools automatically check for required disclosures and documentation.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/tools/compliance-ftc')}
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300"
                    >
                      Learn More About Compliance
                    </Button>
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