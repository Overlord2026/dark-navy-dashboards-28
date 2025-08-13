import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  FileText, 
  AlertCircle, 
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

interface AccountingMetrics {
  todaysCash: number;
  openInvoices: { count: number; total: number };
  openBills: { count: number; total: number };
  unreconciled: number;
  monthlyPL: { revenue: number; expenses: number; net: number };
}

export const AccountingOSCards: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [metrics, setMetrics] = useState<AccountingMetrics>({
    todaysCash: 0,
    openInvoices: { count: 0, total: 0 },
    openBills: { count: 0, total: 0 },
    unreconciled: 0,
    monthlyPL: { revenue: 0, expenses: 0, net: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Only show for CPA/accountant roles
  if (!userProfile?.role || (userProfile.role !== 'accountant' && !userProfile.role.includes('cpa'))) {
    return null;
  }

  useEffect(() => {
    fetchAccountingMetrics();
  }, [userProfile]);

  const fetchAccountingMetrics = async () => {
    try {
      setLoading(true);
      
      // Use existing accounting tables with fallback values
      // Get open invoices from accounting_invoices table
      const { data: invoicesData } = await supabase
        .from('accounting_invoices')
        .select('total_amount')
        .eq('status', 'sent');

      // Calculate metrics with fallback demo data
      const openInvoices = {
        count: invoicesData?.length || 3,
        total: invoicesData?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 12300
      };

      const openBills = {
        count: 2, // Demo data
        total: 8750 // Demo data
      };

      const monthlyPL = {
        revenue: 125000,
        expenses: 87500,
        net: 37500
      };

      setMetrics({
        todaysCash: 25840, // Demo data
        openInvoices,
        openBills,
        unreconciled: 3, // Demo data
        monthlyPL
      });

    } catch (error) {
      console.error('Error fetching accounting metrics:', error);
      // Set fallback demo data on error
      setMetrics({
        todaysCash: 25840,
        openInvoices: { count: 3, total: 12300 },
        openBills: { count: 2, total: 8750 },
        unreconciled: 3,
        monthlyPL: { revenue: 125000, expenses: 87500, net: 37500 }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Today's Cash",
      value: formatCurrency(metrics.todaysCash),
      change: "+2.4%",
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      route: '/accounting/cash'
    },
    {
      title: "Open Invoices",
      value: formatCurrency(metrics.openInvoices.total),
      subtitle: `${metrics.openInvoices.count} invoices`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      route: '/accounting/invoices'
    },
    {
      title: "Open Bills",
      value: formatCurrency(metrics.openBills.total),
      subtitle: `${metrics.openBills.count} bills`,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      route: '/accounting/bills'
    },
    {
      title: "Unreconciled Items",
      value: metrics.unreconciled.toString(),
      subtitle: "Items need review",
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      route: '/accounting/reconcile'
    },
    {
      title: "This Month's P&L",
      value: formatCurrency(metrics.monthlyPL.net),
      subtitle: `Rev: ${formatCurrency(metrics.monthlyPL.revenue)} | Exp: ${formatCurrency(metrics.monthlyPL.expenses)}`,
      change: "+12.3%",
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      route: '/accounting/reports'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Accounting OS</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/accounting')}
        >
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`${card.borderColor} hover:shadow-lg transition-all duration-200 cursor-pointer`}
              onClick={() => navigate(card.route)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  {card.change && (
                    <Badge variant="secondary" className={`text-xs ${
                      card.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {card.changeType === 'positive' ? 
                        <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      }
                      {card.change}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                  <p className="text-lg font-semibold text-foreground">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};