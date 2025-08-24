import { Badge } from '@/components/ui/badge';
import { Shield, Anchor } from 'lucide-react';

interface ProofStripProps {
  lastReceiptId?: string;
  anchored?: boolean;
  className?: string;
}

export function ProofStrip({ lastReceiptId, anchored = false, className = '' }: ProofStripProps) {
  if (!lastReceiptId) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      <Badge variant="outline" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        <span>Receipt</span>
        <code className="text-xs">{lastReceiptId.slice(-8)}</code>
      </Badge>
      {anchored && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Anchor className="h-3 w-3" />
          <span>Anchored ✓</span>
        </Badge>
      )}
    </div>
  );
}