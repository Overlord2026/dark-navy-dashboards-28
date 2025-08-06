import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, DollarSign, Calendar, Zap, TrendingUp, CreditCard, Building, Repeat } from "lucide-react";
import { AddBillDialog } from "./AddBillDialog";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { useBillPayData } from "@/hooks/useBillPayData";
import { BillPayOverviewSkeleton } from "@/components/ui/skeletons/BillPaySkeletons";
import { BillPayErrorBoundary } from "./BillPayErrorBoundary";

export const BillPayOverview: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const { 
    analytics, 
    upcomingBills, 
    addBill, 
    isLoading, 
    error,
    hasAutomatedPayments,
    hasAdvancedAnalytics 
  } = useBillPayData();
  
  const hasPremiumAccess = checkFeatureAccess('premium');

  // Memoized calculations
  const monthlyStats = useMemo(() => ({
    monthlyTotal: analytics.monthlyTotal,
    activeBills: analytics.activeBills,
    automatedPayments: analytics.automatedPayments,
    potentialSavings: analytics.potentialSavings
  }), [analytics]);

  const formattedUpcomingBills = useMemo(() => 
    upcomingBills.map(bill => ({
      ...bill,
      formattedDueDate: new Date(bill.due_date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    })), [upcomingBills]
  );

  // Callback handlers
  const handleAddBill = useCallback((billData: any) => {
    addBill(billData);
  }, [addBill]);

  const handleQuickAction = useCallback((action: string) => {
    console.info(`Quick action: ${action}`);
  }, []);

  if (isLoading) {
    return (
      <BillPayErrorBoundary>
        <BillPayOverviewSkeleton />
      </BillPayErrorBoundary>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <BillPayErrorBoundary>
      <div className="space-y-6">
        {/* Premium upgrade alert */}
        {!hasPremiumAccess && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Upgrade to Premium to unlock automated payments, advanced analytics, and bank account connections.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyStats.monthlyTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Current month estimate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bills</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyStats.activeBills}</div>
              <p className="text-xs text-muted-foreground">
                Bills tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automated</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyStats.automatedPayments}</div>
              <p className="text-xs text-muted-foreground">
                {hasAutomatedPayments ? "Auto payments" : "Upgrade for automation"}
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
                ${hasAdvancedAnalytics ? monthlyStats.potentialSavings.toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasAdvancedAnalytics ? "Potential monthly" : "Upgrade for insights"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bills */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Bills</h2>
            <Button onClick={() => setIsAddBillOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </div>
          
          <div className="space-y-3">
            {formattedUpcomingBills.map((bill) => (
              <Card key={bill.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{bill.biller_name}</h3>
                    <p className="text-sm text-muted-foreground">Due {bill.formattedDueDate}</p>
                  </div>
                    <div className="text-right">
                      <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                      <Badge variant={bill.status === 'scheduled' ? 'default' : 'secondary'}>
                        {bill.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuickAction(`edit-${bill.id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleQuickAction(`pay-${bill.id}`)}
                    >
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Add New Bill</h3>
                    <p className="text-sm text-muted-foreground">Set up a new bill payment</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setIsAddBillOpen(true)}
                >
                  Add Bill
                </Button>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-shadow ${!hasAutomatedPayments ? 'opacity-60' : 'hover:shadow-md'}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Connect Bank Account</h3>
                    <p className="text-sm text-muted-foreground">Link your bank for easy payments</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant={hasAutomatedPayments ? "default" : "secondary"}
                  disabled={!hasAutomatedPayments}
                  onClick={() => handleQuickAction('connect-bank')}
                >
                  {hasAutomatedPayments ? "Connect Account" : "Premium Feature 🔒"}
                </Button>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-shadow ${!hasAutomatedPayments ? 'opacity-60' : 'hover:shadow-md'}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Repeat className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Setup Autopay</h3>
                    <p className="text-sm text-muted-foreground">Automate your bill payments</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant={hasAutomatedPayments ? "default" : "secondary"}
                  disabled={!hasAutomatedPayments}
                  onClick={() => handleQuickAction('setup-autopay')}
                >
                  {hasAutomatedPayments ? "Setup Autopay" : "Premium Feature 🔒"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddBillDialog 
          isOpen={isAddBillOpen}
          onClose={() => setIsAddBillOpen(false)}
          onAddBill={handleAddBill}
        />
      </div>
    </BillPayErrorBoundary>
  );
};