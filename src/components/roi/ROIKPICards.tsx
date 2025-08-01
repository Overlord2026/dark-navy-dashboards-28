import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Calendar, Target, DollarSign, BarChart3 } from 'lucide-react';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface ROIKPICardsProps {
  dateRange: DateRange | undefined;
}

export function ROIKPICards({ dateRange }: ROIKPICardsProps) {
  // TODO: Fetch real data based on dateRange
  const kpis = [
    {
      title: 'Leads',
      value: '124',
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Appointments',
      value: '37',
      icon: Calendar,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Shows',
      value: '29',
      icon: Target,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: '1st Close',
      value: '7',
      icon: TrendingUp,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'LTV',
      value: '$8k',
      icon: DollarSign,
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'ROI %',
      value: '324%',
      icon: BarChart3,
      change: '+45%',
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
              kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.change} from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}