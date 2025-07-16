import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Lock, CheckCircle, Users, Calendar, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';

export function SubscriptionTierDisplay() {
  const { currentTier } = useSubscription();
  const [showServiceMenu, setShowServiceMenu] = useState(false);

  const features = {
    basic: [
      'Net Worth & Account Aggregation',
      'Retirement & Goal Tracking',
      'Secure Document Vault',
      'Investment & Real Estate Tracking',
      'Social Security Optimizer',
      'Core Tax Planning Tools',
      'Education Library & Custom Guides',
      'Personalized Dashboard & Alerts',
      'Concierge Support'
    ],
    premium: [
      'Advanced Estate & Trust Planning',
      'Family Legacy Box™',
      'Private Market Alpha™ Access',
      'Healthcare Integration (HSA, advanced planning)',
      'Advanced Property Management',
      'Priority Advisor Access',
      'Concierge Family Support',
      'White-glove Onboarding'
    ]
  };

  const allFeatures = [...features.basic, ...features.premium];

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              Welcome to Your Boutique Family Office Dashboard
              {currentTier === 'premium' && <Star className="h-5 w-5 text-primary fill-current" />}
            </h3>
            <p className="text-muted-foreground">
              See your entire financial world—investments, taxes, estate, legacy, and more—at a glance.
            </p>
          </div>
          <Badge variant={currentTier === 'premium' ? 'default' : 'secondary'} className="text-sm">
            {currentTier === 'premium' ? 'Premium' : 'Basic'} Member
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Your Current Services Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {features[currentTier as keyof typeof features].slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            {features[currentTier as keyof typeof features].length > 6 && (
              <p className="text-sm text-muted-foreground mt-2">
                +{features[currentTier as keyof typeof features].length - 6} more services
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowServiceMenu(true)}
              className="flex-1"
            >
              See All Available Services
            </Button>
            {currentTier === 'basic' && (
              <Button 
                className="bg-primary hover:bg-primary/90 flex-1"
                onClick={() => window.open('https://calendly.com/bfo-consultation', '_blank')}
              >
                <Star className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Service Menu Modal */}
      <Dialog open={showServiceMenu} onOpenChange={setShowServiceMenu}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Complete Family Office Service Menu
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Services */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  Basic Services
                  <Badge variant="secondary">Included</Badge>
                </h3>
                <div className="space-y-2">
                  {features.basic.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Services */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  Premium Services
                  <Badge variant={currentTier === 'premium' ? 'default' : 'outline'}>
                    {currentTier === 'premium' ? 'Active' : 'Upgrade Required'}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {features.premium.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {currentTier === 'premium' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        currentTier === 'premium' ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {currentTier === 'basic' && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">
                  Ready for Premium Family Office Services?
                </h4>
                <p className="text-muted-foreground mb-4">
                  Unlock advanced estate planning, private markets, and concierge support. Contact your advisor or schedule a premium consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => window.open('https://calendly.com/bfo-consultation', '_blank')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Premium Review
                  </Button>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Message Support
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Need help? Contact your dedicated advisor anytime.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Message Advisor
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://calendly.com/bfo-consultation', '_blank')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}