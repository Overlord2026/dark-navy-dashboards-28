import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Shield, 
  Building, 
  Crown,
  ArrowRight,
  CheckCircle,
  Workflow,
  Clock,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { useEntitlements } from '@/context/EntitlementsContext';

const estatePlanningWorkflows = [
  {
    icon: FileText,
    title: 'Estate Document Suite',
    description: 'Comprehensive will, trust, and power of attorney document generation and management',
    tier: 'premium'
  },
  {
    icon: Users,
    title: 'Family Governance',
    description: 'Multi-generational wealth transfer planning and family meeting coordination',
    tier: 'elite'
  },
  {
    icon: Shield,
    title: 'Asset Protection',
    description: 'Sophisticated structures to protect wealth from creditors and litigation',
    tier: 'elite'
  },
  {
    icon: Building,
    title: 'Trust Administration',
    description: 'Ongoing trust management, reporting, and beneficiary coordination',
    tier: 'premium'
  },
  {
    icon: Scale,
    title: 'Tax-Efficient Transfers',
    description: 'Minimize estate and gift taxes through strategic wealth transfer techniques',
    tier: 'premium'
  },
  {
    icon: Workflow,
    title: 'Succession Planning',
    description: 'Business succession and leadership transition planning for family enterprises',
    tier: 'elite'
  }
];

const workflowSteps = [
  {
    step: '01',
    title: 'Initial Assessment',
    description: 'Comprehensive review of your current estate plan and family objectives'
  },
  {
    step: '02',
    title: 'Strategy Development',
    description: 'Custom estate planning strategy tailored to your wealth and family structure'
  },
  {
    step: '03',
    title: 'Document Preparation',
    description: 'Professional drafting of all necessary legal documents and structures'
  },
  {
    step: '04',
    title: 'Implementation',
    description: 'Coordinate with attorneys, accountants, and other professionals'
  },
  {
    step: '05',
    title: 'Ongoing Management',
    description: 'Regular reviews and updates to ensure plan remains optimal'
  }
];

export default function EstatePlanningPage() {
  const navigate = useNavigate();
  const { plan: currentPlan } = useEntitlements();

  useEffect(() => {
    analytics.track('solution.estate_planning.viewed', {
      current_plan: currentPlan,
      timestamp: Date.now()
    });
  }, [currentPlan]);

  const handleUpgrade = (targetPlan: 'premium' | 'elite') => {
    analytics.track('solution.estate_planning.upgrade_cta', {
      target_plan: targetPlan,
      current_plan: currentPlan,
      source: 'estate_planning_page'
    });
    navigate(`/pricing?plan=${targetPlan}&feature=estate_advanced`);
  };

  const isFeatureAvailable = (tier: string) => {
    if (tier === 'premium') return ['premium', 'elite'].includes(currentPlan);
    if (tier === 'elite') return currentPlan === 'elite';
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Shield className="h-3 w-3 mr-1" />
            Estate Planning Solutions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive Estate Planning & Wealth Transfer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Protect and transfer your wealth across generations with sophisticated estate planning strategies 
            designed for high-net-worth families.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Estate Planning Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-primary">{step.step}</span>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {estatePlanningWorkflows.map((feature, index) => {
            const Icon = feature.icon;
            const available = isFeatureAvailable(feature.tier);
            
            return (
              <Card 
                key={index}
                className={`relative ${!available ? 'opacity-75' : ''}`}
              >
                {!available && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Crown className="h-3 w-3 mr-1" />
                      {feature.tier === 'premium' ? 'Premium' : 'Elite'}
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* What's Included */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Complete Estate Planning Suite</CardTitle>
            <CardDescription className="text-lg">
              Everything you need to protect and transfer your wealth
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">Premium Features</h4>
                <div className="space-y-2">
                  {[
                    'Will and trust document generation',
                    'Power of attorney setup',
                    'Healthcare directive management',
                    'Beneficiary designation tracking',
                    'Estate tax planning',
                    'Charitable giving strategies'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-purple-700">Elite Features</h4>
                <div className="space-y-2">
                  {[
                    'Advanced trust structures (GRAT, CRUT, etc.)',
                    'Family limited partnerships',
                    'Dynasty trust planning',
                    'Asset protection strategies',
                    'International estate planning',
                    'Business succession planning'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Crown className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA Section */}
        {currentPlan === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-100 text-blue-700">Premium Plan</Badge>
                <CardTitle className="text-xl">Essential Estate Planning</CardTitle>
                <CardDescription>
                  Core estate planning tools for growing families
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">$99<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Estate document suite
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Trust administration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tax-efficient transfers
                  </li>
                </ul>
                <Button 
                  onClick={() => handleUpgrade('premium')}
                  className="w-full"
                >
                  Upgrade to Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-purple-100 text-purple-700">Elite Plan</Badge>
                <CardTitle className="text-xl">Advanced Estate Solutions</CardTitle>
                <CardDescription>
                  Sophisticated planning for complex wealth structures
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">$299<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    All Premium features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Family governance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Asset protection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Succession planning
                  </li>
                </ul>
                <Button 
                  onClick={() => handleUpgrade('elite')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Upgrade to Elite
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentPlan === 'premium' && (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 text-center mb-12">
            <CardContent className="pt-6">
              <Crown className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">Unlock Elite Estate Planning</h3>
              <p className="text-muted-foreground mb-4">
                Access family governance, asset protection, and advanced wealth transfer strategies
              </p>
              <Button 
                onClick={() => handleUpgrade('elite')}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Upgrade to Elite - $299/month
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Already on Elite */}
        {currentPlan === 'elite' && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-center mb-12">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">You Have Full Access!</h3>
              <p className="text-muted-foreground mb-4">
                All advanced estate planning features are available in your Elite plan
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}