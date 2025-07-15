import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HealthCardProps } from '@/types/healthcare';
import { cn } from '@/lib/utils';

export const HealthCard: React.FC<HealthCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  status = 'info',
  icon,
  href,
  className = ''
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'error':
        return 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Normal</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Attention</Badge>;
      case 'error':
        return <Badge variant="destructive">Alert</Badge>;
      default:
        return null;
    }
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link to={href} className="block">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        href && "cursor-pointer",
        getStatusStyles(),
        className
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="p-2 rounded-lg bg-muted/50">
              {React.cloneElement(icon as React.ReactElement, {
                className: "h-4 w-4 text-muted-foreground"
              })}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {value && (
                <p className="text-2xl font-bold text-foreground leading-none">
                  {value}
                </p>
              )}
              {change && (
                <div className={cn(
                  "flex items-center space-x-1 text-xs font-medium",
                  getChangeColor()
                )}>
                  {getChangeIcon()}
                  <span>{change}</span>
                </div>
              )}
            </div>
            {status !== 'info' && (
              <div className="flex-shrink-0">
                {getStatusBadge()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};