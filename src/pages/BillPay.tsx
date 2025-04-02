import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, Plus, ArrowUp, Wallet, Receipt, FileText, BanknoteIcon, CreditCard as CreditCardIcon, ExternalLink, ActivityIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { AdvancedBillPayingProvidersDialog } from "@/components/billpay/AdvancedBillPayingProvidersDialog";
import { BillPayButtonDiagnostics } from "@/components/billpay/BillPayButtonDiagnostics";

const upcomingBills = [
  { id: 1, name: "Electricity Bill", amount: 85.75, dueDate: "2025-04-15", category: "Utilities" },
  { id: 2, name: "Internet Service", amount: 69.99, dueDate: "2025-04-18", category: "Utilities" },
  { id: 3, name: "Water Bill", amount: 42.50, dueDate: "2025-04-25", category: "Utilities" },
  { id: 4, name: "Netflix Subscription", amount: 15.99, dueDate: "2025-05-01", category: "Entertainment" }
];

const recentPayments = [
  { id: 101, name: "Cell Phone Bill", amount: 89.99, date: "2025-04-01", status: "Completed", category: "Utilities" },
  { id: 102, name: "Rent Payment", amount: 1200.00, date: "2025-03-28", status: "Completed", category: "Housing" },
  { id: 103, name: "Car Insurance", amount: 145.50, date: "2025-03-15", status: "Completed", category: "Insurance" }
];

const frequentBills = [
  { id: 201, name: "Electric Company", accountNumber: "****1234", lastAmount: 85.75 },
  { id: 202, name: "Water Services", accountNumber: "****5678", lastAmount: 42.50 },
  { id: 203, name: "Internet Provider", accountNumber: "****9012", lastAmount: 69.99 }
];

const BillPay = () => {
  const { toast } = useToast();
  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [showAdvancedProvidersDialog, setShowAdvancedProvidersDialog] = useState(false);
  const [showDiagnosticsDialog, setShowDiagnosticsDialog] = useState(false);
  const [diagnosticButtonName, setDiagnosticButtonName] = useState<string | undefined>(undefined);

  const handleQuickPay = (billId: number) => {
    setSelectedBill(billId);
    toast({
      title: "Payment initiated",
      description: "Your payment is being processed.",
      duration: 3000,
    });
    
    setTimeout(() => setSelectedBill(null), 1000);
  };

  const handleAddNewBill = () => {
    toast({
      title: "Create New Bill",
      description: "Feature will be implemented soon",
      duration: 3000,
    });
  };
  
  const handleViewAllBills = () => {
    toast({
      title: "View All Bills",
      description: "Showing all your bills history and scheduled payments",
      duration: 3000,
    });
  };
  
  const handleManagePaymentMethods = () => {
    toast({
      title: "Manage Payment Methods",
      description: "Access your payment methods settings",
      duration: 3000,
    });
  };

  const runDiagnostics = (buttonName: string) => {
    setDiagnosticButtonName(buttonName);
    setShowDiagnosticsDialog(true);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueBadgeVariant = (dueDate: string) => {
    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue <= 3) return "destructive";
    if (daysUntilDue <= 7) return "warning";
    return "secondary";
  };

  return (
    <ThreeColumnLayout title="Bill Pay">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <DashboardHeader 
          heading="Bill Payment Center" 
          text="Manage and schedule all your bill payments from one centralized location."
        />
        
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="relative group">
            <Button 
              variant="default" 
              size="lg" 
              className="gap-2" 
              onClick={handleAddNewBill}
            >
              <Plus className="h-4 w-4" />
              Create New Bill
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => runDiagnostics("Create New Bill")}
            >
              <ActivityIcon className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="relative group">
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2" 
              onClick={handleViewAllBills}
            >
              <FileText className="h-4 w-4" />
              View All Bills
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => runDiagnostics("View All Bills")}
            >
              <ActivityIcon className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="relative group">
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2" 
              onClick={handleManagePaymentMethods}
            >
              <CreditCardIcon className="h-4 w-4" />
              Manage Payment Methods
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => runDiagnostics("Manage Payment Methods")}
            >
              <ActivityIcon className="h-3 w-3" />
            </Button>
          </div>

          <div className="relative group">
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setShowAdvancedProvidersDialog(true)}
            >
              <ExternalLink className="h-4 w-4" />
              Advanced Bill Paying Providers
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => runDiagnostics("Advanced Bill Paying Providers")}
            >
              <ActivityIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Bills
                </CardTitle>
                <CardDescription>
                  Bills due in the next 30 days
                </CardDescription>
              </div>
              <div className="relative group">
                <Button variant="outline" size="sm" onClick={handleAddNewBill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => runDiagnostics("Add Bill")}
                >
                  <ActivityIcon className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingBills.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming bills scheduled.</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={handleAddNewBill}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first bill
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-medium">{bill.name}</span>
                        <span className="text-sm text-muted-foreground">{bill.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold">${bill.amount.toFixed(2)}</span>
                          <Badge variant={getDueBadgeVariant(bill.dueDate)}>
                            Due in {getDaysUntilDue(bill.dueDate)} days
                          </Badge>
                        </div>
                        <div className="relative group">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleQuickPay(bill.id)}
                            className="whitespace-nowrap"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => runDiagnostics("Pay Now")}
                          >
                            <ActivityIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Button variant="ghost" size="sm" onClick={handleViewAllBills}>
                View All Bills
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Quick Pay
              </CardTitle>
              <CardDescription>
                Pay your frequent bills faster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {frequentBills.map((bill) => (
                <div 
                  key={bill.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${selectedBill === bill.id ? 'border-primary bg-primary/5' : 'bg-card'}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{bill.name}</span>
                    <span className="text-sm text-muted-foreground">Acct: {bill.accountNumber}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuickPay(bill.id)}
                    className="whitespace-nowrap"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    ${bill.lastAmount.toFixed(2)}
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full" onClick={handleAddNewBill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Frequent Bill
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Payments
              </CardTitle>
              <CardDescription>
                Your payment history from the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Your payment history will appear here once you've made your first payment.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Biller</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                        <th className="text-right py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-muted/30">
                          <td className="py-3 px-4">{payment.name}</td>
                          <td className="py-3 px-4">{payment.category}</td>
                          <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right font-medium">${payment.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                              {payment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="ghost" size="sm">
                Download Statement
              </Button>
              <Button variant="ghost" size="sm" onClick={handleViewAllBills}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>

        <BillPayButtonDiagnostics 
          isOpen={showDiagnosticsDialog}
          onClose={() => setShowDiagnosticsDialog(false)}
          selectedButton={diagnosticButtonName}
        />

        <AdvancedBillPayingProvidersDialog 
          isOpen={showAdvancedProvidersDialog}
          onClose={() => setShowAdvancedProvidersDialog(false)}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default BillPay;
