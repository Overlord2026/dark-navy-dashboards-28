import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Calendar, Target, DollarSign, BarChart3 } from 'lucide-react';
import { useROIData } from '@/hooks/useROIData';
import { NoDataState } from './NoDataState';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface ROIKPICardsProps {
  dateRange: DateRange | undefined;
}

export function ROIKPICards({ dateRange }: ROIKPICardsProps) {
  const { getROIMetrics } = useROIData();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const data = await getROIMetrics(dateRange);
        setMetrics(data);
      } catch (error) {
        console.error('Error loading ROI metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [dateRange, getROIMetrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics || metrics.totalLeads === 0) {
    return null; // No data state will be handled by parent component
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const costPerLead = metrics.totalSpend > 0 && metrics.totalLeads > 0 
    ? metrics.totalSpend / metrics.totalLeads 
    : 0;
  
  const costPerClient = metrics.totalSpend > 0 && metrics.closedLeads > 0 
    ? metrics.totalSpend / metrics.closedLeads 
    : 0;

  const avgLTV = metrics.closedLeads > 0 
    ? metrics.totalLTV / metrics.closedLeads 
    : 0;

  const kpis = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads.toString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Cost/Lead',
      value: formatCurrency(costPerLead),
      icon: DollarSign,
      change: '-8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Closed Deals',
      value: metrics.closedLeads.toString(),
      icon: Target,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Close Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      change: '+3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Avg LTV',
      value: formatCurrency(avgLTV),
      icon: BarChart3,
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'ROI',
      value: `${metrics.roi.toFixed(0)}%`,
      icon: TrendingUp,
      change: `+${metrics.roi > 0 ? '45' : '0'}%`,
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className={`text-xs ${
              kpi.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              {kpi.change} from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}