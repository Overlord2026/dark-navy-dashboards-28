
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
import { AddBillDialog } from "@/components/billpay/AddBillDialog";
import { PayBillDialog } from "@/components/billpay/PayBillDialog";
import { PaymentMethodsDialog, PaymentMethod, DEFAULT_PAYMENT_METHODS } from "@/components/billpay/PaymentMethodsDialog";

// Define bill type for TypeScript
interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
}

// Initial bills data
const initialUpcomingBills: Bill[] = [
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
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>(initialUpcomingBills);
  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [showAdvancedProvidersDialog, setShowAdvancedProvidersDialog] = useState(false);
  const [showDiagnosticsDialog, setShowDiagnosticsDialog] = useState(false);
  const [diagnosticButtonName, setDiagnosticButtonName] = useState<string | undefined>(undefined);
  
  // State for dialogs
  const [showAddBillDialog, setShowAddBillDialog] = useState(false);
  const [showPayBillDialog, setShowPayBillDialog] = useState(false);
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false);
  const [billToPay, setBillToPay] = useState<Bill | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);

  const handleQuickPay = (billId: number) => {
    const bill = upcomingBills.find(b => b.id === billId);
    if (bill) {
      setBillToPay(bill);
      setShowPayBillDialog(true);
    }
  };

  const handleAddNewBill = () => {
    setShowAddBillDialog(true);
  };
  
  const handleViewAllBills = () => {
    toast({
      title: "View All Bills",
      description: "Showing all your bills history and scheduled payments",
      duration: 3000,
    });
  };
  
  const handleManagePaymentMethods = () => {
    setShowPaymentMethodsDialog(true);
  };

  const handleAddBill = (newBill: Bill) => {
    setUpcomingBills(prev => [...prev, newBill]);
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

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, method]);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <ThreeColumnLayout title="Bill Pay">
      <div className="space-y-6 px-2 sm:px-4 py-4 sm:py-6 max-w-7xl mx-auto">
        <DashboardHeader 
          heading="Bill Payment Center" 
          text="Manage and schedule all your bill payments from one centralized location."
        />
        
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
          <div className="relative group">
            <Button 
              variant="default" 
              size="sm"
              className="gap-2 text-xs sm:text-sm sm:size-lg" 
              onClick={handleAddNewBill}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Create New Bill</span>
              <span className="inline sm:hidden">New Bill</span>
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
              size="sm"
              className="gap-2 text-xs sm:text-sm sm:size-lg" 
              onClick={handleViewAllBills}
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">View All Bills</span>
              <span className="inline sm:hidden">All Bills</span>
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
              size="sm"
              className="gap-2 text-xs sm:text-sm sm:size-lg" 
              onClick={handleManagePaymentMethods}
            >
              <CreditCardIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Manage Payment Methods</span>
              <span className="inline sm:hidden">Payment Methods</span>
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
              size="sm"
              className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs sm:text-sm sm:size-lg"
              onClick={() => setShowAdvancedProvidersDialog(true)}
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Advanced Bill Paying Providers</span>
              <span className="inline sm:hidden">Advanced</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Upcoming Bills
                </CardTitle>
                <CardDescription>
                  Bills due in the next 30 days
                </CardDescription>
              </div>
              <div className="relative group">
                <Button variant="outline" size="sm" onClick={handleAddNewBill} className="text-xs">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
                <div className="space-y-3 sm:space-y-4">
                  {upcomingBills.map((bill) => (
                    <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col mb-2 sm:mb-0">
                        <span className="font-medium">{bill.name}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">{bill.category}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-normal sm:gap-4">
                        <div className="flex flex-col items-start sm:items-end">
                          <span className="font-semibold">${bill.amount.toFixed(2)}</span>
                          <Badge variant={getDueBadgeVariant(bill.dueDate)} className="text-xs">
                            Due in {getDaysUntilDue(bill.dueDate)} days
                          </Badge>
                        </div>
                        <div className="relative group ml-4 sm:ml-0">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleQuickPay(bill.id)}
                            className="whitespace-nowrap text-xs"
                          >
                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
              <Button variant="ghost" size="sm" onClick={handleViewAllBills} className="text-xs sm:text-sm">
                View All Bills
              </Button>
            </CardFooter>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Quick Pay
              </CardTitle>
              <CardDescription>
                Pay your frequent bills faster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {frequentBills.map((bill) => (
                <div 
                  key={bill.id} 
                  className={`flex items-center justify-between p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors ${selectedBill === bill.id ? 'border-primary bg-primary/5' : 'bg-card'}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm sm:text-base">{bill.name}</span>
                    <span className="text-xs text-muted-foreground">Acct: {bill.accountNumber}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuickPay(bill.id)}
                    className="whitespace-nowrap text-xs"
                  >
                    <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    ${bill.lastAmount.toFixed(2)}
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm" onClick={handleAddNewBill}>
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add Frequent Bill
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Recent Payments
              </CardTitle>
              <CardDescription>
                Your payment history from the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {recentPayments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Your payment history will appear here once you've made your first payment.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="min-w-max">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Biller</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Category</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Date</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Amount</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recentPayments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-muted/30">
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{payment.name}</td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{payment.category}</td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm">${payment.amount.toFixed(2)}</td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                              <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between gap-2">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                Download Statement
              </Button>
              <Button variant="ghost" size="sm" onClick={handleViewAllBills} className="text-xs sm:text-sm w-full sm:w-auto">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Dialogs */}
        <AddBillDialog 
          isOpen={showAddBillDialog} 
          onClose={() => setShowAddBillDialog(false)} 
          onAddBill={handleAddBill}
        />

        <PayBillDialog
          isOpen={showPayBillDialog}
          onClose={() => {
            setShowPayBillDialog(false);
            setBillToPay(null);
          }}
          bill={billToPay}
        />

        <PaymentMethodsDialog
          isOpen={showPaymentMethodsDialog}
          onClose={() => setShowPaymentMethodsDialog(false)}
          paymentMethods={paymentMethods}
          onAddPaymentMethod={handleAddPaymentMethod}
          onSetDefault={handleSetDefault}
          onRemove={handleRemovePaymentMethod}
        />

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
