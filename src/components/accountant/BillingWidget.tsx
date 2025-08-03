import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BillingMetrics {
  total_revenue: number;
  paid_revenue: number;
  pending_revenue: number;
  invoice_count: number;
}

interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export function BillingWidget() {
  const [metrics, setMetrics] = useState<BillingMetrics>({
    total_revenue: 0,
    paid_revenue: 0,
    pending_revenue: 0,
    invoice_count: 0
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const fetchBillingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view billing data",
          variant: "destructive"
        });
        return;
      }

      // Get current period (this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Fetch billing metrics for current period
      const { data: metricsData, error: metricsError } = await supabase
        .from('billing_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_start', startOfMonth.toISOString().split('T')[0])
        .lte('period_end', endOfMonth.toISOString().split('T')[0])
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') {
        console.error('Error fetching billing metrics:', metricsError);
      }

      // If no metrics exist, calculate from invoices
      if (!metricsData) {
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('client_invoices')
          .select('amount, status')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());

        if (invoicesError) {
          console.error('Error fetching invoices for metrics:', invoicesError);
        } else {
          const calculatedMetrics = invoicesData?.reduce(
            (acc, invoice) => {
              acc.total_revenue += invoice.amount;
              if (invoice.status === 'paid') {
                acc.paid_revenue += invoice.amount;
              } else if (invoice.status === 'sent' || invoice.status === 'overdue') {
                acc.pending_revenue += invoice.amount;
              }
              acc.invoice_count++;
              return acc;
            },
            { total_revenue: 0, paid_revenue: 0, pending_revenue: 0, invoice_count: 0 }
          ) || { total_revenue: 0, paid_revenue: 0, pending_revenue: 0, invoice_count: 0 };

          setMetrics(calculatedMetrics);
        }
      } else {
        setMetrics(metricsData);
      }

      // Fetch recent invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('client_invoices')
        .select('id, client_name, amount, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (invoicesError) {
        console.error('Error fetching recent invoices:', invoicesError);
        toast({
          title: "Error",
          description: "Failed to load recent invoices",
          variant: "destructive"
        });
      } else {
        setRecentInvoices(invoicesData || []);
      }

    } catch (error) {
      console.error('Error in fetchBillingData:', error);
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();

    // Set up real-time subscription for invoices
    const invoicesSubscription = supabase
      .channel('invoice-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_invoices'
        },
        () => {
          fetchBillingData();
        }
      )
      .subscribe();

    // Set up real-time subscription for billing metrics
    const metricsSubscription = supabase
      .channel('metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'billing_metrics'
        },
        () => {
          fetchBillingData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(invoicesSubscription);
      supabase.removeChannel(metricsSubscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">
              This period • {metrics.invoice_count} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.paid_revenue)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.total_revenue > 0 ? Math.round((metrics.paid_revenue / metrics.total_revenue) * 100) : 0}% collection rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(metrics.pending_revenue)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding receivables
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invoices found</p>
              <p className="text-sm">Create your first invoice to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{invoice.client_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatCurrency(invoice.amount)}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}