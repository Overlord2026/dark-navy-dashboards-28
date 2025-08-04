import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  Calculator, 
  CreditCard, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Send
} from 'lucide-react';

export function PracticeBillingModule() {
  const billingMetrics = {
    pendingInvoices: '$45,200',
    collectedThisMonth: '$128,500',
    outstanding: '$12,300',
    avgFee: '1.25%',
    totalAUM: '$24.2M',
    annualRevenue: '$302,500'
  };

  const recentInvoices = [
    {
      id: 'INV-001',
      client: 'Johnson Family',
      amount: '$6,050',
      dueDate: 'Mar 20, 2024',
      status: 'Pending',
      type: 'Quarterly Management Fee',
      method: 'ACH'
    },
    {
      id: 'INV-002',
      client: 'Miller Corporation',
      amount: '$4,500',
      dueDate: 'Mar 15, 2024',
      status: 'Paid',
      type: 'Plan Administration',
      method: 'Wire'
    },
    {
      id: 'INV-003',
      client: 'Davis Household',
      amount: '$2,187',
      dueDate: 'Mar 25, 2024',
      status: 'Overdue',
      type: 'Management Fee',
      method: 'Check'
    },
    {
      id: 'INV-004',
      client: 'Chen Individual',
      amount: '$1,250',
      dueDate: 'Apr 1, 2024',
      status: 'Draft',
      type: 'Initial Planning Fee',
      method: 'Stripe'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'Pending': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'Overdue': return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      case 'Draft': return <Badge variant="outline">Draft</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Dashboard */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{billingMetrics.pendingInvoices}</div>
            <p className="text-sm text-muted-foreground">Pending Invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-green-600">{billingMetrics.collectedThisMonth}</div>
            <p className="text-sm text-muted-foreground">Collected This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-red-600">{billingMetrics.outstanding}</div>
            <p className="text-sm text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{billingMetrics.avgFee}</div>
            <p className="text-sm text-muted-foreground">Avg Fee Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{billingMetrics.totalAUM}</div>
            <p className="text-sm text-muted-foreground">Total AUM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{billingMetrics.annualRevenue}</div>
            <p className="text-sm text-muted-foreground">Annual Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Fee Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">AUM Amount</label>
              <Input placeholder="$500,000" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Fee Rate (%)</label>
              <Input placeholder="1.25" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Billing Frequency</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Quarterly</option>
                <option>Monthly</option>
                <option>Semi-Annual</option>
                <option>Annual</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                Calculate Fee
              </Button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Calculated Fee</div>
            <div className="text-2xl font-bold">$1,562.50</div>
            <div className="text-sm text-muted-foreground">per quarter</div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Generation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Client</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Johnson Family</option>
                <option>Miller Corporation</option>
                <option>Davis Household</option>
                <option>Chen Individual</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Invoice Type</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Quarterly Management Fee</option>
                <option>Initial Planning Fee</option>
                <option>Plan Administration</option>
                <option>Custom Fee</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <Input placeholder="$0.00" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Due Date</label>
              <Input type="date" />
            </div>
            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <div className="text-blue-600 font-bold">Stripe</div>
                <div className="text-xs text-muted-foreground">Credit Cards</div>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <div className="text-green-600 font-bold">ACH</div>
                <div className="text-xs text-muted-foreground">Bank Transfer</div>
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">Integration Status</div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Stripe Connected</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">ACH Setup Required</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Configure Payment Methods
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Invoices</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Bulk Send
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.id} - {invoice.client}</div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.type} • Due: {invoice.dueDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">{invoice.amount}</div>
                    <div className="text-xs text-muted-foreground">{invoice.method}</div>
                  </div>
                  
                  {getStatusBadge(invoice.status)}

                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}