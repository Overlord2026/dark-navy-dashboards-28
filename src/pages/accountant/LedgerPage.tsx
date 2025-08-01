import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Filter, Download } from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
}

export default function LedgerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');

  const mockEntries: LedgerEntry[] = [
    {
      id: '1',
      date: '2024-03-10',
      account: 'Cash - Operating',
      description: 'Client payment received',
      debit: 5000,
      credit: 0,
      balance: 15000,
      reference: 'INV-001'
    },
    {
      id: '2',
      date: '2024-03-09',
      account: 'Accounts Receivable',
      description: 'Invoice to ABC Corp',
      debit: 2500,
      credit: 0,
      balance: 7500,
      reference: 'INV-002'
    },
    {
      id: '3',
      date: '2024-03-08',
      account: 'Office Expenses',
      description: 'Office supplies purchase',
      debit: 0,
      credit: 250,
      balance: 1750,
      reference: 'EXP-045'
    }
  ];

  const accounts = [
    'Cash - Operating',
    'Accounts Receivable',
    'Office Expenses',
    'Professional Services Revenue',
    'Equipment'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.account.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = selectedAccount === 'all' || entry.account === selectedAccount;
    return matchesSearch && matchesAccount;
  });

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">General Ledger</h1>
            <p className="text-muted-foreground">Complete bookkeeping and account management</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(125000)}</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(35000)}</div>
              <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Equity</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(90000)}</div>
              <p className="text-xs text-muted-foreground">+8.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ledger Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="all">All Accounts</option>
                  {accounts.map(account => (
                    <option key={account} value={account}>{account}</option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                <div>Date</div>
                <div>Account</div>
                <div>Description</div>
                <div className="text-right">Debit</div>
                <div className="text-right">Credit</div>
                <div className="text-right">Balance</div>
                <div>Reference</div>
              </div>
              
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-muted/25">
                  <div className="text-sm">{entry.date}</div>
                  <div className="text-sm">{entry.account}</div>
                  <div className="text-sm">{entry.description}</div>
                  <div className="text-sm text-right">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </div>
                  <div className="text-sm text-right">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                  </div>
                  <div className="text-sm text-right font-medium">
                    {formatCurrency(entry.balance)}
                  </div>
                  <div className="text-sm">
                    <Badge variant="outline">{entry.reference}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}