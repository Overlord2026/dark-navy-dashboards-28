import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'beta' | 'coming-soon' | 'new' | 'featured';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  className?: string;
}

export function StatusBadge({ status, label, variant, className }: StatusBadgeProps) {
  const badgeText = label || getDefaultLabel(status);
  const badgeVariant = variant || getStatusVariant(status);
  const badgeClassName = cn(getStatusClassName(status), className);

  return (
    <Badge variant={badgeVariant} className={badgeClassName}>
      {badgeText}
    </Badge>
  );
}

function getDefaultLabel(status: StatusType): string {
  const labels: Record<StatusType, string> = {
    'beta': 'Beta',
    'coming-soon': 'Coming Soon',
    'new': 'New',
    'featured': 'Featured',
  };
  return labels[status];
}

function getStatusVariant(status: StatusType): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' {
  switch (status) {
    case 'beta':
      return 'warning';
    case 'coming-soon':
      return 'outline';
    case 'new':
      return 'success';
    case 'featured':
      return 'default';
    default:
      return 'secondary';
  }
}

function getStatusClassName(status: StatusType): string {
  const baseStyles = 'font-medium text-xs';
  
  const statusStyles: Record<StatusType, string> = {
    'beta': 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
    'coming-soon': 'bg-muted text-muted-foreground border-muted-foreground/30',
    'new': 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
    'featured': 'bg-primary/10 text-primary border-primary/20',
  };

  return cn(baseStyles, statusStyles[status]);
}

export default StatusBadge;