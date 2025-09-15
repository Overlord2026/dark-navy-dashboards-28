import React from 'react';
import NUAAnalyzer from '@/components/tax-planning/NUAAnalyzer';

export function TaxNua() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Net Unrealized Appreciation (NUA) Strategy</h1>
        <p className="text-muted-foreground">
          Analyze NUA benefits for employer stock distributions from qualified retirement plans.
        </p>
      </div>
      
      <NUAAnalyzer subscriptionTier="premium" />
    </div>
  );
}