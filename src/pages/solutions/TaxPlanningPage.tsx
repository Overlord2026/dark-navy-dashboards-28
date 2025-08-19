import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  TrendingDown, 
  Shield, 
  Clock, 
  Crown,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { useEntitlements } from '@/context/EntitlementsContext';

const taxPlanningFeatures = [
  {
    icon: Calculator,
    title: 'Tax Optimization Analysis',
    description: 'Advanced modeling to minimize your tax burden across federal, state, and local jurisdictions',
    tier: 'premium'
  },
  {
    icon: FileText,
    title: 'Multi-Entity Tax Planning',
    description: 'Coordinate tax strategies across trusts, LLCs, and other business entities',
    tier: 'elite'
  },
  {
    icon: TrendingDown,
    title: 'Tax Loss Harvesting',
    description: 'Automated identification of opportunities to offset gains with strategic losses',
    tier: 'premium'
  },
  {
    icon: Shield,
    title: 'Audit Protection',
    description: 'Comprehensive documentation and support for tax positions and strategies',
    tier: 'elite'
  },
  {
    icon: Clock,
    title: 'Year-Round Planning',
    description: 'Quarterly reviews and proactive adjustments to your tax strategy',
    tier: 'premium'
  }
];

const whatYouGet = [
  'Personalized tax reduction roadmap',
  'Entity structure optimization recommendations',
  'Charitable giving strategy integration',
  'Retirement account optimization',
  'State residency planning guidance',
  'Estate tax minimization strategies'
];

export default function TaxPlanningPage() {
  const navigate = useNavigate();
  const { plan: currentPlan } = useEntitlements();

  useEffect(() => {
    analytics.track('solution.tax_planning.viewed', {
      current_plan: currentPlan,
      timestamp: Date.now()
    });
  }, [currentPlan]);

  const handleUpgrade = (targetPlan: 'premium' | 'elite') => {
    analytics.track('solution.tax_planning.upgrade_cta', {
      target_plan: targetPlan,
      current_plan: currentPlan,
      source: 'tax_planning_page'
    });
    navigate(`/pricing?plan=${targetPlan}&feature=tax_advanced`);
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
            <Calculator className="h-3 w-3 mr-1" />
            Tax Planning Solutions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Advanced Tax Planning & Optimization
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sophisticated tax strategies designed for high-net-worth families. 
            Minimize your tax burden while maximizing wealth preservation and growth.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {taxPlanningFeatures.map((feature, index) => {
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

        {/* What You Get Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">What You Get With Advanced Tax Planning</CardTitle>
            <CardDescription className="text-lg">
              Comprehensive tax optimization tailored to your unique situation
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whatYouGet.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA Section */}
        {currentPlan === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-100 text-blue-700">Premium Plan</Badge>
                <CardTitle className="text-xl">Essential Tax Planning</CardTitle>
                <CardDescription>
                  Core tax optimization strategies for growing wealth
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">$99<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tax optimization analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tax loss harvesting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Year-round planning
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
                <CardTitle className="text-xl">Comprehensive Tax Solutions</CardTitle>
                <CardDescription>
                  Enterprise-grade tax planning for complex wealth structures
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
                    Multi-entity tax planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Audit protection
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
              <h3 className="text-xl font-semibold mb-2">Unlock Elite Tax Planning</h3>
              <p className="text-muted-foreground mb-4">
                Access multi-entity planning, audit protection, and white-glove service
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
                All advanced tax planning features are available in your Elite plan
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