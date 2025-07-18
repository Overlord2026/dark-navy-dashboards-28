import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Filter, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  MoreHorizontal 
} from 'lucide-react';

export function AdminPayouts() {
  const payouts = [
    {
      id: 'PO-001',
      referrerName: 'John Advisor',
      referrerEmail: 'john@advisor.com',
      type: 'referral_reward',
      amount: 500,
      status: 'pending',
      requestDate: '2024-01-15',
      dueDate: '2024-01-22',
      description: 'Client referral payout - Sarah Johnson'
    },
    {
      id: 'PO-002',
      referrerName: 'ABC Financial',
      referrerEmail: 'contact@abcfinancial.com',
      type: 'franchise_payout',
      amount: 2500,
      status: 'approved',
      requestDate: '2024-01-10',
      dueDate: '2024-01-20',
      description: 'Franchise referral - Q4 2023'
    },
    {
      id: 'PO-003',
      referrerName: 'Mike Williams',
      referrerEmail: 'mike@advisor.com',
      type: 'advisor_override',
      amount: 750,
      status: 'paid',
      requestDate: '2024-01-05',
      dueDate: '2024-01-15',
      description: 'Advisor override commission'
    },
  ];

  const stats = [
    {
      title: 'Pending Payouts',
      value: '$12,450',
      icon: Clock,
      count: '15',
      color: 'text-yellow-600'
    },
    {
      title: 'Approved Payouts',
      value: '$8,750',
      icon: CheckCircle,
      count: '8',
      color: 'text-blue-600'
    },
    {
      title: 'Paid This Month',
      value: '$45,230',
      icon: DollarSign,
      count: '42',
      color: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: '$1,200',
      icon: XCircle,
      count: '3',
      color: 'text-red-600'
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800' },
      paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config?.className || 'bg-gray-100 text-gray-800'}>
        {config?.label || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      referral_reward: 'Referral',
      franchise_payout: 'Franchise',
      advisor_override: 'Override',
    };
    return (
      <Badge variant="outline">
        {typeConfig[type as keyof typeof typeConfig] || type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payout Management</h1>
        <p className="text-muted-foreground">
          Manage and process referral payouts, overrides, and commission payments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.count} payouts
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Payouts</CardTitle>
              <CardDescription>
                View and manage all payout requests and payments
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                Process Batch
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by referrer, payout ID, or description..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Payouts Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Payout ID</th>
                    <th className="text-left p-4 font-medium">Referrer</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Due Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b">
                      <td className="p-4">
                        <div className="font-medium">{payout.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {payout.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{payout.referrerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payout.referrerEmail}
                        </div>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(payout.type)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">${payout.amount.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(payout.status)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {payout.dueDate}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-3 of 68 payouts
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}