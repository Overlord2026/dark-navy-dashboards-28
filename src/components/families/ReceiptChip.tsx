import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ReceiptChipProps {
  hash: string;
  anchored: boolean;
  policyVersion?: string;
  className?: string;
}

export function ReceiptChip({ hash, anchored, policyVersion, className = "" }: ReceiptChipProps) {
  const shortHash = hash.slice(0, 8) + '...' + hash.slice(-6);
  
  const getStatusIcon = () => {
    if (anchored) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
    return <Clock className="h-3 w-3 text-amber-500" />;
  };

  const getStatusText = () => {
    return anchored ? 'Anchored' : 'Pending';
  };

  const getStatusColor = () => {
    return anchored ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <Badge 
      variant="outline" 
      className={`gap-1 font-mono text-xs ${getStatusColor()} ${className}`}
      title={`Receipt: ${hash}\nPolicy: ${policyVersion || 'Unknown'}\nStatus: ${getStatusText()}`}
    >
      {getStatusIcon()}
      <span className="font-medium">{shortHash}</span>
      {policyVersion && (
        <span className="text-muted-foreground">·{policyVersion}</span>
      )}
    </Badge>
  );
}