import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Download, 
  Users, 
  Zap, 
  Gift,
  Calendar,
  DollarSign,
  TrendingUp
} from "lucide-react";

export function BillingSubscriptionsSection() {
  const currentPlan = {
    name: 'Professional Team',
    price: 199,
    billingCycle: 'monthly',
    seatsTotal: 10,
    seatsUsed: 7,
    nextBilling: '2024-02-01',
    status: 'active'
  };

  const invoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 199,
      status: 'paid',
      description: 'Professional Team - January 2024'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 199,
      status: 'paid',
      description: 'Professional Team - December 2023'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 149,
      status: 'paid',
      description: 'Small Team - November 2023'
    }
  ];

  const availablePlans = [
    {
      name: 'Solo Professional',
      price: 49,
      seats: 1,
      features: ['Basic client management', 'Document sharing', 'Basic analytics']
    },
    {
      name: 'Small Team',
      price: 149,
      seats: 5,
      features: ['Team collaboration', 'Advanced analytics', 'Priority support']
    },
    {
      name: 'Professional Team',
      price: 199,
      seats: 10,
      features: ['Full team features', 'Custom branding', 'API access'],
      current: true
    },
    {
      name: 'Enterprise',
      price: 499,
      seats: 25,
      features: ['SSO integration', 'Advanced security', 'Dedicated support']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your active subscription and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-muted-foreground">
                ${currentPlan.price}/{currentPlan.billingCycle}
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Seat Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentPlan.seatsUsed} of {currentPlan.seatsTotal} seats</span>
                  <span>{Math.round((currentPlan.seatsUsed / currentPlan.seatsTotal) * 100)}%</span>
                </div>
                <Progress value={(currentPlan.seatsUsed / currentPlan.seatsTotal) * 100} />
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Next Billing</span>
              </div>
              <p className="text-lg font-semibold">{currentPlan.nextBilling}</p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Monthly Cost</span>
              </div>
              <p className="text-lg font-semibold">${currentPlan.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Seat Management
          </CardTitle>
          <CardDescription>
            Add or remove team member seats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Additional Seats</Label>
              <p className="text-sm text-muted-foreground">
                Add more team members to your plan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">$19/seat/month</span>
              <Button size="sm">Add Seats</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Unused Seats</Label>
              <p className="text-sm text-muted-foreground">
                {currentPlan.seatsTotal - currentPlan.seatsUsed} seats available
              </p>
            </div>
            <Button variant="outline" size="sm">Remove Unused</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Manage your payment information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          
          <Button variant="outline" className="w-full">
            + Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                Download invoices and view payment history
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invoice.id}</span>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {invoice.description} • {invoice.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">${invoice.amount}</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Upgrade or downgrade your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availablePlans.map((plan) => (
              <div 
                key={plan.name} 
                className={`p-4 border rounded-lg ${plan.current ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{plan.name}</h4>
                  {plan.current && <Badge variant="default">Current</Badge>}
                </div>
                
                <div className="mb-3">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Up to {plan.seats} {plan.seats === 1 ? 'seat' : 'seats'}
                </p>
                
                <ul className="space-y-1 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      • {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.current ? "outline" : "default"} 
                  size="sm" 
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Select Plan'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
          <CardDescription>
            Earn credits by referring other professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-medium">Your Referral Code</Label>
              <Button variant="outline" size="sm">Copy</Button>
            </div>
            <p className="font-mono text-lg">ADVISOR-2024-XYZ</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Referrals Made</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-2xl font-bold">$150</p>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}