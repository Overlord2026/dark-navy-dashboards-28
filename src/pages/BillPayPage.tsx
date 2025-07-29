import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CreditCard, DollarSign, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PremiumWrapper } from '@/components/ui/premium-badge';
import { toast } from 'sonner';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category: string;
  isRecurring: boolean;
}

export const BillPayPage = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasPremiumBillPay = checkFeatureAccessByKey('bill_pay_premium');

  const [bills] = useState<Bill[]>([
    {
      id: '1',
      name: 'Electric Bill',
      amount: 245.67,
      dueDate: '2024-02-15',
      status: 'pending',
      category: 'Utilities',
      isRecurring: true
    },
    {
      id: '2', 
      name: 'Internet Service',
      amount: 89.99,
      dueDate: '2024-02-12',
      status: 'paid',
      category: 'Utilities',
      isRecurring: true
    },
    {
      id: '3',
      name: 'Property Tax',
      amount: 1250.00,
      dueDate: '2024-02-20',
      status: 'pending',
      category: 'Tax',
      isRecurring: false
    }
  ]);

  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Utilities'
  });

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success(`Bill "${newBill.name}" added successfully`);
    setNewBill({ name: '', amount: '', dueDate: '', category: 'Utilities' });
  };

  const handlePayBill = (billId: string, billName: string) => {
    if (!hasPremiumBillPay) {
      toast.info('Upgrade to Premium for automated bill payments');
      return;
    }
    toast.success(`Payment scheduled for ${billName}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800', 
      overdue: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || '';
  };

  const totalPending = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bill Pay & Management</h1>
          <p className="text-muted-foreground">
            Manage and schedule your bill payments in one central location
          </p>
        </div>
        <PremiumWrapper isPremium={hasPremiumBillPay} showBadge>
          <Badge variant="outline" className="ml-2">
            {hasPremiumBillPay ? 'Premium Active' : 'Basic Plan'}
          </Badge>
        </PremiumWrapper>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {bills.filter(b => b.status === 'pending').length} bills due
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total scheduled payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Auto-Pay</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bills.filter(b => b.isRecurring).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recurring bills setup
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bills">My Bills</TabsTrigger>
          <TabsTrigger value="add">Add Bill</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="bills">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
              <CardDescription>
                View and manage your scheduled bill payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(bill.status)}
                      <div>
                        <div className="font-medium">{bill.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(bill.dueDate).toLocaleDateString()} • {bill.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">${bill.amount.toFixed(2)}</div>
                        <Badge className={getStatusBadge(bill.status)}>
                          {bill.status}
                        </Badge>
                      </div>
                      {bill.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handlePayBill(bill.id, bill.name)}
                          disabled={!hasPremiumBillPay}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Bill
              </CardTitle>
              <CardDescription>
                Set up a new bill for tracking and payment scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billName">Bill Name *</Label>
                  <Input
                    id="billName"
                    placeholder="Enter bill name"
                    value={newBill.name}
                    onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newBill.amount}
                    onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newBill.category}
                    onValueChange={(value) => setNewBill({...newBill, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Tax">Tax</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddBill} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View your past bill payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment History</h3>
                <p className="text-muted-foreground mb-4">
                  Your payment history will appear here once you start making payments
                </p>
                {!hasPremiumBillPay && (
                  <Button variant="outline">
                    Upgrade to Premium for Full History
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Premium Features Promotion */}
      {!hasPremiumBillPay && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Unlock Premium Bill Pay Features
            </CardTitle>
            <CardDescription>
              Get automated payments, detailed analytics, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Automated bill payments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Payment history & analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Late payment alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Budget integration
              </li>
            </ul>
            <Button>Upgrade to Premium</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};