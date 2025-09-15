import React from 'react';
import TaxBracketProjector from '@/components/tax-planning/TaxBracketProjector';

export function TaxBracketManager() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tax Bracket Manager</h1>
        <p className="text-muted-foreground">
          Multi-year tax bracket optimization and income timing strategies.
        </p>
      </div>
      
      <TaxBracketProjector />
    </div>
  );
}