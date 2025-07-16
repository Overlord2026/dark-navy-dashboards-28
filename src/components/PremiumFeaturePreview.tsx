import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Star, Shield, TrendingUp, Users, Heart } from 'lucide-react';

const premiumFeatures = [
  {
    title: "Advanced Estate Planning",
    description: "Comprehensive trust strategies, tax-efficient legacy planning, and family governance structures.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    blur: true
  },
  {
    title: "Private Market Alpha™",
    description: "Exclusive access to private equity, real estate, and alternative investments typically reserved for institutions.",
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    blur: true
  },
  {
    title: "Family Legacy Box™",
    description: "Digital legacy management, family stories, and multi-generational wealth planning tools.",
    icon: <Heart className="h-8 w-8 text-primary" />,
    blur: true
  },
  {
    title: "Concierge Family Support",
    description: "Dedicated family advisor, white-glove service, and priority access to our entire team.",
    icon: <Users className="h-8 w-8 text-primary" />,
    blur: true
  }
];

export function PremiumFeaturePreview() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Unlock Premium Family Office Features
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access advanced estate planning, private markets, concierge support, and more—available to Premium members.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {premiumFeatures.map((feature, index) => (
          <Card 
            key={index} 
            className={`p-6 bg-card border-border relative overflow-hidden ${
              feature.blur ? 'opacity-75' : ''
            }`}
          >
            {feature.blur && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Premium Feature</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-4 mb-4">
              {feature.icon}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  {feature.title}
                  <Star className="ml-2 h-4 w-4 text-primary fill-current" />
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 border border-primary/20">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Ready to Access Premium Services?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Schedule a complimentary consultation to see if you qualify for our premium family office services. 
          No pressure—just a conversation about your family's unique needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
          >
            <Star className="h-4 w-4 mr-2" />
            Schedule Premium Review
          </Button>
          <Button variant="outline" size="lg">
            Learn More About Premium
          </Button>
        </div>
      </div>
    </div>
  );
}