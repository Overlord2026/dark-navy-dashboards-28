import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, Plus, ArrowUp, Wallet, BanknoteIcon, CreditCard as CreditCardIcon, ExternalLink, ActivityIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { AdvancedBillPayingProvidersDialog } from "@/components/billpay/AdvancedBillPayingProvidersDialog";
import { BillPayButtonDiagnostics } from "@/components/billpay/BillPayButtonDiagnostics";
import { AddBillDialog } from "@/components/billpay/AddBillDialog";
import { PayBillDialog } from "@/components/billpay/PayBillDialog";
import { PaymentMethodsDialog, PaymentMethod, DEFAULT_PAYMENT_METHODS } from "@/components/billpay/PaymentMethodsDialog";
import { Bill as TypedBill, BillFrequency } from "@/types/bill";
import { useBills } from "@/hooks/useBills";

export interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  accountNumber?: string;
  isRecurring: boolean;
}

export interface FrequentBill {
  id: number;
  name: string;
  accountNumber: string;
  lastAmount: number;
}

const BillPay = () => {
  const { toast } = useToast();
  const { bills: typedBills, addBill: addTypedBill } = useBills();
  
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('upcoming-bills');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [frequentBills, setFrequentBills] = useState<FrequentBill[]>(() => {
    const saved = localStorage.getItem('frequent-bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [showAdvancedProvidersDialog, setShowAdvancedProvidersDialog] = useState(false);
  const [showDiagnosticsDialog, setShowDiagnosticsDialog] = useState(false);
  const [diagnosticButtonName, setDiagnosticButtonName] = useState<string | undefined>(undefined);
  
  // Dialogs state
  const [showAddBillDialog, setShowAddBillDialog] = useState(false);
  const [showPayBillDialog, setShowPayBillDialog] = useState(false);
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false);
  const [billToPay, setBillToPay] = useState<Bill | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);

  // Persist data changes
  useEffect(() => {
    localStorage.setItem('upcoming-bills', JSON.stringify(upcomingBills));
  }, [upcomingBills]);

  useEffect(() => {
    localStorage.setItem('frequent-bills', JSON.stringify(frequentBills));
  }, [frequentBills]);

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

  const handleAddBill = (newBillData: Omit<TypedBill, "id" | "createdAt">) => {
    addTypedBill(newBillData);
    
    const isRecurring = newBillData.frequency !== 'once';
    const newBill: Bill = {
      id: Date.now(),
      name: newBillData.name,
      amount: newBillData.amount,
      dueDate: newBillData.dueDate,
      category: newBillData.category,
      accountNumber: newBillData.accountNumber,
      isRecurring
    };
    
    setUpcomingBills(prev => [...prev, newBill]);
    
    if (isRecurring) {
      const frequentBill: FrequentBill = {
        id: newBill.id,
        name: newBill.name,
        accountNumber: newBill.accountNumber || '****' + Math.floor(1000 + Math.random() * 9000),
        lastAmount: newBill.amount
      };
      setFrequentBills(prev => [...prev, frequentBill]);
    }
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

  const getDueBadgeVariant = (daysUntilDue: number) => {
    if (daysUntilDue <= 0) return "destructive";
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
              <BanknoteIcon className="h-4 w-4" />
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
                  <p className="text-muted-foreground">No bills added yet. Click 'Add Bill' to begin tracking your expenses.</p>
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
                          <Badge variant={getDueBadgeVariant(getDaysUntilDue(bill.dueDate))}>
                            {getDaysUntilDue(bill.dueDate) <= 0 
                              ? `Overdue by ${Math.abs(getDaysUntilDue(bill.dueDate))} days`
                              : `Due in ${getDaysUntilDue(bill.dueDate)} days`
                            }
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
              {frequentBills.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No frequent bills added. Use 'Add Frequent Bill' to set up recurring payments.</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={handleAddNewBill}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first frequent bill
                  </Button>
                </div>
              ) : (
                frequentBills.map((bill) => (
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
                ))
              )}
              <Button variant="ghost" size="sm" className="w-full" onClick={handleAddNewBill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Frequent Bill
              </Button>
            </CardContent>
          </Card>
        </div>

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
