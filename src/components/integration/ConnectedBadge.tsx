
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface ConnectedBadgeProps {
  className?: string;
}

export const ConnectedBadge: React.FC<ConnectedBadgeProps> = ({ className }) => {
  return (
    <Badge 
      variant="outline" 
      className={`bg-green-50 text-green-700 border-green-200 flex items-center gap-1 ${className}`}
    >
      <CheckCircle2 className="h-3 w-3" />
      <span>Connected</span>
    </Badge>
  );
};
