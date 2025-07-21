import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFirmManagement } from '@/hooks/useFirmManagement';
import { SUBSCRIPTION_PLANS } from '@/types/firm';
import { CreditCard, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export function BillingManagement() {
  const { firm, subscription, upgradePlan } = useFirmManagement();

  const handleUpgrade = async (planSeats: number, planName: string) => {
    if (firm && planSeats > firm.seats_purchased) {
      await upgradePlan(planSeats, planName);
    }
  };

  if (!firm || !subscription) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground">Set up billing to manage your firm's subscription.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.seats === subscription.seats);
  const monthlyTotal = subscription.price_per_seat * subscription.seats;
  const annualTotal = monthlyTotal * 12 * 0.8; // 20% annual discount

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Your current billing information and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-medium capitalize">{subscription.plan_name}</p>
              <Badge variant="outline">{subscription.billing_cycle}</Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Seats</p>
              <p className="font-medium">{subscription.seats} seats</p>
              <p className="text-sm text-muted-foreground">
                ${subscription.price_per_seat}/seat/month
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Total</p>
              <p className="text-2xl font-bold">${monthlyTotal}</p>
              <div className="flex items-center text-sm text-success">
                <DollarSign className="h-4 w-4 mr-1" />
                Save ${(monthlyTotal * 12 - annualTotal).toFixed(0)} with annual
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Next Billing Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(subscription.next_billing_date).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Available Plans
          </CardTitle>
          <CardDescription>
            Upgrade your plan to add more seats and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrentPlan = plan.seats === subscription.seats;
              const isUpgrade = plan.seats > subscription.seats;
              
              return (
                <div 
                  key={plan.name} 
                  className={`relative p-4 border rounded-lg ${
                    isCurrentPlan ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  {isCurrentPlan && (
                    <Badge className="absolute -top-2 left-4">Current</Badge>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium capitalize">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">Up to {plan.seats} seats</p>
                    </div>
                    
                    <div>
                      <p className="text-2xl font-bold">${plan.price_monthly}</p>
                      <p className="text-sm text-muted-foreground">per seat/month</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-success">
                        Annual: ${plan.price_annual}/seat
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Save {Math.round((1 - plan.price_annual / (plan.price_monthly * 12)) * 100)}%
                      </p>
                    </div>
                    
                    {isCurrentPlan ? (
                      <Button variant="outline" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : isUpgrade ? (
                      <Button 
                        onClick={() => handleUpgrade(plan.seats, plan.name)}
                        className="w-full"
                      >
                        Upgrade
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="w-full">
                        Downgrade
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
          <CardDescription>
            Track your firm's platform usage and optimize your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">{firm.seats_in_use}</p>
              <p className="text-sm text-muted-foreground">Active Seats</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-success">
                {Math.round((firm.seats_in_use / firm.seats_purchased) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Utilization Rate</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-warning">
                {firm.seats_purchased - firm.seats_in_use}
              </p>
              <p className="text-sm text-muted-foreground">Unused Seats</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}