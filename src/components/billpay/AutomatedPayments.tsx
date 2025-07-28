import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { useStripePortal } from "@/hooks/useStripePortal";
import { 
  Zap, 
  CreditCard, 
  Building, 
  Bot, 
  Users, 
  Shield, 
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
  Plus
} from "lucide-react";
import { PremiumPlaceholder } from "@/components/premium/PremiumPlaceholder";

export const AutomatedPayments: React.FC = () => {
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const { openPortal, isLoading } = useStripePortal();
  const [selectedTab, setSelectedTab] = useState("setup");
  
  const hasPremiumAccess = checkFeatureAccess('bill_pay_premium');

  if (!hasPremiumAccess) {
    return (
      <PremiumPlaceholder 
        featureId="bill_pay_premium" 
        featureName="Automated Bill Payments"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Building className="h-8 w-8 text-accent" />
                  <div>
                    <h3 className="font-semibold">Bank Account Sync</h3>
                    <p className="text-sm text-muted-foreground">Connect via Plaid for automatic bill detection</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Stripe Payments</h3>
                    <p className="text-sm text-muted-foreground">Secure, automated bill payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Bot className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">AI Bill Analysis</h3>
                    <p className="text-sm text-muted-foreground">Smart insights and negotiation prompts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Premium Features:</strong> Bank sync, automated payments, AI analysis, concierge support, and team collaboration tools.
            </AlertDescription>
          </Alert>
        </div>
      </PremiumPlaceholder>
    );
  }

  const automatedBills = [
    {
      id: 1,
      name: "Electric Bill",
      amount: 165.23,
      nextPayment: "2024-02-15",
      status: "active",
      method: "Bank Account",
      aiInsight: "Average 12% higher than similar homes"
    },
    {
      id: 2,
      name: "Internet",
      amount: 89.99,
      nextPayment: "2024-02-18", 
      status: "active",
      method: "Credit Card",
      aiInsight: "Good value - rates competitive"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Feature Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["setup", "payments", "analysis", "concierge"].map((tab) => (
          <Card 
            key={tab}
            className={`cursor-pointer transition-all ${selectedTab === tab ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedTab(tab)}
          >
            <CardContent className="pt-4 text-center">
              {tab === "setup" && <Building className="h-6 w-6 mx-auto mb-2 text-accent" />}
              {tab === "payments" && <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />}
              {tab === "analysis" && <Bot className="h-6 w-6 mx-auto mb-2 text-purple-500" />}
              {tab === "concierge" && <Users className="h-6 w-6 mx-auto mb-2 text-orange-500" />}
              <h3 className="font-medium capitalize">{tab}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content based on selected tab */}
      {selectedTab === "setup" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Bank Account Connection
              </CardTitle>
              <CardDescription>
                Connect your bank accounts via Plaid for automatic bill detection and payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your banking information is encrypted and protected with bank-level security. We never store your login credentials.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Connect Bank Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sync your primary checking account for automated bill detection
                    </p>
                    <Button>Connect with Plaid</Button>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Add Credit Card</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect cards for automated bill payments
                    </p>
                    <Button variant="outline">Add Card</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "payments" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Automated Payments</CardTitle>
                <CardDescription>Bills scheduled for automatic payment</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Setup Autopay
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automatedBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{bill.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Next payment: {bill.nextPayment} via {bill.method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">${bill.amount}</p>
                        <Badge variant="secondary">{bill.status}</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openPortal()}
                        disabled={isLoading}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "analysis" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Bill Analysis
              </CardTitle>
              <CardDescription>
                Smart insights and negotiation opportunities for your bills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automatedBills.map((bill) => (
                <Card key={bill.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{bill.name}</h3>
                        <p className="text-sm text-muted-foreground">${bill.amount}/month</p>
                        <p className="text-sm text-purple-600 mt-2">{bill.aiInsight}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Negotiate
                        </Button>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Analyze
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "concierge" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Concierge Services
              </CardTitle>
              <CardDescription>
                White-glove bill management and family collaboration tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Request Bill Review</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Have our experts review your bills for savings opportunities
                    </p>
                    <Button className="w-full">Request Review</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Family Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Grant family members access to view and manage bills
                    </p>
                    <Button variant="outline" className="w-full">Manage Access</Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  <strong>Team Features:</strong> Audit trails, approval workflows, and granular permissions for family and advisors.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};