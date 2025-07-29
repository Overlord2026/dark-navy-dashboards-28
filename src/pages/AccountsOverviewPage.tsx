import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CreditCard,
  Home,
  Banknote,
  DollarSign,
  Eye,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PremiumWrapper } from '@/components/ui/premium-badge';
import { toast } from 'sonner';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'retirement' | 'property' | 'business';
  provider: string;
  balance: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  isConnected: boolean;
}

export const AccountsOverviewPage = () => {
  const { checkFeatureAccessByKey } = useFeatureAccess();
  const hasAdvancedAccounts = checkFeatureAccessByKey('premium_analytics_access');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [accounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Primary Checking',
      type: 'checking',
      provider: 'Chase Bank',
      balance: 125000,
      change: -2500,
      changePercent: -1.96,
      lastUpdated: '2024-02-14T10:30:00Z',
      isConnected: true
    },
    {
      id: '2',
      name: 'High-Yield Savings',
      type: 'savings',
      provider: 'Goldman Sachs',
      balance: 350000,
      change: 1200,
      changePercent: 0.34,
      lastUpdated: '2024-02-14T10:30:00Z',
      isConnected: true
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      provider: 'Fidelity',
      balance: 2450000,
      change: 45000,
      changePercent: 1.87,
      lastUpdated: '2024-02-14T10:25:00Z',
      isConnected: true
    },
    {
      id: '4',
      name: '401(k) Retirement',
      type: 'retirement',
      provider: 'Vanguard',
      balance: 1200000,
      change: 18000,
      changePercent: 1.52,
      lastUpdated: '2024-02-14T09:00:00Z',
      isConnected: true
    },
    {
      id: '5',
      name: 'Main Residence',
      type: 'property',
      provider: 'Manual Entry',
      balance: 1800000,
      change: 25000,
      changePercent: 1.41,
      lastUpdated: '2024-02-01T00:00:00Z',
      isConnected: false
    },
    {
      id: '6',
      name: 'Business Account',
      type: 'business',
      provider: 'Bank of America',
      balance: 75000,
      change: 5000,
      changePercent: 7.14,
      lastUpdated: '2024-02-14T10:15:00Z',
      isConnected: true
    }
  ]);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return <CreditCard className="h-5 w-5" />;
      case 'investment':
      case 'retirement':
        return <BarChart3 className="h-5 w-5" />;
      case 'property':
        return <Home className="h-5 w-5" />;
      case 'business':
        return <Banknote className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking': return 'bg-blue-100 text-blue-800';
      case 'savings': return 'bg-green-100 text-green-800';
      case 'investment': return 'bg-purple-100 text-purple-800';
      case 'retirement': return 'bg-orange-100 text-orange-800';
      case 'property': return 'bg-yellow-100 text-yellow-800';
      case 'business': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || account.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalChange = accounts.reduce((sum, account) => sum + account.change, 0);
  const connectedAccounts = accounts.filter(account => account.isConnected).length;

  const handleRefreshAccounts = () => {
    toast.success('Account data refreshed successfully');
  };

  const handleConnectAccount = () => {
    if (!hasAdvancedAccounts) {
      toast.info('Upgrade to Premium for automated account connections');
      return;
    }
    toast.success('Account connection initiated');
  };

  const accountTypes = [
    { value: 'all', label: 'All Accounts' },
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'investment', label: 'Investment' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'property', label: 'Property' },
    { value: 'business', label: 'Business' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounts Overview</h1>
          <p className="text-muted-foreground">
            Centralized view and management of all your financial accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumWrapper isPremium={hasAdvancedAccounts} showBadge>
            <Badge variant="outline">
              {hasAdvancedAccounts ? 'Auto-Sync Enabled' : 'Manual Updates'}
            </Badge>
          </PremiumWrapper>
          <Button variant="outline" size="sm" onClick={handleRefreshAccounts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(totalChange)}`}>
              {getChangeIcon(totalChange)}
              <span>
                {totalChange >= 0 ? '+' : ''}${Math.abs(totalChange).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedAccounts}</div>
            <p className="text-xs text-muted-foreground">
              of {accounts.length} total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Liquid Assets</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${accounts
                .filter(a => a.type === 'checking' || a.type === 'savings')
                .reduce((sum, a) => sum + a.balance, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for immediate use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investment Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((accounts
                .filter(a => a.type === 'investment' || a.type === 'retirement')
                .reduce((sum, a) => sum + a.change, 0) / 
                accounts
                .filter(a => a.type === 'investment' || a.type === 'retirement')
                .reduce((sum, a) => sum + a.balance, 0)) * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average portfolio performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Accounts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by account name or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="filter">Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleConnectAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Account List</TabsTrigger>
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{account.name}</h3>
                          <Badge className={getAccountTypeColor(account.type)}>
                            {account.type}
                          </Badge>
                          {!account.isConnected && (
                            <Badge variant="outline" className="text-orange-600">
                              Manual
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{account.provider}</p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date(account.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${account.balance.toLocaleString()}</div>
                      <div className={`flex items-center gap-1 text-sm ${getChangeColor(account.change)}`}>
                        {getChangeIcon(account.change)}
                        <span>
                          {account.change >= 0 ? '+' : ''}${Math.abs(account.change).toLocaleString()} 
                          ({account.changePercent >= 0 ? '+' : ''}{account.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid lg:grid-cols-2 gap-6">
            {accountTypes.slice(1).map((type) => {
              const typeAccounts = accounts.filter(a => a.type === type.value);
              const typeTotal = typeAccounts.reduce((sum, a) => sum + a.balance, 0);
              const typeChange = typeAccounts.reduce((sum, a) => sum + a.change, 0);
              
              if (typeAccounts.length === 0) return null;

              return (
                <Card key={type.value}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getAccountIcon(type.value)}
                        {type.label}
                      </CardTitle>
                      <Badge className={getAccountTypeColor(type.value)}>
                        {typeAccounts.length} accounts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold">${typeTotal.toLocaleString()}</div>
                        <div className={`flex items-center gap-1 text-sm ${getChangeColor(typeChange)}`}>
                          {getChangeIcon(typeChange)}
                          <span>
                            {typeChange >= 0 ? '+' : ''}${Math.abs(typeChange).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {typeAccounts.map((account) => (
                          <div key={account.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{account.name}</span>
                            <span className="font-medium">${account.balance.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Analytics</CardTitle>
                <CardDescription>
                  Detailed analysis of your account performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasAdvancedAccounts ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Asset Allocation</div>
                      <div className="text-sm text-blue-600">
                        Well-diversified across account types
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Liquidity Position</div>
                      <div className="text-sm text-green-600">
                        Strong cash reserves for emergencies
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-800">Growth Trend</div>
                      <div className="text-sm text-purple-600">
                        Consistent positive growth across portfolios
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Get detailed insights into your account performance
                    </p>
                    <Button>Upgrade for Analytics</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Health</CardTitle>
                <CardDescription>
                  Overall health metrics for your accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {connectedAccounts}/{accounts.length} Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Freshness</span>
                    <span className="text-sm font-medium">Current</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Account Diversity</span>
                    <span className="text-sm font-medium">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Distribution</span>
                    <span className="text-sm font-medium">Balanced</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Premium Features Promotion */}
      {!hasAdvancedAccounts && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Unlock Premium Account Features</CardTitle>
            <CardDescription>
              Get automated account connections, advanced analytics, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Automated account syncing
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  Advanced analytics & insights
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-green-500" />
                  Real-time balance updates
                </li>
                <li className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-green-500" />
                  Custom alerts & notifications
                </li>
              </ul>
            </div>
            <Button>Upgrade to Premium</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};