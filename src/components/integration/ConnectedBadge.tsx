
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export const ConnectedBadge: React.FC = () => {
  return (
    <div className="p-4">
      <Badge variant="success" className="flex items-center">
        <Check className="h-3 w-3 mr-1" />
        Connected
      </Badge>
      <p className="text-xs text-muted-foreground mt-2">
        This project is connected to the Family Office Marketplace ecosystem
      </p>
    </div>
  );
};
