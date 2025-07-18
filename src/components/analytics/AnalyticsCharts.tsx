import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsData } from '@/hooks/useAnalytics';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface AnalyticsChartsProps {
  data: AnalyticsData[];
  loading: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, loading }) => {
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: format(new Date(item.date), 'MMM dd')
    }));
  }, [data]);

  const userTypeData = React.useMemo(() => {
    if (!data.length) return [];
    
    const latest = data[data.length - 1];
    return [
      { name: 'Advisors', value: latest.advisorLogins, color: COLORS[0] },
      { name: 'Clients', value: latest.clientLogins, color: COLORS[1] }
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No chart data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* User Growth Chart */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="totalUsers" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Total Users"
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sessions Chart */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Session Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSessions" fill="hsl(var(--primary))" name="Sessions" />
              <Bar dataKey="pageViews" fill="hsl(var(--secondary))" name="Page Views" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Types Distribution */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Onboarding Completions */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Onboarding Completions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="advisorOnboardingCompleted" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Advisor Onboarding"
              />
              <Line 
                type="monotone" 
                dataKey="clientOnboardingCompleted" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Client Onboarding"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};