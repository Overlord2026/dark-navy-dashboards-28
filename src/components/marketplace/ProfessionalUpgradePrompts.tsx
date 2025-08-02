import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Crown, 
  ArrowRight,
  Sparkles,
  Megaphone
} from 'lucide-react';

interface ProfessionalUpgradeOption {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  icon: React.ComponentType<any>;
  popular?: boolean;
  badge?: string;
}

const upgradeOptions: ProfessionalUpgradeOption[] = [
  {
    id: 'featured-listing',
    title: 'Featured Listing',
    description: 'Boost your visibility with a premium placement in search results',
    price: '$299',
    period: '/month',
    features: [
      'Top 3 search placement',
      'Featured badge on profile',
      'Enhanced profile highlighting',
      '3x more profile views',
      'Priority in category listings'
    ],
    icon: Star,
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'premium-analytics',
    title: 'Premium Analytics',
    description: 'Advanced insights and performance tracking for your marketplace presence',
    price: '$149',
    period: '/month',
    features: [
      'Detailed performance metrics',
      'Client interaction analytics',
      'Conversion rate tracking',
      'Competitor analysis',
      'Custom reporting',
      'Lead source attribution'
    ],
    icon: BarChart3,
    badge: 'Data-Driven'
  },
  {
    id: 'ad-slots',
    title: 'Premium Ad Slots',
    description: 'Targeted advertising placement throughout the marketplace',
    price: '$199',
    period: '/month',
    features: [
      'Banner ad placements',
      'Sponsored content slots',
      'Category page ads',
      'Resource section promotion',
      'Mobile app placement',
      'Performance tracking'
    ],
    icon: Megaphone,
    badge: 'High Impact'
  },
  {
    id: 'elite-package',
    title: 'Elite Professional',
    description: 'Complete marketplace domination package with all premium features',
    price: '$599',
    period: '/month',
    features: [
      'All featured listing benefits',
      'All premium analytics features',
      'All ad slot placements',
      'Priority customer support',
      'Custom branding options',
      'Dedicated account manager',
      'Advanced lead qualification',
      'White-label consultation tools'
    ],
    icon: Crown,
    badge: 'Complete Package'
  }
];

export function ProfessionalUpgradePrompts() {
  const handleUpgrade = (optionId: string) => {
    // Handle upgrade process - would integrate with payment system
    console.log(`Upgrading to ${optionId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">Grow Your Practice</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Supercharge your marketplace presence with premium features designed to attract 
          high-net-worth clients and grow your business.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">3.5x</div>
            <div className="text-sm text-muted-foreground">More inquiries with featured listing</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">$250K</div>
            <div className="text-sm text-muted-foreground">Average client value increase</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">89%</div>
            <div className="text-sm text-muted-foreground">Client satisfaction rate</div>
          </div>
        </div>
      </div>

      {/* Upgrade Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upgradeOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Card 
              key={option.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                option.popular ? 'ring-2 ring-primary/20 border-primary/30' : ''
              }`}
            >
              {/* Popular Badge */}
              {option.badge && (
                <div className="absolute -top-3 left-6">
                  <Badge className={`${
                    option.popular 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {option.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{option.price}</div>
                    <div className="text-sm text-muted-foreground">{option.period}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{option.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What's included:</h4>
                  <ul className="space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full gap-2"
                  variant={option.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(option.id)}
                >
                  {option.popular ? (
                    <>
                      <Star className="w-4 h-4" />
                      Get Featured
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Upgrade Now
                    </>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Additional Info */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">
                    Cancel anytime • 30-day money-back guarantee
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Sales */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Need a Custom Solution?</h3>
            <p className="text-muted-foreground">
              Large firms and enterprise clients can benefit from custom marketplace packages
            </p>
          </div>
          <Button variant="outline" size="lg" className="gap-2">
            <Target className="w-4 h-4" />
            Contact Sales Team
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}