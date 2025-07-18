import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsMetrics } from './AnalyticsMetrics';
import { AnalyticsCharts } from './AnalyticsCharts';
import { OnboardingProgress } from './OnboardingProgress';
import { CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AnalyticsDashboardProps {
  tenantId?: string;
  isSuper?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tenantId,
  isSuper = false
}) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const {
    analytics,
    onboardingProgress,
    loading,
    error,
    refetch,
    exportReport
  } = useAnalytics(tenantId, dateRange);

  const handleExport = async () => {
    try {
      await exportReport(exportFormat);
      toast.success('Report exported successfully');
    } catch (err) {
      toast.error('Failed to export report');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
            <Button onClick={refetch} className="w-full mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSuper ? 'Global Analytics' : 'Analytics Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isSuper 
              ? 'View aggregated analytics across all tenants'
              : 'Monitor your tenant\'s usage and engagement metrics'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Export Controls */}
          <Select value={exportFormat} onValueChange={(value: 'csv' | 'json') => setExportFormat(value)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button onClick={refetch} variant="outline" disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <AnalyticsMetrics data={analytics} loading={loading} />

      {/* Charts */}
      <AnalyticsCharts data={analytics} loading={loading} />

      {/* Onboarding Progress */}
      <OnboardingProgress data={onboardingProgress} loading={loading} />
    </div>
  );
};