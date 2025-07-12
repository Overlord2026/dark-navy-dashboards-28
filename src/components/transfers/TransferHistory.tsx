import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, CheckCircle, XCircle, AlertCircle, Banknote, CreditCard } from 'lucide-react';
import { useTransfers } from '@/context/TransfersContext';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { formatDistanceToNow } from 'date-fns';

export function TransferHistory() {
  const { transfers, loading } = useTransfers();
  const { accounts } = useBankAccounts();

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.name || 'Unknown Account';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'processing':
      case 'ach_debit_pending':
      case 'funds_held':
      case 'ach_credit_pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
      case 'ach_credit_failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
      case 'processing':
      case 'ach_debit_pending':
      case 'funds_held':
      case 'ach_credit_pending':
        return 'secondary';
      case 'failed':
      case 'ach_credit_failed':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ach_debit_pending':
        return 'ACH Debit Pending';
      case 'funds_held':
        return 'Funds Held';
      case 'ach_credit_pending':
        return 'ACH Credit Pending';
      case 'ach_credit_failed':
        return 'ACH Credit Failed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Your recent transfer activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted-foreground rounded w-32"></div>
                    <div className="h-3 bg-muted-foreground rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-muted-foreground rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Your recent transfer activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ArrowRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Transfer History</CardTitle>
            <CardDescription>
              Your completed transfers will appear here.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer History</CardTitle>
        <CardDescription>Your recent transfer activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.map(transfer => (
            <div
              key={transfer.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {transfer.transfer_type === 'ach' ? (
                    <Banknote className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-green-600" />
                  )}
                  <span className="font-medium">
                    {getAccountName(transfer.from_account_id)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {getAccountName(transfer.to_account_id)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {transfer.transfer_type === 'ach' ? 'ACH' : 'Internal'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{transfer.reference_number}</span>
                  <span>
                    {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                  </span>
                  {transfer.description && (
                    <span className="italic">"{transfer.description}"</span>
                  )}
                </div>
                
                {transfer.transfer_type === 'ach' && transfer.estimated_completion_date && (
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Expected completion: {new Date(transfer.estimated_completion_date).toLocaleDateString()}
                  </div>
                )}
                
                {transfer.failure_reason && (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    {transfer.failure_reason}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(transfer.amount)}
                  </div>
                  {transfer.transfer_fee > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Fee: {formatCurrency(transfer.transfer_fee)}
                    </div>
                  )}
                </div>
                
                <Badge variant={getStatusVariant(transfer.status)} className="flex items-center gap-1">
                  {getStatusIcon(transfer.status)}
                  {formatStatus(transfer.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}