import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

export function SubscriptionDashboard() {
  const { subscriptionPlan, isLoading, syncWithStripe } = useSubscriptionAccess();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionPlan) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No subscription data available</p>
          <Button onClick={syncWithStripe} className="mt-4">
            Sync with Stripe
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'elite': return <Crown className="h-5 w-5 text-white" />;
      case 'premium': return <Crown className="h-5 w-5 text-white" />;
      default: return <Activity className="h-5 w-5 text-white" />;
    }
  };

  const usageData = [
    { 
      name: 'Lending Applications', 
      current: subscriptionPlan.usage_counters.lending_applications,
      limit: subscriptionPlan.usage_limits.lending_applications_limit,
      enabled: subscriptionPlan.add_ons.lending_access 
    },
    { 
      name: 'Tax Analyses', 
      current: subscriptionPlan.usage_counters.tax_analyses,
      limit: subscriptionPlan.usage_limits.tax_analyses_limit,
      enabled: subscriptionPlan.add_ons.tax_access 
    },
    { 
      name: 'AI Queries', 
      current: subscriptionPlan.usage_counters.ai_queries,
      limit: subscriptionPlan.usage_limits.ai_queries_limit,
      enabled: subscriptionPlan.add_ons.ai_features_access 
    },
    { 
      name: 'Document Uploads', 
      current: subscriptionPlan.usage_counters.document_uploads,
      limit: subscriptionPlan.usage_limits.document_uploads_limit,
      enabled: true // Always enabled
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getTierColor(subscriptionPlan.tier)}`}>
                  {getTierIcon(subscriptionPlan.tier)}
                </div>
                {subscriptionPlan.tier.charAt(0).toUpperCase() + subscriptionPlan.tier.slice(1)} Plan
              </CardTitle>
              <CardDescription>
                {subscriptionPlan.is_active ? 'Active subscription' : 'Inactive subscription'}
              </CardDescription>
            </div>
            <Badge variant={subscriptionPlan.is_active ? "default" : "destructive"}>
              {subscriptionPlan.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(subscriptionPlan.add_ons).map(([key, enabled]) => (
              <div key={key} className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-sm font-medium capitalize">
                  {key.replace('_access', '').replace('_', ' ')}
                </div>
                <div className={`text-xs mt-1 ${enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage This Month
          </CardTitle>
          <CardDescription>
            Track your monthly usage across all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {usageData.map((item) => {
              const percentage = item.limit > 0 ? Math.min((item.current / item.limit) * 100, 100) : 0;
              const isUnlimited = item.limit === -1;
              const isNearLimit = !isUnlimited && percentage > 80;
              const isAtLimit = !isUnlimited && item.current >= item.limit;
              
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {!item.enabled && (
                        <Badge variant="outline" className="text-xs">
                          <span className="mr-1">🔒</span>
                          Locked
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isUnlimited ? (
                        <span className="text-green-600 font-medium">Unlimited</span>
                      ) : (
                        <span className={isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : ''}>
                          {item.current} / {item.limit}
                        </span>
                      )}
                    </div>
                  </div>
                  {!isUnlimited && item.enabled && (
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-orange-100' : ''}`}
                    />
                  )}
                  {!item.enabled && (
                    <div className="h-2 bg-muted rounded-full opacity-50" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={syncWithStripe}>
              <Activity className="h-4 w-4 mr-2" />
              Sync with Stripe
            </Button>
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Billing History
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}