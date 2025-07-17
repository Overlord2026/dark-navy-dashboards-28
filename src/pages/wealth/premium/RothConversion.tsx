import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function RothConversion() {
  return (
    <PremiumPlaceholder
      featureId="roth-conversion-analyzer"
      featureName="Roth Conversion Analyzer (Advanced)"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Advanced Roth conversion analysis and optimization:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Multi-year conversion planning</li>
          <li>Tax bracket optimization</li>
          <li>Medicare premium impact analysis</li>
          <li>Estate planning considerations</li>
          <li>Backdoor and mega backdoor strategies</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}