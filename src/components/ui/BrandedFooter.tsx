import React from 'react';
import { withTrademarks } from '@/utils/trademark';

export function BrandedFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>{withTrademarks('Powered by Boutique Family Office')}</span>
        </div>
      </div>
    </footer>
  );
}