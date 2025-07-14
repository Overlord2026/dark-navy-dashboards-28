import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'current' | 'expiring_soon' | 'expired' | 'needs_review';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'current':
        return {
          icon: CheckCircle,
          label: 'Current',
          variant: 'success' as const,
          className: 'bg-success/10 text-success border-success/20 hover:bg-success/15'
        };
      case 'expiring_soon':
        return {
          icon: Clock,
          label: 'Expiring Soon',
          variant: 'warning' as const,
          className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/15'
        };
      case 'expired':
        return {
          icon: XCircle,
          label: 'Expired',
          variant: 'destructive' as const,
          className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15'
        };
      case 'needs_review':
        return {
          icon: AlertCircle,
          label: 'Needs Review',
          variant: 'secondary' as const,
          className: 'bg-accent/50 text-accent-foreground border-accent hover:bg-accent/60'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Unknown',
          variant: 'outline' as const,
          className: 'bg-muted text-muted-foreground border-border'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`inline-flex items-center gap-1 font-medium transition-colors ${config.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};