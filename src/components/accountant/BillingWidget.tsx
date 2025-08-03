import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Plus, 
  FileText, 
  Clock, 
  Calendar,
  Download,
  Send,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  payment_terms: string;
  accountant_clients?: {
    business_name: string;
    email: string;
  };
}

interface TimeEntry {
  id: string;
  client_id: string;
  task_description: string;
  hours_worked: number;
  hourly_rate: number;
  work_date: string;
  is_billable: boolean;
  status: string;
  accountant_clients?: {
    business_name: string;
  };
}

interface Client {
  id: string;
  business_name: string;
  email: string;
}

export function BillingWidget() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [unbilledTimeEntries, setUnbilledTimeEntries] = useState<TimeEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<string[]>([]);

  const [newInvoice, setNewInvoice] = useState({
    client_id: '',
    invoice_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    payment_terms: '30',
    description: '',
    tax_rate: 0
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchUnbilledTimeEntries();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('accountant_invoices')
        .select(`
          *,
          accountant_clients (
            business_name,
            email
          )
        `)
        .order('invoice_date', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('accountant_clients')
        .select('id, business_name, email')
        .eq('status', 'active')
        .order('business_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchUnbilledTimeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('accountant_time_entries')
        .select(`
          *,
          accountant_clients (
            business_name
          )
        `)
        .eq('is_billable', true)
        .in('status', ['draft', 'submitted', 'approved'])
        .order('work_date', { ascending: false });

      if (error) throw error;
      setUnbilledTimeEntries(data || []);
    } catch (error) {
      console.error('Error fetching unbilled time entries:', error);
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const createInvoiceFromTimeEntries = async () => {
    if (!selectedClient || selectedTimeEntries.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a client and time entries",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedEntries = unbilledTimeEntries.filter(entry => 
        selectedTimeEntries.includes(entry.id) && entry.client_id === selectedClient
      );

      const amount = selectedEntries.reduce((sum, entry) => 
        sum + (entry.hours_worked * entry.hourly_rate), 0
      );
      
      const taxAmount = amount * (newInvoice.tax_rate / 100);
      const totalAmount = amount + taxAmount;

      const { data: invoice, error: invoiceError } = await supabase
        .from('accountant_invoices')
        .insert([{
          client_id: selectedClient,
          invoice_number: generateInvoiceNumber(),
          invoice_date: newInvoice.invoice_date,
          due_date: newInvoice.due_date,
          amount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          status: 'draft',
          description: newInvoice.description,
          payment_terms: `Net ${newInvoice.payment_terms} days`
        }])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Update time entries to mark as billed
      const { error: timeEntriesError } = await supabase
        .from('accountant_time_entries')
        .update({ status: 'billed' })
        .in('id', selectedTimeEntries);

      if (timeEntriesError) throw timeEntriesError;

      setIsCreateInvoiceOpen(false);
      setSelectedTimeEntries([]);
      setSelectedClient('');
      setNewInvoice({
        client_id: '',
        invoice_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        payment_terms: '30',
        description: '',
        tax_rate: 0
      });

      fetchInvoices();
      fetchUnbilledTimeEntries();

      toast({
        title: "Invoice Created",
        description: `Invoice ${invoice.invoice_number} created successfully`,
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('accountant_invoices')
        .update({ status })
        .eq('id', invoiceId);

      if (error) throw error;

      fetchInvoices();
      toast({
        title: "Invoice Updated",
        description: "Invoice status updated successfully",
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredTimeEntries = selectedClient 
    ? unbilledTimeEntries.filter(entry => entry.client_id === selectedClient)
    : [];

  const selectedEntriesTotal = filteredTimeEntries
    .filter(entry => selectedTimeEntries.includes(entry.id))
    .reduce((sum, entry) => sum + (entry.hours_worked * entry.hourly_rate), 0);

  // Calculate stats
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'sent').reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${pendingRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="unbilled">Unbilled Time</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Invoice from Time Entries</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Client</Label>
                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.business_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Select 
                          value={newInvoice.payment_terms} 
                          onValueChange={(value) => setNewInvoice({...newInvoice, payment_terms: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">Net 15 days</SelectItem>
                            <SelectItem value="30">Net 30 days</SelectItem>
                            <SelectItem value="60">Net 60 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedClient && (
                      <div className="space-y-3">
                        <Label>Select Time Entries to Bill</Label>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {filteredTimeEntries.map((entry) => (
                            <div key={entry.id} className="flex items-center space-x-3 p-3 border rounded">
                              <input
                                type="checkbox"
                                checked={selectedTimeEntries.includes(entry.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTimeEntries([...selectedTimeEntries, entry.id]);
                                  } else {
                                    setSelectedTimeEntries(selectedTimeEntries.filter(id => id !== entry.id));
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{entry.task_description}</p>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  <span>{format(new Date(entry.work_date), 'MMM d, yyyy')}</span>
                                  <span>{entry.hours_worked.toFixed(2)}h @ ${entry.hourly_rate}/hr</span>
                                  <span className="font-medium">${(entry.hours_worked * entry.hourly_rate).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedEntriesTotal > 0 && (
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="font-medium">Total: ${selectedEntriesTotal.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Textarea
                        value={newInvoice.description}
                        onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                        placeholder="Additional invoice description"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createInvoiceFromTimeEntries}>
                      Create Invoice
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{invoice.invoice_number}</span>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.accountant_clients?.business_name} • 
                        Due {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">${invoice.total_amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(invoice.invoice_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {invoice.status === 'sent' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No invoices yet. Create your first invoice to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unbilled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unbilled Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unbilledTimeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.accountant_clients?.business_name}</span>
                        <Badge variant="outline">{entry.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.task_description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{format(new Date(entry.work_date), 'MMM d, yyyy')}</span>
                        <span>{entry.hours_worked.toFixed(2)} hours</span>
                        <span>${entry.hourly_rate}/hr</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(entry.hours_worked * entry.hourly_rate).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {unbilledTimeEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No unbilled time entries. Start tracking time to see entries here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}