import type { SwagExplainPack } from '@/lib/explainpack';

interface DisclosuresPageProps {
  explainPack: SwagExplainPack;
}

export function DisclosuresPage({ explainPack }: DisclosuresPageProps) {
  return (
    <div className="page-break-before p-8">
      <h2 className="text-3xl font-bold mb-6">Important Disclosures</h2>
      
      <div className="space-y-6 text-sm">
        <section>
          <h3 className="font-semibold text-base mb-2">For Informational Purposes Only</h3>
          <p className="text-muted-foreground leading-relaxed">
            This retirement analysis is provided for informational and educational purposes only. 
            It does not constitute financial, investment, tax, or legal advice. You should consult 
            with qualified professionals before making any financial decisions. The projections and 
            recommendations herein are based on assumptions that may not reflect actual future conditions.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Assumptions and Limitations</h3>
          <p className="text-muted-foreground leading-relaxed">
            This analysis relies on assumptions and projections that may not materialize. Market returns, 
            inflation rates, life expectancy, healthcare costs, tax laws, and other factors are subject 
            to change and uncertainty. The actual outcomes may differ materially from the projections shown. 
            Past performance does not guarantee or indicate future results.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Monte Carlo Simulation Methodology</h3>
          <p className="text-muted-foreground leading-relaxed">
            The Monte Carlo simulation uses <strong>5,000 randomized scenarios</strong> to estimate 
            probability of success. Results represent statistical probabilities based on historical data 
            and forward-looking assumptions, not guarantees of future outcomes. Success probability 
            indicates the percentage of scenarios where funds lasted through the specified retirement horizon.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Withdrawal Strategy & Guardrails</h3>
          <p className="text-muted-foreground leading-relaxed">
            If Guyton-Klinger guardrails are enabled, withdrawals will be dynamically adjusted based on 
            portfolio performance. This may result in increases or decreases to your income stream. 
            You should be prepared for potential reductions in spending during poor market environments.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Tax Considerations</h3>
          <p className="text-muted-foreground leading-relaxed">
            Tax projections are estimates based on current tax laws and your inputs. Actual tax liabilities 
            may vary based on changes in tax legislation, state taxes, deductions, credits, and your specific 
            circumstances. Consult a qualified tax professional for personalized tax advice.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Healthcare & Long-Term Care</h3>
          <p className="text-muted-foreground leading-relaxed">
            Healthcare cost projections are estimates. Actual costs may be significantly higher or lower 
            depending on health status, insurance coverage, geographic location, and medical needs. 
            Long-term care costs can be substantial and are not covered by Medicare.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Alternative Asset Metrics (ETAY/SEAY)</h3>
          <p className="text-muted-foreground leading-relaxed">
            ETAY (Expected Tax-Adjusted Yield) and SEAY (Staking-Equivalent After-tax Yield) are proprietary 
            metrics for evaluating alternative investments. These calculations involve assumptions about taxes, 
            liquidity, and risk that may not reflect your actual experience. Alternative investments often 
            carry higher risks and lower liquidity than traditional assets.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">No Guarantees</h3>
          <p className="text-muted-foreground leading-relaxed">
            Neither the analysis provider nor any affiliated parties guarantee the accuracy or completeness 
            of this analysis or the achievement of any projected outcomes. You bear sole responsibility for 
            any financial decisions made based on this information.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Policy Configuration</h3>
          <p className="text-muted-foreground leading-relaxed">
            This analysis uses policy version <strong>{explainPack.policy_version}</strong> and was 
            generated using build <strong>{explainPack.build_id}</strong> on{' '}
            {new Date(explainPack.generated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-base mb-2">Proprietary Technology</h3>
          <p className="text-muted-foreground leading-relaxed">
            Generated by <strong>myBFOCFO SWAG Retirement Analyzer™</strong>. SWAG is a trademark of 
            Boutique Family Office. All rights reserved. Unauthorized reproduction or distribution of 
            this document is prohibited.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t text-xs text-muted-foreground text-center space-y-1">
        <div>Document ID: {explainPack.analysis_id}</div>
        <div>Generated: {new Date(explainPack.generated_at).toISOString()}</div>
        <div>Policy Version: {explainPack.policy_version} | Build: {explainPack.build_id}</div>
        <div className="pt-4">© 2025 Boutique Family Office. All rights reserved.</div>
      </div>
    </div>
  );
}
