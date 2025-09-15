import React from 'react';
import RothConversionAnalyzer from '@/components/tax-planning/RothConversionAnalyzer';

export function TaxRothConversion() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Roth Conversion Analyzer</h1>
        <p className="text-muted-foreground">
          Optimize your Roth conversion strategy with multi-year tax projections and scenario analysis.
        </p>
      </div>
      
      <RothConversionAnalyzer subscriptionTier="premium" />
    </div>
  );
}