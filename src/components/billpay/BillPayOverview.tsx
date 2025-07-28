import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Plus,
  Zap
} from "lucide-react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

export const BillPayOverview: React.FC = () => {
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  const hasPremiumAccess = checkFeatureAccess('bill_pay_premium');

  const upcomingBills = [
    { id: 1, name: "Electric Bill", amount: 165.23, dueDate: "2024-02-15", status: "pending" },
    { id: 2, name: "Internet", amount: 89.99, dueDate: "2024-02-18", status: "scheduled" },
    { id: 3, name: "Car Insurance", amount: 245.67, dueDate: "2024-02-20", status: "overdue" }
  ];

  const monthlyStats = {
    totalSpent: 1234.56,
    billsCount: 12,
    automatedCount: hasPremiumAccess ? 8 : 0,
    savings: hasPremiumAccess ? 45.67 : 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyStats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bills</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.billsCount}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingBills.filter(b => b.status === "overdue").length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.automatedCount}</div>
            <p className="text-xs text-muted-foreground">
              {hasPremiumAccess ? "67% automated" : "Upgrade for automation"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hasPremiumAccess ? monthlyStats.savings.toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasPremiumAccess ? "From negotiations" : "Upgrade for savings"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upgrade CTA */}
      {!hasPremiumAccess && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Upgrade to Premium</strong> for automated payments, bank sync, and AI-powered bill analysis.
            </div>
            <Button size="sm">Upgrade Now</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Upcoming Bills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Bills</CardTitle>
            <CardDescription>Bills due in the next 30 days</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-sm text-muted-foreground">Due {bill.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${bill.amount}</p>
                    <Badge 
                      variant={
                        bill.status === "overdue" ? "destructive" : 
                        bill.status === "scheduled" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {bill.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    {bill.status === "overdue" ? "Pay Now" : "View"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Plus className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Add New Bill</h3>
                <p className="text-sm text-muted-foreground">Set up a new recurring bill</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${!hasPremiumAccess ? 'opacity-50' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">
                  Connect Bank Account
                  {!hasPremiumAccess && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground">Sync bills automatically</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${!hasPremiumAccess ? 'opacity-50' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">
                  Setup Autopay
                  {!hasPremiumAccess && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground">Automate your payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};