import React from 'react';
import { Shield, Check } from 'lucide-react';

interface ReceiptChipProps {
  hash: string;
  anchored?: boolean;
  className?: string;
}

export function ReceiptChip({ hash, anchored = false, className = '' }: ReceiptChipProps) {
  // Display first 4 and last 4 characters of hash
  const displayHash = hash.length > 8 
    ? `#${hash.slice(0, 4)}…${hash.slice(-4)}`
    : `#${hash}`;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Receipt Hash Pill */}
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-bfo-purple/20 border border-bfo-gold/30 rounded-full text-xs text-white/80">
        <Shield className="h-3 w-3 text-bfo-gold" />
        <code className="text-bfo-gold font-mono">{displayHash}</code>
      </div>
      
      {/* Anchor Badge */}
      {anchored && (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-bfo-gold/20 border border-bfo-gold rounded-full text-xs text-bfo-gold">
          <Check className="h-3 w-3" />
          <span className="font-medium">Anchored ✓</span>
        </div>
      )}
    </div>
  );
}