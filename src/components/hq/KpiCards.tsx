import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, Wrench } from 'lucide-react';

interface KpiData {
  households: number | string;
  proSeats: number | string;
  toolsPerSeat: number | string;
}

export function KpiCards() {
  // Mock data - in real implementation, this would come from useKpiData hook
  const kpiData: KpiData = {
    households: 247,
    proSeats: 156,
    toolsPerSeat: 8.3
  };

  const kpis = [
    {
      title: 'Active Households',
      value: typeof kpiData.households === 'number' ? kpiData.households.toLocaleString() : kpiData.households,
      icon: Users,
      description: 'Families using our platform',
      trend: '+12% this quarter'
    },
    {
      title: 'Professional Seats',
      value: typeof kpiData.proSeats === 'number' ? kpiData.proSeats.toLocaleString() : kpiData.proSeats,
      icon: Building,
      description: 'Active advisor accounts',
      trend: '+8% this quarter'
    },
    {
      title: 'Tools/Seat/Month',
      value: typeof kpiData.toolsPerSeat === 'number' ? kpiData.toolsPerSeat.toFixed(1) : kpiData.toolsPerSeat,
      icon: Wrench,
      description: 'Average tool utilization',
      trend: '+15% this quarter'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Key Performance Indicators</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="bfo-stat">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{kpi.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-bfo-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                <p className="text-xs text-gray-300 mt-1">{kpi.description}</p>
                <p className="text-xs text-bfo-gold mt-1">{kpi.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}