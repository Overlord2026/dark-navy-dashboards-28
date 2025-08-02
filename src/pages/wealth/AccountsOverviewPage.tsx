import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MainLayout } from '@/components/layout/MainLayout';
import { DollarSign, TrendingUp, PieChart, Users, Building, CreditCard, Landmark, TrendingDown } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'retirement' | 'credit';
  institution: string;
  balance: number;
  change: number;
  changePercent: number;
  owner: string;
}

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Primary Checking',
    type: 'checking',
    institution: 'Chase Bank',
    balance: 25000,
    change: 1250,
    changePercent: 5.26,
    owner: 'John Smith'
  },
  {
    id: '2',
    name: 'High Yield Savings',
    type: 'savings',
    institution: 'Marcus by Goldman Sachs',
    balance: 150000,
    change: 3200,
    changePercent: 2.18,
    owner: 'John Smith'
  },
  {
    id: '3',
    name: 'Investment Portfolio',
    type: 'investment',
    institution: 'Vanguard',
    balance: 750000,
    change: -12500,
    changePercent: -1.64,
    owner: 'John Smith'
  },
  {
    id: '4',
    name: '401(k) Retirement',
    type: 'retirement',
    institution: 'Fidelity',
    balance: 425000,
    change: 8500,
    changePercent: 2.04,
    owner: 'John Smith'
  },
  {
    id: '5',
    name: 'Roth IRA',
    type: 'retirement',
    institution: 'Charles Schwab',
    balance: 125000,
    change: 2100,
    changePercent: 1.71,
    owner: 'Jane Smith'
  },
  {
    id: '6',
    name: 'Credit Card',
    type: 'credit',
    institution: 'American Express',
    balance: -8500,
    change: -500,
    changePercent: 6.25,
    owner: 'John Smith'
  }
];

export default function AccountsOverviewPage() {
  const [selectedOwner, setSelectedOwner] = useState<string>('all');

  const filteredAccounts = selectedOwner === 'all' 
    ? mockAccounts 
    : mockAccounts.filter(account => account.owner === selectedOwner);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return <Landmark className="h-5 w-5" />;
      case 'savings': return <PieChart className="h-5 w-5" />;
      case 'investment': return <TrendingUp className="h-5 w-5" />;
      case 'retirement': return <Building className="h-5 w-5" />;
      case 'credit': return <CreditCard className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking': return 'text-accent-aqua';
      case 'savings': return 'text-accent-gold';
      case 'investment': return 'text-emerald-500';
      case 'retirement': return 'text-purple-500';
      case 'credit': return 'text-red-500';
      default: return 'text-white';
    }
  };

  const totalAssets = filteredAccounts.filter(a => a.type !== 'credit').reduce((sum, account) => sum + account.balance, 0);
  const totalLiabilities = Math.abs(filteredAccounts.filter(a => a.type === 'credit').reduce((sum, account) => sum + account.balance, 0));
  const netWorth = totalAssets - totalLiabilities;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 font-display tracking-tight">
              ACCOUNTS OVERVIEW
            </h1>
            <p className="text-text-secondary text-lg">
              Monitor all your family's financial accounts in one place
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Total Assets</p>
                    <p className="text-2xl font-bold text-white">
                      ${totalAssets.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Total Liabilities</p>
                    <p className="text-2xl font-bold text-red-500">
                      ${totalLiabilities.toLocaleString()}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Net Worth</p>
                    <p className="text-2xl font-bold text-accent-gold">
                      ${netWorth.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Accounts</p>
                    <p className="text-2xl font-bold text-white">{filteredAccounts.length}</p>
                  </div>
                  <Building className="h-8 w-8 text-accent-aqua" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <Card className="mb-6 bg-surface border-border-primary">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button 
                  variant={selectedOwner === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedOwner('all')}
                  className={selectedOwner === 'all' ? 'bg-accent-gold text-primary' : 'border-accent-gold text-accent-gold'}
                >
                  All Accounts
                </Button>
                <Button 
                  variant={selectedOwner === 'John Smith' ? 'default' : 'outline'}
                  onClick={() => setSelectedOwner('John Smith')}
                  className={selectedOwner === 'John Smith' ? 'bg-accent-aqua text-primary' : 'border-accent-aqua text-accent-aqua'}
                >
                  John Smith
                </Button>
                <Button 
                  variant={selectedOwner === 'Jane Smith' ? 'default' : 'outline'}
                  onClick={() => setSelectedOwner('Jane Smith')}
                  className={selectedOwner === 'Jane Smith' ? 'bg-emerald-500 text-primary' : 'border-emerald-500 text-emerald-500'}
                >
                  Jane Smith
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Accounts List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="bg-card border-border-primary hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-surface ${getAccountColor(account.type)}`}>
                          {getAccountIcon(account.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{account.name}</h3>
                          <p className="text-text-secondary text-sm">{account.institution}</p>
                        </div>
                      </div>
                      <Badge 
                        className={`capitalize ${
                          account.type === 'credit' ? 'bg-red-500' : 
                          account.type === 'investment' ? 'bg-emerald-500' :
                          account.type === 'retirement' ? 'bg-purple-500' :
                          'bg-accent-gold'
                        } text-white`}
                      >
                        {account.type}
                      </Badge>
                    </div>

                    {/* Balance */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Balance:</span>
                        <span className={`text-xl font-bold ${account.balance < 0 ? 'text-red-500' : 'text-white'}`}>
                          ${Math.abs(account.balance).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Change:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${account.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {account.change >= 0 ? '+' : ''}${account.change.toFixed(0)}
                          </span>
                          <Badge 
                            className={`${account.change >= 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white`}
                          >
                            {account.change >= 0 ? '+' : ''}{account.changePercent.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border-primary/30">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-accent-gold text-primary text-xs font-bold">
                          {account.owner.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-text-secondary text-sm">{account.owner}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}