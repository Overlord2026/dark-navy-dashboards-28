import React from 'react';
import { Shield } from 'lucide-react';

export function PatentPendingBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-gold/20 to-gold-light/20 border border-gold/30 rounded-full text-xs font-medium text-gold">
      <Shield className="h-3 w-3" />
      Patent Pending
    </div>
  );
}