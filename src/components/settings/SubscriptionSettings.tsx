import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  ExternalLink,
  Crown,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SubscriptionSettings: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionPlan, isLoading, syncWithStripe } = useSubscriptionAccess();
  const { trackFeatureUsed } = useEventTracking();
  const { toast } = useToast();

  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [nextPayment, setNextPayment] = useState<Date | null>(null);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (user && subscriptionPlan) {
      loadBillingData();
    }
  }, [user, subscriptionPlan]);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      // Load billing history and next payment date
      const { data, error } = await supabase.functions.invoke('get-billing-info', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      setBillingHistory(data.billing_history || []);
      setNextPayment(data.next_payment ? new Date(data.next_payment) : null);
    } catch (error) {
      console.error('Error loading billing data:', error);
    }
  };

  const handleUpgrade = async (tier: string) => {
    if (!user) return;

    setIsManaging(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          user_id: user.id,
          tier: tier,
          upgrade: true
        }
      });

      if (error) throw error;

      // Track upgrade attempt
      trackFeatureUsed('subscription_upgrade_initiated', { target_tier: tier });

      // Redirect to Stripe checkout
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error starting upgrade:', error);
      toast({
        title: "Error",
        description: "Failed to start upgrade process",
        variant: "destructive",
      });
    } finally {
      setIsManaging(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user || !subscriptionPlan?.stripe_customer_id) return;

    setIsManaging(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      trackFeatureUsed('subscription_portal_opened');

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      });
    } finally {
      setIsManaging(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'elite': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanPrice = (tier: string) => {
    const prices = {
      basic: '$29',
      premium: '$99',
      elite: '$299'
    };
    return prices[tier as keyof typeof prices] || 'Free';
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const availableTiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Essential features for individuals',
      features: [
        '3 Lending Applications',
        '5 Tax Analyses',
        '20 AI Queries',
        '10 Document Uploads',
        'Basic Support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99',
      period: '/month',
      description: 'Advanced features for professionals',
      features: [
        '10 Lending Applications',
        '20 Tax Analyses',
        '100 AI Queries',
        '50 Document Uploads',
        'Premium Analytics',
        'Priority Support'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$299',
      period: '/month',
      description: 'Unlimited access for power users',
      features: [
        'Unlimited Everything',
        'Advanced AI Features',
        'White-label Options',
        'Dedicated Support',
        'Custom Integrations'
      ]
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground">Loading subscription...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className={getTierColor(subscriptionPlan?.tier || 'basic')}>
                  {subscriptionPlan?.tier?.toUpperCase() || 'BASIC'}
                </Badge>
                <span className="text-2xl font-bold">
                  {getPlanPrice(subscriptionPlan?.tier || 'basic')}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Active subscription
                {nextPayment && (
                  <span className="ml-2">
                    • Next payment: {nextPayment.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                disabled={isManaging}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
              <Button onClick={syncWithStripe} variant="ghost" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sync
              </Button>
            </div>
          </div>

          {/* Usage Overview */}
          {subscriptionPlan && (
            <div className="space-y-4">
              <Separator />
              <h4 className="font-medium">Usage This Month</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(subscriptionPlan.usage_counters).map(([key, used]) => {
                  const limit = subscriptionPlan.usage_limits[`${key}_limit` as keyof typeof subscriptionPlan.usage_limits];
                  const percentage = getUsagePercentage(used as number, limit as number);
                  const isUnlimited = limit === -1;
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-muted-foreground">
                          {String(used)}{isUnlimited ? '' : ` / ${limit}`}
                        </span>
                      </div>
                      <Progress 
                        value={isUnlimited ? 100 : percentage} 
                        className="h-2"
                        indicatorClassName={isUnlimited ? "bg-green-500" : percentage > 80 ? "bg-orange-500" : "bg-primary"}
                      />
                      {!isUnlimited && percentage > 80 && (
                        <p className="text-xs text-orange-600">Consider upgrading for more usage</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {subscriptionPlan?.tier !== 'elite' && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableTiers.filter(tier => tier.id !== subscriptionPlan?.tier).map((tier) => (
                <div 
                  key={tier.id}
                  className={`relative p-4 border rounded-lg ${tier.popular ? 'border-primary' : 'border-border'}`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-2 left-4 bg-primary">Most Popular</Badge>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                    <div className="text-2xl font-bold">
                      {tier.price}
                      <span className="text-sm font-normal text-muted-foreground">{tier.period}</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={isManaging}
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                    >
                      {isManaging ? 'Processing...' : `Upgrade to ${tier.name}`}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {billingHistory.length > 0 ? (
            <div className="space-y-3">
              {billingHistory.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{invoice.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">${invoice.amount}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No billing history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Management (for Advisors) */}
      {(user?.user_metadata?.role === 'advisor' || user?.user_metadata?.role === 'admin') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                As an advisor, you can manage team subscriptions and assign client access. 
                Contact support to set up multi-user billing.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button variant="outline" onClick={() => window.open('mailto:billing@bfocfo.com', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Billing Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};