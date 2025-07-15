import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HealthMetric } from '@/types/healthcare';

interface HealthMetricCardProps {
  metric: HealthMetric;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  metric,
  trend = 'stable',
  className = ''
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.type}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="text-sm text-muted-foreground">
                {metric.unit}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {formatDate(metric.date)}
            </Badge>
            {trend !== 'stable' && (
              <span className={`text-xs font-medium ${getTrendColor()}`}>
                {trend === 'up' ? 'Trending up' : 'Trending down'}
              </span>
            )}
          </div>
          
          {metric.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
              {metric.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};