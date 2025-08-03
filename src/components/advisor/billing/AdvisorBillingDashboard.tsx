import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  Users, 
  Calendar as CalendarIcon,
  Download,
  Plus,
  Edit,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientFee {
  id: string;
  client_id: string;
  client_name: string;
  fee_type: 'aum' | 'hourly' | 'flat' | 'performance';
  fee_rate: number;
  fee_amount: number;
  billing_frequency: 'monthly' | 'quarterly' | 'annually';
  aum_value?: number;
  hours_worked?: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: Date;
  invoice_number?: string;
  created_at: Date;
}

interface BillingMetrics {
  totalRevenue: number;
  monthlyRecurring: number;
  pendingInvoices: number;
  overdueAmount: number;
  averageFeePerClient: number;
  clientCount: number;
}

export const AdvisorBillingDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientFees, setClientFees] = useState<ClientFee[]>([]);
  const [metrics, setMetrics] = useState<BillingMetrics>({
    totalRevenue: 0,
    monthlyRecurring: 0,
    pendingInvoices: 0,
    overdueAmount: 0,
    averageFeePerClient: 0,
    clientCount: 0
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showNewFeeForm, setShowNewFeeForm] = useState(false);
  const [newFee, setNewFee] = useState<{
    client_id: string;
    fee_type: 'aum' | 'hourly' | 'flat' | 'performance';
    fee_rate: number;
    billing_frequency: 'monthly' | 'quarterly' | 'annually';
    aum_value: number;
    hours_worked: number;
  }>({
    client_id: '',
    fee_type: 'aum',
    fee_rate: 0,
    billing_frequency: 'quarterly',
    aum_value: 0,
    hours_worked: 0
  });

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Mock data for billing - in production this would come from your database
      const mockFees: ClientFee[] = [
        {
          id: '1',
          client_id: 'client1',
          client_name: 'John & Sarah Wilson',
          fee_type: 'aum',
          fee_rate: 1.0,
          fee_amount: 12500,
          billing_frequency: 'quarterly',
          aum_value: 1250000,
          status: 'paid',
          due_date: new Date('2024-01-15'),
          invoice_number: 'INV-2024-001',
          created_at: new Date('2024-01-01')
        },
        {
          id: '2',
          client_id: 'client2',
          client_name: 'Michael Chen',
          fee_type: 'hourly',
          fee_rate: 350,
          fee_amount: 2800,
          billing_frequency: 'monthly',
          hours_worked: 8,
          status: 'sent',
          due_date: new Date('2024-02-15'),
          invoice_number: 'INV-2024-002',
          created_at: new Date('2024-02-01')
        },
        {
          id: '3',
          client_id: 'client3',
          client_name: 'Thompson Family Trust',
          fee_type: 'flat',
          fee_rate: 5000,
          fee_amount: 5000,
          billing_frequency: 'monthly',
          status: 'overdue',
          due_date: new Date('2024-01-30'),
          invoice_number: 'INV-2024-003',
          created_at: new Date('2024-01-15')
        }
      ];

      setClientFees(mockFees);

      // Calculate metrics
      const totalRevenue = mockFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.fee_amount, 0);
      const monthlyRecurring = mockFees.filter(f => f.billing_frequency === 'monthly').reduce((sum, f) => sum + f.fee_amount, 0);
      const pendingInvoices = mockFees.filter(f => f.status === 'sent').length;
      const overdueAmount = mockFees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + f.fee_amount, 0);
      const clientCount = new Set(mockFees.map(f => f.client_id)).size;
      const averageFeePerClient = clientCount > 0 ? totalRevenue / clientCount : 0;

      setMetrics({
        totalRevenue,
        monthlyRecurring,
        pendingInvoices,
        overdueAmount,
        averageFeePerClient,
        clientCount
      });

    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFeeAmount = () => {
    const { fee_type, aum_value, fee_rate, billing_frequency, hours_worked } = newFee;
    
    if (fee_type === 'aum') {
      const divisor = billing_frequency === 'monthly' ? 12 : billing_frequency === 'quarterly' ? 4 : 1;
      return (aum_value * fee_rate / 100) / divisor;
    } else if (fee_type === 'hourly') {
      return hours_worked * fee_rate;
    } else if (fee_type === 'flat') {
      return fee_rate;
    }
    return 0;
  };

  const createInvoice = async (feeId: string) => {
    try {
      // In production, this would call your invoice generation service
      const fee = clientFees.find(f => f.id === feeId);
      if (!fee) return;

      toast({
        title: "Invoice Created",
        description: `Invoice ${fee.invoice_number} created for ${fee.client_name}`,
      });

      // Update status to sent
      setClientFees(fees => 
        fees.map(f => f.id === feeId ? { ...f, status: 'sent' as const } : f)
      );
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      });
    }
  };

  const sendInvoice = async (feeId: string) => {
    try {
      const fee = clientFees.find(f => f.id === feeId);
      if (!fee) return;

      // In production, this would integrate with your email service
      toast({
        title: "Invoice Sent",
        description: `Invoice sent to ${fee.client_name}`,
      });

    } catch (error) {
      console.error('Error sending invoice:', error);
      toast({
        title: "Error",
        description: "Failed to send invoice",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing & Fee Management</h1>
          <p className="text-muted-foreground">Manage client fees and generate invoices</p>
        </div>
        <Button onClick={() => setShowNewFeeForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Fee
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Monthly Recurring</span>
            </div>
            <div className="text-2xl font-bold">${metrics.monthlyRecurring.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">Pending Invoices</span>
            </div>
            <div className="text-2xl font-bold">{metrics.pendingInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Overdue Amount</span>
            </div>
            <div className="text-2xl font-bold">${metrics.overdueAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Active Clients</span>
            </div>
            <div className="text-2xl font-bold">{metrics.clientCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-muted-foreground">Avg Per Client</span>
            </div>
            <div className="text-2xl font-bold">${Math.round(metrics.averageFeePerClient).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="fees" className="w-full">
        <TabsList>
          <TabsTrigger value="fees">Client Fees</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Fee Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientFees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{fee.client_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {fee.fee_type.toUpperCase()} • {fee.billing_frequency}
                        {fee.fee_type === 'aum' && ` • ${fee.fee_rate}% on $${fee.aum_value?.toLocaleString()}`}
                        {fee.fee_type === 'hourly' && ` • $${fee.fee_rate}/hr • ${fee.hours_worked} hours`}
                        {fee.fee_type === 'flat' && ` • $${fee.fee_rate}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: {format(fee.due_date, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-bold">${fee.fee_amount.toLocaleString()}</div>
                        <Badge className={getStatusColor(fee.status)}>
                          {fee.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        {fee.status === 'draft' && (
                          <Button size="sm" variant="outline" onClick={() => createInvoice(fee.id)}>
                            <Receipt className="h-3 w-3" />
                          </Button>
                        )}
                        {fee.status === 'sent' && (
                          <Button size="sm" variant="outline" onClick={() => sendInvoice(fee.id)}>
                            <Send className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Invoice generation and tracking features coming soon.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Revenue Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Client Billing Summary
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Overdue Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Fee Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Fee Form Modal would go here */}
      {showNewFeeForm && (
        <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <CardContent className="max-w-md mx-auto mt-20 p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Client Fee</h3>
            {/* Form fields would go here */}
            <div className="flex space-x-2 mt-6">
              <Button onClick={() => setShowNewFeeForm(false)} variant="outline">Cancel</Button>
              <Button>Save Fee</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};