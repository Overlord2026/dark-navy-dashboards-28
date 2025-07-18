import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsData } from '@/hooks/useAnalytics';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Activity, 
  Clock, 
  Eye,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsMetricsProps {
  data: AnalyticsData[];
  loading: boolean;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ data, loading }) => {
  const aggregateMetrics = React.useMemo(() => {
    if (!data.length) return null;

    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;
    
    const calculateChange = (current: number, prev: number | null) => {
      if (!prev) return 0;
      return ((current - prev) / prev) * 100;
    };

    return {
      totalUsers: {
        value: latest.totalUsers,
        change: calculateChange(latest.totalUsers, previous?.totalUsers || null)
      },
      activeUsers: {
        value: latest.activeUsers,
        change: calculateChange(latest.activeUsers, previous?.activeUsers || null)
      },
      newUsers: {
        value: latest.newUsers,
        change: calculateChange(latest.newUsers, previous?.newUsers || null)
      },
      totalSessions: {
        value: latest.totalSessions,
        change: calculateChange(latest.totalSessions, previous?.totalSessions || null)
      },
      avgSessionDuration: {
        value: latest.avgSessionDuration,
        change: calculateChange(latest.avgSessionDuration, previous?.avgSessionDuration || null)
      },
      pageViews: {
        value: latest.pageViews,
        change: calculateChange(latest.pageViews, previous?.pageViews || null)
      },
      newAdvisors: {
        value: latest.newAdvisors,
        change: calculateChange(latest.newAdvisors, previous?.newAdvisors || null)
      },
      conversionRate: {
        value: latest.conversionRate,
        change: calculateChange(latest.conversionRate, previous?.conversionRate || null)
      }
    };
  }, [data]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!aggregateMetrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No data available for the selected period</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Total Users',
      value: aggregateMetrics.totalUsers.value.toLocaleString(),
      change: aggregateMetrics.totalUsers.change,
      icon: Users
    },
    {
      title: 'Active Users',
      value: aggregateMetrics.activeUsers.value.toLocaleString(),
      change: aggregateMetrics.activeUsers.change,
      icon: UserCheck
    },
    {
      title: 'New Users',
      value: aggregateMetrics.newUsers.value.toLocaleString(),
      change: aggregateMetrics.newUsers.change,
      icon: UserPlus
    },
    {
      title: 'Total Sessions',
      value: aggregateMetrics.totalSessions.value.toLocaleString(),
      change: aggregateMetrics.totalSessions.change,
      icon: Activity
    },
    {
      title: 'Avg Session Duration',
      value: formatDuration(aggregateMetrics.avgSessionDuration.value),
      change: aggregateMetrics.avgSessionDuration.change,
      icon: Clock
    },
    {
      title: 'Page Views',
      value: aggregateMetrics.pageViews.value.toLocaleString(),
      change: aggregateMetrics.pageViews.change,
      icon: Eye
    },
    {
      title: 'New Advisors',
      value: aggregateMetrics.newAdvisors.value.toLocaleString(),
      change: aggregateMetrics.newAdvisors.change,
      icon: TrendingUp
    },
    {
      title: 'Conversion Rate',
      value: `${aggregateMetrics.conversionRate.value.toFixed(1)}%`,
      change: aggregateMetrics.conversionRate.change,
      icon: Target
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={cn("text-xs", getChangeColor(metric.change))}>
                {formatChange(metric.change)} from last period
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};