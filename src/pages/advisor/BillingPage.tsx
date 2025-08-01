import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, Clock, CheckCircle, AlertTriangle, Plus, Download } from 'lucide-react';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  sentDate: string;
  description: string;
  type: 'management_fee' | 'performance_fee' | 'consultation' | 'planning';
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'fees'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const mockInvoices: Invoice[] = [
    {
      id: 'INV-001',
      clientName: 'Johnson Family',
      amount: 2500,
      status: 'sent',
      dueDate: '2024-03-20',
      sentDate: '2024-03-01',
      description: 'Q1 2024 Portfolio Management Fee',
      type: 'management_fee'
    },
    {
      id: 'INV-002',
      clientName: 'Smith Trust',
      amount: 1800,
      status: 'paid',
      dueDate: '2024-03-15',
      sentDate: '2024-02-15',
      description: 'Financial Planning Services',
      type: 'planning'
    },
    {
      id: 'INV-003',
      clientName: 'Williams LLC',
      amount: 3200,
      status: 'overdue',
      dueDate: '2024-02-28',
      sentDate: '2024-02-01',
      description: 'Investment Consultation',
      type: 'consultation'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      sent: 'default',
      paid: 'default',
      overdue: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('_', ' ')}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const outstandingRevenue = mockInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fee & Billing Management</h1>
            <p className="text-muted-foreground">Automated fee calculation and client invoicing</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {['overview', 'invoices', 'fees'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">This quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collected</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(paidRevenue)}</div>
                  <p className="text-xs text-muted-foreground">{Math.round((paidRevenue/totalRevenue)*100)}% collection rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(outstandingRevenue)}</div>
                  <p className="text-xs text-muted-foreground">Pending payment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Needs follow-up</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Billing Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Payment received from Smith Trust</div>
                      <div className="text-xs text-muted-foreground">2 hours ago • {formatCurrency(1800)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Invoice sent to Johnson Family</div>
                      <div className="text-xs text-muted-foreground">1 day ago • {formatCurrency(2500)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Williams LLC invoice overdue</div>
                      <div className="text-xs text-muted-foreground">3 days ago • {formatCurrency(3200)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'invoices' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Invoices
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(invoice.status)}
                      <div>
                        <div className="font-medium">{invoice.id} - {invoice.clientName}</div>
                        <div className="text-sm text-muted-foreground">{invoice.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Sent: {invoice.sentDate} • Due: {invoice.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {invoice.type.replace('_', ' ')}
                        </div>
                      </div>
                      {getStatusBadge(invoice.status)}
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'fees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Management Fee</div>
                      <div className="text-sm text-muted-foreground">Annual AUM-based fee</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">1.00%</div>
                      <div className="text-xs text-muted-foreground">Quarterly billing</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Performance Fee</div>
                      <div className="text-sm text-muted-foreground">Above benchmark returns</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">20%</div>
                      <div className="text-xs text-muted-foreground">Annual billing</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Planning Fee</div>
                      <div className="text-sm text-muted-foreground">Financial planning services</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$300/hr</div>
                      <div className="text-xs text-muted-foreground">Monthly billing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Billing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Management fees</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Performance fees</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment reminders</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Late fee assessment</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <Button className="w-full mt-4">
                    Configure Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}