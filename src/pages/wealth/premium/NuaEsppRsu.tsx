import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function NuaEsppRsu() {
  return (
    <PremiumPlaceholder
      featureId="nua-espp-rsu-optimizer"
      featureName="NUA/ESPP/RSU Optimizer"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Optimize your employee stock benefits with sophisticated strategies:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Net Unrealized Appreciation (NUA) strategies</li>
          <li>Employee Stock Purchase Plan (ESPP) optimization</li>
          <li>Restricted Stock Unit (RSU) tax planning</li>
          <li>Stock option exercise timing</li>
          <li>Alternative Minimum Tax (AMT) planning</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}