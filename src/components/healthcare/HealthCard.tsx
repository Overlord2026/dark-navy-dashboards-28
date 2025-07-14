import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HealthCardProps } from "@/types/healthcare";

export const HealthCard: React.FC<HealthCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  status = 'info',
  icon,
  className
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-l-green-500';
      case 'warning':
        return 'border-l-4 border-l-yellow-500';
      default:
        return 'border-l-4 border-l-blue-500';
    }
  };

  const getChangeStyles = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={cn("p-6", getStatusStyles(), className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {value && (
            <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          )}
          {change && (
            <p className={cn("text-sm mt-1", getChangeStyles())}>{change}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground ml-4">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};