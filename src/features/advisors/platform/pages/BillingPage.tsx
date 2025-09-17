import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  CreditCard, 
  ArrowLeft,
  Settings,
  Users,
  DollarSign,
  Check,
  Plus,
  ExternalLink
} from 'lucide-react';

export default function BillingPage() {
  const navigate = useNavigate();
  const [advisorPaysForClients, setAdvisorPaysForClients] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  const handlePaymentMethodSetup = () => {
    toast.success('Payment method setup completed');
    setHasPaymentMethod(true);
  };

  const handleBillingPreferenceChange = (enabled: boolean) => {
    if (enabled && !hasPaymentMethod) {
      toast.error('Please set up a payment method first');
      return;
    }
    setAdvisorPaysForClients(enabled);
    toast.success(
      enabled 
        ? 'You will now be billed for client invitations' 
        : 'Clients will pay for their own subscriptions'
    );
  };

  return (
    <>
      <Helmet>
        <title>Billing Setup | Advisor Platform</title>
        <meta name="description" content="Manage your advisor platform billing and client payment preferences" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/pros/advisors/platform')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing Setup</h1>
            <p className="text-muted-foreground text-lg">
              Configure payment methods and client billing preferences
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Settings className="w-3 h-3 mr-1" />
            Setup Required
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Billing Setup */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Payment Method */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasPaymentMethod ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Add a payment method to enable advisor-paid client subscriptions
                      </p>
                      <Button onClick={handlePaymentMethodSetup} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">
                            ****
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        Update Payment Method
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Payment Preference */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Client Payment Preference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="advisor-pays" className="text-base font-medium">
                          Pay for client subscriptions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          When enabled, you'll be billed for all client invitations at $19/month per seat
                        </p>
                      </div>
                      <Switch
                        id="advisor-pays"
                        checked={advisorPaysForClients}
                        onCheckedChange={handleBillingPreferenceChange}
                      />
                    </div>

                    {advisorPaysForClients && (
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="font-medium text-primary">Advisor-Paid Mode Enabled</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          All new client invitations will be added to your subscription automatically.
                          Clients won't see any payment screens during onboarding.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Subscription */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Advisor Platform Pro</p>
                        <p className="text-sm text-muted-foreground">$99/month</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Add-ons:</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Client seats (3 active)</span>
                          <span className="font-medium">$57/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Monthly</span>
                        <span className="text-lg font-bold">$156</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Pricing Overview */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Pricing Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="font-medium text-sm">Client-Paid Model</p>
                    <p className="text-xs text-muted-foreground">
                      Clients pay $29-299/month directly
                    </p>
                    <p className="text-xs text-green-600 mt-1">No additional cost to you</p>
                  </div>

                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium text-sm">Advisor-Paid Model</p>
                    <p className="text-xs text-muted-foreground">
                      You pay $19/month per client seat
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Seamless client onboarding</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Advisor-Paid Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">No payment friction for clients</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Higher conversion rates</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Unified billing management</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Professional client experience</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}