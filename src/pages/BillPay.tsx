import React, { useState, useMemo } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, CreditCard, Plus, ArrowUp, Wallet, Receipt, 
  FileText, Inbox, BanknoteIcon, ExternalLink, ActivityIcon, 
  Upload, BarChart3, AlertCircle, CheckCircle, Home, Shield,
  Link, PieChart, CircleDollarSign, Bell, MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { Separator } from "@/components/ui/separator";

import { AdvancedBillPayingProvidersDialog } from "@/components/billpay/AdvancedBillPayingProvidersDialog";
import { BillPayButtonDiagnostics } from "@/components/billpay/BillPayButtonDiagnostics";
import { AddBillDialog } from "@/components/billpay/AddBillDialog";
import { PayBillDialog } from "@/components/billpay/PayBillDialog";
import { PaymentMethodsDialog, PaymentMethod, DEFAULT_PAYMENT_METHODS } from "@/components/billpay/PaymentMethodsDialog";
import { SchedulePaymentDialog } from "@/components/billpay/SchedulePaymentDialog";
import { ReminderSetupDialog } from "@/components/billpay/ReminderSetupDialog";
import { InsightsPanel } from "@/components/billpay/InsightsPanel";

interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status?: string;
  new?: boolean;
  lateFee?: number;
}

const initialUpcomingBills: Bill[] = [
  { id: 1, name: "Electricity Bill", amount: 85.75, dueDate: "2025-04-15", category: "Utilities", lateFee: 15 },
  { id: 2, name: "Internet Service", amount: 69.99, dueDate: "2025-04-18", category: "Utilities" },
  { id: 3, name: "Water Bill", amount: 42.50, dueDate: "2025-04-25", category: "Utilities", lateFee: 10 },
  { id: 4, name: "Netflix Subscription", amount: 15.99, dueDate: "2025-05-01", category: "Entertainment" },
  { id: 5, name: "Car Insurance", amount: 112.40, dueDate: "2025-04-10", category: "Insurance", lateFee: 25 },
  { id: 6, name: "Visa Credit Card", amount: 287.65, dueDate: "2025-04-08", category: "Credit Cards", lateFee: 35 }
];

const recentPayments = [
  { id: 101, name: "Cell Phone Bill", amount: 89.99, date: "2025-04-01", status: "Completed", category: "Utilities" },
  { id: 102, name: "Rent Payment", amount: 1200.00, date: "2025-03-28", status: "Completed", category: "Housing" },
  { id: 103, name: "Car Insurance", amount: 145.50, date: "2025-03-15", status: "Completed", category: "Insurance" }
];

const frequentBills = [
  { id: 201, name: "Electric Company", accountNumber: "****1234", lastAmount: 85.75, category: "Utilities", icon: Home },
  { id: 202, name: "Water Services", accountNumber: "****5678", lastAmount: 42.50, category: "Utilities", icon: Home },
  { id: 203, name: "Internet Provider", accountNumber: "****9012", lastAmount: 69.99, category: "Utilities", icon: Home },
  { id: 204, name: "Auto Insurance", accountNumber: "****4567", lastAmount: 112.40, category: "Insurance", icon: Shield },
  { id: 205, name: "Credit Card", accountNumber: "****7890", lastAmount: 287.65, category: "Credit Cards", icon: CreditCard }
];

const billsInbox = [
  { id: 301, name: "Bank Statement.pdf", date: "2025-04-02", size: "1.2 MB", new: true },
  { id: 302, name: "Phone_Bill.pdf", date: "2025-04-01", size: "0.8 MB", new: true },
  { id: 303, name: "Car Insurance Renewal.pdf", date: "2025-03-29", size: "2.1 MB", new: false }
];

const BillPay = () => {
  const { toast } = useToast();
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>(initialUpcomingBills);
  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAdvancedProvidersDialog, setShowAdvancedProvidersDialog] = useState(false);
  const [showDiagnosticsDialog, setShowDiagnosticsDialog] = useState(false);
  const [diagnosticButtonName, setDiagnosticButtonName] = useState<string | undefined>(undefined);
  
  const [showAddBillDialog, setShowAddBillDialog] = useState(false);
  const [showPayBillDialog, setShowPayBillDialog] = useState(false);
  const [showSchedulePaymentDialog, setShowSchedulePaymentDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  const [selectedBillForAction, setSelectedBillForAction] = useState<Bill | null>(null);
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false);
  
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);

  const billsSummary = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    const totalUnpaid = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
    const dueThisWeek = upcomingBills
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return !isAfter(dueDate, nextWeek) && !isBefore(dueDate, today);
      })
      .reduce((sum, bill) => sum + bill.amount, 0);
      
    const overdueBills = upcomingBills
      .filter(bill => isBefore(new Date(bill.dueDate), today))
      .length;

    const dueSoonBills = upcomingBills
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return !isAfter(dueDate, nextWeek) && !isBefore(dueDate, today);
      })
      .length;
      
    return { totalUnpaid, dueThisWeek, overdueBills, dueSoonBills };
  }, [upcomingBills]);

  const handleQuickPay = (billId: number) => {
    const bill = upcomingBills.find(b => b.id === billId) || 
                 frequentBills.find(b => b.id === billId);
    if (bill) {
      setSelectedBillForAction(bill as Bill);
      setShowSchedulePaymentDialog(true);
    }
  };

  const handleSetReminder = (billId: number) => {
    const bill = upcomingBills.find(b => b.id === billId);
    if (bill) {
      setSelectedBillForAction(bill);
      setShowReminderDialog(true);
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
    toast({
      title: "Bill Created",
      description: `${newBill.name} has been added successfully.`,
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

  const getBillStatus = (dueDate: string) => {
    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue < 0) return "Overdue";
    if (daysUntilDue <= 3) return "Due Soon";
    if (daysUntilDue <= 7) return "Upcoming";
    return "Scheduled";
  };

  const getBillBadgeVariant = (dueDate: string) => {
    const status = getBillStatus(dueDate);
    switch (status) {
      case "Overdue": return "destructive";
      case "Due Soon": return "warning";
      case "Upcoming": return "secondary";
      default: return "outline";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "utilities": return <Home className="h-4 w-4" />;
      case "credit cards": return <CreditCard className="h-4 w-4" />;
      case "insurance": return <Shield className="h-4 w-4" />;
      case "entertainment": return <FileText className="h-4 w-4" />;
      case "housing": return <Home className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const handleUploadBill = () => {
    toast({
      title: "Upload Bill",
      description: "The bill upload feature is coming soon",
      duration: 3000,
    });
  };

  const handleManageIntegrations = () => {
    toast({
      title: "Integrations",
      description: "Bill payment integrations management will be available soon",
      duration: 3000,
    });
  };

  const handlePaymentMethodChange = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods);
  };

  return (
    <ThreeColumnLayout title="Bill Pay" activeMainItem="family-wealth">
      <div className="flex h-full">
        <div className="flex-1 space-y-6 px-4 py-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <DashboardHeader 
              heading="Bill Payment Center" 
              text="Manage and schedule all your bill payments from one centralized location."
            />
            
            <Button 
              variant="outline" 
              onClick={() => setShowInsightsPanel(!showInsightsPanel)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Insights</span>
              <Badge variant="warning" className="ml-1">5</Badge>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Total Unpaid</p>
                    <p className="text-2xl font-semibold">${billsSummary.totalUnpaid.toFixed(2)}</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CircleDollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Due in 7 Days</p>
                    <p className="text-2xl font-semibold">${billsSummary.dueThisWeek.toFixed(2)}</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Overdue Bills</p>
                    <p className="text-2xl font-semibold">{billsSummary.overdueBills}</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Due Soon</p>
                    <p className="text-2xl font-semibold">{billsSummary.dueSoonBills}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="relative group">
              <Button 
                variant="default" 
                size="lg" 
                className="gap-2" 
                onClick={handleAddNewBill}
              >
                <Plus className="h-4 w-4" />
                Add New Bill
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => runDiagnostics("Add New Bill")}
              >
                <ActivityIcon className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="relative group">
              <Button 
                variant="default" 
                size="lg" 
                className="gap-2 bg-green-600 hover:bg-green-700" 
                onClick={handleUploadBill}
              >
                <Upload className="h-4 w-4" />
                Upload Bill
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => runDiagnostics("Upload Bill")}
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
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => runDiagnostics("Payment Methods")}
              >
                <ActivityIcon className="h-3 w-3" />
              </Button>
            </div>

            <div className="relative group">
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={handleManageIntegrations}
              >
                <Link className="h-4 w-4" />
                Manage Integrations
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-3 -right-3 h-6 w-6 p-0 bg-amber-100 border-amber-300 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => runDiagnostics("Integrations")}
              >
                <ActivityIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="upcoming" className="text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Bills
              </TabsTrigger>
              <TabsTrigger value="quick" className="text-sm">
                <ArrowUp className="h-4 w-4 mr-2" />
                Quick Pay
              </TabsTrigger>
              <TabsTrigger value="inbox" className="text-sm">
                <Inbox className="h-4 w-4 mr-2" />
                Bill Inbox
                {billsInbox.filter(bill => bill.new).length > 0 && (
                  <Badge variant="default" className="ml-2 bg-red-500">
                    {billsInbox.filter(bill => bill.new).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
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
                      {upcomingBills
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((bill) => (
                          <div 
                            key={bill.id} 
                            className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full 
                                ${bill.category === 'Utilities' ? 'bg-blue-100' :
                                  bill.category === 'Credit Cards' ? 'bg-purple-100' :
                                  bill.category === 'Insurance' ? 'bg-green-100' :
                                  'bg-gray-100'}`}
                              >
                                {getCategoryIcon(bill.category)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{bill.name}</span>
                                <span className="text-sm text-muted-foreground">{bill.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-end">
                                <span className="font-semibold">${bill.amount.toFixed(2)}</span>
                                <Badge variant={getBillBadgeVariant(bill.dueDate)}>
                                  {getBillStatus(bill.dueDate)} • {format(new Date(bill.dueDate), "MMM d")}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSetReminder(bill.id)}
                                  className="h-9"
                                >
                                  <Bell className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleQuickPay(bill.id)}
                                  className="whitespace-nowrap h-9"
                                >
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Pay Now
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
              
              <Card className="mt-6">
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
              </Card>
            </TabsContent>
            
            <TabsContent value="quick">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ArrowUp className="h-5 w-5 text-primary" />
                    Quick Pay
                  </CardTitle>
                  <CardDescription>
                    Pay your frequent bills faster
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frequentBills.map((bill) => (
                    <div 
                      key={bill.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full 
                          ${bill.category === 'Utilities' ? 'bg-blue-100' :
                            bill.category === 'Credit Cards' ? 'bg-purple-100' :
                            bill.category === 'Insurance' ? 'bg-green-100' :
                            'bg-gray-100'}`}
                        >
                          <bill.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{bill.name}</span>
                          <span className="text-sm text-muted-foreground">Acct: {bill.accountNumber}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleQuickPay(bill.id)}
                        className="whitespace-nowrap"
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Pay ${bill.lastAmount.toFixed(2)}
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button variant="ghost" onClick={handleAddNewBill}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Frequent Bill
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="inbox">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Inbox className="h-5 w-5 text-primary" />
                    Bills Inbox
                  </CardTitle>
                  <CardDescription>
                    Review and categorize your recently uploaded bills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billsInbox.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Your bills inbox is empty.</p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={handleUploadBill}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload your first bill
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {billsInbox.map((bill) => (
                        <div 
                          key={bill.id} 
                          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                            bill.new ? 'bg-blue-50 border-blue-200' : 'bg-background hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-full">
                              <FileText className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span className="font-medium">{bill.name}</span>
                                {bill.new && (
                                  <Badge variant="default" className="ml-2 bg-blue-500">New</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Uploaded on {new Date(bill.date).toLocaleDateString()} • {bill.size}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Process
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="ghost" size="sm">
                    View All Documents
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleUploadBill}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Bill
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <AddBillDialog 
            isOpen={showAddBillDialog} 
            onClose={() => setShowAddBillDialog(false)} 
            onAddBill={handleAddBill}
          />

          <PayBillDialog
            isOpen={showPayBillDialog}
            onClose={() => {
              setShowPayBillDialog(false);
              setSelectedBillForAction(null);
            }}
            bill={selectedBillForAction}
          />

          <SchedulePaymentDialog
            isOpen={showSchedulePaymentDialog}
            onClose={() => {
              setShowSchedulePaymentDialog(false);
              setSelectedBillForAction(null);
            }}
            bill={selectedBillForAction}
          />

          <ReminderSetupDialog
            isOpen={showReminderDialog}
            onClose={() => {
              setShowReminderDialog(false);
              setSelectedBillForAction(null);
            }}
            bill={selectedBillForAction}
          />

          <PaymentMethodsDialog
            isOpen={showPaymentMethodsDialog}
            onClose={() => setShowPaymentMethodsDialog(false)}
            paymentMethods={paymentMethods}
            onAddPaymentMethod={(method) => handlePaymentMethodChange([...paymentMethods, method])}
            onSetDefault={(id) => {
              const updated = paymentMethods.map(m => ({
                ...m,
                isDefault: m.id === id
              }));
              handlePaymentMethodChange(updated);
            }}
            onRemove={(id) => {
              const updated = paymentMethods.filter(m => m.id !== id);
              handlePaymentMethodChange(updated);
            }}
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
        
        <InsightsPanel 
          isExpanded={showInsightsPanel} 
          onToggle={() => setShowInsightsPanel(!showInsightsPanel)} 
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default BillPay;
