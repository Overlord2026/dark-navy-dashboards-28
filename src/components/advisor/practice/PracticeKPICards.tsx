import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, CheckSquare } from 'lucide-react';

export function PracticeKPICards() {
  const kpiData = [
    {
      title: 'Active Clients',
      value: '127',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Total active client relationships'
    },
    {
      title: 'Assets Under Management',
      value: '$24.2M',
      change: '+8.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Total AUM across all clients'
    },
    {
      title: 'Pipeline Value',
      value: '$3.8M',
      change: '+15%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Potential new AUM in pipeline'
    },
    {
      title: 'Open Tasks',
      value: '23',
      change: '-5',
      changeType: 'neutral' as const,
      icon: CheckSquare,
      description: 'Tasks requiring attention'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={kpi.changeType === 'positive' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {kpi.change}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}