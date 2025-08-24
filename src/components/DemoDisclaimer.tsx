import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface DemoDisclaimerProps {
  className?: string;
}

export const DemoDisclaimer: React.FC<DemoDisclaimerProps> = ({ className = '' }) => {
  return (
    <Badge variant="outline" className={`bg-amber-50 text-amber-700 border-amber-200 ${className}`}>
      <Info className="w-3 h-3 mr-1" />
      Demo Mode - For education, not advice
    </Badge>
  );
};