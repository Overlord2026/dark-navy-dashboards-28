import type { RetirementPolicy } from '@/types/retirement';

interface PolicyConfigurationProps {
  policy: RetirementPolicy;
}

export function PolicyConfiguration({ policy }: PolicyConfigurationProps) {
  const guardrails = policy.guardrails;
  const isGKEnabled = guardrails?.method === 'gk';
  
  return (
    <div className="page-break-before p-8">
      <h2 className="text-3xl font-bold mb-6">Policy Configuration</h2>
      
      {/* Guardrails */}
      <section className="mb-8 page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Withdrawal Guardrails</h3>
        
        {!isGKEnabled ? (
          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-muted-foreground">No guardrails active</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Guyton-Klinger Method</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Initial Withdrawal Rate:</span>
                  <span className="ml-2 font-medium">{(guardrails.initial_withdrawal_rate * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Bands:</span>
                  <span className="ml-2 font-medium">±{(guardrails.bands_pct * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Raise on Upper Breach:</span>
                  <span className="ml-2 font-medium">{(guardrails.raise_cut_pct.up * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cut on Lower Breach:</span>
                  <span className="ml-2 font-medium">{(guardrails.raise_cut_pct.down * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                The Guyton-Klinger method dynamically adjusts withdrawals based on portfolio performance. 
                If the portfolio exceeds the upper band ({(guardrails.bands_pct * 100).toFixed(0)}% above initial), 
                withdrawals increase by {(guardrails.raise_cut_pct.up * 100).toFixed(0)}%. 
                If it breaches the lower band, withdrawals decrease by {(guardrails.raise_cut_pct.down * 100).toFixed(0)}%.
              </p>
            </div>
          </div>
        )}
      </section>
      
      {/* Alternative Asset Metrics */}
      {policy.metrics && (
        <section className="page-break-avoid">
          <h3 className="text-xl font-semibold mb-3">Alternative Asset Metrics</h3>
          
          {policy.metrics.etayFormula && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">ETAY (Expected Tax-Adjusted Yield)</h4>
              <div className="border rounded-lg p-4 bg-muted/30 font-mono text-sm">
                {policy.metrics.etayFormula}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                ETAY calculates after-tax expected return for alternative assets, 
                accounting for interest, qualified dividends, and capital gains at different tax rates.
              </p>
            </div>
          )}
          
          {policy.metrics.seayFormula && (
            <div>
              <h4 className="font-medium mb-2">SEAY (Staking-Equivalent After-tax Yield)</h4>
              <div className="border rounded-lg p-4 bg-muted/30 font-mono text-sm">
                {policy.metrics.seayFormula}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                SEAY adjusts staking yields for taxes, slashing risk, and liquidity delays 
                to provide comparable metrics for crypto/staking positions.
              </p>
            </div>
          )}
          
          {!policy.metrics.etayFormula && !policy.metrics.seayFormula && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-muted-foreground">No alternative asset metrics configured</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
